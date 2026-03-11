import { useState, useRef } from "react";
import Head from "next/head";

const DENIAL_CODES = {
  "CO-1":   { label:"Deductible",             category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Deductible amount" },
  "CO-2":   { label:"Coinsurance",            category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Coinsurance amount" },
  "CO-3":   { label:"Copay",                  category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Co-payment amount" },
  "CO-4":   { label:"Procedure Inconsistent", category:"Coding Error",           color:"#ef4444", icon:"⚠️", description:"Procedure inconsistent with modifier" },
  "CO-5":   { label:"Not Covered",            category:"Coverage Denial",        color:"#dc2626", icon:"🚫", description:"Procedure is not covered by payer" },
  "CO-7":   { label:"Inconsistent Diagnosis", category:"Coding Error",           color:"#ef4444", icon:"⚠️", description:"Procedure inconsistent with diagnosis" },
  "CO-8":   { label:"Inconsistent Sex",       category:"Coding Error",           color:"#ef4444", icon:"⚠️", description:"Procedure inconsistent with patient sex" },
  "CO-9":   { label:"Inconsistent Age",       category:"Coding Error",           color:"#ef4444", icon:"⚠️", description:"Procedure inconsistent with patient age" },
  "CO-11":  { label:"Diagnosis Inconsistent", category:"Coding Error",           color:"#ef4444", icon:"⚠️", description:"Diagnosis inconsistent with procedure" },
  "CO-13":  { label:"Date of Service",        category:"Eligibility",            color:"#0ea5e9", icon:"📅", description:"Date of service not in coverage period" },
  "CO-15":  { label:"Authorization",          category:"Auth/Referral",          color:"#ec4899", icon:"🔐", description:"Payment adjusted — authorization unavailable" },
  "CO-16":  { label:"Claim Lacks Info",       category:"Admin/Process",          color:"#8b5cf6", icon:"📋", description:"Claim lacks information for adjudication" },
  "CO-17":  { label:"Pre-auth Required",      category:"Auth/Referral",          color:"#ec4899", icon:"🔐", description:"Prior authorization required" },
  "CO-18":  { label:"Duplicate Claim",        category:"Duplicate",              color:"#f97316", icon:"🔁", description:"Exact duplicate claim or service" },
  "CO-19":  { label:"Therapy Exceeds Limit",  category:"Coverage Limit",         color:"#dc2626", icon:"🚫", description:"Therapy visit limit exceeded" },
  "CO-20":  { label:"Lower Level of Care",    category:"Medical Necessity",      color:"#dc2626", icon:"🏥", description:"Lower level of care appropriate" },
  "CO-21":  { label:"Third Party Liable",     category:"Coordination of Benefits", color:"#06b6d4", icon:"🔄", description:"Other coverage is primary" },
  "CO-22":  { label:"COB Savings",            category:"Coordination of Benefits", color:"#06b6d4", icon:"🔄", description:"Care may be covered by another payer" },
  "CO-23":  { label:"Payment by Other Payer", category:"Coordination of Benefits", color:"#06b6d4", icon:"🔄", description:"Payment adjusted per COB" },
  "CO-26":  { label:"Expired Coverage",       category:"Timely Filing",          color:"#0ea5e9", icon:"📅", description:"Expenses incurred after coverage expired" },
  "CO-27":  { label:"Prior to Coverage",      category:"Eligibility",            color:"#0ea5e9", icon:"📅", description:"Expenses incurred prior to coverage" },
  "CO-29":  { label:"Timely Filing",          category:"Timely Filing",          color:"#0ea5e9", icon:"📅", description:"Claim not filed timely" },
  "CO-31":  { label:"Patient Cannot ID",      category:"Patient Info",           color:"#8b5cf6", icon:"📋", description:"Patient cannot be identified as insured" },
  "CO-33":  { label:"Limit Exceeded",         category:"Coverage Limit",         color:"#dc2626", icon:"🚫", description:"Quantity exceeds plan limit" },
  "CO-35":  { label:"Lifetime Max",           category:"Coverage Limit",         color:"#dc2626", icon:"🚫", description:"Lifetime benefit maximum reached" },
  "CO-40":  { label:"Charges Not Separated",  category:"Coding Error",           color:"#ef4444", icon:"⚠️", description:"Charges not separated per policy" },
  "CO-45":  { label:"Charge Exceeds Allowed", category:"Contract",               color:"#7c3aed", icon:"📑", description:"Charge exceeds contracted amount" },
  "CO-49":  { label:"Non-covered Routine",    category:"Coverage Denial",        color:"#dc2626", icon:"🚫", description:"Non-covered routine exams" },
  "CO-50":  { label:"Not Medically Necessary",category:"Medical Necessity",      color:"#dc2626", icon:"🏥", description:"Service not deemed medically necessary" },
  "CO-51":  { label:"Custodial Care",         category:"Medical Necessity",      color:"#dc2626", icon:"🏥", description:"Service is custodial care" },
  "CO-56":  { label:"Procedure Unbundled",    category:"Coding Error",           color:"#ef4444", icon:"⚠️", description:"Should be billed as complete service" },
  "CO-59":  { label:"Concurrent Procedure",   category:"NCCI Bundling",          color:"#f97316", icon:"🔗", description:"Multiple/concurrent procedure reduction" },
  "CO-74":  { label:"Duplicate",              category:"Duplicate",              color:"#f97316", icon:"🔁", description:"Duplicate of original payment" },
  "CO-76":  { label:"Treatment Denied",       category:"Medical Necessity",      color:"#dc2626", icon:"🏥", description:"Treatment not required per medical record" },
  "CO-78":  { label:"Multiple Procedures",    category:"NCCI Bundling",          color:"#f97316", icon:"🔗", description:"Payment reduced for multiple procedures" },
  "CO-85":  { label:"Claim Not Received",     category:"Admin/Process",          color:"#8b5cf6", icon:"📋", description:"Claim not received by payer" },
  "CO-96":  { label:"Non-covered Charge",     category:"Coverage Denial",        color:"#dc2626", icon:"🚫", description:"Benefit not provided by plan" },
  "CO-97":  { label:"Payment Included",       category:"NCCI Bundling",          color:"#f97316", icon:"🔗", description:"Payment included in another service" },
  "CO-109": { label:"Wrong Payer",            category:"Coverage Denial",        color:"#dc2626", icon:"🚫", description:"Forward to correct payer" },
  "CO-119": { label:"Benefit Max Reached",    category:"Coverage Limit",         color:"#dc2626", icon:"🚫", description:"Benefit maximum for period reached" },
  "CO-125": { label:"Submission Issue",       category:"Admin/Process",          color:"#8b5cf6", icon:"📋", description:"Submission/billing error" },
  "CO-146": { label:"Invalid Diagnosis",      category:"Coding Error",           color:"#ef4444", icon:"⚠️", description:"Diagnosis invalid for date of service" },
  "CO-163": { label:"Attachment Required",    category:"Admin/Process",          color:"#8b5cf6", icon:"📋", description:"Documentation/attachment required" },
  "CO-167": { label:"Diagnosis Not Covered",  category:"Coding Error",           color:"#ef4444", icon:"⚠️", description:"This diagnosis is not covered" },
  "CO-174": { label:"No Coverage",            category:"Eligibility",            color:"#0ea5e9", icon:"📅", description:"No coverage on date of service" },
  "CO-176": { label:"Accident Related",       category:"COB/Liability",          color:"#06b6d4", icon:"🔄", description:"Accident-related — liability may apply" },
  "CO-177": { label:"Patient Not Eligible",   category:"Eligibility",            color:"#0ea5e9", icon:"📅", description:"Patient not eligible for service" },
  "CO-181": { label:"Referral Required",      category:"Auth/Referral",          color:"#ec4899", icon:"🔐", description:"Referral not on file" },
  "CO-182": { label:"Procedure Denied",       category:"Coverage Denial",        color:"#dc2626", icon:"🚫", description:"Not covered by this payer" },
  "CO-183": { label:"Out of Network",         category:"Contract",               color:"#7c3aed", icon:"📑", description:"No network provider — service denied" },
  "CO-186": { label:"Level of Care",          category:"Medical Necessity",      color:"#dc2626", icon:"🏥", description:"Level of care not appropriate" },
  "CO-195": { label:"Revenue Code Mismatch",  category:"Coding Error",           color:"#ef4444", icon:"⚠️", description:"Revenue code inconsistent with procedure" },
  "CO-197": { label:"Pre-cert Required",      category:"Auth/Referral",          color:"#ec4899", icon:"🔐", description:"Precertification not obtained" },
  "CO-199": { label:"Revenue/Proc Mismatch",  category:"Coding Error",           color:"#ef4444", icon:"⚠️", description:"Revenue code and procedure code mismatch" },
  "CO-200": { label:"Lapse in Coverage",      category:"Coverage Denial",        color:"#dc2626", icon:"🚫", description:"Expenses during coverage lapse" },
  "CO-201": { label:"Workers Comp",           category:"COB/Liability",          color:"#06b6d4", icon:"🔄", description:"Workers compensation case" },
  "CO-204": { label:"Not Covered – Category", category:"Coverage Denial",        color:"#dc2626", icon:"🚫", description:"Service/drug not covered under plan" },
  "CO-222": { label:"Exceeds Units",          category:"Coverage Limit",         color:"#dc2626", icon:"🚫", description:"Exceeds plan allowable units/visits" },
  "CO-224": { label:"Not FDA Approved",       category:"Coverage Denial",        color:"#dc2626", icon:"🚫", description:"Unapproved procedure or drug" },
  "CO-228": { label:"Failed IME",             category:"Medical Necessity",      color:"#dc2626", icon:"🏥", description:"Denied — independent medical exam" },
  "CO-231": { label:"Mutually Exclusive",     category:"NCCI Bundling",          color:"#f97316", icon:"🔗", description:"Mutually exclusive procedure" },
  "CO-234": { label:"Component Billing",      category:"Coding Error",           color:"#ef4444", icon:"⚠️", description:"Component of a comprehensive code" },
  "CO-238": { label:"Coverage Not Active",    category:"Eligibility",            color:"#0ea5e9", icon:"📅", description:"Coverage not active during DOS" },
  "CO-243": { label:"Not Medically Necessary",category:"Medical Necessity",      color:"#dc2626", icon:"🏥", description:"Not medically necessary per plan" },
  "CO-245": { label:"Not Preauthorized",      category:"Auth/Referral",          color:"#ec4899", icon:"🔐", description:"Service not preauthorized" },
  "CO-246": { label:"Auth Number Missing",    category:"Auth/Referral",          color:"#ec4899", icon:"🔐", description:"Authorization number missing or invalid" },
  "CO-252": { label:"Info Required",          category:"Admin/Process",          color:"#8b5cf6", icon:"📋", description:"Documentation required" },
  "CO-256": { label:"Service Not Ordered",    category:"Medical Necessity",      color:"#dc2626", icon:"🏥", description:"Service not ordered by physician" },
  "N30":    { label:"Invalid Patient ID",     category:"Admin/Process",          color:"#8b5cf6", icon:"📋", description:"Incomplete/invalid patient ID" },
  "N95":    { label:"COB/EOB Required",       category:"COB/Liability",          color:"#06b6d4", icon:"🔄", description:"Refer to EOB from primary payer" },
  "N115":   { label:"Appeal Rights",          category:"Info/Alert",             color:"#64748b", icon:"ℹ️", description:"This decision may be appealed" },
  "N179":   { label:"Info Req – Patient",     category:"Admin/Process",          color:"#8b5cf6", icon:"📋", description:"Additional info required from patient" },
  "N180":   { label:"Info Req – Provider",    category:"Admin/Process",          color:"#8b5cf6", icon:"📋", description:"Additional info required from provider" },
  "N362":   { label:"Composite Pricing",      category:"Contract",               color:"#7c3aed", icon:"📑", description:"Processed per composite pricing" },
  "N522":   { label:"Resubmission Not Allowed",category:"Admin/Process",         color:"#8b5cf6", icon:"📋", description:"Resubmission not allowed" },
  "N576":   { label:"Appeal Info",            category:"Info/Alert",             color:"#64748b", icon:"ℹ️", description:"Include remittance and EOB in appeal" },
  "N657":   { label:"Missing NDC",            category:"Coding Error",           color:"#ef4444", icon:"⚠️", description:"Missing/invalid National Drug Code" },
};

const DARK = "#09111f", CARD = "#0f1929", CARD2 = "#131f33", BORDER = "#1a2d47", ACCENT = "#38bdf8";

function Tag({ label, color, onRemove }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 11px", borderRadius:7, background:`${color}18`, border:`1.5px solid ${color}55`, color, fontSize:12, fontWeight:700, fontFamily:"monospace", margin:"3px" }}>
      {label}
      {onRemove && <span onClick={onRemove} style={{ cursor:"pointer", opacity:0.7, fontSize:14 }}>×</span>}
    </span>
  );
}

function Section({ icon, title, items, color, note }) {
  if (!items?.length) return null;
  return (
    <div style={{ background:`${color}0d`, border:`1.5px solid ${color}30`, borderRadius:12, padding:"14px 16px", marginBottom:11 }}>
      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
        <span>{icon}</span>
        <span style={{ fontSize:11, fontWeight:700, color, textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</span>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:6 }}>
          <span style={{ color, fontWeight:800, fontSize:13, flexShrink:0 }}>›</span>
          <span style={{ fontSize:13, color:"#c8d8ea", lineHeight:1.65 }}>{item}</span>
        </div>
      ))}
      {note && <p style={{ margin:"8px 0 0", fontSize:11, color:"#475569", fontStyle:"italic", borderTop:`1px solid ${color}25`, paddingTop:7 }}>{note}</p>}
    </div>
  );
}
export default function DenialAnalyzer() {
  const [denialCode, setDenialCode] = useState("");
  const [denialSearch, setDenialSearch] = useState("");
  const [billedLines, setBilledLines] = useState([]);
  const [deniedLines, setDeniedLines] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [mode, setMode] = useState("billed");
  const [additionalContext, setAdditionalContext] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const resultRef = useRef(null);

  const selectedCode = DENIAL_CODES[denialCode.toUpperCase()] || null;
  const filteredCodes = denialSearch.length >= 1
    ? Object.entries(DENIAL_CODES).filter(([k, v]) =>
        k.toLowerCase().includes(denialSearch.toLowerCase()) ||
        v.label.toLowerCase().includes(denialSearch.toLowerCase()) ||
        v.description.toLowerCase().includes(denialSearch.toLowerCase()) ||
        v.category.toLowerCase().includes(denialSearch.toLowerCase())
      ).slice(0, 12)
    : [];

  function parseEntry(raw) {
    const parts = raw.trim().toUpperCase().split(/\s+/);
    const cptMod = parts[0].split("-");
    const cpt = cptMod[0];
    const modifier = cptMod.slice(1).join("-") || "";
    const dx = parts[1] || "";
    if (!/^\d{4,5}[A-Z0-9]?$/.test(cpt) && !/^[A-Z]\d{2}/.test(cpt)) return null;
    return { cpt, modifier, dx, id: Date.now() + Math.random() };
  }

  function handleAdd() {
    setError("");
    if (!inputVal.trim()) return;
    const parsed = parseEntry(inputVal);
    if (!parsed) {
      setError("Format: CPT  or  CPT-MODIFIER  or  CPT-MODIFIER ICD10  (e.g. 99213  or  27447-59  or  27447-59 M54.5)");
      return;
    }
    if (mode === "billed") setBilledLines(l => [...l, parsed]);
    else setDeniedLines(l => [...l, parsed]);
    setInputVal("");
    inputRef.current?.focus();
  }

  async function runAnalysis() {
    setError("");
    if (!denialCode) { setError("Please select a denial code first."); return; }
    if (deniedLines.length === 0) { setError("Please add at least one denied CPT code."); return; }
    setLoading(true);
    setResult(null);

    const codeInfo = DENIAL_CODES[denialCode.toUpperCase()];
    const billedStr = billedLines.length > 0
      ? billedLines.map(l => `${l.cpt}${l.modifier ? "-" + l.modifier : ""}${l.dx ? " [" + l.dx + "]" : ""}`).join(", ")
      : "Not provided";
    const deniedStr = deniedLines.map(l => `${l.cpt}${l.modifier ? "-" + l.modifier : ""}${l.dx ? " [" + l.dx + "]" : ""}`).join(", ");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          denialCode,
          denialCategory: codeInfo?.category,
          denialDescription: codeInfo?.description,
          billedStr,
          deniedStr,
          additionalContext,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");
      setResult({ ai: data, codeInfo, denialCode });
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    }

    setLoading(false);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  }

  function reset() {
    setDenialCode(""); setDenialSearch(""); setBilledLines([]); setDeniedLines([]);
    setInputVal(""); setResult(null); setError(""); setAdditionalContext(""); setMode("billed");
  }

  const ai = result?.ai;
  const isFalse = ai?.verdict === "FALSE" || ai?.verdict === "LIKELY_FALSE";
  const isTrue  = ai?.verdict === "TRUE"  || ai?.verdict === "LIKELY_TRUE";
  const vc = ai?.verdict === "FALSE" ? "#22c55e" : ai?.verdict === "LIKELY_FALSE" ? "#86efac" : ai?.verdict === "TRUE" ? "#ef4444" : "#f59e0b";
  const vl = ai?.verdict === "TRUE" ? "TRUE DENIAL" : ai?.verdict === "FALSE" ? "FALSE DENIAL" : ai?.verdict === "LIKELY_TRUE" ? "LIKELY TRUE DENIAL" : "LIKELY FALSE DENIAL";
  const vi = isFalse ? "✅" : ai?.verdict === "TRUE" ? "❌" : "⚠️";

  return (
    <>
      <Head>
        <title>Medical Billing Denial Analyzer</title>
        <meta name="description" content="AI-powered medical billing denial analyzer covering all CARC and RARC codes." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ minHeight:"100vh", background:DARK, fontFamily:"'Segoe UI',system-ui,sans-serif", padding:"20px 14px 48px" }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>

          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(56,189,248,0.08)", border:"1px solid rgba(56,189,248,0.2)", borderRadius:999, padding:"4px 14px", marginBottom:12 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:ACCENT, display:"inline-block" }}/>
              <span style={{ fontSize:11, color:ACCENT, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>AI-Powered · All CARC & RARC Codes</span>
            </div>
            <h1 style={{ margin:"0 0 6px", fontSize:28, fontWeight:800, color:"#e8f4ff", letterSpacing:"-0.02em" }}>
              Medical Billing Denial <span style={{ color:ACCENT }}>Analyzer</span>
            </h1>
            <p style={{ margin:0, color:"#4a6a8a", fontSize:13, maxWidth:460, marginLeft:"auto", marginRight:"auto" }}>
              Select any denial code · Enter CPT codes · Get instant AI verdict with exact next steps
            </p>
          </div>

          <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"20px", marginBottom:12 }}>

            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#3a5a7a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ background:ACCENT, color:DARK, borderRadius:"50%", width:17, height:17, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800 }}>1</span>
                Denial Code (CARC or RARC)
              </div>
              <div style={{ position:"relative" }}>
                <input value={denialSearch}
                  onChange={e => { setDenialSearch(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  placeholder="Type code or keyword... e.g. CO-59, CO-50, auth, timely filing, duplicate"
                  style={{ width:"100%", padding:"10px 13px", borderRadius:8, border:`2px solid ${selectedCode ? selectedCode.color+"60" : BORDER}`, background:"#0a1525", color:"#d0e8ff", fontSize:13, fontFamily:"monospace", outline:"none", boxSizing:"border-box" }}
                />
                {showDropdown && filteredCodes.length > 0 && (
                  <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, background:CARD2, border:`1px solid ${BORDER}`, borderRadius:10, zIndex:200, boxShadow:"0 16px 40px rgba(0,0,0,0.6)", maxHeight:260, overflowY:"auto" }}>
                    {filteredCodes.map(([key, val]) => (
                      <div key={key}
                        onClick={() => { setDenialCode(key); setDenialSearch(`${key} — ${val.label}`); setShowDropdown(false); }}
                        style={{ padding:"9px 13px", cursor:"pointer", display:"flex", alignItems:"center", gap:9, borderBottom:`1px solid ${BORDER}` }}
                        onMouseEnter={e => e.currentTarget.style.background = "#1a2d47"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <span style={{ fontSize:14, flexShrink:0 }}>{val.icon}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                            <span style={{ fontFamily:"monospace", fontWeight:700, fontSize:12, color:val.color }}>{key}</span>
                            <span style={{ fontSize:12, color:"#c8d8ea" }}>{val.label}</span>
                          </div>
                          <div style={{ fontSize:11, color:"#3a5a7a", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{val.description}</div>
                        </div>
                        <span style={{ fontSize:10, color:val.color, background:`${val.color}15`, borderRadius:4, padding:"2px 6px", fontWeight:700, flexShrink:0, whiteSpace:"nowrap" }}>{val.category}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedCode && (
                <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:9, padding:"8px 13px", borderRadius:8, background:`${selectedCode.color}10`, border:`1.5px solid ${selectedCode.color}40` }}>
                  <span style={{ fontSize:18 }}>{selectedCode.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                      <span style={{ fontFamily:"monospace", fontWeight:800, fontSize:13, color:selectedCode.color }}>{denialCode}</span>
                      <span style={{ fontSize:13, color:"#c8d8ea", fontWeight:600 }}>{selectedCode.label}</span>
                      <span style={{ fontSize:10, color:selectedCode.color, background:`${selectedCode.color}20`, borderRadius:4, padding:"2px 7px", fontWeight:700 }}>{selectedCode.category}</span>
                    </div>
                    <div style={{ fontSize:11, color:"#4a6a8a", marginTop:2 }}>{selectedCode.description}</div>
                  </div>
                  <button onClick={() => { setDenialCode(""); setDenialSearch(""); }} style={{ background:"none", border:"none", color:"#3a5a7a", cursor:"pointer", fontSize:16 }}>×</button>
                </div>
              )}
            </div>

            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#3a5a7a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ background:ACCENT, color:DARK, borderRadius:"50%", width:17, height:17, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800 }}>2</span>
                CPT Codes
              </div>
              <div style={{ display:"flex", gap:7, marginBottom:10 }}>
                {[["billed","✓ Billed CPTs","All codes on the claim"],["denied","✗ Denied CPT(s)","Codes that got this denial"]].map(([m,lbl,hint]) => (
                  <button key={m} onClick={() => setMode(m)}
                    style={{ flex:1, padding:"8px 12px", borderRadius:8, border:`2px solid ${mode===m?(m==="denied"?"rgba(239,68,68,0.5)":ACCENT+"80"):BORDER}`, background:mode===m?(m==="denied"?"rgba(239,68,68,0.08)":"rgba(56,189,248,0.06)"):"transparent", cursor:"pointer", textAlign:"left" }}>
                    <div style={{ fontSize:12, fontWeight:700, color:mode===m?(m==="denied"?"#f87171":ACCENT):"#3a5a7a" }}>{lbl}</div>
                    <div style={{ fontSize:11, color:"#2a4a6a" }}>{hint}</div>
                  </button>
                ))}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <input ref={inputRef} value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAdd()}
                  placeholder={mode === "billed" ? "e.g. 99213  or  27447-25  or  27447-25 M54.5" : "e.g. 27446  or  27446-59  or  27446 M17.11"}
                  style={{ flex:1, padding:"10px 12px", borderRadius:8, border:`2px solid ${BORDER}`, background:"#0a1525", color:"#d0e8ff", fontSize:13, fontFamily:"monospace", outline:"none", boxSizing:"border-box" }}
                />
                <button onClick={handleAdd}
                  style={{ padding:"10px 16px", borderRadius:8, border:"none", background:mode==="denied"?"rgba(239,68,68,0.15)":"rgba(56,189,248,0.12)", color:mode==="denied"?"#f87171":ACCENT, fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
                  {mode === "billed" ? "+ Billed" : "+ Denied"}
                </button>
              </div>
              <div style={{ fontSize:11, color:"#2a4a6a", marginTop:5 }}>CPT · CPT-MODIFIER · CPT-MODIFIER ICD10 — press Enter to add</div>
              {error && <div style={{ marginTop:7, fontSize:12, color:"#f87171", background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:7, padding:"6px 11px" }}>{error}</div>}
            </div>

            {(billedLines.length > 0 || deniedLines.length > 0) && (
              <div style={{ borderTop:`1px solid ${BORDER}`, paddingTop:11, marginBottom:12 }}>
                {billedLines.length > 0 && (
                  <div style={{ marginBottom:7 }}>
                    <span style={{ fontSize:10, fontWeight:700, color:"#3a5a7a", textTransform:"uppercase", letterSpacing:"0.07em", display:"block", marginBottom:4 }}>Billed ({billedLines.length})</span>
                    {billedLines.map(l => (
                      <Tag key={l.id} color="#38bdf8"
                        label={`${l.cpt}${l.modifier?"-"+l.modifier:""}${l.dx?" ["+l.dx+"]":""}`}
                        onRemove={() => setBilledLines(ls => ls.filter(x => x.id !== l.id))} />
                    ))}
                  </div>
                )}
                {deniedLines.length > 0 && (
                  <div>
                    <span style={{ fontSize:10, fontWeight:700, color:"#3a5a7a", textTransform:"uppercase", letterSpacing:"0.07em", display:"block", marginBottom:4 }}>Denied ({deniedLines.length})</span>
                    {deniedLines.map(l => (
                      <Tag key={l.id} color="#f87171"
                        label={`${l.cpt}${l.modifier?"-"+l.modifier:""}${l.dx?" ["+l.dx+"]":""}`}
                        onRemove={() => setDeniedLines(ls => ls.filter(x => x.id !== l.id))} />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#3a5a7a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6, display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ background:"#1a2d47", color:"#3a5a7a", borderRadius:"50%", width:17, height:17, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800 }}>3</span>
                Additional Context
                <span style={{ fontWeight:400, color:"#2a4a6a", textTransform:"none", fontSize:11 }}>(optional)</span>
              </div>
              <textarea value={additionalContext} onChange={e => setAdditionalContext(e.target.value)} rows={2}
                placeholder="e.g. Auth was obtained, payer is Medicare, modifier -25 was on claim..."
                style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`2px solid ${BORDER}`, background:"#0a1525", color:"#8a9baa", fontSize:12, outline:"none", resize:"vertical", boxSizing:"border-box", lineHeight:1.5 }} />
            </div>

            <div style={{ display:"flex", gap:9 }}>
              <button onClick={runAnalysis} disabled={loading}
                style={{ flex:1, padding:"12px", borderRadius:10, border:"none", background:loading?"#0f1929":`linear-gradient(135deg,${ACCENT},#0284c7)`, color:loading?"#3a5a7a":"#03111f", fontSize:14, fontWeight:800, cursor:loading?"not-allowed":"pointer", boxShadow:loading?"none":"0 4px 18px rgba(56,189,248,0.2)" }}>
                {loading ? "🔍  Analyzing..." : "⚡  Analyze — True or False Denial?"}
              </button>
              {(billedLines.length>0||deniedLines.length>0||denialCode||result) && (
                <button onClick={reset} style={{ padding:"12px 15px", borderRadius:10, border:`1.5px solid ${BORDER}`, background:"transparent", color:"#3a5a7a", fontSize:12, fontWeight:600, cursor:"pointer" }}>Reset</button>
              )}
            </div>
          </div>

          {loading && (
            <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"28px 20px", textAlign:"center" }}>
              <div style={{ fontSize:28, marginBottom:10 }}>🔬</div>
              <div style={{ fontSize:14, color:"#7a9bbf", fontWeight:600, marginBottom:5 }}>Reviewing {denialCode} rules & claim details…</div>
              <div style={{ fontSize:12, color:"#2a4a6a" }}>Checking payer policy · Evaluating CPTs · Assessing appeal options</div>
              <div style={{ display:"flex", justifyContent:"center", gap:7, marginTop:14 }}>
                {[0,0.2,0.4].map((d,i) => (
                  <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:ACCENT, animation:`pulse2 1.2s ${d}s infinite` }}/>
                ))}
              </div>
            </div>
          )}

          {result && !loading && ai && (
            <div ref={resultRef}>
              <div style={{ background:CARD, border:`1.5px solid ${vc}35`, borderRadius:16, padding:"18px 20px", marginBottom:11, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${vc},transparent)` }}/>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <span style={{ fontSize:36 }}>{vi}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#3a5a7a", textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:3 }}>Denial Analysis — {result.denialCode}</div>
                    <div style={{ fontSize:22, fontWeight:800, color:vc, marginBottom:3 }}>{vl}</div>
                    {ai.verdictSummary && <p style={{ margin:0, fontSize:13, color:"#7a9bbf", lineHeight:1.6 }}>{ai.verdictSummary}</p>}
                  </div>
                  <div style={{ textAlign:"center", flexShrink:0 }}>
                    <div style={{ fontSize:10, color:"#3a5a7a", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>Confidence</div>
                    <div style={{ position:"relative", width:64, height:64 }}>
                      <svg width="64" height="64" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="26" fill="none" stroke={BORDER} strokeWidth="6"/>
                        <circle cx="32" cy="32" r="26" fill="none" stroke={vc} strokeWidth="6"
                          strokeDasharray={`${2*Math.PI*26}`}
                          strokeDashoffset={`${2*Math.PI*26*(1-(ai.confidence||70)/100)}`}
                          strokeLinecap="round" transform="rotate(-90 32 32)"/>
                      </svg>
                      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:vc, fontFamily:"monospace" }}>
                        {ai.confidence||70}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"18px 20px" }}>
                {ai.denialRuleExplained && (
                  <div style={{ background:"rgba(56,189,248,0.06)", border:"1.5px solid rgba(56,189,248,0.2)", borderRadius:11, padding:"13px 15px", marg
