export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { denialCode, denialCategory, denialDescription, billedStr, deniedStr, additionalContext } = req.body;

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
7. For Medical Necessity denials (CO-50, CO-20, CO-51, CO-76, CO-186, CO-228, CO-243, CO-244, CO-256): explicitly state in "whyTrueDenial" or "whyFalseDenial" whether a Local Coverage Determination (LCD) or National Coverage Determination (NCD) likely governs the denied CPT code. Use the format: "Check the LCD/NCD for CPT [code] — it defines the covered diagnoses and documentation requirements for this service." If an NCD is known to exist for the procedure (e.g., colonoscopy screenings, sleep studies), name it explicitly. Do not fabricate LCD article numbers or contractor names.`;

  const prompt = `DENIAL INFORMATION:
- Denial Code: ${denialCode}
- Denial Category: ${denialCategory || "Unknown"}
- Denial Description: ${denialDescription || "Unknown"}
- All Billed CPT Codes: ${billedStr || "Not provided"}
- Denied CPT Code(s): ${deniedStr}
${additionalContext ? `- Additional Context: ${additionalContext}` : ""}

Determine if this is a TRUE denial (valid) or FALSE denial (should be paid). Provide specific actionable guidance.

Respond ONLY in this exact JSON structure:
{"verdict":"TRUE|FALSE|LIKELY_TRUE|LIKELY_FALSE|CANNOT_DETERMINE","confidence":0-85,"verdictSummary":"one clear sentence explaining the verdict or why it cannot be determined","denialRuleExplained":"plain english explanation of ${denialCode}","whyTrueDenial":[],"whyFalseDenial":[],"billingErrors":[],"correctiveActions":[],"appealSteps":[],"modifierGuidance":"advice or null","documentationNeeded":[],"preventionTips":[],"timingAdvice":"deadline note or uncertainty disclaimer per rules","escalationPath":"general escalation process without fabricated contacts"}`;

  // Use the 2.5-flash-lite endpoint for the best balance of stability and free-tier limits in 2026
  const modelEndpoint = "gemini-2.5-flash-lite"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelEndpoint}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more consistent medical logic
          maxOutputTokens: 2000,
          response_mime_type: "application/json", // Forces Gemini to return pure JSON without markdown
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API direct error:", errText);

      // Specific handling for Free Tier Rate Limits (Error 429)
      if (response.status === 429) {
        return res.status(429).json({ error: "Daily limit or rate limit reached. Please wait a minute." });
      }

      return res.status(response.status).json({ error: "Gemini API failed to respond." });
    }

    const data = await response.json();
    
    // Safety check: sometimes the API responds but candidates is empty due to safety filters
    if (!data.candidates || data.candidates.length === 0) {
      return res.status(500).json({ error: "The AI blocked this response due to safety filters. Try simplifying your context." });
    }

    const resultText = data.candidates[0].content.parts[0].text;

    try {
      // With response_mime_type enabled, resultText is guaranteed to be a stringified JSON object
      const result = JSON.parse(resultText);
      return res.status(200).json(result);
    } catch (parseErr) {
      console.error("Failed to parse Gemini output:", resultText);
      return res.status(500).json({ error: "The AI returned an invalid response format." });
    }

  } catch (err) {
    console.error("Critical server error:", err);
    return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
}
