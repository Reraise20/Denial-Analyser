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

  const prompt = `You are a senior certified medical billing compliance specialist with deep expertise in CARC/RARC denial codes, NCCI edits, payer policies, and appeals.

DENIAL INFORMATION:
- Denial Code: ${denialCode}
- Denial Category: ${denialCategory || "Unknown"}
- Denial Description: ${denialDescription || "Unknown"}
- All Billed CPT Codes: ${billedStr || "Not provided"}
- Denied CPT Code(s): ${deniedStr}
${additionalContext ? `- Additional Context: ${additionalContext}` : ""}

Determine if this is a TRUE denial (valid) or FALSE denial (should be paid). Provide specific actionable guidance.

Respond ONLY in this exact JSON (no markdown, no extra text):
{"verdict":"TRUE|FALSE|LIKELY_TRUE|LIKELY_FALSE","confidence":0-100,"verdictSummary":"one clear sentence","denialRuleExplained":"plain english explanation of ${denialCode}","whyTrueDenial":[],"whyFalseDenial":[],"billingErrors":[],"correctiveActions":[],"appealSteps":[],"modifierGuidance":"advice or null","documentationNeeded":[],"preventionTips":[],"timingAdvice":"deadline note","escalationPath":"if appeal fails what next"}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1500,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini error:", err);
      return res.status(500).json({ error: "Gemini API error" });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    return res.status(200).json(result);
  } catch (err) {
    console.error("Parse/fetch error:", err);
    return res.status(500).json({ error: "Failed to analyze denial. Please try again." });
  }
}
