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
- Use "TRUE" ONLY when: a universally applicable, well-established CMS or AMA rule clearly supports the denial AND you can cite the exact rule in whyTrueDenial. Examples: confirmed NCCI PTP bundle[...]
- Use "LIKELY_TRUE" when: general billing guidelines support the denial but payer-specific contract terms, documentation review, or modifier usage could change the outcome.
- Use "LIKELY_FALSE" when: there is a documentable, rule-based reason the denial appears incorrect, but full confirmation requires payer verification or claim detail you do not have.
- Use "FALSE" ONLY when: a clear, universally applicable rule makes the denial definitively incorrect AND you can cite it precisely. This is rare without full claim and contract details.
- Use "CANNOT_DETERMINE" when: the verdict fundamentally depends on payer-specific contract terms, clinical documentation content, or current quarterly NCCI edit tables that you cannot access. Do [...]

CONFIDENCE SCORE RULES:
- TRUE or FALSE verdict: max confidence 85 — you never have full claim context
- LIKELY_TRUE or LIKELY_FALSE: max confidence 75
- CANNOT_DETERMINE: confidence must be 0
- Never return confidence above 85 under any circumstance

ANTI-HALLUCINATION RULES — FOLLOW STRICTLY:
1. Do NOT fabricate payer-specific phone numbers, fax numbers, portal URLs, or mailing addresses. If you do not know them with certainty, omit them entirely.
2. For "timingAdvice": if you are not certain of the exact timely filing or appeal deadline for this specific payer and denial type, respond with "Verify the exact deadline directly with the payer[...]
3. For "escalationPath": describe the general escalation process (e.g., internal appeal → external review → state insurance commissioner) without fabricating specific contacts, case numbers, o[...]
4. For "appealSteps": provide general procedurally accurate steps. Do not cite specific payer portal URLs or phone numbers unless you are certain they are correct.
5. For "modifierGuidance": only reference CMS-defined modifiers (e.g., -59, -25, -PT, -76). Do not invent modifier rules.
6. If you are unsure about any claim, say so explicitly rather than guessing with false confidence.
7. For Medical Necessity denials (CO-50, CO-20, CO-51, CO-76, CO-186, CO-228, CO-243, CO-244, CO-256): explicitly state in "whyTrueDenial" or "whyFalseDenial" whether a Local Coverage Determinatio[...]
8. For NCCI bundling denials (CO-97, CO-59, CO-96, CO-78, CO-231, CO-4) — FOLLOW THIS EXACTLY OR YOUR VERDICT WILL BE WRONG:
- The DENIED CPT code is always the Column 2 (component/inclusive) code. The PAID/BILLED code is the Column 1 (comprehensive) code.
- CO-97 (Payment included in another service): The denied code is bundled INTO the paid code. If the denied code is a subset or component of the comprehensive paid code, the denial is CORRECT — [...]
- CO-59 (Procedure not bundled with another): Denial issued because payer believes these should be billed separately. Assess whether a distinct procedural service modifier (-59, -XS, -XE, -XP, -XU[...]
- CO-96 (Non-covered charge): The payer's contract or plan excludes this service entirely. Assess whether a coverage exclusion or benefit limitation applies.
- CO-78 (Unrelated procedure by same physician during post-op period): Assess whether the denied procedure is truly unrelated to the original surgery or falls within the global surgical period.
- CO-231 (Mutually exclusive procedures): Two procedures cannot reasonably be performed at the same session (e.g., bilateral and unilateral version of the same service). Assess whether both were t[...]
- CO-4 (Procedure inconsistent with modifier): The modifier used does not support separate billing. Assess whether the modifier was clinically appropriate for the scenario.
- For ALL NCCI denials: Only return LIKELY_FALSE or FALSE if (a) the two codes are clinically distinct services performed at different anatomical sites, different lesions, or clearly separate enco[...]

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
When a RARC is provided alongside the CARC, the RARC defines the SPECIFIC reason for the denial. The CARC is the category — the RARC is the detail. Your entire analysis must be based on the CARC[...]

${isMedicalNecessity ? `MEDICAL NECESSITY VERDICT RULES:
${icd10Codes
  ? `ICD-10 codes ARE provided (${icd10Codes}). You MUST assess whether these diagnosis codes represent a covered indication for the denied CPT code under general Medicare or commercial payer LCD/[...]
  : `ICD-10 codes are NOT provided. You cannot assess medical necessity without knowing what diagnosis was billed. Return CANNOT_DETERMINE and clearly explain that the verdict requires ICD-10 diag[...]
}` : ""}

${isAuth ? `PRIOR AUTHORIZATION VERDICT RULES:
${payerName
  ? `Payer IS provided (${payerName}). Use your search capability to look up ${payerName}'s current prior authorization requirements for the denied CPT code(s). Search for "${payerName} prior auth[...]
  : `Payer name is NOT provided. You cannot search for payer-specific auth requirements without knowing the payer. Return CANNOT_DETERMINE and instruct the biller to re-run the analysis with the p[...]
}` : ""}

${isNcci ? `NCCI BUNDLING ANALYSIS RULES:
You MUST use the word "NCCI" explicitly in every item you place in whyTrueDenial, whyFalseDenial, billingErrors, correctiveActions, and appealSteps — this is required so the user interface can d[...]
- Search the current CMS NCCI PTP edit tables for the CPT pair: billed code(s) ${billedStr} vs denied code(s) ${deniedStr}.
- Identify which code is Column 1 (comprehensive/pays) and which is Column 2 (component/denied). State this explicitly in your whyTrueDenial or whyFalseDenial.
- State whether a modifier indicator of 0 (modifier not allowed) or 1 (modifier allowed) applies to this NCCI edit pair.
- If modifier indicator is 1 and a modifier like -59, -XS, -XE, -XP, or -XU was present on the denied code, the denial may be disputable — return LIKELY_FALSE.
- If modifier indicator is 0, no modifier can override the NCCI edit — return LIKELY_TRUE or TRUE.
- In correctiveActions, always include: "Verify the current NCCI PTP edit for CPT ${deniedStr} vs ${billedStr} in the CMS NCCI edit tables to confirm the column assignment and modifier indicator."
- In appealSteps (if disputing), always include: "Pull the current quarter NCCI PTP edit table from CMS and confirm the modifier indicator for this CPT pair before submitting the appeal."` : ""}

Determine if this is a TRUE denial (valid) or FALSE denial (should be paid). Provide specific actionable guidance.

Respond ONLY in this exact JSON structure:
{"verdict":"TRUE|FALSE|LIKELY_TRUE|LIKELY_FALSE|CANNOT_DETERMINE","confidence":0-85,"verdictSummary":"one clear sentence explaining the verdict or why it cannot be determined","denialRuleExplained[...]

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
    ...(useGrounding ? { tools: [{ googleSearch: { dynamicRetrievalConfig: { mode: "MODE_DYNAMIC", dynamicThreshold: 0.0 } } }] } : {}),
  };

  async function callGemini(body) {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // ========== ENHANCED ERROR HANDLING START ==========
    // Log response status and headers for debugging
    console.log(`[Gemini API Call] Status: ${r.status}, Content-Type: ${r.headers.get("content-type")}`);

    if (!r.ok) {
      const errText = await r.text();
      console.error("Gemini API error response:", {
        status: r.status,
        statusText: r.statusText,
        contentType: r.headers.get("content-type"),
        bodyPreview: errText.slice(0, 500),
        isHtml: errText.includes("<!DOCTYPE") || errText.includes("<html"),
      });

      if (r.status === 429) {
        throw { status: 429, message: "Daily limit or rate limit reached. Please wait a minute." };
      }
      if (r.status === 401 || r.status === 403) {
        throw { status: r.status, message: "API key invalid or unauthorized. Check GEMINI_API_KEY environment variable." };
      }
      throw { status: r.status, message: `Gemini API failed with status ${r.status}. Response: ${errText.slice(0, 200)}` };
    }

    // Check Content-Type before parsing JSON
    const contentType = r.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const bodyText = await r.text();
      console.error("Unexpected content type:", {
        contentType,
        bodyPreview: bodyText.slice(0, 500),
        isHtml: bodyText.includes("<!DOCTYPE") || bodyText.includes("<html"),
      });
      throw { status: 500, message: `Expected JSON but got ${contentType}. Response was not valid JSON.` };
    }

    try {
      return await r.json();
    } catch (jsonErr) {
      const bodyText = await r.text();
      console.error("JSON parsing failed:", {
        error: jsonErr.message,
        bodyPreview: bodyText.slice(0, 500),
        isHtml: bodyText.includes("<!DOCTYPE") || bodyText.includes("<html"),
      });
      throw { status: 500, message: "API returned invalid JSON. Please try again." };
    }
    // ========== ENHANCED ERROR HANDLING END ==========
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

    // Extract grounding source links — use the raw Vertex AI redirect URI directly.
    // These are reliable and redirect to the actual source pages Gemini read.
    const groundingChunks = geminiData.candidates[0]?.groundingMetadata?.groundingChunks || [];
    const webSearchQueries = geminiData.candidates[0]?.groundingMetadata?.webSearchQueries || [];
    const sources = groundingChunks
      .filter(c => c?.web?.uri && c?.web?.title)
      .map(c => ({ url: c.web.uri, title: c.web.title }))
      .filter((s, i, arr) => arr.findIndex(x => x.url === s.url) === i)
      .slice(0, 5);

    // Also include the actual search queries Gemini used, so users can run them manually
    const usedQueries = webSearchQueries.slice(0, 3);

    return res.status(200).json({ ...parsed, sources: sources.length > 0 ? sources : null, usedQueries: usedQueries.length > 0 ? usedQueries : null });

  } catch (err) {
    console.error("Critical server error:", err);
    return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
}
