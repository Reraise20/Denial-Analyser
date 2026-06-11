import { useState, useRef, useEffect } from "react";
import Head from "next/head";

const DENIAL_CODES = {
  // ── PATIENT RESPONSIBILITY (CO) ───────────────────────────────────────────
  "CO-1":   { label:"Deductible",             category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Deductible amount" },
  "CO-2":   { label:"Coinsurance",            category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Coinsurance amount" },
  "CO-3":   { label:"Copay",                  category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Co-payment amount" },
  "CO-66":  { label:"Blood Deductible",       category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Blood deductible amount" },
  "CO-188": { label:"Plan Specified",         category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Product/procedure only covered under specified plan" },
  "CO-225": { label:"Upgrade Charge",         category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Upgrade charge — patient responsibility" },
  "CO-247": { label:"Deductible Not Met",     category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Deductible not met — patient responsibility" },
  // ── PR CODES ──────────────────────────────────────────────────────────────
  "PR-1":   { label:"PR Deductible",          category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Patient responsibility — deductible" },
  "PR-2":   { label:"PR Coinsurance",         category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Patient responsibility — coinsurance" },
  "PR-3":   { label:"PR Copay",               category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Patient responsibility — copay" },
  "PR-4":   { label:"PR Inconsistent",        category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Patient responsibility — procedure inconsistent with modifier" },
  "PR-5":   { label:"PR Not Covered",         category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Patient responsibility — not covered by payer" },
  "PR-6":   { label:"PR Unassigned",          category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Patient responsibility — unassigned claim" },
  "PR-26":  { label:"PR Expired Coverage",    category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Patient responsibility — coverage expired" },
  "PR-27":  { label:"PR Prior Coverage",      category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Patient responsibility — prior to coverage" },
  "PR-49":  { label:"PR Non-covered",         category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Patient responsibility — non-covered routine exam" },
  "PR-96":  { label:"PR Non-covered Charge",  category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Patient responsibility — non-covered charge" },
  "PR-119": { label:"PR Benefit Max",         category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Patient responsibility — benefit maximum reached" },
  "PR-204": { label:"PR Not Covered Category",category:"Patient Responsibility", color:"#f59e0b", icon:"💰", description:"Patient responsibility — service not covered under plan" },
  // ── OA CODES ──────────────────────────────────────────────────────────────
  "OA-1":   { label:"OA Deductible",          category:"Other Adjustment", color:"#6366f1", icon:"🔵", description:"Other adjustment — deductible" },
  "OA-2":   { label:"OA Coinsurance",         category:"Other Adjustment", color:"#6366f1", icon:"🔵", description:"Other adjustment — coinsurance" },
  "OA-3":   { label:"OA Copay",               category:"Other Adjustment", color:"#6366f1", icon:"🔵", description:"Other adjustment — copay" },
  "OA-18":  { label:"OA Duplicate",           category:"Other Adjustment", color:"#6366f1", icon:"🔵", description:"Other adjustment — duplicate claim" },
  "OA-23":  { label:"OA COB Payment",         category:"Other Adjustment", color:"#6366f1", icon:"🔵", description:"Other adjustment — payment adjusted per COB" },
  "OA-24":  { label:"OA Capitated",           category:"Other Adjustment", color:"#6366f1", icon:"🔵", description:"Other adjustment — capitated service" },
  "OA-45":  { label:"OA Charge Exceeds",      category:"Other Adjustment", color:"#6366f1", icon:"🔵", description:"Other adjustment — charge exceeds contracted amount" },
  "OA-96":  { label:"OA Non-covered",         category:"Other Adjustment", color:"#6366f1", icon:"🔵", description:"Other adjustment — non-covered charge" },
  "OA-97":  { label:"OA Payment Included",    category:"Other Adjustment", color:"#6366f1", icon:"🔵", description:"Other adjustment — payment included in another service" },
  "OA-109": { label:"OA Wrong Payer",         category:"Other Adjustment", color:"#6366f1", icon:"🔵", description:"Other adjustment — forward to correct payer" },
  "OA-119": { label:"OA Benefit Max",         category:"Other Adjustment", color:"#6366f1", icon:"🔵", description:"Other adjustment — benefit maximum reached" },
  "OA-125": { label:"OA Submission Issue",    category:"Other Adjustment", color:"#6366f1", icon:"🔵", description:"Other adjustment — submission/billing error" },
  "OA-136": { label:"OA Failure to Follow Up",category:"Other Adjustment", color:"#6366f1", icon:"🔵", description:"Other adjustment — failure to follow up" },
  "OA-181": { label:"OA Referral Required",   category:"Other Adjustment", color:"#6366f1", icon:"🔵", description:"Other adjustment — referral not on file" },
  "OA-197": { label:"OA Pre-cert Required",   category:"Other Adjustment", color:"#6366f1", icon:"🔵", description:"Other adjustment — precertification not obtained" },
  // ── CODING ERRORS ─────────────────────────────────────────────────────────
  "CO-4":   { label:"Procedure Inconsistent", category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Procedure inconsistent with modifier" },
  "CO-7":   { label:"Inconsistent Diagnosis", category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Procedure inconsistent with diagnosis" },
  "CO-8":   { label:"Inconsistent Sex",       category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Procedure inconsistent with patient sex" },
  "CO-9":   { label:"Inconsistent Age",       category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Procedure inconsistent with patient age" },
  "CO-10":  { label:"Inconsistent DOB",       category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Procedure inconsistent with date of birth" },
  "CO-11":  { label:"Diagnosis Inconsistent", category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Diagnosis inconsistent with procedure" },
  "CO-40":  { label:"Charges Not Separated",  category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Charges not separated per policy" },
  "CO-56":  { label:"Procedure Unbundled",    category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Should be billed as complete service" },
  "CO-146": { label:"Invalid Diagnosis",      category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Diagnosis invalid for date of service" },
  "CO-167": { label:"Diagnosis Not Covered",  category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"This diagnosis is not covered" },
  "CO-192": { label:"Non-standard Code",      category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Non-standard adjustment code" },
  "CO-195": { label:"Revenue Code Mismatch",  category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Revenue code inconsistent with procedure" },
  "CO-199": { label:"Revenue/Proc Mismatch",  category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Revenue code and procedure code mismatch" },
  "CO-234": { label:"Component Billing",      category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Component of a comprehensive code" },
  // ── COVERAGE DENIAL ───────────────────────────────────────────────────────
  "CO-5":   { label:"Not Covered",            category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Procedure is not covered by payer" },
  "CO-49":  { label:"Non-covered Routine",    category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Non-covered routine exams" },
  "CO-53":  { label:"Services by Relative",   category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Services by immediate relative not covered" },
  "CO-96":  { label:"Non-covered Charge",     category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Benefit not provided by plan" },
  "CO-109": { label:"Wrong Payer",            category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Forward to correct payer" },
  "CO-147": { label:"Long Term Care",         category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Provider cannot bill this service" },
  "CO-170": { label:"Professional Only",      category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Payment included in fee schedule allowance" },
  "CO-173": { label:"NF Resident",            category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Nursing facility resident — not covered" },
  "CO-178": { label:"Oral Rx",                category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Oral prescription drug benefit excluded" },
  "CO-179": { label:"Compound Drug",          category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Compound drug not covered" },
  "CO-182": { label:"Procedure Denied",       category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Not covered by this payer" },
  "CO-200": { label:"Lapse in Coverage",      category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Expenses during coverage lapse" },
  "CO-202": { label:"Personal Comfort",       category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Non-covered personal comfort items" },
  "CO-203": { label:"Discontinued Drug",      category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Discontinued or withdrawn drug" },
  "CO-204": { label:"Not Covered – Category", category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Service/drug not covered under plan" },
  "CO-224": { label:"Not FDA Approved",       category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Unapproved procedure or drug" },
  "CO-233": { label:"Services Restricted",    category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Services/charges restricted" },
  "CO-239": { label:"Unapproved Facility",    category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Unapproved facility — service not covered" },
  "CO-242": { label:"Wrong Provider Type",    category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Services not performed by appropriate provider" },
  "CO-250": { label:"No Coverage – Service",  category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"No coverage for the service" },
  // ── MEDICAL NECESSITY ─────────────────────────────────────────────────────
  "CO-20":  { label:"Lower Level of Care",    category:"Medical Necessity", color:"#dc2626", icon:"🏥", description:"Lower level of care appropriate" },
  "CO-50":  { label:"Not Medically Necessary",category:"Medical Necessity", color:"#dc2626", icon:"🏥", description:"Service not deemed medically necessary" },
  "CO-51":  { label:"Custodial Care",         category:"Medical Necessity", color:"#dc2626", icon:"🏥", description:"Service is custodial care" },
  "CO-76":  { label:"Treatment Denied",       category:"Medical Necessity", color:"#dc2626", icon:"🏥", description:"Treatment not required per medical record" },
  "CO-186": { label:"Level of Care",          category:"Medical Necessity", color:"#dc2626", icon:"🏥", description:"Level of care not appropriate" },
  "CO-228": { label:"Failed IME",             category:"Medical Necessity", color:"#dc2626", icon:"🏥", description:"Denied — independent medical exam" },
  "CO-243": { label:"Not Medically Necessary",category:"Medical Necessity", color:"#dc2626", icon:"🏥", description:"Not medically necessary per plan" },
  "CO-244": { label:"Peer Review Denial",     category:"Medical Necessity", color:"#dc2626", icon:"🏥", description:"Peer review organization denial" },
  "CO-256": { label:"Service Not Ordered",    category:"Medical Necessity", color:"#dc2626", icon:"🏥", description:"Service not ordered by physician" },
  // ── NCCI BUNDLING ─────────────────────────────────────────────────────────
  "CO-59":  { label:"Multiple Procedures",    category:"NCCI Bundling", color:"#f97316", icon:"🔗", description:"Payment adjusted — multiple/concurrent procedure reduction rule applied" },
  "CO-78":  { label:"Multiple Procedures",    category:"NCCI Bundling", color:"#f97316", icon:"🔗", description:"Payment reduced for multiple procedures" },
  "CO-97":  { label:"Payment Included",       category:"NCCI Bundling", color:"#f97316", icon:"🔗", description:"Payment included in another service" },
  "CO-231": { label:"Mutually Exclusive",     category:"NCCI Bundling", color:"#f97316", icon:"🔗", description:"Mutually exclusive procedure" },
  "CO-B15": { label:"Requires Qualifying Svc", category:"NCCI Bundling", color:"#f97316", icon:"🔗", description:"Service requires a qualifying service/procedure that has not been received/adjudicated" },
  // ── DUPLICATE ─────────────────────────────────────────────────────────────
  "CO-18":  { label:"Duplicate Claim",        category:"Duplicate", color:"#f97316", icon:"🔁", description:"Exact duplicate claim or service" },
  "CO-60":  { label:"Charges Covered Prior",  category:"Duplicate", color:"#f97316", icon:"🔁", description:"Charges for outpatient with prior hospitalization" },
  "CO-74":  { label:"Duplicate Payment",      category:"Duplicate", color:"#f97316", icon:"🔁", description:"Duplicate of original payment" },
  "CO-129": { label:"Prior Processing Error", category:"Duplicate", color:"#f97316", icon:"🔁", description:"Prior processing information appears incorrect" },
  "CO-193": { label:"Original Payment Stands",category:"Duplicate", color:"#f97316", icon:"🔁", description:"Original payment decision maintained" },
  // ── ADMIN / PROCESS ───────────────────────────────────────────────────────
  "CO-6":   { label:"Unassigned Claim",       category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Claim submitted for non-assigned service" },
  "CO-16":  { label:"Claim Lacks Info",       category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Claim lacks information for adjudication" },
  "CO-31":  { label:"Patient Cannot ID",      category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Patient cannot be identified as insured" },
  "CO-39":  { label:"Service Admin Denial",   category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Services denied at time of service" },
  "CO-55":  { label:"Wrong Provider",         category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Claim filed by other than rendering provider" },
  "CO-85":  { label:"Claim Not Received",     category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Claim not received by payer" },
  "CO-125": { label:"Submission Issue",       category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Submission/billing error" },
  "CO-131": { label:"Negotiated Discount",    category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Claim specific negotiated discount" },
  "CO-163": { label:"Attachment Required",    category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Documentation/attachment required" },
  "CO-166": { label:"Payer Deadline Passed",  category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Submitted after payer deadline" },
  "CO-168": { label:"Service Dates Invalid",  category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Service dates not valid under this plan" },
  "CO-171": { label:"Consent Error",          category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Consent error" },
  "CO-190": { label:"EOB Required",           category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Payment included in composite rate allowance" },
  "CO-226": { label:"Info Provided",          category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Information requested from provider is provided" },
  "CO-227": { label:"Prior Payer Info Missing",category:"Admin/Process",color:"#8b5cf6", icon:"📋", description:"Information from prior payer not received" },
  "CO-229": { label:"Prior Bad Debt",         category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Partial charge not covered due to prior bad debt" },
  "CO-232": { label:"Claim Span Issue",       category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Claim spans eligible and ineligible periods" },
  "CO-235": { label:"Institutional Only",     category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Must be billed by institutional provider" },
  "CO-252": { label:"Info Required",          category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Documentation required" },
  // ── AUTH / REFERRAL ───────────────────────────────────────────────────────
  "CO-15":  { label:"Authorization Missing",  category:"Auth/Referral", color:"#ec4899", icon:"🔐", description:"Payment adjusted — authorization unavailable" },
  "CO-17":  { label:"Pre-auth Required",      category:"Auth/Referral", color:"#ec4899", icon:"🔐", description:"Prior authorization required" },
  "CO-136": { label:"Failure to Follow Up",   category:"Auth/Referral", color:"#ec4899", icon:"🔐", description:"Failure to follow up after inpatient" },
  "CO-181": { label:"Referral Required",      category:"Auth/Referral", color:"#ec4899", icon:"🔐", description:"Referral not on file" },
  "CO-197": { label:"Pre-cert Required",      category:"Auth/Referral", color:"#ec4899", icon:"🔐", description:"Precertification not obtained" },
  "CO-198": { label:"Pre-cert Exceeded",      category:"Auth/Referral", color:"#ec4899", icon:"🔐", description:"Precertification exceeded" },
  "CO-245": { label:"Not Preauthorized",      category:"Auth/Referral", color:"#ec4899", icon:"🔐", description:"Service not preauthorized" },
  "CO-246": { label:"Auth Number Missing",    category:"Auth/Referral", color:"#ec4899", icon:"🔐", description:"Authorization number missing or invalid" },
  // ── COORDINATION OF BENEFITS ──────────────────────────────────────────────
  "CO-21":  { label:"Third Party Liable",     category:"Coordination of Benefits", color:"#06b6d4", icon:"🔄", description:"Other coverage is primary" },
  "CO-22":  { label:"COB Savings",            category:"Coordination of Benefits", color:"#06b6d4", icon:"🔄", description:"Care may be covered by another payer" },
  "CO-23":  { label:"Payment by Other Payer", category:"Coordination of Benefits", color:"#06b6d4", icon:"🔄", description:"Payment adjusted per COB" },
  "CO-54":  { label:"Other Plan Liable",      category:"Coordination of Benefits", color:"#06b6d4", icon:"🔄", description:"Multiple coverages — other plan liable" },
  "CO-176": { label:"Accident Related",       category:"COB/Liability",            color:"#06b6d4", icon:"🔄", description:"Accident-related — liability may apply" },
  "CO-184": { label:"Liability Adjustment",   category:"COB/Liability",            color:"#06b6d4", icon:"🔄", description:"Liability adjustment" },
  "CO-189": { label:"Not a Covered Benefit",  category:"COB/Liability",            color:"#06b6d4", icon:"🔄", description:"Not a covered benefit — COB" },
  "CO-201": { label:"Workers Comp",           category:"COB/Liability",            color:"#06b6d4", icon:"🔄", description:"Workers compensation case" },
  "CO-230": { label:"No Responsible Party",   category:"COB/Liability",            color:"#06b6d4", icon:"🔄", description:"No responsible party identified" },
  // ── ELIGIBILITY ───────────────────────────────────────────────────────────
  "CO-13":  { label:"Date of Service",        category:"Eligibility", color:"#0ea5e9", icon:"📅", description:"Date of service not in coverage period" },
  "CO-14":  { label:"Date of Birth Issue",    category:"Eligibility", color:"#0ea5e9", icon:"📅", description:"Date of birth follows date of service" },
  "CO-27":  { label:"Prior to Coverage",      category:"Eligibility", color:"#0ea5e9", icon:"📅", description:"Expenses incurred prior to coverage" },
  "CO-140": { label:"Plan Enrollment Pending",category:"Eligibility", color:"#0ea5e9", icon:"📅", description:"Patient not eligible — plan enrollment pending" },
  "CO-174": { label:"No Coverage",            category:"Eligibility", color:"#0ea5e9", icon:"📅", description:"No coverage on date of service" },
  "CO-177": { label:"Patient Not Eligible",   category:"Eligibility", color:"#0ea5e9", icon:"📅", description:"Patient not eligible for service" },
  "CO-180": { label:"Enrollment Exception",   category:"Eligibility", color:"#0ea5e9", icon:"📅", description:"Procedure inconsistent with enrollment category" },
  "CO-238": { label:"Coverage Not Active",    category:"Eligibility", color:"#0ea5e9", icon:"📅", description:"Coverage not active during DOS" },
  "CO-240": { label:"Plan Pending",           category:"Eligibility", color:"#0ea5e9", icon:"📅", description:"Plan enrollment pending" },
  // ── TIMELY FILING ─────────────────────────────────────────────────────────
  "CO-12":  { label:"Administered Prior",     category:"Eligibility", color:"#0ea5e9", icon:"📅", description:"Service administered prior to coverage effective date" },
  "CO-26":  { label:"Expired Coverage",       category:"Eligibility", color:"#0ea5e9", icon:"📅", description:"Expenses incurred after coverage termination date" },
  "CO-29":  { label:"Timely Filing",          category:"Timely Filing", color:"#0ea5e9", icon:"📅", description:"Claim not filed timely" },
  // ── COVERAGE LIMIT ────────────────────────────────────────────────────────
  "CO-19":  { label:"Therapy Exceeds Limit",  category:"Coverage Limit", color:"#dc2626", icon:"🚫", description:"Therapy visit limit exceeded" },
  "CO-33":  { label:"Limit Exceeded",         category:"Coverage Limit", color:"#dc2626", icon:"🚫", description:"Quantity exceeds plan limit" },
  "CO-35":  { label:"Lifetime Max",           category:"Coverage Limit", color:"#dc2626", icon:"🚫", description:"Lifetime benefit maximum reached" },
  "CO-61":  { label:"Referral Penalty",       category:"Coverage Limit", color:"#dc2626", icon:"🚫", description:"Penalty for failure to obtain referral" },
  "CO-69":  { label:"Day Outlier",            category:"Coverage Limit", color:"#dc2626", icon:"🚫", description:"Day outlier amount exceeded" },
  "CO-119": { label:"Benefit Max Reached",    category:"Coverage Limit", color:"#dc2626", icon:"🚫", description:"Benefit maximum for period reached" },
  "CO-222": { label:"Exceeds Units",          category:"Coverage Limit", color:"#dc2626", icon:"🚫", description:"Exceeds plan allowable units/visits" },
  "CO-223": { label:"Quantity Not Covered",   category:"Coverage Limit", color:"#dc2626", icon:"🚫", description:"Quantity received not covered" },
  // ── CONTRACT ──────────────────────────────────────────────────────────────
  "CO-24":  { label:"HMO Capitated",          category:"Contract", color:"#7c3aed", icon:"📑", description:"Payment for capitated service" },
  "CO-44":  { label:"Prompt Pay Discount",    category:"Contract", color:"#7c3aed", icon:"📑", description:"Prompt-pay discount applied" },
  "CO-45":  { label:"Charge Exceeds Allowed", category:"Contract", color:"#7c3aed", icon:"📑", description:"Charge exceeds contracted amount" },
  "CO-139": { label:"Contracted Adjustment",  category:"Contract", color:"#7c3aed", icon:"📑", description:"Contracted provider adjustment" },
  "CO-150": { label:"Payer Specified",        category:"Contract", color:"#7c3aed", icon:"📑", description:"Payer-specified adjustment" },
  "CO-151": { label:"Payment Exceeds Limit",  category:"Contract", color:"#7c3aed", icon:"📑", description:"Payment exceeds limitation" },
  "CO-183": { label:"Out of Network",         category:"Contract", color:"#7c3aed", icon:"📑", description:"No network provider — service denied" },
  "CO-185": { label:"Clinical Trial",         category:"Contract", color:"#7c3aed", icon:"📑", description:"Qualifying clinical trials adjustment" },
  "CO-194": { label:"Anesthesia Reduced",     category:"Contract", color:"#7c3aed", icon:"📑", description:"Anesthesia payment reduced" },
  "CO-237": { label:"Legislated Rate",        category:"Contract", color:"#7c3aed", icon:"📑", description:"Legislated/regulatory penalty" },
  "CO-249": { label:"Payer Responsibility",   category:"Contract", color:"#7c3aed", icon:"📑", description:"Payer responsibility amount" },
  "CO-253": { label:"Sequestration",          category:"Contract", color:"#7c3aed", icon:"📑", description:"Sequestration reduction applied" },
  "CO-254": { label:"Penalty",                category:"Contract", color:"#7c3aed", icon:"📑", description:"Penalty or interest applied" },
  // ── RARC / REMARK CODES ──────────────────────────────────────────────────
  // PHILOSOPHY: This dictionary contains ONLY entries verified against the X12 master list
  // at https://x12.org/codes/remittance-advice-remark-codes. Unverified or rare codes are
  // intentionally omitted — when the user enters a RARC not present here, the API receives
  // `rarcDescription: null` which triggers `rarcUnverified` in analyze.js, forcing Google
  // Search grounding to fetch the authoritative definition. A small verified core + grounded
  // fallback produces fewer hallucinations than a large dictionary with wrong entries.
  // Last X12 verification: per master list dated 3/4/2026
  //
  // ── M-series (Missing/Invalid Info, verified from X12 master) ────────────
  "M15":   { label:"Bundled Services",        category:"NCCI Bundling", color:"#f59e0b", icon:"🔗", description:"Separately billed services/tests have been bundled as they are considered components of the same procedure. Separate payment is not allowed." },
  "M20":   { label:"Missing HCPCS",           category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/incomplete/invalid HCPCS." },
  "M29":   { label:"Missing Op Note",         category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing operative note/report." },
  "M30":   { label:"Missing Path Report",     category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing pathology report." },
  "M31":   { label:"Missing Radiology Report",category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing radiology report." },
  "M44":   { label:"Missing Condition Code",  category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/incomplete/invalid condition code." },
  "M50":   { label:"Missing Revenue Code",    category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/incomplete/invalid revenue code(s)." },
  "M51":   { label:"Missing Procedure Code",  category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/incomplete/invalid procedure code(s)." },
  "M52":   { label:"Missing From DOS",        category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/incomplete/invalid 'from' date(s) of service." },
  "M53":   { label:"Missing Days/Units",      category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/incomplete/invalid days or units of service." },
  "M54":   { label:"Missing Total Charges",   category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/incomplete/invalid total charges." },
  "M56":   { label:"Missing Payer ID",        category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing/incomplete/invalid payer identifier." },
  "M59":   { label:"Missing To DOS",          category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/incomplete/invalid 'to' date(s) of service." },
  "M60":   { label:"Missing CMN",             category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing Certificate of Medical Necessity." },
  "M62":   { label:"Missing Auth Code",       category:"Auth/Referral", color:"#ec4899", icon:"🔐", description:"Missing/incomplete/invalid treatment authorization code." },
  "M64":   { label:"Missing Other Dx",        category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/incomplete/invalid other diagnosis." },
  "M67":   { label:"Missing Other Proc Code", category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/incomplete/invalid other procedure code(s)." },
  "M76":   { label:"Missing Diagnosis",       category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/incomplete/invalid diagnosis or condition." },
  "M77":   { label:"Missing/Invalid POS",     category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/incomplete/invalid/inappropriate place of service." },
  "M79":   { label:"Missing Charge",          category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/incomplete/invalid charge." },
  "M80":   { label:"Same-Session Bundled",    category:"NCCI Bundling", color:"#f59e0b", icon:"🔗", description:"Not covered when performed during the same session/date as a previously processed service for the patient." },
  "M81":   { label:"Code to Highest Specificity",category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"You are required to code to the highest level of specificity." },
  "M86":   { label:"Duplicate Procedure",     category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Service denied because payment already made for same/similar procedure within set time frame." },
  "M99":   { label:"Missing UPN",             category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/incomplete/invalid Universal Product Number/Serial Number." },
  "M115":  { label:"Non-Contract Supplier",   category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"This item is denied when provided to this patient by a non-contract or non-demonstration supplier." },
  "M119":  { label:"Missing NDC",             category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/incomplete/invalid/deactivated/withdrawn National Drug Code (NDC)." },
  "M122":  { label:"Missing Subluxation Level",category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing/incomplete/invalid level of subluxation." },
  "M123":  { label:"Missing Drug Info",       category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/incomplete/invalid name, strength, or dosage of the drug furnished." },
  "M124":  { label:"Missing DME Ownership",   category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing indication of whether the patient owns the equipment that requires the part or supply." },
  "M125":  { label:"Missing Duration of Need",category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing/incomplete/invalid information on the period of time for which the service/supply/equipment will be needed." },
  "M127":  { label:"Missing Medical Record",  category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing patient medical record for this service." },
  "M129":  { label:"Missing X-ray Indicator", category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing/incomplete/invalid indicator of x-ray availability for review." },
  "M131":  { label:"Missing Stark Form",      category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing physician financial relationship form." },
  "M133":  { label:"Purchased Test Info Missing",category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Claim did not identify who performed the purchased diagnostic test or the amount you were charged for the test." },
  "M135":  { label:"Missing Plan of Treatment",category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing/incomplete/invalid plan of treatment." },
  // ── MA-series (Medicare Administrative, verified) ────────────────────────
  "MA01":  { label:"Appeal Rights",           category:"Info/Alert", color:"#64748b", icon:"ℹ️", description:"Alert: If you do not agree with what we approved for these services, you may appeal our decision." },
  "MA18":  { label:"Forwarded to Supplemental",category:"Info/Alert", color:"#64748b", icon:"ℹ️", description:"Alert: The claim information is also being forwarded to the patient's supplemental insurer." },
  "MA63":  { label:"Missing Principal Dx",    category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/incomplete/invalid principal diagnosis." },
  // ── N-series (verified against X12 / CMS source documents) ───────────────
  "N115":  { label:"Based on LCD",            category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"This decision is based on a Local Medical Review Policy (LMRP) or Local Coverage Determination (LCD)." },
  "N657":  { label:"Inconsistent w/ Modifier",category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"This should be billed with the appropriate code for these services." },
  "N822":  { label:"Missing Procedure Modifier",category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing procedure modifier(s)." },
  "N823":  { label:"Invalid Procedure Modifier",category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Incomplete/Invalid procedure modifier(s)." },
};

const RARC_CODES = {
  // ANTI-HALLUCINATION DICTIONARY — VERIFIED AGAINST X12 MASTER LIST ONLY
  // ─────────────────────────────────────────────────────────────────────────
  // Every entry below has been verified against the official X12 source at
  // https://x12.org/codes/remittance-advice-remark-codes or directly-cited
  // CMS transmittal documents. Entries with unverifiable or contested meanings
  // were intentionally removed — when a removed RARC is queried, the analyze.js
  // backend detects `rarcDescription: null`, sets `rarcUnverified = true`, and
  // forces Google Search grounding to retrieve the live authoritative meaning.
  // This produces fewer hallucinations than carrying wrong entries.
  // Last X12 verification: per master list dated 3/4/2026.
  //
  // ── M-series (Missing/Invalid Info — verbatim X12 text) ──────────────────
  "M15":  { description: "Separately billed services/tests have been bundled as they are considered components of the same procedure. Separate payment is not allowed." },
  "M20":  { description: "Missing/incomplete/invalid HCPCS." },
  "M29":  { description: "Missing operative note/report." },
  "M30":  { description: "Missing pathology report." },
  "M31":  { description: "Missing radiology report." },
  "M44":  { description: "Missing/incomplete/invalid condition code." },
  "M50":  { description: "Missing/incomplete/invalid revenue code(s)." },
  "M51":  { description: "Missing/incomplete/invalid procedure code(s)." },
  "M52":  { description: "Missing/incomplete/invalid 'from' date(s) of service." },
  "M53":  { description: "Missing/incomplete/invalid days or units of service." },
  "M54":  { description: "Missing/incomplete/invalid total charges." },
  "M56":  { description: "Missing/incomplete/invalid payer identifier." },
  "M59":  { description: "Missing/incomplete/invalid 'to' date(s) of service." },
  "M60":  { description: "Missing Certificate of Medical Necessity." },
  "M62":  { description: "Missing/incomplete/invalid treatment authorization code." },
  "M64":  { description: "Missing/incomplete/invalid other diagnosis." },
  "M67":  { description: "Missing/incomplete/invalid other procedure code(s)." },
  "M76":  { description: "Missing/incomplete/invalid diagnosis or condition." },
  "M77":  { description: "Missing/incomplete/invalid/inappropriate place of service." },
  "M79":  { description: "Missing/incomplete/invalid charge." },
  "M80":  { description: "Not covered when performed during the same session/date as a previously processed service for the patient." },
  "M81":  { description: "You are required to code to the highest level of specificity." },
  "M86":  { description: "Service denied because payment already made for same/similar procedure within set time frame." },
  "M99":  { description: "Missing/incomplete/invalid Universal Product Number/Serial Number." },
  "M115": { description: "This item is denied when provided to this patient by a non-contract or non-demonstration supplier." },
  "M119": { description: "Missing/incomplete/invalid/deactivated/withdrawn National Drug Code (NDC)." },
  "M122": { description: "Missing/incomplete/invalid level of subluxation." },
  "M123": { description: "Missing/incomplete/invalid name, strength, or dosage of the drug furnished." },
  "M124": { description: "Missing indication of whether the patient owns the equipment that requires the part or supply." },
  "M125": { description: "Missing/incomplete/invalid information on the period of time for which the service/supply/equipment will be needed." },
  "M127": { description: "Missing patient medical record for this service." },
  "M129": { description: "Missing/incomplete/invalid indicator of x-ray availability for review." },
  "M131": { description: "Missing physician financial relationship form." },
  "M133": { description: "Claim did not identify who performed the purchased diagnostic test or the amount you were charged for the test." },
  "M135": { description: "Missing/incomplete/invalid plan of treatment." },
  // ── MA-series (Medicare Administrative) ──────────────────────────────────
  "MA01": { description: "Alert: If you do not agree with what we approved for these services, you may appeal our decision." },
  "MA18": { description: "Alert: The claim information is also being forwarded to the patient's supplemental insurer." },
  "MA63": { description: "Missing/incomplete/invalid principal diagnosis." },
  // ── N-series (verified) ──────────────────────────────────────────────────
  "N115": { description: "This decision is based on a Local Medical Review Policy (LMRP) or Local Coverage Determination (LCD)." },
  "N657": { description: "This should be billed with the appropriate code for these services." },
  "N822": { description: "Missing procedure modifier(s)." },
  "N823": { description: "Incomplete/Invalid procedure modifier(s)." },
};

const PLACE_OF_SERVICE = {
  "11": "11 — Office",
  "12": "12 — Home",
  "21": "21 — Inpatient Hospital",
  "22": "22 — On-Campus Outpatient Hospital",
  "23": "23 — Emergency Room — Hospital",
  "24": "24 — Ambulatory Surgical Center (ASC)",
  "25": "25 — Birthing Center",
  "31": "31 — Skilled Nursing Facility (SNF)",
  "32": "32 — Nursing Facility",
  "33": "33 — Custodial Care Facility",
  "34": "34 — Hospice",
  "49": "49 — Independent Clinic",
  "50": "50 — Federally Qualified Health Center (FQHC)",
  "51": "51 — Inpatient Psychiatric Facility",
  "52": "52 — Psychiatric Partial Hospitalization",
  "53": "53 — Community Mental Health Center",
  "54": "54 — Intermediate Care Facility",
  "55": "55 — Residential Substance Abuse Treatment",
  "56": "56 — Psychiatric Residential Treatment Center",
  "57": "57 — Non-residential Substance Abuse Treatment",
  "61": "61 — Inpatient Rehabilitation Facility (IRF)",
  "62": "62 — Outpatient Rehabilitation Facility",
  "65": "65 — End-Stage Renal Disease Treatment Facility",
  "71": "71 — State/Local Public Health Clinic",
  "72": "72 — Rural Health Clinic",
  "81": "81 — Independent Laboratory",
  "99": "99 — Other",
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
      {items.map((item, i) => {
        const mentionsNcci = /ncci/i.test(item);
        const mentionsLcd  = /\b(lcd|ncd|local coverage|national coverage|coverage determination)\b/i.test(item);
        const cptMatches   = [...new Set(item.match(/\b\d{5}\b/g) || [])];

        const ncciQuery = cptMatches.length >= 2
          ? `NCCI edit ${cptMatches[0]} ${cptMatches[1]}`
          : cptMatches.length === 1
          ? `NCCI edit ${cptMatches[0]}`
          : null;
        const ncciHref = ncciQuery
          ? `https://www.google.com/search?q=${encodeURIComponent(ncciQuery)}`
          : "https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-tools";
        const ncciLabel = cptMatches.length >= 2
          ? `🔗 Look up NCCI edit: ${cptMatches[0]} vs ${cptMatches[1]} ↗`
          : cptMatches.length === 1
          ? `🔗 Look up NCCI edits for ${cptMatches[0]} ↗`
          : "🔗 Verify in CMS NCCI Edit Tables ↗";

        const lcdHref = cptMatches.length >= 1
          ? `https://www.cms.gov/medicare-coverage-database/search.aspx?keyword=${cptMatches[0]}&keywordType=code&contractStatus=active&DocType=1&s=50&b=10&page=1`
          : "https://www.cms.gov/medicare-coverage-database/search.aspx?contractStatus=active";
        const lcdLabel = cptMatches.length >= 1
          ? `🏥 Look up LCD/NCD for CPT ${cptMatches[0]} ↗`
          : "🏥 Search CMS LCD/NCD Database ↗";

        return (
          <div key={i} style={{ marginBottom:8 }}>
            <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
              <span style={{ color, fontWeight:800, fontSize:13, flexShrink:0 }}>›</span>
              <span style={{ fontSize:13, color:"#c8d8ea", lineHeight:1.65 }}>{item}</span>
            </div>
            {(mentionsNcci || mentionsLcd) && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:5, marginLeft:21 }}>
                {mentionsNcci && (
                  <a href={ncciHref} target="_blank" rel="noopener noreferrer"
                    style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:5, background:"rgba(249,115,22,0.1)", border:"1px solid rgba(249,115,22,0.3)", textDecoration:"none", fontSize:11, fontWeight:700, color:"#f97316" }}>
                    {ncciLabel}
                  </a>
                )}
                {mentionsLcd && (
                  <a href={lcdHref} target="_blank" rel="noopener noreferrer"
                    style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:5, background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.3)", textDecoration:"none", fontSize:11, fontWeight:700, color:"#f87171" }}>
                    {lcdLabel}
                  </a>
                )}
              </div>
            )}
          </div>
        );
      })}
      {note && <p style={{ margin:"8px 0 0", fontSize:11, color:"#475569", fontStyle:"italic", borderTop:`1px solid ${color}25`, paddingTop:7 }}>{note}</p>}
    </div>
  );
}

export default function DenialAnalyzer() {
  const [denialCode, setDenialCode]       = useState("");
  const [denialSearch, setDenialSearch]   = useState("");
  const [billedLines, setBilledLines]     = useState([]);
  const [deniedLines, setDeniedLines]     = useState([]);
  const [inputVal, setInputVal]           = useState("");
  const [mode, setMode]                   = useState("billed");
  const [additionalContext, setAdditionalContext] = useState("");
  const [rarcCode, setRarcCode]           = useState("");
  const [icd10Codes, setIcd10Codes]       = useState("");
  const [payerName, setPayerName]         = useState("");
  const [placeOfService, setPlaceOfService] = useState("");
  const [result, setResult]               = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [showDropdown, setShowDropdown]   = useState(false);
  // ── NEW: loading stage for cycling messages ────────────────────────────────
  const [loadingStage, setLoadingStage]   = useState(0);

  const inputRef  = useRef(null);
  const resultRef = useRef(null);

  // ── Cycle loading stage every 3.5s while loading ──────────────────────────
  useEffect(() => {
    if (!loading) { setLoadingStage(0); return; }
    const t = setInterval(() => setLoadingStage(s => (s + 1) % 3), 3500);
    return () => clearInterval(t);
  }, [loading]);

  const selectedCode   = DENIAL_CODES[denialCode.toUpperCase()] || null;
  const filteredCodes  = denialSearch.length >= 1
    ? Object.entries(DENIAL_CODES).filter(([k, v]) =>
        k.toLowerCase().includes(denialSearch.toLowerCase()) ||
        v.label.toLowerCase().includes(denialSearch.toLowerCase()) ||
        v.description.toLowerCase().includes(denialSearch.toLowerCase()) ||
        v.category.toLowerCase().includes(denialSearch.toLowerCase())
      ).slice(0, 12)
    : [];

  // Allow any denial code that isn't in the dictionary to be used as a custom code (AI-analyzed).
  const typedCode = denialSearch.trim().toUpperCase();
  const looksLikeCustomCode =
    !DENIAL_CODES[typedCode] &&
    typedCode.length >= 2 &&
    /^([A-Z]{2}-)?[A-Z]?\d{1,3}[A-Z]?$/.test(typedCode);

  function parseEntry(raw) {
    const parts   = raw.trim().toUpperCase().split(/\s+/);
    const cptMod  = parts[0].split("-");
    const cpt     = cptMod[0];
    const rawMods = cptMod.slice(1).filter(Boolean);
    const dx      = parts[1] || "";
    if (!/^\d{4,5}[A-Z0-9]?$/.test(cpt) && !/^[A-Z]\d{2}/.test(cpt)) return null;
    // Every CPT/HCPCS modifier is exactly 2 characters (e.g. 59, 26, PT, XU, GA). Flag anything else.
    const modifiers = rawMods.filter(m => /^[A-Z0-9]{2}$/.test(m));
    const badMods   = rawMods.filter(m => !/^[A-Z0-9]{2}$/.test(m));
    const modifier  = modifiers.join("-");
    return { cpt, modifier, modifiers, dx, badMods, id: Date.now() + Math.random() };
  }

  function handleAdd() {
    setError("");
    if (!inputVal.trim()) return;
    const parsed = parseEntry(inputVal);
    if (!parsed) {
      setError("Format: CPT  or  CPT-MODIFIER  or  CPT-MODIFIER ICD10  (e.g. 99213  or  27447-59  or  27447-59 M54.5)");
      return;
    }
    if (parsed.badMods?.length) {
      setError(`Each modifier must be exactly 2 characters. Not recognized: ${parsed.badMods.join(", ")}. Use hyphens for multiples, e.g. 45385-59-PT-33`);
      return;
    }
    if (mode === "billed") setBilledLines(l => [...l, parsed]);
    else setDeniedLines(l => [...l, parsed]);
    setInputVal("");
    inputRef.current?.focus();
  }

  async function runAnalysis() {
    setError("");
    if (!denialCode)          { setError("Please select a denial code first."); return; }
    if (deniedLines.length === 0) { setError("Please add at least one denied CPT code."); return; }
    setLoading(true);
    setResult(null);

    const codeInfo   = DENIAL_CODES[denialCode.toUpperCase()];
    const billedStr  = billedLines.length > 0
      ? billedLines.map(l => `${l.cpt}${l.modifier ? "-" + l.modifier : ""}${l.dx ? " [" + l.dx + "]" : ""}`).join(", ")
      : "Not provided";
    const deniedStr  = deniedLines.map(l => `${l.cpt}${l.modifier ? "-" + l.modifier : ""}${l.dx ? " [" + l.dx + "]" : ""}`).join(", ");

    // Structured modifier summary so the AI reliably sees every modifier on every line.
    const modLine = (label, lines) => lines
      .filter(l => l.modifiers?.length)
      .map(l => `${label} ${l.cpt}: ${l.modifiers.join(", ")}`);
    const modifierDetail = [...modLine("Denied", deniedLines), ...modLine("Billed", billedLines)].join(" | ") || null;

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          denialCode,
          denialCategory:   codeInfo?.category,
          denialDescription: codeInfo?.description,
          billedStr,
          deniedStr,
          additionalContext,
          rarcCode:        rarcCode.trim().toUpperCase() || null,
          rarcDescription: rarcCode.trim() ? (RARC_CODES[rarcCode.trim().toUpperCase()]?.description || null) : null,
          icd10Codes:      icd10Codes.trim() || null,
          payerName:       payerName.trim() || null,
          placeOfService:  placeOfService || null,
          modifierDetail,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");
      setResult({ ai: data, codeInfo, denialCode, rarcCode: rarcCode.trim().toUpperCase() || null });
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    }

    setLoading(false);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  }

  function reset() {
    setDenialCode(""); setDenialSearch(""); setBilledLines([]); setDeniedLines([]);
    setInputVal(""); setResult(null); setError(""); setAdditionalContext(""); setMode("billed");
    setRarcCode(""); setIcd10Codes(""); setPayerName(""); setPlaceOfService("");
  }

  const ai          = result?.ai;
  const isFalse     = ai?.verdict === "FALSE" || ai?.verdict === "LIKELY_FALSE";
  const isTrue      = ai?.verdict === "TRUE"  || ai?.verdict === "LIKELY_TRUE";
  const isUncertain = ai?.verdict === "CANNOT_DETERMINE";
  const vc = ai?.verdict === "FALSE" ? "#22c55e" : ai?.verdict === "LIKELY_FALSE" ? "#86efac" : ai?.verdict === "TRUE" ? "#ef4444" : ai?.verdict === "LIKELY_TRUE" ? "#f59e0b" : "#94a3b8";
  const vl = ai?.verdict === "TRUE" ? "TRUE DENIAL" : ai?.verdict === "FALSE" ? "FALSE DENIAL" : ai?.verdict === "LIKELY_TRUE" ? "LIKELY TRUE DENIAL" : ai?.verdict === "LIKELY_FALSE" ? "LIKELY FALSE DENIAL" : "CANNOT DETERMINE";
  const vi = isFalse ? "✅" : isTrue ? "❌" : isUncertain ? "❓" : "⚠️";

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
              <span style={{ fontSize:11, color:ACCENT, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>AI-Powered · All CARC &amp; RARC Codes</span>
            </div>
            <h1 style={{ margin:"0 0 6px", fontSize:28, fontWeight:800, color:"#e8f4ff", letterSpacing:"-0.02em" }}>
              Medical Billing Denial <span style={{ color:ACCENT }}>Analyzer</span>
            </h1>
            <p style={{ margin:0, color:"#4a6a8a", fontSize:13, maxWidth:460, marginLeft:"auto", marginRight:"auto" }}>
              Select any denial code · Enter CPT codes · Get instant AI verdict with exact next steps
            </p>
          </div>

          <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"20px", marginBottom:12 }}>

            {/* ── STEP 1: DENIAL CODE ── */}
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
                  placeholder="Type code or keyword... e.g. CO-59, PR-1, OA-45, N95, auth, timely, duplicate"
                  style={{ width:"100%", padding:"10px 13px", borderRadius:8, border:`2px solid ${selectedCode ? selectedCode.color+"60" : BORDER}`, background:"#0a1525", color:"#d0e8ff", fontSize:13, fontFamily:"monospace", outline:"none", boxSizing:"border-box" }}
                />
                {showDropdown && (filteredCodes.length > 0 || looksLikeCustomCode) && (
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
                    {looksLikeCustomCode && (
                      <div
                        onClick={() => { setDenialCode(typedCode); setDenialSearch(typedCode); setShowDropdown(false); }}
                        style={{ padding:"9px 13px", cursor:"pointer", display:"flex", alignItems:"center", gap:9 }}
                        onMouseEnter={e => e.currentTarget.style.background = "#1a2d47"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <span style={{ fontSize:14, flexShrink:0 }}>✨</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                            <span style={{ fontFamily:"monospace", fontWeight:700, fontSize:12, color:ACCENT }}>{typedCode}</span>
                            <span style={{ fontSize:12, color:"#c8d8ea" }}>Use as custom code</span>
                          </div>
                          <div style={{ fontSize:11, color:"#3a5a7a" }}>Not in dictionary — the AI will define and analyze it</div>
                        </div>
                        <span style={{ fontSize:10, color:ACCENT, background:`${ACCENT}15`, borderRadius:4, padding:"2px 6px", fontWeight:700, flexShrink:0, whiteSpace:"nowrap" }}>Custom</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {!selectedCode && denialCode && (
                <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:9, padding:"8px 13px", borderRadius:8, background:`${ACCENT}10`, border:`1.5px solid ${ACCENT}40` }}>
                  <span style={{ fontSize:18 }}>✨</span>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                      <span style={{ fontFamily:"monospace", fontWeight:800, fontSize:13, color:ACCENT }}>{denialCode}</span>
                      <span style={{ fontSize:13, color:"#c8d8ea", fontWeight:600 }}>Custom code</span>
                      <span style={{ fontSize:10, color:ACCENT, background:`${ACCENT}20`, borderRadius:4, padding:"2px 7px", fontWeight:700 }}>AI-defined</span>
                    </div>
                    <div style={{ fontSize:11, color:"#4a6a8a", marginTop:2 }}>Not in the local dictionary — its official meaning will be resolved by AI in the analysis</div>
                  </div>
                  <button onClick={() => { setDenialCode(""); setDenialSearch(""); }} style={{ background:"none", border:"none", color:"#3a5a7a", cursor:"pointer", fontSize:16 }}>×</button>
                </div>
              )}
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

            {/* ── STEP 2: CPT CODES ── */}
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

            {/* ── STEP 3: PAYER NAME ── */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#3a5a7a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6, display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ background:"#1a2d47", color:"#3a5a7a", borderRadius:"50%", width:17, height:17, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800 }}>3</span>
                Payer Name
                <span style={{ fontWeight:400, color:"#2a4a6a", textTransform:"none", fontSize:11 }}>(recommended — required for auth &amp; coverage denial grounding)</span>
              </div>
              <input
                value={payerName}
                onChange={e => setPayerName(e.target.value)}
                placeholder="e.g. Aetna, UnitedHealthcare, BCBS, Cigna, Humana, Medicare..."
                style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`2px solid ${BORDER}`, background:"#0a1525", color:"#8a9baa", fontSize:13, outline:"none", boxSizing:"border-box" }}
              />
            </div>

            {/* ── STEP 4: RARC CODE ── */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#3a5a7a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6, display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ background:"#1a2d47", color:"#3a5a7a", borderRadius:"50%", width:17, height:17, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800 }}>4</span>
                RARC / Remark Code
                <span style={{ fontWeight:400, color:"#2a4a6a", textTransform:"none", fontSize:11 }}>(optional — e.g. M76, N115)</span>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                <input
                  value={rarcCode}
                  onChange={e => setRarcCode(e.target.value)}
                  placeholder="e.g. M76"
                  style={{ width:110, padding:"9px 12px", borderRadius:8, border:`2px solid ${BORDER}`, background:"#0a1525", color:"#8a9baa", fontSize:13, outline:"none", boxSizing:"border-box", textTransform:"uppercase" }}
                />
                {rarcCode && RARC_CODES[rarcCode.trim().toUpperCase()] && (
                  <div style={{ flex:1, padding:"8px 12px", borderRadius:8, background:"rgba(139,92,246,0.08)", border:"1.5px solid rgba(139,92,246,0.25)", fontSize:12, color:"#c4b5fd", lineHeight:1.5 }}>
                    <span style={{ fontWeight:700, color:"#a78bfa" }}>{rarcCode.trim().toUpperCase()}: </span>
                    {RARC_CODES[rarcCode.trim().toUpperCase()].description}
                  </div>
                )}
                {rarcCode && !RARC_CODES[rarcCode.trim().toUpperCase()] && (
                  <div style={{ flex:1, padding:"8px 12px", borderRadius:8, background:"rgba(100,116,139,0.08)", border:"1.5px solid rgba(100,116,139,0.2)", fontSize:12, color:"#64748b", lineHeight:1.5 }}>
                    Code not in local dictionary — its official meaning will be resolved by AI in the analysis
                  </div>
                )}
              </div>
            </div>

            {/* ── STEP 5: ICD-10 DIAGNOSIS CODES ── */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#3a5a7a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6, display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ background:"#1a2d47", color:"#3a5a7a", borderRadius:"50%", width:17, height:17, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800 }}>5</span>
                ICD-10 Diagnosis Code(s)
                <span style={{ fontWeight:400, color:"#2a4a6a", textTransform:"none", fontSize:11 }}>(recommended for medical necessity &amp; coverage denials)</span>
              </div>
              <input
                value={icd10Codes}
                onChange={e => setIcd10Codes(e.target.value)}
                placeholder="e.g. K57.30, Z12.11, K92.1"
                style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`2px solid ${BORDER}`, background:"#0a1525", color:"#8a9baa", fontSize:13, outline:"none", boxSizing:"border-box", textTransform:"uppercase" }}
              />
            </div>

            {/* ── STEP 6: PLACE OF SERVICE ── */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#3a5a7a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6, display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ background:"#1a2d47", color:"#3a5a7a", borderRadius:"50%", width:17, height:17, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800 }}>6</span>
                Place of Service
                <span style={{ fontWeight:400, color:"#2a4a6a", textTransform:"none", fontSize:11 }}>(recommended — improves auth &amp; medical necessity verdicts)</span>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <select
                  value={placeOfService}
                  onChange={e => setPlaceOfService(e.target.value)}
                  style={{ flex:1, padding:"9px 12px", borderRadius:8, border:`2px solid ${placeOfService ? "#38bdf8" : BORDER}`, background:"#0a1525", color: placeOfService ? "#e2e8f0" : "#3a5a7a", fontSize:13, outline:"none", boxSizing:"border-box", cursor:"pointer", appearance:"none", WebkitAppearance:"none" }}
                >
                  <option value="">Select POS code...</option>
                  {Object.entries(PLACE_OF_SERVICE).map(([code, label]) => (
                    <option key={code} value={code}>{label}</option>
                  ))}
                </select>
                {placeOfService && (
                  <span
                    onClick={() => setPlaceOfService("")}
                    style={{ flexShrink:0, fontSize:11, fontWeight:700, color:"#3a5a7a", cursor:"pointer", padding:"4px 8px", borderRadius:6, border:`1px solid ${BORDER}`, background:"#0a1525" }}
                  >✕ Clear</span>
                )}
              </div>
              {placeOfService && (
                <div style={{ marginTop:6, padding:"7px 11px", borderRadius:7, background:"rgba(56,189,248,0.07)", border:"1.5px solid rgba(56,189,248,0.2)", fontSize:12, color:"#38bdf8", fontWeight:600 }}>
                  📍 POS {placeOfService} — {PLACE_OF_SERVICE[placeOfService]}
                </div>
              )}
            </div>

            {/* ── STEP 7: ADDITIONAL CONTEXT ── */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#3a5a7a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6, display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ background:"#1a2d47", color:"#3a5a7a", borderRadius:"50%", width:17, height:17, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800 }}>7</span>
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

          {/* ── LOADING STATE — context-aware with stage cycling ── */}
          {loading && (() => {
            const dc      = denialCode.toUpperCase();
            const isCov   = ["CO-96","CO-5","CO-182","CO-204","CO-233","CO-250"].includes(dc) && !!payerName && !!icd10Codes;
            const isMN    = ["CO-50","CO-20","CO-51","CO-76","CO-186","CO-228","CO-243","CO-244","CO-256"].includes(dc) && !!icd10Codes;
            const isNC    = ["CO-97","CO-59","CO-78","CO-231","CO-B15"].includes(dc);
            const isAU    = ["CO-15","CO-17","CO-197","CO-198","CO-245","CO-246"].includes(dc) && !!payerName;
            const isCM    = ["CO-4"].includes(dc) || ["N56","N519","M78","M51","N657","M50","N822","N823"].includes((rarcCode||"").trim().toUpperCase());
            const isGrounded = isCov || isMN || isNC || isAU || isCM;
            const deniedCpts = deniedLines.map(l => l.cpt).join(", ");

            const configs = {
              cov: {
                icon: "📋",
                stages: [
                  `Searching ${payerName} clinical policy for CPT ${deniedCpts}…`,
                  `Checking covered indications & CPB criteria…`,
                  `Assessing dispute strength & appeal options…`,
                ],
                sub: "Coverage policy · CPB criteria · Appeal assessment",
              },
              mn: {
                icon: "🏥",
                stages: [
                  `Looking up active LCD/NCD for CPT ${deniedCpts}…`,
                  `Matching ICD-10 ${icd10Codes} to coverage criteria…`,
                  `Assessing medical necessity & documentation gaps…`,
                ],
                sub: "CMS coverage database · LCD/NCD · Necessity criteria",
              },
              ncci: {
                icon: "🔗",
                stages: [
                  `Verifying NCCI edit tables for CPT pair…`,
                  `Checking Column 1 / Column 2 relationship…`,
                  `Reviewing modifier exceptions & appeal options…`,
                ],
                sub: "NCCI PTP edits · Column logic · Modifier check",
              },
              auth: {
                icon: "🔐",
                stages: [
                  `Searching ${payerName} authorization requirements…`,
                  `Checking POS-specific auth rules for CPT ${deniedCpts}…`,
                  `Evaluating retroactive auth & dispute options…`,
                ],
                sub: "Payer auth policy · POS rules · Dispute options",
              },
              cm: {
                icon: "🏷️",
                stages: [
                  `Isolating the modifier on CPT ${deniedCpts}…`,
                  `Checking NCCI modifier indicator & MPFS flags…`,
                  `Assessing fix-and-resubmit vs appeal…`,
                ],
                sub: "Modifier validity · NCCI/MPFS indicators · Resubmit vs appeal",
              },
              default: {
                icon: "🔬",
                stages: [
                  `Reviewing ${denialCode} rules & claim details…`,
                  `Evaluating CPT codes & denial criteria…`,
                  `Assessing corrective actions & appeal options…`,
                ],
                sub: "Denial rules · CPT evaluation · Appeal options",
              },
            };

            const cfg = isCov ? configs.cov : isMN ? configs.mn : isNC ? configs.ncci : isAU ? configs.auth : isCM ? configs.cm : configs.default;

            return (
              <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"28px 20px", textAlign:"center" }}>
                <div style={{ fontSize:28, marginBottom:10 }}>{cfg.icon}</div>
                <div style={{ fontSize:14, color:"#7a9bbf", fontWeight:600, marginBottom:5, minHeight:22 }}>
                  {cfg.stages[loadingStage]}
                </div>
                <div style={{ fontSize:12, color:"#2a4a6a", marginBottom: isGrounded ? 10 : 0 }}>
                  {cfg.sub}
                </div>
                {isGrounded && (
                  <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:11, fontWeight:700, color:ACCENT, background:"rgba(56,189,248,0.07)", border:`1px solid rgba(56,189,248,0.2)`, borderRadius:6, padding:"4px 11px" }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:ACCENT, display:"inline-block", animation:"pulse2 1.2s infinite" }}/>
                    Live web search active — may take 10–15 seconds
                  </div>
                )}
                <div style={{ display:"flex", justifyContent:"center", gap:7, marginTop:14 }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:ACCENT, animation:`pulse2 1.2s ${d}s infinite` }}/>
                  ))}
                </div>
              </div>
            );
          })()}

          {result && !loading && ai && (
            <div ref={resultRef}>
              <div style={{ background:CARD, border:`1.5px solid ${vc}35`, borderRadius:16, padding:"18px 20px", marginBottom:11, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${vc},transparent)` }}/>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <span style={{ fontSize:36 }}>{vi}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#3a5a7a", textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:3 }}>
                      Denial Analysis — {result.denialCode}{result.rarcCode ? ` + ${result.rarcCode}` : ""}
                    </div>
                    <div style={{ fontSize:22, fontWeight:800, color:vc, marginBottom:3 }}>{vl}</div>
                    {ai.verdictSummary && <p style={{ margin:0, fontSize:13, color:"#7a9bbf", lineHeight:1.6 }}>{ai.verdictSummary}</p>}
                    <div style={{ marginTop:8 }}>
                      {(ai.coverageCheck?.matches || []).some(m => m.match_quality === "GROUP")
                        ? <span style={{ fontSize:10, fontWeight:700, color:"#34d399", background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.3)", borderRadius:4, padding:"2px 8px" }}>🏛️ CMS Coverage Data — Group-Confirmed</span>
                        : ai.wasGrounded
                          ? <span style={{ fontSize:10, fontWeight:700, color:"#34d399", background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.3)", borderRadius:4, padding:"2px 8px" }}>🌐 Web-Grounded — Live CMS/Payer Data</span>
                          : <span style={{ fontSize:10, fontWeight:700, color:"#64748b", background:"rgba(100,116,139,0.1)", border:"1px solid rgba(100,116,139,0.25)", borderRadius:4, padding:"2px 8px" }}>🧠 AI Knowledge Only — Verify with CMS</span>
                      }
                    </div>
                  </div>
                  <div style={{ textAlign:"center", flexShrink:0 }}>
                    <div style={{ fontSize:10, color:"#3a5a7a", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>Confidence</div>
                    <div style={{ position:"relative", width:64, height:64 }}>
                      <svg width="64" height="64" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="26" fill="none" stroke={BORDER} strokeWidth="6"/>
                        <circle cx="32" cy="32" r="26" fill="none" stroke={vc} strokeWidth="6"
                          strokeDasharray={`${2*Math.PI*26}`}
                          strokeDashoffset={`${2*Math.PI*26*(1-(ai.confidence ?? 0)/100)}`}
                          strokeLinecap="round" transform="rotate(-90 32 32)"/>
                      </svg>
                      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:vc, fontFamily:"monospace" }}>
                        {ai.confidence ?? 0}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"18px 20px" }}>
                {ai.denialRuleExplained && (
                  <div style={{ background:"rgba(56,189,248,0.06)", border:"1.5px solid rgba(56,189,248,0.2)", borderRadius:11, padding:"13px 15px", marginBottom:11 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:ACCENT, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>📖 What {result.denialCode} Means</div>
                    <p style={{ margin:0, fontSize:13, color:"#a0bcce", lineHeight:1.7 }}>{ai.denialRuleExplained}</p>
                  </div>
                )}

                {/* ── Custom denial-code definition (AI-resolved when the code isn't in the dictionary) ── */}
                {ai.denialCodeDefinition && !result.codeInfo && (
                  <div style={{ background:`${ACCENT}0d`, border:`1.5px solid ${ACCENT}40`, borderRadius:11, padding:"12px 15px", marginBottom:11 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <span style={{ fontSize:14 }}>✨</span>
                      <span style={{ fontSize:11, fontWeight:700, color:ACCENT, textTransform:"uppercase", letterSpacing:"0.08em" }}>{result.denialCode} — Code Meaning (custom)</span>
                    </div>
                    <p style={{ margin:0, fontSize:12, color:"#7a9bbf", lineHeight:1.7 }}>{ai.denialCodeDefinition}</p>
                  </div>
                )}

                {/* ── RARC definition (AI-resolved for any remark code, dictionary or not) ── */}
                {ai.rarcDefinition && result.rarcCode && (
                  <div style={{ background:"rgba(139,92,246,0.06)", border:"1.5px solid rgba(139,92,246,0.25)", borderRadius:11, padding:"12px 15px", marginBottom:11 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <span style={{ fontSize:14 }}>🏷️</span>
                      <span style={{ fontSize:11, fontWeight:700, color:"#a78bfa", textTransform:"uppercase", letterSpacing:"0.08em" }}>RARC {result.rarcCode} — Remark Code Meaning</span>
                    </div>
                    <p style={{ margin:0, fontSize:12, color:"#7a9bbf", lineHeight:1.7 }}>{ai.rarcDefinition}</p>
                  </div>
                )}

                {/* ── CMS Coverage Check (authoritative LCD/NCD medical-necessity result) ── */}
                {ai.coverageCheck && (ai.coverageCheck.matches?.length > 0 || ai.coverageCheck.isMedicareAdvantage) && (
                  <div style={{ background:"rgba(52,211,153,0.05)", border:"1.5px solid rgba(52,211,153,0.3)", borderRadius:11, padding:"12px 15px", marginBottom:11 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <span style={{ fontSize:14 }}>🏛️</span>
                      <span style={{ fontSize:11, fontWeight:700, color:"#34d399", textTransform:"uppercase", letterSpacing:"0.08em" }}>
                        CMS Coverage Check{ai.coverageCheck.state ? ` — ${ai.coverageCheck.state}` : ""}
                      </span>
                    </div>
                    {ai.coverageCheck.isMedicareAdvantage && (
                      <p style={{ margin:"0 0 8px", fontSize:11, color:"#f59e0b", lineHeight:1.6 }}>
                        ⚠️ Medicare Advantage plan — the LCD/NCD below is a strong reference, not a binding rule (MA plans may set their own policy).
                      </p>
                    )}
                    {(ai.coverageCheck.matches || []).map((m, i, arr) => {
                      const q = m.match_quality;
                      let st;
                      if (m.icd_status === "COVERED")         st = { c:"#34d399", label:"COVERED",         t:`ICD-10 ${ai.coverageCheck.icd10} supports medical necessity for CPT ${ai.coverageCheck.cpt}` };
                      else if (m.icd_status === "NONCOVERED") st = { c:"#f87171", label:"NON-COVERED",     t:`ICD-10 ${ai.coverageCheck.icd10} does NOT support medical necessity for CPT ${ai.coverageCheck.cpt}` };
                      else if (q === "DIFFERENT_GROUP")       st = { c:"#f59e0b", label:"DIFFERENT GROUP", t:`ICD-10 ${ai.coverageCheck.icd10} appears in this article but under a different procedure group — it does not establish coverage for CPT ${ai.coverageCheck.cpt}` };
                      else                                    st = { c:"#94a3b8", label:"NOT LINKED",      t:`ICD-10 ${ai.coverageCheck.icd10} is not linked to CPT ${ai.coverageCheck.cpt} in this policy` };
                      const qNote = q === "GROUP" ? "Confirmed in the same coverage group" : q === "DIFFERENT_GROUP" ? "Listed under a different procedure group" : "Co-listed only — group structure unavailable, verify";
                      return (
                        <div key={i} style={{ marginBottom:8, paddingBottom:8, borderBottom: i < arr.length-1 ? "1px solid rgba(148,163,184,0.12)" : "none" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap", marginBottom:3 }}>
                            <span style={{ fontSize:10, fontWeight:700, color:st.c, background:`${st.c}18`, border:`1px solid ${st.c}55`, borderRadius:4, padding:"2px 7px" }}>{st.label}</span>
                            {q === "GROUP" && <span style={{ fontSize:9, fontWeight:700, color:"#34d399", background:"rgba(52,211,153,0.12)", border:"1px solid rgba(52,211,153,0.4)", borderRadius:4, padding:"2px 6px" }}>GROUP-CONFIRMED</span>}
                            {m.url
                              ? <a href={m.url} target="_blank" rel="noreferrer" style={{ fontSize:12, color:"#7dd3fc", fontWeight:600, textDecoration:"none" }}>{m.doc_type} {m.display_id} ↗</a>
                              : <span style={{ fontSize:12, color:"#c8d8ea", fontWeight:600 }}>{m.doc_type} {m.display_id}</span>}
                          </div>
                          <p style={{ margin:0, fontSize:11.5, color:"#7a9bbf", lineHeight:1.6 }}>{m.title}</p>
                          <p style={{ margin:"4px 0 0", fontSize:11.5, color:st.c, lineHeight:1.6 }}>{st.t}</p>
                          <p style={{ margin:"3px 0 0", fontSize:10, color:"#5a7a9a", fontStyle:"italic" }}>{qNote}</p>
                        </div>
                      );
                    })}
                    <p style={{ margin:"2px 0 0", fontSize:10, color:"#5a7a9a", lineHeight:1.5 }}>Source: synced CMS Medicare Coverage Database (weekly snapshot) — verify against current CMS coverage.</p>
                  </div>
                )}

                {/* ── NCCI Edit Currency (which quarterly cycle the cited source reflects) ── */}
                {ai.ncciCurrency && (() => {
                  const c = ai.ncciCurrency;
                  const cfg = {
                    current:  { color:"#34d399", bg:"rgba(52,211,153,0.06)",  bd:"rgba(52,211,153,0.3)",  icon:"✓",  title:"Source reflects the current NCCI cycle",
                                text:`The NCCI source the AI cited is on the ${c.sourceLabel || c.currentLabel} cycle — current as of today (${c.currentLabel}, ${c.currentWindow}).` },
                    outdated: { color:"#f59e0b", bg:"rgba(245,158,11,0.06)", bd:"rgba(245,158,11,0.3)", icon:"⚠️", title:"Source may reference an older NCCI cycle",
                                text:`The cited source appears to reference ${c.sourceLabel}. The current cycle is ${c.currentLabel} (${c.currentWindow}). Re-verify this CPT pair against the current NCCI edit file before acting.` },
                    ahead:    { color:"#38bdf8", bg:"rgba(56,189,248,0.06)", bd:"rgba(56,189,248,0.3)", icon:"ℹ️", title:"Source references a later NCCI cycle",
                                text:`The cited source references ${c.sourceLabel}, ahead of the current ${c.currentLabel} cycle (${c.currentWindow}). Confirm the effective date applies to your date of service.` },
                    unknown:  { color:"#94a3b8", bg:"rgba(148,163,184,0.06)", bd:"rgba(148,163,184,0.25)", icon:"❔", title:"NCCI cycle not stated on the cited source",
                                text:`The cited source did not state which NCCI cycle it reflects. The current cycle is ${c.currentLabel} (${c.currentWindow}) — verify this CPT pair against the current NCCI edit file.` },
                  }[c.status];
                  if (!cfg) return null;
                  return (
                    <div style={{ background:cfg.bg, border:`1.5px solid ${cfg.bd}`, borderRadius:11, padding:"12px 15px", marginBottom:11 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                        <span style={{ fontSize:14 }}>{cfg.icon}</span>
                        <span style={{ fontSize:11, fontWeight:700, color:cfg.color, textTransform:"uppercase", letterSpacing:"0.08em" }}>NCCI Edit Currency — {cfg.title}</span>
                      </div>
                      <p style={{ margin:0, fontSize:12, color:"#7a9bbf", lineHeight:1.7 }}>{cfg.text}</p>
                      <div style={{ marginTop:8, display:"flex", gap:8, flexWrap:"wrap" }}>
                        <span style={{ fontSize:10, fontWeight:700, color:cfg.color, background:cfg.bg, border:`1px solid ${cfg.bd}`, borderRadius:4, padding:"2px 8px" }}>Current cycle: {c.currentLabel}</span>
                        {c.sourceLabel && <span style={{ fontSize:10, fontWeight:700, color:"#7a9bbf", background:"rgba(148,163,184,0.08)", border:"1px solid rgba(148,163,184,0.25)", borderRadius:4, padding:"2px 8px" }}>Source cycle: {c.sourceLabel}</span>}
                      </div>
                    </div>
                  );
                })()}

                {/* ── LCD / NCD Reference Card ── */}
                {ai.lcdNcdReference?.type && ai.lcdNcdReference.type !== "NONE" && (
                  <div style={{ background:"rgba(220,38,38,0.05)", border:"1.5px solid rgba(220,38,38,0.3)", borderRadius:11, padding:"14px 15px", marginBottom:11 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:9 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:"#f87171", textTransform:"uppercase", letterSpacing:"0.08em" }}>
                        🏥 Governing {ai.lcdNcdReference.type} Policy
                      </div>
                      {ai.lcdVerification?.status === "VERIFIED"
                        ? <span style={{ fontSize:10, fontWeight:700, color:"#34d399", background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.3)", borderRadius:4, padding:"2px 7px" }}>✓ Verified in CMS data</span>
                        : ai.lcdVerification?.status === "NOT_FOUND"
                          ? <span style={{ fontSize:10, fontWeight:700, color:"#f87171", background:"rgba(248,113,113,0.12)", border:"1px solid rgba(248,113,113,0.45)", borderRadius:4, padding:"2px 7px" }}>⚠️ Not found in CMS data — unverified</span>
                          : ai.wasGrounded
                            ? <span style={{ fontSize:10, fontWeight:700, color:"#34d399", background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.3)", borderRadius:4, padding:"2px 7px" }}>🌐 Found via Live Search</span>
                            : <span style={{ fontSize:10, fontWeight:700, color:"#f59e0b", background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:4, padding:"2px 7px" }}>⚠️ Verify Article Number</span>
                      }
                    </div>
                    {ai.lcdNcdReference.articleNumber && (
                      <div style={{ fontSize:15, fontWeight:800, color:"#e2e8f0", marginBottom:3, fontFamily:"monospace", letterSpacing:"0.04em" }}>
                        {ai.lcdNcdReference.articleNumber}
                      </div>
                    )}
                    {ai.lcdVerification?.status === "NOT_FOUND" && (
                      <p style={{ margin:"0 0 8px", fontSize:11.5, color:"#f87171", lineHeight:1.6, fontWeight:600 }}>
                        ⚠️ This article number was not found in the CMS coverage database — it may be inaccurate or fabricated by the AI. Do not cite it in an appeal without confirming it directly on CMS.
                      </p>
                    )}
                    {ai.lcdNcdReference.title && (
                      <div style={{ fontSize:13, fontWeight:600, color:"#a0bcce", marginBottom:8 }}>
                        {ai.lcdNcdReference.title}
                      </div>
                    )}
                    {ai.lcdNcdReference.summary && (
                      <p style={{ margin:"0 0 10px", fontSize:12, color:"#7a9bbf", lineHeight:1.7 }}>
                        {ai.lcdNcdReference.summary}
                      </p>
                    )}
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      {ai.lcdNcdReference.url ? (
                        <a href={ai.lcdNcdReference.url} target="_blank" rel="noopener noreferrer"
                          style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:12, fontWeight:700, color:"#f87171", textDecoration:"none", background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.35)", borderRadius:6, padding:"6px 11px" }}>
                          📋 View {ai.lcdNcdReference.articleNumber || ai.lcdNcdReference.type} on CMS →
                        </a>
                      ) : (
                        <a href="https://www.cms.gov/medicare-coverage-database/search.aspx?contractStatus=active" target="_blank" rel="noopener noreferrer"
                          style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:12, fontWeight:700, color:"#f87171", textDecoration:"none", background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.35)", borderRadius:6, padding:"6px 11px" }}>
                          🔍 Search CMS Coverage Database →
                        </a>
                      )}
                      <a href="https://www.cms.gov/medicare-coverage-database/search.aspx?contractStatus=active" target="_blank" rel="noopener noreferrer"
                        style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600, color:"#64748b", textDecoration:"none", background:"rgba(100,116,139,0.08)", border:"1px solid rgba(100,116,139,0.25)", borderRadius:6, padding:"6px 11px" }}>
                        🗂️ Browse Active LCDs/NCDs
                      </a>
                    </div>
                  </div>
                )}

                {isTrue  && <Section icon="❌" title="Why This Denial Is Valid"          color="#ef4444" items={ai.whyTrueDenial} />}
                {isFalse && <Section icon="✅" title="Why This Denial Is Incorrect"      color="#22c55e" items={ai.whyFalseDenial} />}
                {isFalse && ai.whyTrueDenial?.length>0  && <Section icon="⚠️" title="What Payer May Cite"        color="#f59e0b" items={ai.whyTrueDenial} />}
                {isTrue  && ai.whyFalseDenial?.length>0 && <Section icon="💡" title="Potentially Disputable"     color="#a78bfa" items={ai.whyFalseDenial} />}
                {isUncertain && ai.whyTrueDenial?.length>0  && <Section icon="⚖️" title="Factors Supporting the Denial"   color="#f59e0b" items={ai.whyTrueDenial} note="Cannot confirm without payer-specific contract terms or clinical documentation." />}
                {isUncertain && ai.whyFalseDenial?.length>0 && <Section icon="💡" title="Factors Supporting a Dispute"    color="#94a3b8" items={ai.whyFalseDenial} note="Review against your provider agreement and the actual remittance before acting." />}
                {isUncertain && (
                  <div style={{ background:"rgba(148,163,184,0.06)", border:"1.5px solid rgba(148,163,184,0.25)", borderRadius:11, padding:"13px 15px", marginBottom:11 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>❓ Why This Cannot Be Determined</div>
                    <p style={{ margin:0, fontSize:13, color:"#7a9bbf", lineHeight:1.7 }}>{ai.verdictSummary}</p>
                  </div>
                )}
                {ai.billingErrors?.length>0    && <Section icon="🔴" title="Billing Errors Identified"           color="#f87171" items={ai.billingErrors} note="These are the likely root cause of the denial." />}
                {(() => {
                  const raw = Array.isArray(ai.modifierGuidance) ? ai.modifierGuidance : [ai.modifierGuidance];
                  const items = raw.filter(x => x && typeof x === "string" && !["null","none","n/a","na"].includes(x.trim().toLowerCase()));
                  return items.length > 0 ? <Section icon="🏷️" title="Modifier Analysis" color="#c084fc" items={items} /> : null;
                })()}
                {isTrue  && ai.correctiveActions?.length>0 && <Section icon="🔧" title="How to Correct & Resubmit"  color={ACCENT}   items={ai.correctiveActions} />}
                {isFalse && ai.appealSteps?.length>0        && <Section icon="⚖️" title="Steps to Appeal & Get Paid" color="#22c55e"  items={ai.appealSteps} />}
                {isTrue  && ai.appealSteps?.length>0        && <Section icon="⚖️" title="Appeal Steps (if disputing)" color="#a78bfa" items={ai.appealSteps} />}

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11, marginBottom:11 }}>
                  {ai.documentationNeeded?.length>0 && (
                    <div style={{ background:"rgba(255,255,255,0.02)", border:`1.5px solid ${BORDER}`, borderRadius:11, padding:"13px 15px" }}>
                      <div style={{ fontSize:11, fontWeight:700, color:"#3a5a7a", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:9 }}>📁 Documentation Needed</div>
                      {ai.documentationNeeded.map((d,i) => (
                        <div key={i} style={{ display:"flex", gap:7, alignItems:"flex-start", marginBottom:5 }}>
                          <span style={{ color:"#3a5a7a", fontWeight:800, fontSize:12, flexShrink:0 }}>›</span>
                          <span style={{ fontSize:12, color:"#7a9bbf", lineHeight:1.5 }}>{d}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
                    {ai.timingAdvice && (
                      <div style={{ background:"rgba(245,158,11,0.06)", border:"1.5px solid rgba(245,158,11,0.25)", borderRadius:11, padding:"13px 15px", flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:7 }}>
                          <div style={{ fontSize:11, fontWeight:700, color:"#f59e0b", textTransform:"uppercase", letterSpacing:"0.07em" }}>⏰ Timing / Deadline</div>
                          <span style={{ fontSize:10, fontWeight:700, color:"#f59e0b", background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.35)", borderRadius:4, padding:"2px 7px" }}>⚠️ Verify with payer</span>
                        </div>
                        <p style={{ margin:0, fontSize:12, color:"#a0bcce", lineHeight:1.6 }}>{ai.timingAdvice}</p>
                      </div>
                    )}
                    {ai.escalationPath && (
                      <div style={{ background:"rgba(167,139,250,0.06)", border:"1.5px solid rgba(167,139,250,0.25)", borderRadius:11, padding:"13px 15px", flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:7 }}>
                          <div style={{ fontSize:11, fontWeight:700, color:"#c084fc", textTransform:"uppercase", letterSpacing:"0.07em" }}>🔺 Escalation Path</div>
                          <span style={{ fontSize:10, fontWeight:700, color:"#c084fc", background:"rgba(167,139,250,0.15)", border:"1px solid rgba(167,139,250,0.35)", borderRadius:4, padding:"2px 7px" }}>⚠️ Verify with payer</span>
                        </div>
                        <p style={{ margin:0, fontSize:12, color:"#a0bcce", lineHeight:1.6 }}>{ai.escalationPath}</p>
                      </div>
                    )}
                  </div>
                </div>

                {ai.preventionTips?.length>0 && <Section icon="🛡️" title="Prevention Tips" color="#34d399" items={ai.preventionTips} />}

                {/* ── Grounding Sources ── */}
                {ai.sources?.length > 0 && (
                  <div style={{ background:"rgba(56,189,248,0.04)", border:"1.5px solid rgba(56,189,248,0.2)", borderRadius:11, padding:"13px 15px", marginBottom:11 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:ACCENT, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>
                      🌐 Sources Used by AI — Verify Manually
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                      {ai.sources.map((s, i) => (
                        <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                          style={{ display:"flex", alignItems:"flex-start", gap:9, padding:"8px 11px", borderRadius:8, background:"rgba(14,116,144,0.08)", border:"1px solid rgba(14,116,144,0.25)", textDecoration:"none" }}>
                          <span style={{ fontSize:14, marginTop:1, flexShrink:0 }}>📄</span>
                          <div style={{ minWidth:0 }}>
                            <div style={{ fontSize:12, fontWeight:700, color:ACCENT, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.title}</div>
                            <div style={{ fontSize:10, color:"#3a5a7a", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.url}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── CMS Reference Links ── */}
                <div style={{ background:"rgba(56,189,248,0.04)", border:`1.5px solid rgba(56,189,248,0.15)`, borderRadius:11, padding:"13px 15px", marginBottom:11 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:ACCENT, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>🔗 Verify Against Official Sources</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {(result.codeInfo?.category === "NCCI Bundling" || result.denialCode === "CO-59" || result.denialCode === "CO-97" || result.denialCode === "CO-78" || result.denialCode === "CO-231" || result.denialCode === "CO-4" || ["N56","N519","M78","M51","N657","M50","N822","N823"].includes(result.rarcCode)) && (
                      <a href="https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits" target="_blank" rel="noopener noreferrer"
                        style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 11px", borderRadius:8, background:"rgba(249,115,22,0.08)", border:"1px solid rgba(249,115,22,0.25)", textDecoration:"none" }}>
                        <span style={{ fontSize:16 }}>🔗</span>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color:"#f97316" }}>CMS NCCI Edit Tables</div>
                          <div style={{ fontSize:11, color:"#6a7a8a" }}>Verify exact CPT code pair bundling edits</div>
                        </div>
                      </a>
                    )}
                    {(result.codeInfo?.category === "Medical Necessity") && (
                      <a href="https://www.cms.gov/medicare-coverage-database/search.aspx?contractStatus=active&DocType=1" target="_blank" rel="noopener noreferrer"
                        style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 11px", borderRadius:8, background:"rgba(220,38,38,0.08)", border:"1px solid rgba(220,38,38,0.25)", textDecoration:"none" }}>
                        <span style={{ fontSize:16 }}>🏥</span>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color:"#f87171" }}>CMS LCD/NCD Database</div>
                          <div style={{ fontSize:11, color:"#6a7a8a" }}>Look up Local &amp; National Coverage Determinations</div>
                        </div>
                      </a>
                    )}
                    {(result.codeInfo?.category === "Coverage Denial") && (
                      <a href="https://www.cms.gov/medicare-coverage-database/search.aspx?contractStatus=active" target="_blank" rel="noopener noreferrer"
                        style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 11px", borderRadius:8, background:"rgba(220,38,38,0.08)", border:"1px solid rgba(220,38,38,0.25)", textDecoration:"none" }}>
                        <span style={{ fontSize:16 }}>📋</span>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color:"#f87171" }}>CMS Coverage &amp; CPB Reference</div>
                          <div style={{ fontSize:11, color:"#6a7a8a" }}>Verify coverage policies and clinical criteria</div>
                        </div>
                      </a>
                    )}
                    {(result.codeInfo?.category === "Auth/Referral") && (
                      <a href="https://www.cms.gov/medicare/prior-authorization-and-pre-claim-review-initiatives" target="_blank" rel="noopener noreferrer"
                        style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 11px", borderRadius:8, background:"rgba(236,72,153,0.08)", border:"1px solid rgba(236,72,153,0.25)", textDecoration:"none" }}>
                        <span style={{ fontSize:16 }}>🔐</span>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color:"#ec4899" }}>CMS Prior Authorization Guidelines</div>
                          <div style={{ fontSize:11, color:"#6a7a8a" }}>Medicare prior auth requirements by service</div>
                        </div>
                      </a>
                    )}
                    {(result.codeInfo?.category === "Timely Filing") && (
                      <a href="https://www.cms.gov/regulations-and-guidance/guidance/manuals/downloads/clm104c01.pdf" target="_blank" rel="noopener noreferrer"
                        style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 11px", borderRadius:8, background:"rgba(14,165,233,0.08)", border:"1px solid rgba(14,165,233,0.25)", textDecoration:"none" }}>
                        <span style={{ fontSize:16 }}>📅</span>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color:"#0ea5e9" }}>CMS Timely Filing Guidelines</div>
                          <div style={{ fontSize:11, color:"#6a7a8a" }}>Medicare Claims Processing Manual — Chapter 1</div>
                        </div>
                      </a>
                    )}
                    <a href="https://www.cms.gov/medicare-coverage-database/search.aspx?contractStatus=active" target="_blank" rel="noopener noreferrer"
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 11px", borderRadius:8, background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.25)", textDecoration:"none" }}>
                      <span style={{ fontSize:16 }}>📋</span>
                      <div>
                        <div style={{ fontSize:12, fontWeight:700, color:"#818cf8" }}>CMS Coverage Database</div>
                        <div style={{ fontSize:11, color:"#6a7a8a" }}>Search active LCD, NCD, and Article policies</div>
                      </div>
                    </a>
                    <a href="https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-tools" target="_blank" rel="noopener noreferrer"
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 11px", borderRadius:8, background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.25)", textDecoration:"none" }}>
                      <span style={{ fontSize:16 }}>🛠️</span>
                      <div>
                        <div style={{ fontSize:12, fontWeight:700, color:"#34d399" }}>NCCI Tools &amp; Edit Files</div>
                        <div style={{ fontSize:11, color:"#6a7a8a" }}>Download quarterly NCCI PTP &amp; MUE tables</div>
                      </div>
                    </a>
                  </div>
                </div>

                {/* ── Disclaimer ── */}
                <div style={{ background:"rgba(245,158,11,0.05)", border:"1.5px solid rgba(245,158,11,0.2)", borderRadius:11, padding:"12px 15px", marginBottom:11 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#f59e0b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>⚠️ Important Disclaimer</div>
                  <p style={{ margin:0, fontSize:11, color:"#6a7a8a", lineHeight:1.7 }}>
                    This analysis is AI-generated based on general CARC/RARC knowledge and billing guidelines. It is <strong style={{ color:"#a0bcce" }}>not a substitute</strong> for official CMS NCCI edit tables, LCD/NCD policies, or payer-specific contracts. Always verify bundling decisions against the current quarterly NCCI edit files and applicable MAC LCD before submitting appeals. Results may not reflect payer-specific policies or the most recent CMS quarterly updates.
                  </p>
                </div>

                <div style={{ display:"flex", gap:9, marginTop:4 }}>
                  <button onClick={reset} style={{ flex:1, padding:"10px", borderRadius:9, border:`1.5px solid ${BORDER}`, background:"transparent", color:"#3a5a7a", fontSize:13, fontWeight:600, cursor:"pointer" }}>↺ Analyze Another Denial</button>
                </div>
              </div>
            </div>
          )}

          <div style={{ textAlign:"center", marginTop:18, fontSize:11, color:"#1a2d47" }}>
            CARC · RARC · PR · OA · All Denial Codes · For revenue cycle use only · Not a legal opinion
          </div>
        </div>
      </div>
    </>
  );
}
