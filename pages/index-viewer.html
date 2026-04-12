<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>index.js — Copy for GitHub</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0d1117; color: #c9d1d9; font-family: monospace; }
  .header { background: #161b22; border-bottom: 1px solid #30363d; padding: 14px 16px; position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .title { color: #58a6ff; font-size: 14px; font-weight: bold; }
  .info { color: #8b949e; font-size: 12px; }
  .btn { background: #238636; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: bold; cursor: pointer; }
  .btn:active { background: #2ea043; }
  .copied { background: #1f6feb !important; }
  .code-wrap { padding: 16px; overflow-x: auto; }
  pre { font-size: 12px; line-height: 1.6; white-space: pre; color: #e6edf3; }
  .toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #238636; color: white; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: bold; display: none; z-index: 999; }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="title">📄 pages/index.js</div>
    <div class="info">Complete file — copy all and paste into GitHub</div>
  </div>
  <button class="btn" onclick="copyAll()">📋 Copy All Code</button>
</div>
<div class="code-wrap">
  <pre id="code"></pre>
</div>
<div class="toast" id="toast">✅ Copied! Now paste into GitHub</div>
<script>
const code = `import { useState, useRef } from "react";
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
  "CO-59":  { label:"Concurrent Procedure",   category:"NCCI Bundling", color:"#f97316", icon:"🔗", description:"Multiple/concurrent procedure reduction" },
  "CO-78":  { label:"Multiple Procedures",    category:"NCCI Bundling", color:"#f97316", icon:"🔗", description:"Payment reduced for multiple procedures" },
  "CO-97":  { label:"Payment Included",       category:"NCCI Bundling", color:"#f97316", icon:"🔗", description:"Payment included in another service" },
  "CO-231": { label:"Mutually Exclusive",     category:"NCCI Bundling", color:"#f97316", icon:"🔗", description:"Mutually exclusive procedure" },
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
  "CO-12":  { label:"Administered Prior",     category:"Timely Filing", color:"#0ea5e9", icon:"📅", description:"Service administered prior to coverage" },
  "CO-26":  { label:"Expired Coverage",       category:"Timely Filing", color:"#0ea5e9", icon:"📅", description:"Expenses incurred after coverage expired" },
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
  // ── RARC / N CODES ────────────────────────────────────────────────────────
  "N1":    { label:"Alert: Adjusted",         category:"Info/Alert", color:"#64748b", icon:"ℹ️", description:"Reimbursement adjusted per contract/policy" },
  "N4":    { label:"Missing Tooth",           category:"Dental",     color:"#a78bfa", icon:"🦷", description:"Missing tooth information required" },
  "N6":    { label:"Prior Auth Number",       category:"Auth/Referral", color:"#ec4899", icon:"🔐", description:"Prior authorization number required" },
  "N10":   { label:"Payment Based on Fee",    category:"Contract",   color:"#7c3aed", icon:"📑", description:"Payment based on fee schedule" },
  "N15":   { label:"Services Not Covered",    category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Services not covered when performed by this provider" },
  "N19":   { label:"Procedure Inconsistent",  category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Procedure inconsistent with qualifier" },
  "N20":   { label:"Unable to Adjudicate",    category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Unable to adjudicate — resubmit with additional info" },
  "N26":   { label:"Missing Itemized Bill",   category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing itemized bill or statement" },
  "N29":   { label:"Missing Signature",       category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing patient or subscriber signature" },
  "N30":   { label:"Invalid Patient ID",      category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Incomplete/invalid patient ID" },
  "N35":   { label:"Lifetime Benefit Max",    category:"Coverage Limit", color:"#dc2626", icon:"🚫", description:"Lifetime benefit maximum has been reached" },
  "N56":   { label:"Procedure Code Inconsistent",category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Procedure code inconsistent with modifier" },
  "N57":   { label:"Missing Consent",         category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing/incomplete/invalid consent" },
  "N95":   { label:"COB/EOB Required",        category:"COB/Liability", color:"#06b6d4", icon:"🔄", description:"Refer to EOB from primary payer" },
  "N96":   { label:"Non-covered Charge",      category:"Coverage Denial", color:"#dc2626", icon:"🚫", description:"Non-covered charge — patient responsibility" },
  "N104":  { label:"Not Eligible",            category:"Eligibility", color:"#0ea5e9", icon:"📅", description:"This patient is not eligible" },
  "N115":  { label:"Appeal Rights",           category:"Info/Alert", color:"#64748b", icon:"ℹ️", description:"This decision may be appealed" },
  "N130":  { label:"Consult Info",            category:"Info/Alert", color:"#64748b", icon:"ℹ️", description:"Consulting provider information provided" },
  "N179":  { label:"Info Req – Patient",      category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Additional info required from patient" },
  "N180":  { label:"Info Req – Provider",     category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Additional info required from provider" },
  "N211":  { label:"No Appeal Rights",        category:"Info/Alert", color:"#64748b", icon:"ℹ️", description:"You may not appeal this decision" },
  "N270":  { label:"Missing Tooth Exception", category:"Dental",     color:"#a78bfa", icon:"🦷", description:"Missing tooth exception required" },
  "N290":  { label:"Prior Auth Not Obtained", category:"Auth/Referral", color:"#ec4899", icon:"🔐", description:"Prior authorization not obtained" },
  "N362":  { label:"Composite Pricing",       category:"Contract",   color:"#7c3aed", icon:"📑", description:"Processed per composite pricing" },
  "N381":  { label:"Consult Provider",        category:"Info/Alert", color:"#64748b", icon:"ℹ️", description:"Alert: Consult your provider agreement" },
  "N414":  { label:"Workers Comp Excluded",   category:"COB/Liability", color:"#06b6d4", icon:"🔄", description:"Workers comp excluded from coverage" },
  "N425":  { label:"Claim Submitted Late",    category:"Timely Filing", color:"#0ea5e9", icon:"📅", description:"Claim submitted past filing limit" },
  "N443":  { label:"Incomplete Rx Info",      category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Incomplete/invalid prescription information" },
  "N517":  { label:"Reimbursement Method",    category:"Contract",   color:"#7c3aed", icon:"📑", description:"Reimbursement method — cost to charge ratio" },
  "N522":  { label:"Resubmission Not Allowed",category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Resubmission not allowed" },
  "N570":  { label:"Missing Cert of Medical", category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing/incomplete certificate of medical necessity" },
  "N576":  { label:"Appeal Info",             category:"Info/Alert", color:"#64748b", icon:"ℹ️", description:"Include remittance and EOB in appeal" },
  "N583":  { label:"No Coverage for DOS",     category:"Eligibility", color:"#0ea5e9", icon:"📅", description:"No coverage for patient on date of service" },
  "N600":  { label:"Unlisted Procedure",      category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Unlisted procedure code — documentation required" },
  "N630":  { label:"Claim Rejected",          category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Claim rejected — resubmit with corrections" },
  "N657":  { label:"Missing NDC",             category:"Coding Error", color:"#ef4444", icon:"⚠️", description:"Missing/invalid National Drug Code" },
  "N764":  { label:"Auth Not On File",        category:"Auth/Referral", color:"#ec4899", icon:"🔐", description:"Authorization not on file for service" },
  "N822":  { label:"Missing Rendering NPI",   category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing/incomplete rendering provider NPI" },
  "N823":  { label:"Missing Billing NPI",     category:"Admin/Process", color:"#8b5cf6", icon:"📋", description:"Missing/incomplete billing provider NPI" },
};

const DARK = "#09111f", CARD = "#0f1929", CARD2 = "#131f33", BORDER = "#1a2d47", ACCENT = "#38bdf8";

function Tag({ label, color, onRemove }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 11px", borderRadius:7, background:\`\${color}18\`, border:\`1.5px solid \${color}55\`, color, fontSize:12, fontWeight:700, fontFamily:"monospace", margin:"3px" }}>
      {label}
      {onRemove && <span onClick={onRemove} style={{ cursor:"pointer", opacity:0.7, fontSize:14 }}>×</span>}
    </span>
  );
}

function Section({ icon, title, items, color, note }) {
  if (!items?.length) return null;
  return (
    <div style={{ background:\`\${color}0d\`, border:\`1.5px solid \${color}30\`, borderRadius:12, padding:"14px 16px", marginBottom:11 }}>
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
      {note && <p style={{ margin:"8px 0 0", fontSize:11, color:"#475569", fontStyle:"italic", borderTop:\`1px solid \${color}25\`, paddingTop:7 }}>{note}</p>}
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
    const parts = raw.trim().toUpperCase().split(/\\s+/);
    const cptMod = parts[0].split("-");
    const cpt = cptMod[0];
    const modifier = cptMod.slice(1).join("-") || "";
    const dx = parts[1] || "";
    if (!/^\\d{4,5}[A-Z0-9]?$/.test(cpt) && !/^[A-Z]\\d{2}/.test(cpt)) return null;
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
      ? billedLines.map(l => \`\${l.cpt}\${l.modifier ? "-" + l.modifier : ""}\${l.dx ? " [" + l.dx + "]" : ""}\`).join(", ")
      : "Not provided";
    const deniedStr = deniedLines.map(l => \`\${l.cpt}\${l.modifier ? "-" + l.modifier : ""}\${l.dx ? " [" + l.dx + "]" : ""}\`).join(", ");

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

          <div style={{ background:CARD, border:\`1px solid \${BORDER}\`, borderRadius:16, padding:"20px", marginBottom:12 }}>

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
                  style={{ width:"100%", padding:"10px 13px", borderRadius:8, border:\`2px solid \${selectedCode ? selectedCode.color+"60" : BORDER}\`, background:"#0a1525", color:"#d0e8ff", fontSize:13, fontFamily:"monospace", outline:"none", boxSizing:"border-box" }}
                />
                {showDropdown && filteredCodes.length > 0 && (
                  <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, background:CARD2, border:\`1px solid \${BORDER}\`, borderRadius:10, zIndex:200, boxShadow:"0 16px 40px rgba(0,0,0,0.6)", maxHeight:260, overflowY:"auto" }}>
                    {filteredCodes.map(([key, val]) => (
                      <div key={key}
                        onClick={() => { setDenialCode(key); setDenialSearch(\`\${key} — \${val.label}\`); setShowDropdown(false); }}
                        style={{ padding:"9px 13px", cursor:"pointer", display:"flex", alignItems:"center", gap:9, borderBottom:\`1px solid \${BORDER}\` }}
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
                        <span style={{ fontSize:10, color:val.color, background:\`\${val.color}15\`, borderRadius:4, padding:"2px 6px", fontWeight:700, flexShrink:0, whiteSpace:"nowrap" }}>{val.category}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedCode && (
                <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:9, padding:"8px 13px", borderRadius:8, background:\`\${selectedCode.color}10\`, border:\`1.5px solid \${selectedCode.color}40\` }}>
                  <span style={{ fontSize:18 }}>{selectedCode.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                      <span style={{ fontFamily:"monospace", fontWeight:800, fontSize:13, color:selectedCode.color }}>{denialCode}</span>
                      <span style={{ fontSize:13, color:"#c8d8ea", fontWeight:600 }}>{selectedCode.label}</span>
                      <span style={{ fontSize:10, color:selectedCode.color, background:\`\${selectedCode.color}20\`, borderRadius:4, padding:"2px 7px", fontWeight:700 }}>{selectedCode.category}</span>
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
                    style={{ flex:1, padding:"8px 12px", borderRadius:8, border:\`2px solid \${mode===m?(m==="denied"?"rgba(239,68,68,0.5)":ACCENT+"80"):BORDER}\`, background:mode===m?(m==="denied"?"rgba(239,68,68,0.08)":"rgba(56,189,248,0.06)"):"transparent", cursor:"pointer", textAlign:"left" }}>
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
                  style={{ flex:1, padding:"10px 12px", borderRadius:8, border:\`2px solid \${BORDER}\`, background:"#0a1525", color:"#d0e8ff", fontSize:13, fontFamily:"monospace", outline:"none", boxSizing:"border-box" }}
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
              <div style={{ borderTop:\`1px solid \${BORDER}\`, paddingTop:11, marginBottom:12 }}>
                {billedLines.length > 0 && (
                  <div style={{ marginBottom:7 }}>
                    <span style={{ fontSize:10, fontWeight:700, color:"#3a5a7a", textTransform:"uppercase", letterSpacing:"0.07em", display:"block", marginBottom:4 }}>Billed ({billedLines.length})</span>
                    {billedLines.map(l => (
                      <Tag key={l.id} color="#38bdf8"
                        label={\`\${l.cpt}\${l.modifier?"-"+l.modifier:""}\${l.dx?" ["+l.dx+"]":""}\`}
                        onRemove={() => setBilledLines(ls => ls.filter(x => x.id !== l.id))} />
                    ))}
                  </div>
                )}
                {deniedLines.length > 0 && (
                  <div>
                    <span style={{ fontSize:10, fontWeight:700, color:"#3a5a7a", textTransform:"uppercase", letterSpacing:"0.07em", display:"block", marginBottom:4 }}>Denied ({deniedLines.length})</span>
                    {deniedLines.map(l => (
                      <Tag key={l.id} color="#f87171"
                        label={\`\${l.cpt}\${l.modifier?"-"+l.modifier:""}\${l.dx?" ["+l.dx+"]":""}\`}
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
                style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:\`2px solid \${BORDER}\`, background:"#0a1525", color:"#8a9baa", fontSize:12, outline:"none", resize:"vertical", boxSizing:"border-box", lineHeight:1.5 }} />
            </div>

            <div style={{ display:"flex", gap:9 }}>
              <button onClick={runAnalysis} disabled={loading}
                style={{ flex:1, padding:"12px", borderRadius:10, border:"none", background:loading?"#0f1929":\`linear-gradient(135deg,\${ACCENT},#0284c7)\`, color:loading?"#3a5a7a":"#03111f", fontSize:14, fontWeight:800, cursor:loading?"not-allowed":"pointer", boxShadow:loading?"none":"0 4px 18px rgba(56,189,248,0.2)" }}>
                {loading ? "🔍  Analyzing..." : "⚡  Analyze — True or False Denial?"}
              </button>
              {(billedLines.length>0||deniedLines.length>0||denialCode||result) && (
                <button onClick={reset} style={{ padding:"12px 15px", borderRadius:10, border:\`1.5px solid \${BORDER}\`, background:"transparent", color:"#3a5a7a", fontSize:12, fontWeight:600, cursor:"pointer" }}>Reset</button>
              )}
            </div>
          </div>

          {loading && (
            <div style={{ background:CARD, border:\`1px solid \${BORDER}\`, borderRadius:16, padding:"28px 20px", textAlign:"center" }}>
              <div style={{ fontSize:28, marginBottom:10 }}>🔬</div>
              <div style={{ fontSize:14, color:"#7a9bbf", fontWeight:600, marginBottom:5 }}>Reviewing {denialCode} rules & claim details…</div>
              <div style={{ fontSize:12, color:"#2a4a6a" }}>Checking payer policy · Evaluating CPTs · Assessing appeal options</div>
              <div style={{ display:"flex", justifyContent:"center", gap:7, marginTop:14 }}>
                {[0,0.2,0.4].map((d,i) => (
                  <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:ACCENT, animation:\`pulse2 1.2s \${d}s infinite\` }}/>
                ))}
              </div>
            </div>
          )}

          {result && !loading && ai && (
            <div ref={resultRef}>
              <div style={{ background:CARD, border:\`1.5px solid \${vc}35\`, borderRadius:16, padding:"18px 20px", marginBottom:11, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:\`linear-gradient(90deg,\${vc},transparent)\` }}/>
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
                          strokeDasharray={\`\${2*Math.PI*26}\`}
                          strokeDashoffset={\`\${2*Math.PI*26*(1-(ai.confidence||70)/100)}\`}
                          strokeLinecap="round" transform="rotate(-90 32 32)"/>
                      </svg>
                      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:vc, fontFamily:"monospace" }}>
                        {ai.confidence||70}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background:CARD, border:\`1px solid \${BORDER}\`, borderRadius:16, padding:"18px 20px" }}>
                {ai.denialRuleExplained && (
                  <div style={{ background:"rgba(56,189,248,0.06)", border:"1.5px solid rgba(56,189,248,0.2)", borderRadius:11, padding:"13px 15px", marginBottom:11 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:ACCENT, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>📖 What {result.denialCode} Means</div>
                    <p style={{ margin:0, fontSize:13, color:"#a0bcce", lineHeight:1.7 }}>{ai.denialRuleExplained}</p>
                  </div>
                )}
                {isTrue  && <Section icon="❌" title="Why This Denial Is Valid"          color="#ef4444" items={ai.whyTrueDenial} />}
                {isFalse && <Section icon="✅" title="Why This Denial Is Incorrect"      color="#22c55e" items={ai.whyFalseDenial} />}
                {isFalse && ai.whyTrueDenial?.length>0  && <Section icon="⚠️" title="What Payer May Cite"        color="#f59e0b" items={ai.whyTrueDenial} />}
                {isTrue  && ai.whyFalseDenial?.length>0 && <Section icon="💡" title="Potentially Disputable"     color="#a78bfa" items={ai.whyFalseDenial} />}
                {ai.billingErrors?.length>0    && <Section icon="🔴" title="Billing Errors Identified"           color="#f87171" items={ai.billingErrors} note="These are the likely root cause of the denial." />}
                {ai.modifierGuidance           && <Section icon="🏷️" title="Modifier Guidance"                  color="#c084fc" items={[ai.modifierGuidance]} />}
                {isTrue  && ai.correctiveActions?.length>0 && <Section icon="🔧" title="How to Correct & Resubmit"  color={ACCENT}   items={ai.correctiveActions} />}
                {isFalse && ai.appealSteps?.length>0        && <Section icon="⚖️" title="Steps to Appeal & Get Paid" color="#22c55e"  items={ai.appealSteps} />}
                {isTrue  && ai.appealSteps?.length>0        && <Section icon="⚖️" title="Appeal Steps (if disputing)" color="#a78bfa" items={ai.appealSteps} />}

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11, marginBottom:11 }}>
                  {ai.documentationNeeded?.length>0 && (
                    <div style={{ background:"rgba(255,255,255,0.02)", border:\`1.5px solid \${BORDER}\`, borderRadius:11, padding:"13px 15px" }}>
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
                        <div style={{ fontSize:11, fontWeight:700, color:"#f59e0b", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:7 }}>⏰ Timing / Deadline</div>
                        <p style={{ margin:0, fontSize:12, color:"#a0bcce", lineHeight:1.6 }}>{ai.timingAdvice}</p>
                      </div>
                    )}
                    {ai.escalationPath && (
                      <div style={{ background:"rgba(167,139,250,0.06)", border:"1.5px solid rgba(167,139,250,0.25)", borderRadius:11, padding:"13px 15px", flex:1 }}>
                        <div style={{ fontSize:11, fontWeight:700, color:"#c084fc", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:7 }}>🔺 Escalation Path</div>
                        <p style={{ margin:0, fontSize:12, color:"#a0bcce", lineHeight:1.6 }}>{ai.escalationPath}</p>
                      </div>
                    )}
                  </div>
                </div>

                {ai.preventionTips?.length>0 && <Section icon="🛡️" title="Prevention Tips" color="#34d399" items={ai.preventionTips} />}

                <div style={{ display:"flex", gap:9, marginTop:4 }}>
                  <button onClick={reset} style={{ flex:1, padding:"10px", borderRadius:9, border:\`1.5px solid \${BORDER}\`, background:"transparent", color:"#3a5a7a", fontSize:13, fontWeight:600, cursor:"pointer" }}>↺ Analyze Another Denial</button>
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
`;
document.getElementById('code').textContent = code;
function copyAll() {
  navigator.clipboard.writeText(code).then(() => {
    const toast = document.getElementById('toast');
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
  });
}
</script>
</body>
</html>
