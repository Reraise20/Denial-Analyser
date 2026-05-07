export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { denialCode, denialCategory, denialDescription, billedStr, deniedStr, additionalContext, rarcCode, rarcDescription, icd10Codes, payerName } = req.body;

  if (!denialCode || !deniedStr) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const systemInstruction = `You are a senior certified medical billing compliance specialist with deep expertise in CARC/RARC denial codes, NCCI edits, payer policies, and appeals.

VERDICT CRITERIA — YOU MUST FOLLOW THESE EXACTLY:
- Use "TRUE" ONLY when: a universally applicable, well-established CMS or AMA rule clearly supports the denial AND you can cite the exact rule in whyTrueDenial. Examples: confirmed NCCI PTP bundle with no modifier, patient responsibility codes (CO-1/2/3) which are always valid, timely filing clearly exceeded under Medicare's standard 12-month rule.
- Use "LIKELY_TRUE" when: general billing guidelines support the denial but payer-specific contract terms, documentation review, or modifier usage could change the outcome.
- Use "LIKELY_FALSE" when: there is a documentable, rule-based reason the denial appears incorrect, but full confirmation requires payer verification or claim detail you do not have.
- Use "FALSE" ONLY when: a clear, universally applicable rule makes the denial definitively incorrect AND you can cite it precisely. This is rare without full claim and contract details.
- Use "CANNOT_DETERMINE" when: the verdict fundamentally depends on payer-specific contract terms, clinical documentation content, or current quarterly NCCI edit tables that you cannot access. Do not guess in these cases.

CONFIDENCE SCORE RULES:
- TRUE or FALSE verdict: max confidence 85 — you never have full claim context
- LIKELY_TRUE or LIKELY_FALSE: max confidence 75
- CANNOT_DETERMINE: confidence must be 0
- Never return confidence above 85 under any circumstance

ANTI-HALLUCINATION RULES — FOLLOW STRICTLY:
1. Do NOT fabricate payer-specific phone numbers, fax numbers, portal URLs, or mailing addresses. If you do not know them with certainty, omit them entirely.
2. For "timingAdvice": if you are not certain of the exact timely filing or appeal deadline for this specific payer and denial type, respond with "Verify the exact deadline directly with the payer or in your provider agreement — do not rely on this estimate." Do NOT invent a specific number of days.
3. For "escalationPath": describe the general escalation process (e.g., internal appeal → external review → state insurance commissioner) without fabricating specific contacts, case numbers, or addresses.
4. For "appealSteps": provide general procedurally accurate steps. Do not cite specific payer portal URLs or phone numbers unless you are certain they are correct.
5. For "modifierGuidance": only reference CMS-defined modifiers (e.g., -59, -25, -PT, -76). Do not invent modifier rules.
6. If you are unsure about any claim, say so explicitly rather than guessing with false confidence.
7. For Medical Necessity denials (CO-50, CO-20, CO-51, CO-76, CO-186, CO-228, CO-243, CO-244, CO-256): explicitly state in "whyTrueDenial" or "whyFalseDenial" whether a Local Coverage Determination (LCD) or National Coverage Determination (NCD) likely governs the denied CPT code. Use the format: "Check the LCD/NCD for CPT [code] — it defines the covered diagnoses and documentation requirements for this service." If an NCD is known to exist for the procedure (e.g., colonoscopy screenings, sleep studies), name it explicitly. Do not fabricate LCD article numbers or contractor names.
8. For NCCI bundling denials (CO-97, CO-59, CO-96, CO-78, CO-231, CO-4) — FOLLOW THIS EXACTLY OR YOUR VERDICT WILL BE WRONG:
- The DENIED CPT code is always the Column 2 (component/inclusive) code. The PAID/BILLED code is the Column 1 (comprehensive) code.
- CO-97 (Payment included in another service): The denied code is bundled INTO the paid code. If the denied code is a subset or component of the comprehensive paid code, the denial is CORRECT — return LIKELY_TRUE or TRUE. Do NOT reason that "the paid code is more extensive therefore the denial is wrong" — that is backwards. The whole point of bundling is that the component is already included in the comprehensive code's reimbursement.
- CO-59 (Procedure not bundled with another): Denial issued because payer believes these should be billed separately. Assess whether a distinct procedural service modifier (-59, -XS, -XE, -XP, -XU) was present and whether the services were truly clinically distinct.
- CO-96 (Non-covered charge): The payer's contract or plan excludes this service entirely. Assess whether a coverage exclusion or benefit limitation applies.
- CO-78 (Unrelated procedure by same physician during post-op period): Assess whether the denied procedure is truly unrelated to the original surgery or falls within the global surgical period.
- CO-231 (Mutually exclusive procedures): Two procedures cannot reasonably be performed at the same session (e.g., bilateral and unilateral version of the same service). Assess whether both were truly performed and documented as distinct.
- CO-4 (Procedure inconsistent with modifier): The modifier used does not support separate billing. Assess whether the modifier was clinically appropriate for the scenario.
- For ALL NCCI denials: Only return LIKELY_FALSE or FALSE if (a) the two codes are clinically distinct services performed at different anatomical sites, different lesions, or clearly separate encounters AND (b) a valid NCCI modifier (-59, -XS, -XE, -XP, -XU) was present or clearly should have been. Never return FALSE solely because one code is more comprehensive than the other.`;

  // ── Declare all flags BEFORE the prompt so they can be referenced inside it ──
  const isMedicalNecessity = ["CO-50","CO-20","CO-51","CO-76","CO-186","CO-228","CO-243","CO-244","CO-256"].includes(denialCode?.toUpperCase());
  const isNcci = ["CO-97","CO-59","CO-96","CO-78","CO-231","CO-4"].includes(denialCode?.toUpperCase());
  const isAuth = ["CO-15","CO-197","OA-23","CO-171","CO-172"].includes(denialCode?.toUpperCase());

  const prompt = `DENIAL INFORMATION:
- CARC (Denial Code): ${denialCode}
- Denial Category: ${denialCategory || "Unknown"}
- Denial Description: ${denialDescription || "Unknown"}
${rarcCode ? `- RARC (Remark Code): ${rarcCode}${rarcDescription ? ` — ${rarcDescription}` : " (not in local dictionary — interpret based on your knowledge)"}` : "- RARC: Not provided"}
- Payer: ${payerName || "Not provided"}
- All Billed CPT Codes: ${billedStr || "Not provided"}
- Denied CPT Code(s): ${deniedStr}
${icd10Codes ? `- ICD-10 Diagnosis Code(s): ${icd10Codes}` : "- ICD-10 Diagnosis Code(s): Not provided"}
${additionalContext ? `- Additional Context: ${additionalContext}` : ""}

RARC INTERPRETATION RULE:
When a RARC is provided alongside the CARC, the RARC defines the SPECIFIC reason for the denial. The CARC is the category — the RARC is the detail. Your entire analysis must be based on the CARC + RARC combination, not the CARC alone. For example: CO-16 alone means "claim lacks information" (vague). CO-16 + M76 means "claim denied specifically because diagnosis code is missing or invalid" — treat this as a diagnosis coding error, not a generic submission issue.

${isMedicalNecessity ? `MEDICAL NECESSITY VERDICT RULES:
${icd10Codes
  ? `ICD-10 codes ARE provided (${icd10Codes}). You MUST assess whether these diagnosis codes represent a covered indication for the denied CPT code under general Medicare or commercial payer LCD/NCD standards. Provide a LIKELY_TRUE or LIKELY_FALSE verdict based on whether the diagnosis-to-procedure pairing is clinically appropriate and typically covered. Do not default to CANNOT_DETERMINE when ICD-10 codes are available — make a reasoned assessment and flag what documentation would confirm it.`
  : `ICD-10 codes are NOT provided. You cannot assess medical necessity without knowing what diagnosis was billed. Return CANNOT_DETERMINE and clearly explain that the verdict requires ICD-10 diagnosis codes to evaluate coverage criteria. List in correctiveActions what the biller should do: retrieve the diagnosis codes from the claim and re-run the analysis.`
}` : ""}

${isAuth ? `PRIOR AUTHORIZATION VERDICT RULES:
${payerName
  ? `Payer IS provided (${payerName}). Use your search capability to look up ${payerName}'s current prior authorization requirements for the denied CPT code(s). Search for "${payerName} prior authorization requirements CPT ${deniedStr}" and "${payerName} clinical policy bulletin ${deniedStr}". Based on what you find: if the CPT code IS on ${payerName}'s auth required list and no auth was obtained, return LIKELY_TRUE. If the CPT code does NOT require auth under ${payerName}'s policy, return LIKELY_FALSE — this is a disputable denial. Cite the specific policy document found in your verdict reasoning.`
  : `Payer name is NOT provided. You cannot search for payer-specific auth requirements without knowing the payer. Return CANNOT_DETERMINE and instruct the biller to re-run the analysis with the payer name entered — this will enable a targeted search of that payer's clinical policies and auth requirement lists.`
}` : ""}

${isNcci ? `NCCI BUNDLING ANALYSIS RULES:
You MUST use the word "NCCI" explicitly in every item you place in whyTrueDenial, whyFalseDenial, billingErrors, correctiveActions, and appealSteps — this is required so the user interface can detect it and display verification links. Do not paraphrase "NCCI" as "bundling edit" or "edit table" alone — always say "NCCI edit" or "NCCI bundling".
- Search the current CMS NCCI PTP edit tables for the CPT pair: billed code(s) ${billedStr} vs denied code(s) ${deniedStr}.
- Identify which code is Column 1 (comprehensive/pays) and which is Column 2 (component/denied). State this explicitly in your whyTrueDenial or whyFalseDenial.
- State whether a modifier indicator of 0 (modifier not allowed) or 1 (modifier allowed) applies to this NCCI edit pair.
- If modifier indicator is 1 and a modifier like -59, -XS, -XE, -XP, or -XU was present on the denied code, the denial may be disputable — return LIKELY_FALSE.
- If modifier indicator is 0, no modifier can override the NCCI edit — return LIKELY_TRUE or TRUE.
- In correctiveActions, always include: "Verify the current NCCI PTP edit for CPT ${deniedStr} vs ${billedStr} in the CMS NCCI edit tables to confirm the column assignment and modifier indicator."
- In appealSteps (if disputing), always include: "Pull the current quarter NCCI PTP edit table from CMS and confirm the modifier indicator for this CPT pair before submitting the appeal."` : ""}

Determine if this is a TRUE denial (valid) or FALSE denial (should be paid). Provide specific actionable guidance.

Respond ONLY in this exact JSON structure:
{"verdict":"TRUE|FALSE|LIKELY_TRUE|LIKELY_FALSE|CANNOT_DETERMINE","confidence":0-85,"verdictSummary":"one clear sentence explaining the verdict or why it cannot be determined","denialRuleExplained":"plain english explanation of ${denialCode}${rarcCode ? ` with remark code ${rarcCode}` : ""}","whyTrueDenial":[],"whyFalseDenial":[],"billingErrors":[],"correctiveActions":[],"appealSteps":[],"modifierGuidance":"advice or null","documentationNeeded":[],"preventionTips":[],"timingAdvice":"deadline note or uncertainty disclaimer per rules","escalationPath":"general escalation process without fabricated contacts"}`;

  // Grounding fires for:
  // - Medical necessity when ICD-10 codes provided (reads live LCD/NCD from CMS)
  // - NCCI bundling always (reads live quarterly CMS edit tables for the CPT pair)
  // - Auth denials when payer name is provided (searches payer's public clinical policy/auth list)
  // NOTE: grounding is incompatible with response_mime_type JSON mode — extract JSON from text response
  const useGrounding = (isMedicalNecessity && !!icd10Codes) || isNcci || (isAuth && !!payerName);

  const modelEndpoint = "gemini-2.5-flash-lite";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelEndpoint}:generateContent?key=${apiKey}`;

  const requestBody = {
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2000,
      ...(useGrounding ? {} : { response_mime_type: "application/json" }),
    },
    ...(useGrounding ? { tools: [{ googleSearch: {} }] } : {}),
  };

  async function callGemini(body) {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const errText = await r.text();
      console.error("Gemini API error:", r.status, errText);
      if (r.status === 429) throw { status: 429, message: "Daily limit or rate limit reached. Please wait a minute." };
      throw { status: r.status, message: "Gemini API failed to respond." };
    }
    return r.json();
  }

  function extractJson(text) {
    // Find the outermost { } block — handles grounded responses with prose around the JSON
    const start = text.indexOf("{");
    const end   = text.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    try { return JSON.parse(text.slice(start, end + 1)); } catch { return null; }
  }

  try {
    let geminiData;
    let usedGrounding = useGrounding;

    try {
      geminiData = await callGemini(requestBody);
    } catch (apiErr) {
      // If grounding call fails (model doesn't support it), retry without grounding
      if (useGrounding) {
        console.warn("Grounding call failed — retrying without grounding:", apiErr);
        usedGrounding = false;
        const fallbackBody = {
          ...requestBody,
          generationConfig: { temperature: 0.1, maxOutputTokens: 2000, response_mime_type: "application/json" },
        };
        delete fallbackBody.tools;
        try {
          geminiData = await callGemini(fallbackBody);
        } catch (fallbackErr) {
          return res.status(fallbackErr.status || 500).json({ error: fallbackErr.message || "Gemini API failed on retry." });
        }
      } else {
        return res.status(apiErr.status || 500).json({ error: apiErr.message || "Gemini API failed." });
      }
    }

    // Safety check first
    if (!geminiData?.candidates?.length) {
      return res.status(500).json({ error: "The AI blocked this response due to safety filters. Try simplifying your context." });
    }

    const rawText = geminiData.candidates[0]?.content?.parts?.[0]?.text || "";
    if (!rawText) {
      return res.status(500).json({ error: "AI returned an empty response. Please try again." });
    }

    // Parse JSON — for grounded calls extract from prose, for JSON-mode parse directly
    let parsed = usedGrounding ? extractJson(rawText) : (() => { try { return JSON.parse(rawText); } catch { return null; } })();

    if (!parsed) {
      // Last resort: try extractJson even on non-grounded responses
      parsed = extractJson(rawText);
      if (!parsed) {
        console.error("Failed to parse Gemini output:", rawText.slice(0, 500));
        return res.status(500).json({ error: "AI returned an unreadable format. Please try again." });
      }
    }

    // Extract grounding source links if present
    // NOTE: c.web.uri is a Vertex AI redirect URL that expires quickly — not reliable for users to click.
    // Instead we build a stable Google Search URL from the title so links always work.
    const groundingChunks = geminiData.candidates[0]?.groundingMetadata?.groundingChunks || [];
    const webSearchQueries = geminiData.candidates[0]?.groundingMetadata?.webSearchQueries || [];
    const sources = groundingChunks
      .filter(c => c?.web?.title)
      .map(c => {
        const title = c.web.title;
        const looksLikeDomain = /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(title.trim());
        const url = looksLikeDomain
          ? `https://${title.trim()}`
          : `https://www.google.com/search?q=${encodeURIComponent(title)}`;
        return { url, title };
      })
      .filter((s, i, arr) => arr.findIndex(x => x.title === s.title) === i)
      .slice(0, 5);

    // Also include the actual search queries Gemini used, so users can run them manually
    const usedQueries = webSearchQueries.slice(0, 3);

    // Fallback: if grounding was supposed to fire but Gemini didn't search (no chunks returned),
    // generate denial-type-specific validation links so the user always has something to verify against.
    let fallbackSources = [];
    if (usedGrounding && sources.length === 0 && usedQueries.length === 0) {
      if (isNcci) {
        const cptPair = `${deniedStr} ${billedStr}`.replace(/[^0-9 ]/g, " ").trim();
        fallbackSources = [
          { title: "CMS NCCI Edit Tables", url: "https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-tools" },
          { title: `NCCI edit lookup: ${cptPair}`, url: `https://www.google.com/search?q=${encodeURIComponent(`NCCI PTP edit ${cptPair} CMS`)}` },
        ];
      } else if (isAuth) {
        const payer = payerName || "payer";
        const cpt   = deniedStr.split(",")[0].trim();
        fallbackSources = [
          { title: `${payer} prior authorization requirements CPT ${cpt}`, url: `https://www.google.com/search?q=${encodeURIComponent(`${payer} prior authorization requirements CPT ${cpt}`)}` },
          { title: `${payer} clinical policy bulletin ${cpt}`, url: `https://www.google.com/search?q=${encodeURIComponent(`${payer} clinical policy bulletin ${cpt}`)}` },
        ];
      } else if (isMedicalNecessity) {
        const cpt = deniedStr.split(",")[0].replace(/[^0-9]/g, "").trim();
        fallbackSources = [
          { title: `CMS LCD/NCD for CPT ${cpt}`, url: `https://www.cms.gov/medicare-coverage-database/search.aspx?keyword=${cpt}&keywordType=code` },
          { title: `Medical necessity criteria CPT ${cpt}`, url: `https://www.google.com/search?q=${encodeURIComponent(`medical necessity criteria CPT ${cpt} LCD NCD CMS`)}` },
        ];
      }
    }

    const finalSources = sources.length > 0 ? sources : (fallbackSources.length > 0 ? fallbackSources : null);
    return res.status(200).json({ ...parsed, sources: finalSources, usedQueries: usedQueries.length > 0 ? usedQueries : null });

  } catch (err) {
    console.error("Critical server error:", err);
    return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
}
