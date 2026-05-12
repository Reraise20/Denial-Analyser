export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { denialCode, denialCategory, denialDescription, billedStr, deniedStr, additionalContext, rarcCode, rarcDescription, icd10Codes, payerName, placeOfService } = req.body;

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
7. For Medical Necessity denials (CO-50, CO-20, CO-51, CO-76, CO-186, CO-228, CO-243, CO-244, CO-256): you MUST populate the lcdNcdReference object in your JSON response.
   - If grounding/search found a real LCD article number (format L#####) or NCD number (format ###.#): use it ONLY if the policy status is "Active" or "Final" — it is real, not fabricated.
   - CRITICAL — NEVER cite a retired, withdrawn, superseded, or replaced LCD/NCD. These are void and citing them is incorrect. If your search returns a retired policy, search for its active replacement and use that instead. If no active replacement exists, set articleNumber to null.
   - If grounding did NOT find a confirmed active article number: set articleNumber to null. Do NOT guess or invent article numbers or contractor names.
   - Always set the type field to "LCD", "NCD", or "NONE" based on what you found.
   - For well-known NCDs (colonoscopy, sleep studies, CPAP, mammography, etc.) you may include the NCD number from your training knowledge ONLY if you are highly certain the NCD is still active — flag it as "verify active status" in the summary.
   - Always set the url field to the direct active article link (https://www.cms.gov/medicare-coverage-database/view/lcd.aspx?lcdId=XXXXX), never to a retired document.
8. For Auth denials (CO-15, CO-17, CO-197, CO-198, CO-245, CO-246): you are ONLY permitted to state that a specific payer requires authorization for a specific CPT code if your Google Search tool returned a real policy document confirming it in this session. If you did not perform a search, or your search returned no usable policy document, you MUST set verdict to CANNOT_DETERMINE — never state what a specific payer "requires" or "does not require" based on training knowledge alone. Training data about payer policies is outdated and unreliable.`;

  // ── Declare all flags BEFORE the prompt so they can be referenced inside it ──
  const isMedicalNecessity = ["CO-50","CO-20","CO-51","CO-76","CO-186","CO-228","CO-243","CO-244","CO-256"].includes(denialCode?.toUpperCase());
  const isNcci = ["CO-97","CO-59","CO-78","CO-231"].includes(denialCode?.toUpperCase());
  const isAuth = ["CO-15","CO-17","CO-197","CO-198","CO-245","CO-246"].includes(denialCode?.toUpperCase());

  const prompt = `DENIAL INFORMATION:
- CARC (Denial Code): ${denialCode}
- Denial Category: ${denialCategory || "Unknown"}
- Denial Description: ${denialDescription || "Unknown"}
${rarcCode ? `- RARC (Remark Code): ${rarcCode}${rarcDescription ? ` — ${rarcDescription}` : " (not in local dictionary — interpret based on your knowledge)"}` : "- RARC: Not provided"}
- Payer: ${payerName || "Not provided"}
- Place of Service (POS): ${placeOfService ? `POS ${placeOfService}` : "Not provided"}
- All Billed CPT Codes: ${billedStr || "Not provided"}
- Denied CPT Code(s): ${deniedStr}
${icd10Codes ? `- ICD-10 Diagnosis Code(s): ${icd10Codes}` : "- ICD-10 Diagnosis Code(s): Not provided"}
${additionalContext ? `- Additional Context: ${additionalContext}` : ""}

RARC INTERPRETATION RULE:
When a RARC is provided alongside the CARC, the RARC defines the SPECIFIC reason for the denial. The CARC is the category — the RARC is the detail. Your entire analysis must be based on the CARC + RARC combination, not the CARC alone. For example: CO-16 alone means "claim lacks information" (vague). CO-16 + M76 means "claim denied specifically because diagnosis code is missing or invalid" — treat this as a diagnosis coding error, not a generic submission issue.

${isMedicalNecessity ? `MEDICAL NECESSITY VERDICT RULES:
${icd10Codes
  ? `ICD-10 codes ARE provided (${icd10Codes}). You MUST assess whether these diagnosis codes represent a covered indication for the denied CPT code under general Medicare or commercial payer LCD/NCD standards. Provide a LIKELY_TRUE or LIKELY_FALSE verdict based on whether the diagnosis-to-procedure pairing is clinically appropriate and typically covered. Do not default to CANNOT_DETERMINE when ICD-10 codes are available — make a reasoned assessment and flag what documentation would confirm it.

LCD/NCD LOOKUP — MANDATORY:
You MUST search for the ACTIVE, CURRENT governing LCD or NCD for CPT ${deniedStr}. Use these search queries in order:
1. "active LCD CPT ${deniedStr} medicare coverage database site:cms.gov"
2. "active NCD ${deniedStr} medicare national coverage determination current"
3. "CMS active LCD article CPT ${deniedStr} ${icd10Codes} final"

CRITICAL — LCD/NCD CURRENCY CHECK (must be applied before using any result):
- CMS retires, supersedes, and replaces LCDs regularly (often quarterly). A retired LCD is legally void — citing it in an appeal or denial analysis is incorrect and misleading.
- Before accepting any LCD or NCD from your search results, verify the document's STATUS field:
  · ONLY accept policies with status: "Active", "Final", or "Effective"
  · REJECT and DISCARD any policy with status: "Retired", "Withdrawn", "Superseded", "Replaced", or "Proposed"
- If the first result is a retired LCD, continue searching for its active replacement. CMS typically links to the superseding document within the retired policy's record.
- If multiple LCDs exist for the same CPT, use ONLY the one with the most recent effective date AND an Active status.
- Set url to the direct CMS Medicare Coverage Database link for the ACTIVE article only (format: https://www.cms.gov/medicare-coverage-database/view/lcd.aspx?lcdId=XXXXX). Never link to a retired article.
- If you find only retired policies and no active replacement, set articleNumber to null and write in summary: "No active LCD/NCD found — prior policy may have been retired without replacement; check CMS coverage database for current status."

From your search results (active policies only), extract:
- The article number (L##### for LCD, or ###.# for NCD — e.g. L33626 or NCD 210.1)
- The full policy title
- The direct CMS URL to that active article
- Whether the ICD-10 code(s) ${icd10Codes} appear in the covered diagnosis list for CPT ${deniedStr}

Populate the lcdNcdReference object with everything you find. If the search returns a real active article number, use it — it is not fabricated. If no active article number is found, set articleNumber to null.`
  : `ICD-10 codes are NOT provided. You cannot assess medical necessity without knowing what diagnosis was billed. Return CANNOT_DETERMINE and clearly explain that the verdict requires ICD-10 diagnosis codes to evaluate coverage criteria. List in correctiveActions what the biller should do: retrieve the diagnosis codes from the claim and re-run the analysis.

Set lcdNcdReference to: {"type":"NONE","articleNumber":null,"title":null,"url":null,"summary":"ICD-10 codes required to look up applicable LCD/NCD coverage criteria."}`
}` : ""}

${isNcci ? `NCCI BUNDLING VERDICT RULES — CRITICAL, READ CAREFULLY:
In CMS NCCI PTP (Procedure-to-Procedure) edits, there are two columns:
- COLUMN 1 = the comprehensive procedure (the one that is PAID — typically the higher/more complex code)
- COLUMN 2 = the component procedure (the one that is BUNDLED/DENIED — typically the lesser code)

When a payer denies the Column 2 code via CO-97 because Column 1 was paid, that is CORRECT bundling per NCCI rules.

YOUR PRIMARY TASK FOR NCCI DENIALS:
1. Identify which billed code is Column 1 (paid/comprehensive) and which is Column 2 (denied/component).
2. If the DENIED code is Column 2 to the PAID code's Column 1 → the payer is CORRECTLY bundling → return LIKELY_TRUE.
3. If the DENIED code is actually Column 1 and a lesser Column 2 code was paid → the payer bundled in the WRONG direction → return LIKELY_FALSE.

CRITICAL TRAP TO AVOID — THIS IS THE MOST COMMON AI MISTAKE:
A simpler/lesser procedure being denied when a more complex procedure was paid does NOT mean the denial is false. That is EXACTLY what NCCI bundling is designed to do — the comprehensive Column 1 code absorbs the component Column 2 code. Do NOT assume the denial is wrong just because the denied code seems "less comprehensive."

EXAMPLE (the correct logic):
- 45385 paid (snare polypectomy, Column 1) + 45380 denied (biopsy, Column 2) → LIKELY_TRUE denial — 45380 is a known Column 2 component of 45385 per NCCI PTP edits. The biopsy is considered integral to the polypectomy session.
- The fact that 45380 is "less comprehensive" is the REASON it is bundled, not a reason to dispute it.

STEP 1 — EXTRACT THE MODIFIER INDICATOR FIRST (mandatory before forming any verdict):
Search for the NCCI PTP modifier indicator for this specific CPT pair using these queries:
1. "NCCI PTP edit ${billedStr} ${deniedStr} modifier indicator site:cms.gov"
2. "CMS NCCI procedure to procedure edit ${billedStr} ${deniedStr} modifier indicator 0 1"

The modifier indicator is a single digit published in the CMS NCCI PTP table for every CPT pair:
- '0' = the bundle is NON-bypassable. No modifier of any kind can override it. If modifier indicator is '0', verdict MUST be LIKELY_TRUE regardless of any modifier present on the claim.
- '1' = the bundle IS bypassable when the appropriate modifier and clinical circumstances are present.

You MUST state the modifier indicator value you found ('0' or '1') explicitly at the start of your verdictSummary before stating the verdict. Example: "The NCCI PTP modifier indicator for this pair is '1', meaning..."

If your search cannot confirm the modifier indicator value → set verdict to CANNOT_DETERMINE and explain the quarterly NCCI table could not be accessed.

STEP 2 — CHECK FOR BYPASS MODIFIERS (only relevant when modifier indicator is '1'):
Two separate modifier scenarios can bypass an NCCI bundle. Check BOTH before deciding:

SCENARIO A — Modifier -25 on the Column 1 E/M code (the PAID code):
This is the most common unbundling scenario for E/M + minor procedure pairs. Modifier -25 on the E/M code signals the E/M was a significant, separately identifiable evaluation and management service on the same day as a procedure.
- If the billed/paid E/M code has modifier -25 AND modifier indicator is '1' → return LIKELY_FALSE. The -25 correctly signals a separately identifiable E/M; the payer should not have bundled the procedure into the E/M visit.
- If modifier -25 is present BUT modifier indicator is '0' → return LIKELY_TRUE. Indicator '0' means no modifier, including -25, can override the bundle.

SCENARIO B — Modifier -59 or X{EPSU} on the denied Column 2 code:
If modifier -59, -XS, -XU, -XP, or -XE is on the DENIED CPT, it signals the procedure was performed at a distinct anatomical site or during a separate encounter.
- If present AND modifier indicator is '1' → return LIKELY_FALSE. Advise confirming documentation supports a distinct site/encounter.
- If present BUT modifier indicator is '0' → return LIKELY_TRUE. Indicator '0' overrides all modifiers.

STEP 3 — VERDICT DECISION TREE (follow exactly):
- Modifier indicator '0' → LIKELY_TRUE, regardless of any modifier on either code.
- Modifier indicator '1' + modifier -25 on the E/M (Column 1) code → LIKELY_FALSE.
- Modifier indicator '1' + modifier -59/XS/XU/XP/XE on the denied (Column 2) code → LIKELY_FALSE.
- Modifier indicator '1' + no bypass modifier on either code → LIKELY_TRUE; advise biller to check if a separate site was documented before appealing.
- Modifier indicator unknown/not found → CANNOT_DETERMINE.

For this specific case:
- Billed/Paid CPT(s): ${billedStr}
- Denied CPT(s): ${deniedStr}
Follow Steps 1 → 2 → 3 in order. State the modifier indicator in verdictSummary, then apply the decision tree.` : ""}

${isAuth ? `PRIOR AUTHORIZATION VERDICT RULES:
${payerName
  ? `Payer IS provided (${payerName}). Use your search capability to look up ${payerName}'s current prior authorization requirements for the denied CPT code(s).

${placeOfService
  ? `Place of Service IS provided (POS ${placeOfService}). This is critical for auth verdicts — many payers require auth for a procedure in one setting but NOT in another (e.g. auth required for inpatient hospital POS 21 but not for office POS 11). Your search MUST be POS-specific.

Use these search queries:
1. "${payerName} prior authorization requirements CPT ${deniedStr} place of service ${placeOfService}"
2. "${payerName} auth required POS ${placeOfService} CPT ${deniedStr}"
3. "${payerName} clinical policy bulletin ${deniedStr} outpatient inpatient"

In your verdict, explicitly state whether auth is required for CPT ${deniedStr} at POS ${placeOfService} under ${payerName}'s policy. If the policy differs by setting, note what POS codes DO require auth vs which do not.`
  : `Place of Service is NOT provided. This limits auth verdict accuracy since many payers have POS-specific auth requirements. Use these search queries:
1. "${payerName} prior authorization requirements CPT ${deniedStr}"
2. "${payerName} clinical policy bulletin ${deniedStr}"

In correctiveActions, instruct the biller to re-run with POS code selected for a more precise verdict.`
}

Based on what you find: if the CPT code IS on ${payerName}'s auth required list for the given POS and no auth was obtained, return LIKELY_TRUE. If the CPT code does NOT require auth under ${payerName}'s policy for this setting, return LIKELY_FALSE — this is a disputable denial. Cite the specific policy document found in your verdict reasoning.`
  : `Payer name is NOT provided. You cannot search for payer-specific auth requirements without knowing the payer. Return CANNOT_DETERMINE and instruct the biller to re-run the analysis with the payer name entered — this will enable a targeted search of that payer's clinical policies and auth requirement lists.`
}` : ""}

Determine if this is a TRUE denial (valid) or FALSE denial (should be paid). Provide specific actionable guidance.

DETAIL REQUIREMENTS — every array field must have at least 2–4 substantive items. Do not leave whyTrueDenial, whyFalseDenial, correctiveActions, appealSteps, documentationNeeded, or preventionTips as empty arrays unless there is a genuine reason. Each item should be a complete, actionable sentence specific to this denial — not a generic placeholder.

Respond ONLY in this exact JSON structure:
{"verdict":"TRUE|FALSE|LIKELY_TRUE|LIKELY_FALSE|CANNOT_DETERMINE","confidence":0-85 (max 85 if TRUE or FALSE; max 75 if LIKELY_TRUE or LIKELY_FALSE; must be 0 if CANNOT_DETERMINE),"verdictSummary":"one clear sentence explaining the verdict or why it cannot be determined","denialRuleExplained":"plain english explanation of ${denialCode}${rarcCode ? ` with remark code ${rarcCode}` : ""}","whyTrueDenial":[],"whyFalseDenial":[],"billingErrors":[],"correctiveActions":[],"appealSteps":[],"modifierGuidance":"advice or null","documentationNeeded":[],"preventionTips":[],"timingAdvice":"deadline note or uncertainty disclaimer per rules","escalationPath":"general escalation process without fabricated contacts","lcdNcdReference":{"type":"LCD|NCD|NONE","articleNumber":"L##### or ###.# or null","title":"full policy title or null","url":"direct CMS URL to article or null","summary":"one sentence: does ICD-10 support coverage for this CPT under this policy, and what documentation is required"}}`;

  // Grounding fires for:
  // - Medical necessity when ICD-10 codes provided (reads live LCD/NCD from CMS)
  // - NCCI bundling always (reads live quarterly CMS edit tables for the CPT pair)
  // - Auth denials when payer name is provided (searches payer's public clinical policy/auth list)
  // NOTE: grounding is incompatible with response_mime_type JSON mode — extract JSON from text response
  const useGrounding = (isMedicalNecessity && !!icd10Codes) || isNcci || (isAuth && !!payerName);

  // Use Pro for grounding cases (auth, NCCI, med necessity) — it reliably supports Google Search.
  // Use Flash Lite for non-grounding cases (coding errors, timely filing, etc.) — fast and cheap.
  const modelEndpoint = useGrounding ? "gemini-2.5-pro" : "gemini-2.5-flash-lite";
  const maxTokens     = useGrounding ? 5000 : 2000; // Pro grounded responses need more room for detail
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelEndpoint}:generateContent?key=${apiKey}`;

  const requestBody = {
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: maxTokens,
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
    // 1. Try markdown-fenced JSON block first (grounded responses often wrap in ```json ... ```)
    const fenced = text.match(/```json\s*([\s\S]*?)```/);
    if (fenced) {
      try { return JSON.parse(fenced[1].trim()); } catch {}
    }
    // 2. Try plain ``` block (no language tag)
    const plainFenced = text.match(/```\s*([\s\S]*?)```/);
    if (plainFenced) {
      try { return JSON.parse(plainFenced[1].trim()); } catch {}
    }
    // 3. Fall back to first { ... last } span
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
      // If grounding call fails (e.g. flash-lite doesn't support it), retry without grounding
      if (useGrounding) {
        console.warn("Grounding call failed — retrying without grounding:", apiErr);
        usedGrounding = false;
        const fallbackBody = {
          ...requestBody,
          generationConfig: { temperature: 0.1, maxOutputTokens: maxTokens, response_mime_type: "application/json" },
        };
        delete fallbackBody.tools;
        geminiData = await callGemini(fallbackBody);
      } else {
        return res.status(apiErr.status || 500).json({ error: apiErr.message || "Gemini API failed." });
      }
    }

    // Auth denials REQUIRE live grounding to give a verdict.
    // If grounding was intended but fell back, returning a payer-specific verdict
    // would be hallucination — return CANNOT_DETERMINE immediately instead.
    if (useGrounding && !usedGrounding && isAuth) {
      return res.status(200).json({
        verdict: "CANNOT_DETERMINE",
        confidence: 0,
        verdictSummary: `Live search of ${payerName || "payer"} authorization policy was unavailable. Prior auth requirements are payer-specific and cannot be reliably verified from AI training data. Verify directly with ${payerName || "the payer"}.`,
        denialRuleExplained: `CO-197 means precertification was not obtained before the service was rendered. Whether this denial is valid depends entirely on ${payerName || "the payer"}'s current authorization requirements for CPT ${deniedStr}${placeOfService ? ` at POS ${placeOfService}` : ""} — this cannot be confirmed without live policy data.`,
        whyTrueDenial: [],
        whyFalseDenial: [],
        billingErrors: [],
        correctiveActions: [
          `Call ${payerName || "the payer"}'s provider line and ask specifically: does CPT ${deniedStr} require prior authorization at ${placeOfService ? `POS ${placeOfService}` : "the billed place of service"}?`,
          "Request a copy of the current authorization requirements list for this CPT and setting.",
          "Check the payer's provider portal for a real-time auth requirement lookup.",
          "If authorization was actually obtained, locate the auth number and resubmit with it on the claim.",
        ],
        appealSteps: [
          "Pull the original remittance advice and confirm the denial reason is solely CO-197.",
          "If auth was obtained prior to service, submit first-level appeal with the authorization number and approval documentation.",
          "If auth was not obtained, check whether the payer allows retrospective authorization for this CPT code.",
          "Submit a written appeal explaining the clinical urgency if retrospective auth is denied.",
        ],
        modifierGuidance: null,
        documentationNeeded: [
          "Prior authorization number (if obtained)",
          `${payerName || "Payer"}'s current auth requirement list for CPT ${deniedStr}`,
          placeOfService ? `Confirmation that POS ${placeOfService} requires auth for this CPT` : "Place of service documentation",
        ],
        preventionTips: [
          `Verify ${payerName || "payer"} auth requirements for CPT ${deniedStr} at every place of service before scheduling.`,
          "Use the payer's provider portal or call the auth line at least 3–5 business days before the procedure.",
          "Document the auth number, approval date, and approving agent name on every case.",
        ],
        timingAdvice: "Verify the exact appeal deadline directly with the payer — do not rely on an estimate.",
        escalationPath: "First-level internal appeal → second-level appeal or peer-to-peer review → external independent review → state insurance commissioner if applicable.",
        lcdNcdReference: { type: "NONE", articleNumber: null, title: null, url: null, summary: null },
        groundingAttempted: true,
        wasGrounded: false,
        sources: null,
      });
    }

    // ── ADDED: NCCI bundling denials REQUIRE live grounding to determine the
    // Column 1/Column 2 relationship. NCCI tables are updated quarterly and
    // cannot be reliably answered from AI training knowledge alone.
    // If grounding was intended but fell back, return CANNOT_DETERMINE instead
    // of letting the model guess — which is what caused the inconsistent
    // TRUE/FALSE flipping seen before this fix.
    if (useGrounding && !usedGrounding && isNcci) {
      return res.status(200).json({
        verdict: "CANNOT_DETERMINE",
        confidence: 0,
        verdictSummary: `Live lookup of the NCCI PTP edit table was unavailable. The Column 1/Column 2 relationship for CPT ${deniedStr} vs ${billedStr} cannot be reliably determined from AI training data alone — NCCI tables are updated quarterly and training data may be stale.`,
        denialRuleExplained: `${denialCode} means the denied procedure was considered bundled into a more comprehensive procedure already paid on the same claim. Whether this is valid depends on the current quarterly NCCI PTP edit table, which could not be accessed in this session.`,
        whyTrueDenial: [
          `If CPT ${deniedStr} is listed as Column 2 to the paid CPT in the current NCCI PTP table, this denial is valid — the payer correctly bundled the component code into the comprehensive code.`,
          "NCCI bundles are updated quarterly. Always verify against the current table rather than relying on prior-quarter data or AI training knowledge.",
        ],
        whyFalseDenial: [
          `If modifier -59 or an X{EPSU} modifier (XE, XP, XS, XU) was appended to CPT ${deniedStr} on the original claim and documents a distinct anatomical site or separate encounter, this denial may be disputable.`,
          `If CPT ${deniedStr} is actually the Column 1 (more comprehensive) code and the payer paid the lesser Column 2 code instead, bundling was applied in the wrong direction and the denial is incorrect.`,
        ],
        billingErrors: [],
        correctiveActions: [
          `Download the current quarterly NCCI PTP edit table from CMS and look up the pair: ${billedStr} vs ${deniedStr} to confirm which is Column 1 and which is Column 2.`,
          `Confirm whether modifier -59 or an X modifier was on CPT ${deniedStr} on the original claim — if so, verify your documentation supports a distinct site or separate encounter before appealing.`,
          "Re-run this analysis — if the live NCCI table lookup succeeds, you will receive a definitive LIKELY_TRUE or LIKELY_FALSE verdict.",
        ],
        appealSteps: [
          "Pull the remittance advice and confirm the exact CPT that was paid vs denied.",
          "Check the current NCCI PTP edit table to confirm Column 1/2 assignment for this CPT pair.",
          "If a -59 or X modifier was billed and documentation supports a distinct service, submit a first-level appeal with the operative or procedure note.",
          "If the payer bundled in the wrong direction (denied the Column 1 code), submit a corrected claim or appeal citing the NCCI Column 1/2 assignment.",
        ],
        modifierGuidance: "Modifier -59 (or XS/XU/XE/XP) on the Column 2 code can override an NCCI bundle — but only when documentation confirms a truly distinct anatomical site or separate encounter. Without that documentation, the modifier will not support an appeal.",
        documentationNeeded: [
          "Current quarterly NCCI PTP edit file from CMS (cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits)",
          `Operative or procedure note confirming whether CPT ${deniedStr} was performed at a separate anatomical site or during a separate encounter`,
          "Original claim or remittance showing which CPT was paid and which was denied",
        ],
        preventionTips: [
          "Subscribe to CMS NCCI quarterly update notifications and review impacted CPT pairs each quarter.",
          "Use a claim scrubber that references the current NCCI PTP table before submission — this catches bundling issues before the claim is sent.",
          "When billing CPT pairs that are commonly bundled, confirm the Column 1/2 relationship in the current table and append the appropriate modifier only when documentation supports a distinct service.",
        ],
        timingAdvice: "Verify the exact appeal deadline directly with the payer — do not rely on an estimate.",
        escalationPath: "First-level internal appeal → second-level appeal → external independent review if applicable.",
        lcdNcdReference: { type: "NONE", articleNumber: null, title: null, url: null, summary: null },
        groundingAttempted: true,
        wasGrounded: false,
        sources: null,
      });
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
    const groundingChunks = geminiData.candidates[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter(c => c?.web?.uri && c?.web?.title)
      .map(c => ({ url: c.web.uri, title: c.web.title }))
      .filter((s, i, arr) => arr.findIndex(x => x.url === s.url) === i)
      .slice(0, 5);

    // ── CHANGED: expose both groundingAttempted and wasGrounded separately.
    // groundingAttempted = true means the Pro model + Google Search was used,
    //   regardless of whether source links came back.
    // wasGrounded = true means grounding was used AND source links were returned.
    // This prevents the badge in the UI from showing "AI Knowledge Only" on
    // NCCI/auth/med-necessity calls where search ran but Gemini didn't attach links.
    return res.status(200).json({
      ...parsed,
      sources: sources.length > 0 ? sources : null,
      groundingAttempted: useGrounding,
      wasGrounded: usedGrounding && sources.length > 0,
    });

  } catch (err) {
    console.error("Critical server error:", err);
    return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
}
