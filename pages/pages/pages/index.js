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
