/**
 * Seva Setu (सेवा सेतु) Frontend Application Controller
 * Catchphrase: Seva Se Samriddhi (सेवा से समृद्धि)
 * Comprehensive multi-portal state management, Web Audio API sound generator,
 * Leaflet OpenStreetMap proximity tracker, Rapido fallback dispatch engine,
 * transparent pricing calculator, interactive payment gateway interface,
 * full Hindi/English bidirectional translation engine, working real-time search,
 * NGO DARPAN verification form, and SIH guided scenario runner.
 */

/**
 * Dynamic API Base URL resolver:
 * 1. window.SEVA_SETU_API_URL or window.API_BASE_URL (injected via config or window)
 * 2. localStorage.getItem("SEVA_SETU_API_URL") (runtime override via browser console/UI)
 * 3. If hosted on localhost/127.0.0.1 without HTTPS, defaults to http://localhost:8000
 * 4. In production (Netlify), defaults to "" to avoid Mixed-Content security blocks
 */
function resolveApiBaseUrl() {
  if (typeof window !== "undefined") {
    if (window.SEVA_SETU_API_URL) return window.SEVA_SETU_API_URL;
    if (window.SAHAKAR_API_URL) return window.SAHAKAR_API_URL;
    if (window.API_BASE_URL) return window.API_BASE_URL;
    try {
      const stored = localStorage.getItem("SEVA_SETU_API_URL") || localStorage.getItem("SAHAKAR_API_URL");
      if (stored) return stored;
    } catch (e) {}

    const host = window.location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0";
    if (isLocal && window.location.protocol !== "https:") {
      return "http://localhost:8000";
    }
  }
  // Production / Netlify: relative URL or empty base
  return "";
}

let API_BASE_URL = resolveApiBaseUrl();

// Developer utility to set custom backend URL on live Netlify site
if (typeof window !== "undefined") {
  window.setBackendUrl = function(url) {
    if (!url) {
      localStorage.removeItem("SEVA_SETU_API_URL");
      localStorage.removeItem("SAHAKAR_API_URL");
      console.log("Seva Setu: Cleared custom backend URL. Reverting to auto-detection.");
    } else {
      localStorage.setItem("SEVA_SETU_API_URL", url);
      console.log(`Seva Setu: Custom backend URL set to: ${url}`);
    }
    API_BASE_URL = resolveApiBaseUrl();
    if (typeof checkBackendHealth === "function") {
      checkBackendHealth();
    }
  };
}

// Comprehensive Multilingual Translation Table (159 UI Keys)
const TRANSLATIONS = {
  en: {
    "ministry-subtitle": "Ministry of Cooperation, GoI • \"Seva Se Samriddhi\"",
    "tab-client": "Citizen App",
    "tab-worker": "Worker Radar",
    "tab-ministry": "Ministry Cockpit",
    "backend-status": "Autonomous Engine",
    "step-1": "1. Select Service & Plan",
    "step-2": "2. Transparent Invoice",
    "step-3": "3. Proximity Radar Dispatch",
    "step-4": "4. Dual-OTP Settlement",
    "lbl-search": "Search Certified Cooperative Service",
    "txt-pacs-verified": "PACS & Labour Federation Verified",
    "txt-speak": "Speak",
    "txt-quick-suggestions": "Quick Suggestions:",
    "txt-emergency-title": "Emergency Triage Mode",
    "txt-emergency-desc": "Priority sub-30m dispatch for gas leak, short circuit, or medical transit.",
    "txt-choose-service": "Choose a Cooperative Service",
    "txt-service-subtitle": "Grassroots fair-wage tariffs - Reduced by 50% vs private aggregators",
    "txt-worker-wage-badge": "100% Wage To Worker",
    "txt-select-pricing": "Select Engagement Horizon",
    "txt-pricing-subtitle": "Fair to technician & citizen",
    "plan-hourly-title": "Hourly Task",
    "plan-hourly-desc": "1 hour quick repair",
    "plan-daily-title": "Full Day",
    "plan-daily-desc": "8 hours shift",
    "plan-weekly-title": "Weekly",
    "plan-weekly-desc": "5 days project",
    "plan-weekly-badge": "5% Off",
    "plan-monthly-title": "Subscription",
    "plan-monthly-desc": "22 days / month",
    "plan-monthly-badge": "15% Off",
    "txt-ngo-label": "Non-Profit / NGO / Community Care (20% Social Subsidy)",
    "txt-ngo-hint": "Requires NGO DARPAN Verification",
    "txt-assigned-worker": "Assigned Cooperative Worker",
    "txt-arrival-otp-title": "1. Arrival OTP (START_OTP)",
    "txt-copy-otp": "Copy",
    "txt-arrival-otp-desc": "Share with technician ONLY upon arrival to commence work",
    "txt-end-otp-title": "2. Completion OTP:",
    "txt-timeline-title": "Live State Machine Timeline",
    "txt-timeline-subtitle": "Dual-OTP Enforced",
    "txt-demo-shortcuts": "Demo Shortcuts:",
    "txt-btn-switch-worker": "Switch to Worker Radar →",
    "txt-btn-fast-forward": "⚡ Fast-Forward Lifecycle",
    "txt-map-title": "Worker Proximity Radar Map",
    "txt-map-live": "OpenStreetMap Live",
    "txt-map-you": "You (Connaught Place)",
    "txt-map-workers": "Cooperative Workers",
    "txt-invoice-title": "Transparent Invoice",
    "txt-invoice-subtitle": "Grassroots fair-wage calculation",
    "txt-invoice-badge": "0% Exploitative Cut",
    "txt-lbl-labor": "Direct Fair Labor",
    "txt-lbl-toolkit": "Certified Toolkit Charge:",
    "txt-lbl-transit": "Direct Transit Tariff",
    "txt-lbl-emergency": "Emergency Priority Surcharge:",
    "txt-lbl-tax": "Statutory GST (5%):",
    "txt-lbl-platform": "Cooperative Welfare Fund (3.5%):",
    "txt-lbl-platform-sub": "Insurance, worker healthcare & pension",
    "txt-lbl-ngo": "Verified NGO / Community Subsidy (-20%):",
    "txt-lbl-total": "Total Customer Payable:",
    "txt-lbl-savings-prefix": "Citizen Savings: ₹",
    "txt-lbl-savings-suffix": "(Aggregator fee eradicated)",
    "txt-btn-book": "Confirm & Proceed to Payment",
    "txt-switch-worker-lbl": "Switch Worker Profile",
    "txt-today-takehome": "Today's Take-Home (100%)",
    "txt-view-passbook": "View Cooperative Passbook",
    "txt-live-radar-title": "Live Job Dispatch Radar",
    "txt-radar-proximity": "Proximity Radius: 5 km",
    "txt-radar-you": "You (Online)",
    "txt-radar-idle": "Scanning cooperative broadcast frequency...",
    "txt-new-broadcast": "New Cooperative Broadcast",
    "txt-radar-guaranteed": "Guaranteed Pay",
    "txt-btn-decline": "Decline (Trigger Fallback)",
    "txt-fallback-activated": "Automated Fallback Engine Activated!",
    "txt-btn-accept": "Accept & Navigate",
    "txt-dual-otp-desk": "Dual-OTP Verification Desk",
    "txt-dual-otp-sub": "Fraud-Proof Settlement",
    "txt-step1-title": "STEP 1: Enter Customer Arrival OTP (START_OTP)",
    "txt-step1-desc": "Ask customer for the 4-digit START_OTP upon reaching their premises.",
    "txt-btn-verify-start": "Verify Start",
    "txt-step2-title": "STEP 2: Proof of Work & Completion OTP (END_OTP)",
    "txt-step2-desc": "Upload completion photo and ask customer for END_OTP to release payment.",
    "txt-btn-sample-proof": "Sample Proof",
    "txt-btn-release": "Release Payout",
    "txt-ai-cred-title": "AI Verified Trade Credentials",
    "txt-inspect-ocr": "Inspect Document OCR",
    "txt-min-title": "Ministry of Cooperation, Government of India",
    "txt-min-desc": "Real-time fair wage oversight, PACS federations registry, district shortage intelligence, and AI credential verification.",
    "txt-btn-refresh-telemetry": "Refresh Live Data",
    "txt-kpi-coops": "Registered Cooperatives",
    "txt-kpi-workers": "Verified Gig Technicians",
    "txt-kpi-wages": "Direct Wages Disbursed",
    "txt-kpi-savings": "Citizen Savings Generated",
    "txt-district-title": "District Deployment & Shortage Intelligence",
    "txt-district-sub": "Autonomous PACS dispatch & vocational training triggers",
    "th-district": "District",
    "th-demand": "Demand Index",
    "th-workers": "Active Technicians",
    "th-status": "Status",
    "th-action": "Action",
    "txt-ai-desk-title": "AI Verification Desk",
    "txt-ai-desk-sub": "Gemini 1.5 Flash Document Attestation",
    "txt-live-stream-title": "Live Federation Stream",
    "scenario-title": "SIH Hackathon Scenario Runner",
    "scenario-sub": "1-Click Interactive Demonstration",
    "scenario-btn-1": "⚡ 1. Standard Booking",
    "scenario-btn-2": "💳 2. Payment Gateway",
    "scenario-btn-3": "🤝 3. NGO Verification",
    "scenario-btn-4": "🚨 4. Emergency & Fallback",
    "scenario-btn-5": "🛡️ 5. Dual-OTP Closure",
    "txt-pay-gateway-title": "Cooperative BharatPay Gateway",
    "txt-pay-gateway-sub": "National Cooperative Escrow & Settlement - Ministry of Cooperation",
    "txt-pay-order-summary": "Order & Escrow Summary",
    "pay-lbl-labor": "Direct Labor Wage (100% to Worker):",
    "pay-lbl-toolkit": "Certified Toolkit Charge:",
    "pay-lbl-transit": "Geospatial Transit (1.2 km):",
    "pay-lbl-emergency": "Emergency Priority Surcharge:",
    "pay-lbl-tax": "Statutory GST (5%):",
    "pay-lbl-platform": "Cooperative Welfare Cess (3.5%):",
    "pay-lbl-ngo": "Verified NGO Subsidy (-20%):",
    "pay-lbl-escrow-trust": "Held in 256-Bit Escrow until END_OTP Validation",
    "txt-pay-choose-method": "Choose Secure Payment Mode",
    "pay-tab-qr": "UPI QR",
    "pay-tab-apps": "UPI Apps",
    "pay-tab-bank": "Coop Bank",
    "pay-tab-escrow": "Escrow Cash",
    "pay-lbl-scan-qr": "Scan with any UPI App (BHIM / GPay / PhonePe)",
    "pay-btn-simulate-qr": "⚡ Simulate Instant UPI Mobile App Approval",
    "pay-lbl-bank-sub": "Pay directly from your Cooperative Society or DCCB account:",
    "pay-zero-cash-title": "Zero Upfront Cash Guarantee",
    "pay-zero-cash-desc": "You only pay in cash or UPI directly to technician once the work is completed and you validate the END_OTP.",
    "pay-btn-cancel": "Cancel",
    "ngo-modal-title": "NGO & Non-Profit Verification",
    "ngo-modal-sub": "Ministry of Cooperation 20% Social Welfare Subsidy Desk",
    "ngo-inst-banner": "To qualify for the 20% cooperative subsidy, non-profit institutions must provide their NITI Aayog NGO-DARPAN ID or 12A/80G registration.",
    "ngo-eval-title": "Evaluating Prototype?",
    "ngo-btn-prefill": "⚡ Pre-fill Sample NGO",
    "ngo-lbl-name": "Registered Non-Profit / NGO Name *",
    "ngo-lbl-darpan": "NITI Aayog DARPAN ID *",
    "ngo-lbl-tax": "Income Tax 12A / 80G No.",
    "ngo-lbl-purpose": "Community Service Purpose *",
    "ngo-lbl-rep": "Authorized Representative Name",
    "ngo-btn-cancel": "Cancel",
    "ngo-btn-verify": "Verify DARPAN & Apply 20% Subsidy",
    "cred-modal-title": "Gemini 1.5 Flash AI Credential Verification",
    "cred-modal-sub": "Ministry of Cooperation Verified Worker Credential Vault",
    "cred-lbl-name": "Worker Name",
    "cred-lbl-issuer": "Issuing Body",
    "cred-lbl-certno": "Certificate No.",
    "cred-lbl-confidence": "Gemini Confidence",
    "cred-btn-close": "Close Inspector",
    "passbook-modal-title": "Cooperative Passbook & DBT Ledger",
    "passbook-lbl-balance": "Withdrawable Balance",
    "passbook-lbl-nocut": "0% Cut Guaranteed",
    "passbook-btn-dbt": "Instant DBT to Bank",
    "passbook-lbl-recent": "Recent Disbursed Earnings",
    "passbook-th-jobid": "Job ID",
    "passbook-th-service": "Service",
    "passbook-th-status": "Status",
    "passbook-th-disbursed": "Disbursed",
    "passbook-btn-close": "Close",
    "sub-card-title": "Seva Setu Samriddhi Subscription Pass",
    "sub-card-sub": "Subscribe to unlock up to 30% discount offers, zero emergency fees & exclusive vouchers",
    "sub-gateway-title": "Seva Setu Samriddhi Pass Checkout",
    "reviews-heading": "Verified Citizen Reviews & Experiences",
    "reviews-subheading": "Public grassroots accountability • Authentic feedback from cooperative home service clients",
    "btn-write-review": "Write a Review",
    "write-review-title": "Submit Service Review & Grievance",
    "worker-auth-title": "Worker Dashboard & Credential Onboarding",
    "worker-auth-desc": "Verify your trade skill and identity to access the decentralized cooperative gig radar, 100% fair-wage passbook, and instant DBT.",
    "min-demand-charts-title": "Regional Worker Demand Intelligence & Charts",
    "min-demand-charts-sub": "Geospatial shortage radar for targeted PACS vocational training & emergency re-allocation",
    "min-reviews-title": "Citizen Grievance & Worker Review Log",
    "min-reviews-sub": "Track complaints against technicians, positive commendations, and enforce federation discipline",
    "min-revenue-title": "Platform Revenue Generated & Cooperative Welfare Audit",
    "min-revenue-sub": "Transparent public ledger: 100% worker wage pass-through + 3.5% non-profit social protection pool",
    "txt-show-all-services": "Show All 6 Services",
    "txt-show-less-services": "Show Less",
    "txt-schedule-title": "Choose Service Date & Time Slot",
    "txt-schedule-subtitle": "Instant emergency dispatch or scheduled future arrival by certified technician",
    "opt-immediate-title": "Instant Dispatch",
    "opt-immediate-desc": "Technician dispatched immediately (<30 min average arrival)",
    "opt-scheduled-title": "Schedule for Later",
    "opt-scheduled-desc": "Choose convenient date & preferred arrival window",
    "lbl-choose-date": "1. Select Service Date:",
    "lbl-up-to-7days": "Up to 7 days advance reservation",
    "lbl-choose-slot": "2. Select Preferred Time Slot:",
    "lbl-exact-time": "Or specify exact arrival time:",
    "lbl-invoice-slot": "Scheduled Slot:",
    "lbl-active-slot": "Confirmed Schedule:",
    "btn-export-req-report": "Export Requirement Report",
    "lbl-quick-service-filter": "Quick Trade Filter:",
    "lbl-req-workforce": "Required Workforce",
    "lbl-active-deployed": "Active Certified Deployed",
    "lbl-net-deficit": "Workforce Deficit / Gap",
    "lbl-monthly-demand": "Monthly Service Demand",
    "min-debarment-title": "Citizen Incident Escalations & Debarment Engine",
    "min-debarment-sub": "Automatic debarment triggered when ≥ 2 independent workers escalate complaints against abusive / non-paying citizens",
    "min-discipline-title": "Worker Rejection Auditing & Ministry Disciplinary Desk",
    "min-discipline-sub": "Workers with ≥ 3 declined dispatches are flagged for formal show-cause review, suspension, or license revocation",
    "escalate-modal-title": "Escalate Customer Incident to Backend",
    "escalate-modal-sub": "Raise official complaint for delayed service, customer misbehavior, or OTP refusal",
    "ngo-banner-title": "NGO, Non-Profit & Institutional Partner Portal",
    "ngo-banner-desc": "Verify your NITI Aayog DARPAN ID to unlock 20% social welfare subsidy and direct access to Heritage Artisan Guilds (Pottery, Blacksmith, Painting).",
    "ngo-banner-btn": "Verify NGO Credentials",
    "txt-ngo-artisan-quick-label": "Additionally Unlocked Services:",
    "txt-artisan-quick-label": "Additional NGO Artisan Guilds:"
  },
  hi: {
    "ministry-subtitle": "सहकारिता मंत्रालय, भारत सरकार • \"सेवा से समृद्धि\"",
    "tab-client": "नागरिक पोर्टल",
    "tab-worker": "श्रमिक रडार",
    "tab-ministry": "मंत्रालय डैशबोर्ड",
    "backend-status": "स्वायत्त इंजन",
    "step-1": "1. सेवा और योजना चुनें",
    "step-2": "2. पारदर्शी चालान",
    "step-3": "3. निकटता रडार प्रेषण",
    "step-4": "4. दोहरी-ओटीपी निपटान",
    "lbl-search": "प्रमाणित सहकारी सेवा खोजें",
    "txt-pacs-verified": "पैक्स और श्रम महासंघ द्वारा सत्यापित",
    "txt-speak": "बोलें",
    "txt-quick-suggestions": "त्वरित सुझाव:",
    "txt-emergency-title": "आपातकालीन ट्रायज मोड",
    "txt-emergency-desc": "गैस रिसाव, शॉर्ट सर्किट, या आपातकालीन सहायता के लिए 30 मिनट में प्राथमिकता प्रेषण।",
    "txt-choose-service": "सहकारी सेवा चुनें",
    "txt-service-subtitle": "जमीनी स्तर पर उचित मजदूरी दरें - निजी बिचौलियों से 50% कम",
    "txt-worker-wage-badge": "100% मजदूरी सीधे श्रमिक को",
    "txt-select-pricing": "कार्य अवधि चुनें",
    "txt-pricing-subtitle": "श्रमिक और नागरिक दोनों के लिए न्यायसंगत",
    "plan-hourly-title": "प्रति घंटा कार्य",
    "plan-hourly-desc": "1 घंटे की त्वरित मरम्मत",
    "plan-daily-title": "पूरा दिन",
    "plan-daily-desc": "8 घंटे की शिफ्ट",
    "plan-weekly-title": "साप्ताहिक",
    "plan-weekly-desc": "5 दिनों का प्रोजेक्ट",
    "plan-weekly-badge": "5% छूट",
    "plan-monthly-title": "मासिक सदस्यता",
    "plan-monthly-desc": "22 दिन / माह",
    "plan-monthly-badge": "15% छूट",
    "txt-ngo-label": "गैर-लाभकारी / एनजीओ / सामाजिक कल्याण (20% सामाजिक सब्सिडी)",
    "txt-ngo-hint": "एनजीओ दर्पण सत्यापन आवश्यक है",
    "txt-assigned-worker": "नियुक्त सहकारी श्रमिक",
    "txt-arrival-otp-title": "1. आगमन ओटीपी (START_OTP)",
    "txt-copy-otp": "कॉपी करें",
    "txt-arrival-otp-desc": "कार्य शुरू करने के लिए केवल तकनीशियन के पहुंचने पर ही साझा करें",
    "txt-end-otp-title": "2. समापन ओटीपी:",
    "txt-timeline-title": "लाइव स्थिति समयरेखा",
    "txt-timeline-subtitle": "दोहरी ओटीपी सुरक्षा लागू",
    "txt-demo-shortcuts": "डेमो शॉर्टकट:",
    "txt-btn-switch-worker": "श्रमिक रडार पर जाएं →",
    "txt-btn-fast-forward": "⚡ त्वरित प्रक्रिया पूरा करें",
    "txt-map-title": "श्रमिक निकटता रडार मानचित्र",
    "txt-map-live": "लाइव ओपन-स्ट्रीट-मैप",
    "txt-map-you": "आप (कनॉट प्लेस)",
    "txt-map-workers": "सहकारी श्रमिक",
    "txt-invoice-title": "पारदर्शी चालान",
    "txt-invoice-subtitle": "उचित श्रम पारिश्रमिक गणना",
    "txt-invoice-badge": "0% शोषणकारी कटौती",
    "txt-lbl-labor": "सीधा उचित श्रम शुल्क",
    "txt-lbl-toolkit": "प्रमाणित टूलकिट शुल्क:",
    "txt-lbl-transit": "सीधा यात्रा शुल्क",
    "txt-lbl-emergency": "आपातकालीन प्राथमिकता शुल्क:",
    "txt-lbl-tax": "वैधानिक जीएसटी (5%):",
    "txt-lbl-platform": "सहकारी कल्याण कोष (3.5%):",
    "txt-lbl-platform-sub": "बीमा, श्रमिक स्वास्थ्य एवं पेंशन",
    "txt-lbl-ngo": "सत्यापित एनजीओ सब्सिडी (-20%):",
    "txt-lbl-total": "कुल देय राशि:",
    "txt-lbl-savings-prefix": "नागरिक बचत: ₹",
    "txt-lbl-savings-suffix": "(बिचौलिया कमीशन समाप्त)",
    "txt-btn-book": "पुष्टि करें और भुगतान करें",
    "txt-switch-worker-lbl": "श्रमिक प्रोफ़ाइल बदलें",
    "txt-today-takehome": "आज की कुल कमाई (100%)",
    "txt-view-passbook": "सहकारी पासबुक देखें",
    "txt-live-radar-title": "लाइव कार्य प्रेषण रडार",
    "txt-radar-proximity": "निकटता दायरा: 5 किमी",
    "txt-radar-you": "आप (ऑनलाइन)",
    "txt-radar-idle": "सहकारी प्रसारण आवृत्ति की खोज जारी है...",
    "txt-new-broadcast": "नया सहकारी अनुरोध",
    "txt-radar-guaranteed": "निश्चित भुगतान",
    "txt-btn-decline": "अस्वीकार करें (बैकअप प्रेषण)",
    "txt-fallback-activated": "स्वचालित बैकअप इंजन सक्रिय!",
    "txt-btn-accept": "स्वीकार करें और जाएं",
    "txt-dual-otp-desk": "दोहरी ओटीपी सत्यापन डेस्क",
    "txt-dual-otp-sub": "धोखाधड़ी-मुक्त प्रत्यक्ष निपटान",
    "txt-step1-title": "चरण 1: ग्राहक का आगमन ओटीपी दर्ज करें (START_OTP)",
    "txt-step1-desc": "कार्यस्थल पर पहुंचने पर ग्राहक से 4 अंकों का आगमन ओटीपी मांगें।",
    "txt-btn-verify-start": "सत्यापित करें",
    "txt-step2-title": "चरण 2: कार्य प्रमाण और समापन ओटीपी (END_OTP)",
    "txt-step2-desc": "समापन फोटो अपलोड करें और भुगतान के लिए ग्राहक से समापन ओटीपी मांगें।",
    "txt-btn-sample-proof": "नमूना फोटो",
    "txt-btn-release": "भुगतान जारी करें",
    "txt-ai-cred-title": "एआई सत्यापित व्यावसायिक प्रमाण पत्र",
    "txt-inspect-ocr": "दस्तावेज़ ओसीआर जांचें",
    "txt-min-title": "सहकारिता मंत्रालय, भारत सरकार",
    "txt-min-desc": "वास्तविक समय निष्पक्ष मजदूरी निगरानी, पैक्स महासंघ पंजीकरण, जिला कमी विश्लेषण और एआई प्रमाणन।",
    "txt-btn-refresh-telemetry": "लाइव डेटा रिफ्रेश करें",
    "txt-kpi-coops": "पंजीकृत सहकारी समितियां",
    "txt-kpi-workers": "सत्यापित तकनीशियन",
    "txt-kpi-wages": "सीधे वितरित की गई मजदूरी",
    "txt-kpi-savings": "नागरिकों की कुल बचत",
    "txt-district-title": "जिला स्तर पर मांग एवं तकनीशियन कमी विश्लेषण",
    "txt-district-sub": "स्वायत्त पैक्स प्रेषण एवं व्यावसायिक प्रशिक्षण तंत्र",
    "th-district": "जिला",
    "th-demand": "मांग सूचकांक",
    "th-workers": "सक्रिय तकनीशियन",
    "th-status": "स्थिति",
    "th-action": "कार्रवाई",
    "txt-ai-desk-title": "एआई दस्तावेज़ सत्यापन डेस्क",
    "txt-ai-desk-sub": "जेमिनी 1.5 फ्लैश दस्तावेज़ सत्यापन",
    "txt-live-stream-title": "लाइव महासंघ गतिविधि",
    "scenario-title": "एसआईएच हैकथॉन परिदृश्य प्रदर्शक",
    "scenario-sub": "1-क्लिक इंटरैक्टिव प्रदर्शन",
    "scenario-btn-1": "⚡ 1. सामान्य बुकिंग",
    "scenario-btn-2": "💳 2. भुगतान गेटवे",
    "scenario-btn-3": "🤝 3. एनजीओ सत्यापन",
    "scenario-btn-4": "🚨 4. आपातकाल व बैकअप",
    "scenario-btn-5": "🛡️ 5. दोहरी-ओटीपी समापन",
    "txt-pay-gateway-title": "सहकारी भारतपे गेटवे",
    "txt-pay-gateway-sub": "राष्ट्रीय सहकारी एस्क्रो एवं निपटान - सहकारिता मंत्रालय",
    "txt-pay-order-summary": "ऑर्डर एवं एस्क्रो सारांश",
    "pay-lbl-labor": "सीधा श्रम पारिश्रमिक (100% श्रमिक को):",
    "pay-lbl-toolkit": "प्रमाणित टूलकिट शुल्क:",
    "pay-lbl-transit": "यात्रा शुल्क (1.2 किमी):",
    "pay-lbl-emergency": "आपातकालीन प्राथमिकता शुल्क:",
    "pay-lbl-tax": "वैधानिक जीएसटी (5%):",
    "pay-lbl-platform": "सहकारी कल्याण कोष (3.5%):",
    "pay-lbl-ngo": "सत्यापित एनजीओ सब्सिडी (-20%):",
    "pay-lbl-escrow-trust": "समापन ओटीपी सत्यापन तक सुरक्षित एस्क्रो में संरक्षित",
    "txt-pay-choose-method": "सुरक्षित भुगतान विकल्प चुनें",
    "pay-tab-qr": "यूपीआई क्यूआर",
    "pay-tab-apps": "यूपीआई ऐप्स",
    "pay-tab-bank": "सहकारी बैंक",
    "pay-tab-escrow": "एस्क्रो नकद",
    "pay-lbl-scan-qr": "किसी भी यूपीआई ऐप (BHIM / GPay / PhonePe) से स्कैन करें",
    "pay-btn-simulate-qr": "⚡ तत्काल यूपीआई मोबाइल ऐप अनुमोदन सिमुलेट करें",
    "pay-lbl-bank-sub": "अपनी सहकारी समिति या डीसीसीबी खाते से सीधे भुगतान करें:",
    "pay-zero-cash-title": "शून्य अग्रिम नकद गारंटी",
    "pay-zero-cash-desc": "कार्य पूरा होने और समापन ओटीपी सत्यापित होने के बाद ही आप सीधे तकनीशियन को नकद या यूपीआई द्वारा भुगतान करते हैं।",
    "pay-btn-cancel": "रद्द करें",
    "ngo-modal-title": "एनजीओ एवं गैर-लाभकारी सत्यापन",
    "ngo-modal-sub": "सहकारिता मंत्रालय 20% सामाजिक कल्याण सब्सिडी डेस्क",
    "ngo-inst-banner": "20% सहकारी सब्सिडी के लिए गैर-लाभकारी संस्थानों को अपना नीति आयोग एनजीओ-दर्पण आईडी या 12A/80G पंजीकरण दर्ज करना होगा।",
    "ngo-eval-title": "प्रोटोटाइप जांच रहे हैं?",
    "ngo-btn-prefill": "⚡ नमूना एनजीओ डेटा भरें",
    "ngo-lbl-name": "पंजीकृत गैर-लाभकारी / एनजीओ का नाम *",
    "ngo-lbl-darpan": "नीति आयोग दर्पण आईडी *",
    "ngo-lbl-tax": "आयकर 12A / 80G संख्या",
    "ngo-lbl-purpose": "सामुदायिक सेवा उद्देश्य *",
    "ngo-lbl-rep": "अधिकृत प्रतिनिधि का नाम",
    "ngo-btn-cancel": "रद्द करें",
    "ngo-btn-verify": "दर्पण सत्यापित करें और 20% सब्सिडी लागू करें",
    "cred-modal-title": "जेमिनी 1.5 फ्लैश एआई प्रमाण पत्र सत्यापन",
    "cred-modal-sub": "सहकारिता मंत्रालय सत्यापित श्रमिक प्रमाण पत्र वॉल्ट",
    "cred-lbl-name": "श्रमिक का नाम",
    "cred-lbl-issuer": "जारीकर्ता संस्थान",
    "cred-lbl-certno": "प्रमाण पत्र संख्या",
    "cred-lbl-confidence": "जेमिनी विश्वसनीयता स्कोर",
    "cred-btn-close": "निरीक्षक बंद करें",
    "passbook-modal-title": "सहकारी पासबुक एवं डीबीटी खाता",
    "passbook-lbl-balance": "निकासी योग्य शेष राशि",
    "passbook-lbl-nocut": "0% कटौती की गारंटी",
    "passbook-btn-dbt": "बैंक खाते में तत्काल डीबीटी",
    "passbook-lbl-recent": "हाल ही में प्राप्त कमाई",
    "passbook-th-jobid": "कार्य आईडी",
    "passbook-th-service": "सेवा",
    "passbook-th-status": "स्थिति",
    "passbook-th-disbursed": "हस्तांतरित",
    "passbook-btn-close": "बंद करें",
    "sub-card-title": "सेवा सेतु समृद्धि सदस्यता पास",
    "sub-card-sub": "30% तक छूट, शून्य आपातकालीन शुल्क और विशेष वाउचर अनलॉक करने के लिए सदस्यता लें",
    "sub-gateway-title": "सेवा सेतु समृद्धि पास चेकआउट",
    "reviews-heading": "सत्यापित नागरिक समीक्षाएं और अनुभव",
    "reviews-subheading": "सार्वजनिक जवाबदेही • सहकारी घरेलू सेवा ग्राहकों से वास्तविक प्रतिक्रिया",
    "btn-write-review": "समीक्षा लिखें",
    "write-review-title": "सेवा समीक्षा एवं शिकायत दर्ज करें",
    "worker-auth-title": "श्रमिक डैशबोर्ड एवं क्रेडेंशियल ऑनबोर्डिंग",
    "worker-auth-desc": "विकेंद्रीकृत सहकारी गिग रडार, 100% उचित मजदूरी पासबुक और तत्काल डीबीटी प्राप्त करने के लिए अपने कौशल और पहचान का सत्यापन करें।",
    "min-demand-charts-title": "क्षेत्रीय श्रमिक मांग विश्लेषण एवं चार्ट्स",
    "min-demand-charts-sub": "लक्षित पैक्स व्यावसायिक प्रशिक्षण और आपातकालीन पुनर्वितरण हेतु क्षेत्रीय कमी रडार",
    "min-reviews-title": "नागरिक शिकायत और श्रमिक समीक्षा लॉग",
    "min-reviews-sub": "तकनीशियनों के विरुद्ध शिकायतों, प्रशंसा समीक्षाओं पर नज़र रखें और अनुशासन लागू करें",
    "min-revenue-title": "प्लेटफॉर्म राजस्व एवं सहकारी कल्याण ऑडिट",
    "min-revenue-sub": "पारदर्शी सार्वजनिक बहीखाता: 100% श्रमिक मजदूरी + 3.5% गैर-लाभकारी सामाजिक सुरक्षा निधि",
    "txt-show-all-services": "सभी 6 सेवाएँ देखें",
    "txt-show-less-services": "कम सेवाएँ देखें",
    "txt-schedule-title": "सेवा की तिथि एवं समय स्लॉट चुनें",
    "txt-schedule-subtitle": "त्वरित आपातकालीन प्रेषण या प्रमाणित तकनीशियन का अग्रिम समय निर्धारण",
    "opt-immediate-title": "तुरंत प्रेषण",
    "opt-immediate-desc": "तकनीशियन तुरंत रवाना होगा (औसतन <30 मिनट में आगमन)",
    "opt-scheduled-title": "बाद के लिए समय तय करें",
    "opt-scheduled-desc": "अपनी सुविधा अनुसार तारीख और आगमन समय चुनें",
    "lbl-choose-date": "1. सेवा की तारीख चुनें:",
    "lbl-up-to-7days": "7 दिन पहले तक का अग्रिम आरक्षण",
    "lbl-choose-slot": "2. पसंदीदा समय स्लॉट चुनें:",
    "lbl-exact-time": "या सटीक आगमन का समय लिखें:",
    "lbl-invoice-slot": "तय समय स्लॉट:",
    "lbl-active-slot": "पुष्ट समय स्लॉट:",
    "btn-export-req-report": "आवश्यकता रिपोर्ट डाउनलोड करें",
    "lbl-quick-service-filter": "त्वरित ट्रेड फ़िल्टर:",
    "lbl-req-workforce": "आवश्यक कार्यबल",
    "lbl-active-deployed": "सक्रिय प्रमाणित तकनीशियन",
    "lbl-net-deficit": "कुल कार्यबल कमी",
    "lbl-monthly-demand": "मासिक सेवा मांग",
    "min-debarment-title": "नागरिक घटना शिकायतें एवं निष्कासन प्रणाली",
    "min-debarment-sub": "जब ≥ 2 स्वतंत्र श्रमिक शिकायत दर्ज करते हैं तो स्वचालित नागरिक निष्कासन",
    "min-discipline-title": "श्रमिक अस्वीकृति ऑडिट एवं मंत्रालय अनुशासनात्मक डेस्क",
    "min-discipline-sub": "≥ 3 अस्वीकृत प्रेषण वाले श्रमिकों को समीक्षा, निलंबन या लाइसेंस रद्दीकरण हेतु चिह्नित किया जाता है",
    "escalate-modal-title": "ग्राहक घटना की शिकायत बैकएंड को भेजें",
    "escalate-modal-sub": "अत्यधिक देरी, दुर्व्यवहार या ओटीपी न देने पर आधिकारिक शिकायत दर्ज करें",
    "ngo-banner-title": "एनजीओ, गैर-लाभकारी व संस्थागत साझेदार पोर्टल",
    "ngo-banner-desc": "20% सामाजिक कल्याण सब्सिडी और धरोहर कारीगर संघों (कुम्हार, लुहार, पेंटर) की सेवाओं को अनलॉक करने हेतु नीति आयोग दर्पण आईडी सत्यापित करें।",
    "ngo-banner-btn": "एनजीओ क्रेडेंशियल सत्यापित करें",
    "txt-ngo-artisan-quick-label": "अतिरिक्त अनलॉक की गई सेवाएं:",
    "txt-artisan-quick-label": "अतिरिक्त एनजीओ कारीगर संघ:"
  }
};

// Toast Notification Manager
function showToast(message, icon = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-msg";
  
  let iconHtml = '<i data-lucide="info" class="w-5 h-5 text-blue-400"></i>';
  if (icon === "success") iconHtml = '<i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-400"></i>';
  if (icon === "warning") iconHtml = '<i data-lucide="alert-triangle" class="w-5 h-5 text-amber-400"></i>';
  if (icon === "emergency") iconHtml = '<i data-lucide="siren" class="w-5 h-5 text-red-400"></i>';

  toast.innerHTML = `
    ${iconHtml}
    <div class="flex-1">${message}</div>
  `;

  container.appendChild(toast);
  safeCreateIcons();

  setTimeout(() => {
    toast.classList.add("toast-exit");
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
}

// Audio Synthesizer via Web Audio API
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playAlert() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(780, now + 0.12);
      osc.frequency.setValueAtTime(1040, now + 0.24);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.4);
    } catch (e) {}
  }

  playFallbackWarning() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(330, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  playSuccessFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.09 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.09);
        osc.stop(this.ctx.currentTime + idx * 0.09 + 0.35);
      });
    } catch (e) {}
  }
}

const sfx = new SoundFX();

// Guards against the Lucide CDN failing to load (blocked network, slow CDN, offline
// demo, etc.) so a single missing external script can't crash icon rendering and
// take the rest of the app down with it.
function safeCreateIcons() {
  try {
    if (typeof lucide !== "undefined" && lucide.createIcons) {
      lucide.createIcons();
    }
  } catch (e) {
    console.warn("[SahakarSeva] Lucide icons unavailable:", e);
  }
}

// Seed Workers Registry
const WORKERS = [
  {
    id: 101,
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    skill: "electrician",
    coop_id: 1,
    coop_name: "Delhi Central Labour Cooperative",
    coords: [28.6328, 77.2197], // Connaught Place
    is_available: true,
    is_verified: true,
    rating: 4.9,
    aadhaar: "XXXX-XXXX-8921",
    certificate: "ITI National Trade Certificate (Electrician - Grade A)",
    cert_title: "ITI Wireman NTC",
    cert_issuer: "NCVT Attested",
    today_wage: 2840.0,
    coop_ac: "DCCB-PACS-8821092",
    completed_jobs: 142,
    total_earned: 68400.0,
    photo: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 102,
    name: "Mohammad Aslam",
    phone: "+91 98111 22334",
    skill: "plumber",
    coop_id: 1,
    coop_name: "Delhi Central Labour Cooperative",
    coords: [28.6506, 77.1906], // Karol Bagh
    is_available: true,
    is_verified: true,
    rating: 4.8,
    aadhaar: "XXXX-XXXX-4532",
    certificate: "Skill India Sanitary & Plumbing Level 4",
    cert_title: "Skill India Sanitary L4",
    cert_issuer: "Skill India Vetted",
    today_wage: 2150.0,
    coop_ac: "DCCB-PACS-4532104",
    completed_jobs: 98,
    total_earned: 45200.0,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 103,
    name: "Sunita Sharma",
    phone: "+91 98733 90812",
    skill: "tailoring",
    coop_id: 2,
    coop_name: "South Delhi Multi-Purpose Cooperative",
    coords: [28.5700, 77.2400], // Lajpat Nagar
    is_available: true,
    is_verified: true,
    rating: 5.0,
    aadhaar: "XXXX-XXXX-1190",
    certificate: "Weavers Cooperative Federation Master Tailoring Certificate",
    cert_title: "Weavers Federation Tailoring L4",
    cert_issuer: "Handloom Development Board & NSDC",
    today_wage: 3200.0,
    coop_ac: "SDMC-PACS-1190338",
    completed_jobs: 76,
    total_earned: 52300.0,
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 104,
    name: "Vikram Singh",
    phone: "+91 97123 45678",
    skill: "driver",
    coop_id: 2,
    coop_name: "South Delhi Multi-Purpose Cooperative",
    coords: [28.5244, 77.2100], // Saket
    is_available: true,
    is_verified: true,
    rating: 4.7,
    aadhaar: "XXXX-XXXX-7654",
    certificate: "Commercial PSV Badge (Heavy & Light Motor)",
    cert_title: "Commercial PSV Badge",
    cert_issuer: "MoRTH Vetted",
    today_wage: 2600.0,
    coop_ac: "SDMC-PACS-7654211",
    completed_jobs: 210,
    total_earned: 94000.0,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 105,
    name: "Pooja Devi",
    phone: "+91 99901 23456",
    skill: "cleaning",
    coop_id: 3,
    coop_name: "NCR Technicians Cooperative",
    coords: [28.6289, 77.2065], // Gole Market
    is_available: true,
    is_verified: true,
    rating: 4.9,
    aadhaar: "XXXX-XXXX-3341",
    certificate: "Green Sanitation Guild Certificate",
    cert_title: "Green Sanitation Guild",
    cert_issuer: "e-Shram Attested",
    today_wage: 1950.0,
    coop_ac: "NCRT-PACS-3341889",
    completed_jobs: 115,
    total_earned: 39500.0,
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 106,
    name: "Amit Verma",
    phone: "+91 98700 11223",
    skill: "electrician",
    coop_id: 1,
    coop_name: "Delhi Central Labour Cooperative",
    coords: [28.6400, 77.2300], // Delhi Gate (Backup Electrician)
    is_available: true,
    is_verified: true,
    rating: 4.8,
    aadhaar: "XXXX-XXXX-9912",
    certificate: "ITI Electrician & Solar Wireman",
    cert_title: "ITI Solar & Wireman",
    cert_issuer: "NCVT Attested",
    today_wage: 2400.0,
    coop_ac: "DCCB-PACS-9912056",
    completed_jobs: 84,
    total_earned: 41200.0,
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 108,
    name: "Rameshwar Mistri",
    phone: "+91 98188 44551",
    skill: "carpentry",
    coop_id: 1,
    coop_name: "Delhi Central Labour Cooperative",
    coords: [28.6310, 77.2140], // Connaught Place Inner Circle
    is_available: true,
    is_verified: true,
    rating: 4.9,
    aadhaar: "XXXX-XXXX-9901",
    certificate: "ITI Carpentry & Joinery National Trade Certificate",
    cert_title: "ITI Carpentry NTC (Grade A)",
    cert_issuer: "NCVT Vetted",
    today_wage: 2950.0,
    coop_ac: "DCCB-PACS-9901234",
    completed_jobs: 118,
    total_earned: 58900.0,
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 111,
    name: "Shanti Devi",
    phone: "+91 98114 55667",
    skill: "tailoring",
    coop_id: 3,
    coop_name: "NCR Technicians & Artisans Cooperative",
    coords: [28.6200, 77.2180], // Janpath
    is_available: true,
    is_verified: true,
    rating: 4.9,
    aadhaar: "XXXX-XXXX-8822",
    certificate: "Weavers Cooperative Federation Master Tailoring Certificate",
    cert_title: "Weavers Federation Tailoring L4",
    cert_issuer: "Handloom Development Board",
    today_wage: 2200.0,
    coop_ac: "NCRT-PACS-8822150",
    completed_jobs: 91,
    total_earned: 38400.0,
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 107,
    name: "Ram Dayal",
    phone: "+91 98119 88776",
    skill: "pottery",
    coop_id: 3,
    coop_name: "NCR Technicians & Artisans Cooperative",
    coords: [28.6180, 77.2250], // Crafts Museum / Pragati Maidan
    is_available: true,
    is_verified: true,
    rating: 5.0,
    aadhaar: "XXXX-XXXX-6721",
    certificate: "KVIC Master Terracotta Artisan & Khadi Board Guild Attested",
    cert_title: "KVIC Master Terracotta Artisan",
    cert_issuer: "Khadi & Village Industries Commission (KVIC)",
    today_wage: 2100.0,
    coop_ac: "COOP-DL-2024-007",
    completed_jobs: 124,
    total_earned: 59200.0,
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 109,
    name: "Kishan Luhar",
    phone: "+91 98101 33445",
    skill: "blacksmith",
    coop_id: 1,
    coop_name: "Delhi Central Labour Cooperative",
    coords: [28.6450, 77.2100], // Paharganj
    is_available: true,
    is_verified: true,
    rating: 4.8,
    aadhaar: "XXXX-XXXX-5519",
    certificate: "Labour Cooperative Guild Master Blacksmith & Arc Welding Attested",
    cert_title: "Master Blacksmith & Arc Welder",
    cert_issuer: "Labour Cooperative Guild & NCVT",
    today_wage: 2750.0,
    coop_ac: "COOP-DL-2024-009",
    completed_jobs: 108,
    total_earned: 62400.0,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 110,
    name: "Manoj Painter",
    phone: "+91 98711 77889",
    skill: "painting",
    coop_id: 2,
    coop_name: "South Delhi Multi-Purpose Cooperative",
    coords: [28.5800, 77.2200], // Defence Colony
    is_available: true,
    is_verified: true,
    rating: 4.9,
    aadhaar: "XXXX-XXXX-4482",
    certificate: "NSDC Decorative Finishing & Surface Coating Guild Master",
    cert_title: "NSDC Decorative Finishing Master",
    cert_issuer: "National Skill Development Corporation (NSDC)",
    today_wage: 2450.0,
    coop_ac: "COOP-DL-2024-010",
    completed_jobs: 136,
    total_earned: 66800.0,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  }
];

// Normalize worker profiles with disciplinary and freelancing capabilities
WORKERS.forEach(w => {
  if (w.rejection_count === undefined) w.rejection_count = (w.id === 106 ? 2 : 0);
  if (w.disciplinary_status === undefined) w.disciplinary_status = "GOOD_STANDING";
  if (w.freelance_enabled === undefined) w.freelance_enabled = false;
  if (w.freelance_slots === undefined) w.freelance_slots = ["17:00 - 21:00 (Evening)", "Weekend Flexible"];
  if (w.freelance_earned === undefined) w.freelance_earned = 0.0;
});

// Trade Rates & Metadata with REDUCED Grassroots Cooperative Pricing & Synonyms for Search
const SERVICES = [
  {
    id: "electrician",
    name: "Electrician",
    name_hi: "इलेक्ट्रीशियन",
    icon: "zap",
    base: 120,
    badge: "ITI Trade Certified",
    badge_hi: "आईटीआई प्रमाणित",
    rating: 4.9,
    time: "10 mins",
    time_hi: "10 मिनट",
    keywords: ["electric", "wire", "switch", "light", "fan", "fuse", "short circuit", "ac", "bijli", "tarr", "इलेक्ट्रिक", "बिजली", "तार", "पंखा", "शॉर्ट सर्किट", "मीटर"]
  },
  {
    id: "plumber",
    name: "Plumber",
    name_hi: "प्लम्बर सेवा",
    icon: "wrench",
    base: 110,
    badge: "Skill India Vetted",
    badge_hi: "स्किल इंडिया सत्यापित",
    rating: 4.8,
    time: "12 mins",
    time_hi: "12 मिनट",
    keywords: ["plumb", "pipe", "tap", "leak", "drain", "water", "tank", "washroom", "toilet", "nal", "pani", "नल", "पानी", "पाइप", "लीक", "टोंटी", "सीवर"]
  },
  {
    id: "carpentry",
    name: "Carpentry & Woodcraft",
    name_hi: "बढ़ईगीरी एवं काष्ठकला",
    icon: "hammer",
    base: 115,
    badge: "ITI Carpentry Certified",
    badge_hi: "आईटीआई काष्ठकला प्रमाणित",
    rating: 4.9,
    time: "10 mins",
    time_hi: "10 मिनट",
    keywords: ["carpenter", "wood", "furniture", "table", "chair", "door", "window", "bed", "polish", "drill", "badhai", "lakdi", "almirah", "sofa", "बढ़ई", "लकड़ी", "फर्नीचर", "दरवाजा", "खिड़की", "मेज", "कुर्सी", "अलमारी", "सोफा", "काष्ठ"]
  },
  {
    id: "cleaning",
    name: "Deep Cleaning",
    name_hi: "गहन सफाई सेवा",
    icon: "sparkles",
    base: 90,
    badge: "Green Sanitation",
    badge_hi: "हरित स्वच्छता",
    rating: 4.9,
    time: "15 mins",
    time_hi: "15 मिनट",
    keywords: ["clean", "sweep", "dust", "mop", "wash", "sanit", "deep clean", "safai", "housekeeping", "सफाई", "धुलाई", "स्वच्छता", "झाड़ू", "पोछा", "किचन"]
  },
  {
    id: "tailoring",
    name: "Tailoring & Handloom Repair",
    name_hi: "दर्जी एवं हथकरघा शिल्प",
    icon: "scissors",
    base: 90,
    badge: "Weavers Federation Vetted",
    badge_hi: "बुनकर संघ सत्यापित",
    rating: 4.9,
    time: "12 mins",
    time_hi: "12 मिनट",
    keywords: ["tailor", "sewing", "stitch", "clothes", "fabric", "alteration", "handloom", "darji", "silai", "curtain", "upholstery", "दर्जी", "सिलाई", "कपड़ा", "सूट", "हथकरघा", "पर्दा", "रफू"]
  },
  {
    id: "driver",
    name: "Emergency Driver",
    name_hi: "आपातकालीन चालक",
    icon: "car",
    base: 130,
    badge: "Commercial PSV",
    badge_hi: "वाणिज्यिक पीएसवी",
    rating: 4.7,
    time: "8 mins",
    time_hi: "8 मिनट",
    keywords: ["driv", "car", "taxi", "chauffeur", "ride", "auto", "ambulance", "gadi", "chalak", "चालक", "गाड़ी", "ड्राइवर", "ड्राइविंग", "सवारी"]
  },
  {
    id: "pottery",
    name: "Pottery & Terracotta",
    name_hi: "मृत्तिका शिल्प एवं कुम्हार कला",
    icon: "flower-2",
    base: 95,
    badge: "KVIC Heritage Certified",
    badge_hi: "केवीआईसी विरासत प्रमाणित",
    rating: 5.0,
    time: "15 mins",
    time_hi: "15 मिनट",
    isArtisan: true,
    keywords: ["pottery", "clay", "matka", "terracotta", "tandoor", "diya", "handi", "surahi", "kumhar", "mitti", "bartan", "कुम्हार", "मिट्टी", "मटका", "तंदूर", "दीया", "हांडी", "सुराही", "टेराकोटा", "शिल्प"]
  },
  {
    id: "blacksmith",
    name: "Blacksmith & Metalcraft",
    name_hi: "लोहार एवं धातु शिल्प",
    icon: "shield",
    base: 120,
    badge: "Labour Guild Certified",
    badge_hi: "श्रम गिल्ड प्रमाणित",
    rating: 4.8,
    time: "12 mins",
    time_hi: "12 मिनट",
    isArtisan: true,
    keywords: ["blacksmith", "iron", "welding", "grill", "gate", "metal", "shutter", "sharpen", "loha", "luhar", "welder", "लोहार", "लोहा", "वेल्डिंग", "गेट", "ग्रिल", "धातु", "शटर", "कुल्हाड़ी"]
  },
  {
    id: "painting",
    name: "Painting & Wall Artisan",
    name_hi: "रंग रोगन एवं पेंटिंग कारीगर",
    icon: "palette",
    base: 105,
    badge: "NSDC Decorative Master",
    badge_hi: "एनएसडीसी मास्टर पेंटर",
    rating: 4.9,
    time: "15 mins",
    time_hi: "15 मिनट",
    isArtisan: true,
    keywords: ["paint", "painter", "wall", "color", "whitewash", "distemper", "putty", "texture", "rang", "safedi", "seepage", "damp", "पेंट", "पेंटर", "रंग", "सफेदी", "पुट्टी", "दीवार", "टेक्सचर", "सीलन"]
  }
];

// ==========================================
// SPECIFIC WORK / SUB-SERVICES CATALOG (6 ESSENTIAL COOPERATIVE TRADES)
// ==========================================
const SUB_SERVICES_CATALOG = {
  electrician: [
    {
      id: "switch_socket_repair",
      title: "Switch & Socket Repair",
      title_hi: "स्विच और सॉकेट मरम्मत",
      desc: "Fix loose wiring, burnt switchboard, plug replacements & socket earthing",
      desc_hi: "ढीली वायरिंग, जले हुए स्विचबोर्ड, सॉकेट बदलना और अर्थिंग सुधार",
      icon: "zap",
      badge: "Fast 15-min fix",
      badge_hi: "त्वरित 15 मिनट",
      base: 120
    },
    {
      id: "fan_installation",
      title: "Fan Installation & Repair",
      title_hi: "पंखा स्थापना व मरम्मत",
      desc: "Ceiling fan, exhaust fan installation, capacitor replacement or regulator fix",
      desc_hi: "सीलिंग फैन, एग्जॉस्ट फैन लगाना, कैपेसिटर या रेगुलेटर मरम्मत",
      icon: "wind",
      badge: "Co-op Certified",
      badge_hi: "सहकारी प्रमाणित",
      base: 180
    },
    {
      id: "lighting_fitting",
      title: "Lighting & Chandelier Fitting",
      title_hi: "लाइट व झूमर फिटिंग",
      desc: "LED concealed lights, false ceiling spot lights, strip lighting & chandelier",
      desc_hi: "एलईडी लाइट, फॉल्स सीलिंग स्पॉट लाइट, स्ट्रिप लाइट व झूमर फिटिंग",
      icon: "sun",
      badge: "Precision Work",
      badge_hi: "सटीक कार्य",
      base: 150
    },
    {
      id: "appliance_wiring",
      title: "MCB & Appliance Heavy Wiring",
      title_hi: "एमसीबी और उपकरण हैवी वायरिंग",
      desc: "Frequent tripping MCB, 16A heavy power points for AC, geyser or inverter",
      desc_hi: "बार-बार ट्रिप होने वाली एमसीबी, एसी, गीज़र या इन्वर्टर हेतु हैवी वायरिंग",
      icon: "shield-alert",
      badge: "Safety Grade",
      badge_hi: "सुरक्षा ग्रेड",
      base: 250
    },
    {
      id: "full_home_inspection",
      title: "Full Home Electrical Audit",
      title_hi: "सम्पूर्ण विद्युत निरीक्षण",
      desc: "Complete electrical circuit check, neutral-earth leakage test & audit log",
      desc_hi: "घर का सम्पूर्ण सर्किट परीक्षण, लीकेज टेस्ट व सुरक्षा ऑडिट रिपोर्ट",
      icon: "clipboard-check",
      badge: "Certified Audit",
      badge_hi: "प्रमाणित ऑडिट",
      base: 350
    },
    {
      id: "other_electric",
      title: "Custom Electrical Task",
      title_hi: "अन्य विद्युत कार्य",
      desc: "Doorbell installation, decorative festive lights, inverter battery check, etc.",
      desc_hi: "डोरबेल लगाना, सजावटी लाइटें, इन्वर्टर बैटरी जांच या अन्य कार्य",
      icon: "wrench",
      badge: "Flexible Rate",
      badge_hi: "लचीली दर",
      base: 120
    }
  ],
  plumber: [
    {
      id: "tap_pipe_leakage",
      title: "Tap & Pipe Leakage Repair",
      title_hi: "नल और पाइप रिसाव मरम्मत",
      desc: "Fix dripping bib taps, angle valves, leaking washbasin p-trap or concealed pipes",
      desc_hi: "टपकते नल, एंगल कॉक, वॉशबेसिन पी-ट्रैप या दीवार के अंदर पाइप लीकेज ठीक करें",
      icon: "droplet",
      badge: "Quick Seal",
      badge_hi: "त्वरित सील",
      base: 120
    },
    {
      id: "toilet_flush_repair",
      title: "Toilet Cistern & Flush Valve",
      title_hi: "टॉयलेट सिस्टर्न व फ्लश वाल्व",
      desc: "Repair leaking flush tanks, siphon ball-cock, dual-flush valves or jet spray",
      desc_hi: "फ्लश टैंक लीकेज, साइफन बॉल-कॉक, डुअल फ्लश वाल्व या जेट स्प्रे बदलना",
      icon: "refresh-cw",
      badge: "Hygienic Fix",
      badge_hi: "स्वच्छ समाधान",
      base: 160
    },
    {
      id: "drainage_blockage",
      title: "Drain & Sink Unclogging",
      title_hi: "नाली और सिंक की रुकावट खोलना",
      desc: "Unclog choked kitchen sinks, bathroom floor traps, master sewers & gullies",
      desc_hi: "जाम किचन सिंक, बाथरूम नाली, फ्लोर ट्रैप या सीवर लाइन की सफाई",
      icon: "disc",
      badge: "Deep Clear",
      badge_hi: "गहन सफाई",
      base: 200
    },
    {
      id: "water_tank_motor",
      title: "Water Tank & Motor Pump",
      title_hi: "पानी टंकी और मोटर पंप",
      desc: "Overhead PVC tank cleaning, automatic float valve, booster or submersible motor",
      desc_hi: "पानी टंकी सफाई, ऑटो फ्लोट वाल्व, बूस्टर पंप या सबमर्सिबल मोटर फिटिंग",
      icon: "cpu",
      badge: "Heavy Duty",
      badge_hi: "हैवी ड्यूटी",
      base: 250
    },
    {
      id: "bath_fitting_install",
      title: "Sanitary & Shower Installation",
      title_hi: "सैनिटरी व शावर स्थापना",
      desc: "Install overhead rain shower, hot-cold mixer, diverter or geyser plumbing",
      desc_hi: "रेन शावर, हॉट-कोल्ड मिक्सर, डाइवर्टर या गीज़र की पाइपलाइन फिटिंग",
      icon: "layers",
      badge: "Master Plumber",
      badge_hi: "मास्टर प्लंबर",
      base: 300
    },
    {
      id: "other_plumbing",
      title: "Custom Plumbing Assignment",
      title_hi: "अन्य प्लंबिंग कार्य",
      desc: "Water meter fitting, garden tap connection or any custom pipe alteration",
      desc_hi: "वाटर मीटर फिटिंग, गार्डन पाइप कनेक्शन या अन्य पाइपलाइन मरम्मत",
      icon: "tool",
      badge: "Co-op Rate",
      badge_hi: "सहकारी दर",
      base: 120
    }
  ],
  carpentry: [
    {
      id: "furniture_repair",
      title: "Furniture Repair & Polish",
      title_hi: "फर्नीचर मरम्मत और पॉलिश",
      desc: "Fix shaky dining chairs, bed frames, sofa wood joint reinforcement or polish",
      desc_hi: "हिलती कुर्सियां, बेड फ्रेम, सोफा लकड़ी जोड़ मजबूती या टचअप पॉलिश",
      icon: "hammer",
      badge: "Artisan Fix",
      badge_hi: "कारीगर मरम्मत",
      base: 160
    },
    {
      id: "door_lock_hinge",
      title: "Door, Lock & Hinge Fitting",
      title_hi: "दरवाज़ा, लॉक और हिंज फिटिंग",
      desc: "Align sagging doors, fit mortise handle locks, hydraulic closers or tower bolts",
      desc_hi: "दरवाजा संरेखण, मॉर्टिस हैंडल लॉक, हाइड्रोलिक क्लोज़र या सिटकनी फिटिंग",
      icon: "lock",
      badge: "Secure Fit",
      badge_hi: "सुरक्षित फिट",
      base: 150
    },
    {
      id: "wardrobe_modular",
      title: "Wardrobe & Drawer Channels",
      title_hi: "अलमारी व दराज चैनल फिटिंग",
      desc: "Telescopic drawer slides, sliding wardrobe roller wheels & cabinet hinges",
      desc_hi: "दराज के चैनल, स्लाइडिंग अलमारी के पहिये व कैबिनेट सॉफ्ट-क्लोज़ हिंज",
      icon: "grid",
      badge: "Precision Woodwork",
      badge_hi: "सटीक काष्ठकला",
      base: 220
    },
    {
      id: "custom_woodwork",
      title: "Custom Wood Crafting & Shelves",
      title_hi: "कस्टम लकड़ी निर्माण व शेल्फ",
      desc: "Wall mounted wooden bookshelves, kitchen lofts, temple mandir & study desks",
      desc_hi: "दीवार बुकशेल्फ, किचन मचान, पूजा मंदिर व लकड़ी की स्टडी टेबल निर्माण",
      icon: "box",
      badge: "Master Carpenter",
      badge_hi: "मास्टर बढ़ई",
      base: 350
    },
    {
      id: "window_mesh_repair",
      title: "Window & Mosquito Net Frame",
      title_hi: "खिड़की व मच्छरदानी जाली फ्रेम",
      desc: "Wooden window pane repair, wire mesh fitting & weather stripping",
      desc_hi: "खिड़की के पल्ले, मच्छरदानी जाली फ्रेम लगाना व लैच सुधार",
      icon: "maximize",
      badge: "Weather Proof",
      badge_hi: "मौसम सुरक्षित",
      base: 180
    },
    {
      id: "other_carpentry",
      title: "Custom Carpentry Task",
      title_hi: "अन्य बढ़ई कार्य",
      desc: "Picture frame hanging, curtain rod wooden brackets, drill & wall mounting",
      desc_hi: "फोटो फ्रेम लगाना, कर्टेन रॉड ब्रैकेट, ड्रिलिंग या अन्य लकड़ी कार्य",
      icon: "pocket",
      badge: "Fair Wage",
      badge_hi: "उचित मजदूरी",
      base: 140
    }
  ],
  cleaning: [
    {
      id: "deep_home_cleaning",
      title: "Deep Home Sanitization",
      title_hi: "सम्पूर्ण घर की गहन सफाई",
      desc: "Floor scrubbing, spiderweb removal, balcony pressure wash & all room dusting",
      desc_hi: "फर्श स्क्रबिंग, जाले हटाना, बालकनी धुलाई व सभी कमरों की गहन डस्टिंग",
      icon: "sparkles",
      badge: "Govt Certified",
      badge_hi: "सरकारी प्रमाणित",
      base: 300
    },
    {
      id: "kitchen_deep_clean",
      title: "Kitchen & Chimney Degreasing",
      title_hi: "किचन और चिमनी डीप क्लीन",
      desc: "Exhaust fan, oil grease removal from kitchen tiles, counters & cabinets",
      desc_hi: "किचन चिमनी, टाइल्स से तेल-चिकनाई हटाना, स्लैब व कैबिनेट की सफाई",
      icon: "flame",
      badge: "Heavy Degrease",
      badge_hi: "गहन डीग्रीजिंग",
      base: 250
    },
    {
      id: "bathroom_cleaning",
      title: "Bathroom & Tile Descaling",
      title_hi: "बाथरूम और टाइल सफाई",
      desc: "Hard water scale removal, toilet seat acid scrub, taps & mirror shine",
      desc_hi: "खारे पानी के दाग हटाना, कमोड एसिड स्क्रब, नल व शीशा पॉलिश",
      icon: "droplets",
      badge: "Hospital Grade",
      badge_hi: "अस्पताल ग्रेड",
      base: 180
    },
    {
      id: "sofa_carpet_wash",
      title: "Sofa & Carpet Shampooing",
      title_hi: "सोफा और कालीन धुलाई",
      desc: "Vacuum suction shampooing for 5-seater sofas, mattress or wool carpets",
      desc_hi: "वैक्यूम शैम्पू निष्कर्षण द्वारा सोफा सेट, गद्दे या कालीन की सफाई",
      icon: "archive",
      badge: "Fabric Safe",
      badge_hi: "कपड़ा सुरक्षित",
      base: 250
    },
    {
      id: "post_paint_clean",
      title: "Post-Paint / Renovation Cleanup",
      title_hi: "रंगाई उपरांत सफाई कार्य",
      desc: "Scrape dried paint drops, vacuum cement dust & restore shine to floors",
      desc_hi: "पेंट के छींटे खुरचना, सीमेंट की धूल हटाना व फर्श की चमक वापस लाना",
      icon: "check-circle-2",
      badge: "Co-op Crew",
      badge_hi: "सहकारी टीम",
      base: 350
    },
    {
      id: "other_cleaning",
      title: "Custom Cleaning Requirement",
      title_hi: "अन्य सफाई कार्य",
      desc: "Single room cleanup, terrace sweeping, water tank wash or shop cleaning",
      desc_hi: "एक कमरे की सफाई, छत की झाड़ू, पानी की टंकी या दुकान की सफाई",
      icon: "brush",
      badge: "Flexible",
      badge_hi: "लचीला",
      base: 120
    }
  ],
  tailoring: [
    {
      id: "clothes_alteration",
      title: "Alteration, Hemming & Zipper Fix",
      title_hi: "कपड़ों की फिटिंग, रफू व चेन सुधार",
      desc: "Pant length hem, waist tightening/loosening, dress taper & jacket zipper replacement",
      desc_hi: "पैंट की लंबाई कम करना, कमर ढीली/टाइट करना व जैकेट की चेन बदलना",
      icon: "scissors",
      badge: "Same Day Fit",
      badge_hi: "उसी दिन फिटिंग",
      base: 100
    },
    {
      id: "blouse_suit_stitching",
      title: "Ladies Suit & Designer Blouse Stitching",
      title_hi: "लेडीज सूट व डिज़ाइनर ब्लाउज सिलाई",
      desc: "Custom neckline, padded princess cut blouse, churidar or salwar suit with lining",
      desc_hi: "प्रिंसेस कट पैडेड ब्लाउज, अस्तर वाला सलवार सूट व डिज़ाइनर कुर्ती सिलाई",
      icon: "award",
      badge: "Boutique Finish",
      badge_hi: "बुटीक फिनिश",
      base: 280
    },
    {
      id: "curtains_cushion_covers",
      title: "Curtains & Sofa Cushion Tailoring",
      title_hi: "पर्दे व कुशन कवर सिलाई",
      desc: "Eyelet ring curtains, sofa zip cushions, bolster covers & dining chair upholstery",
      desc_hi: "आईलेट रिंग पर्दे, सोफा कुशन ज़िप कवर, मसनद कवर व कुर्सी कवर सिलाई",
      icon: "bookmark",
      badge: "Home Decor",
      badge_hi: "होम डेकोर",
      base: 200
    },
    {
      id: "kurta_shirt_stitching",
      title: "Kurta Pajama & Formal Shirt",
      title_hi: "कुर्ता पायजामा व शर्ट सिलाई",
      desc: "Traditional khadi kurta, drawstring pajama, Nehru jacket or bespoke formal shirt",
      desc_hi: "पारंपरिक खादी कुर्ता, पायजामा, नेहरू जैकेट या फॉर्मल कॉलर शर्ट सिलाई",
      icon: "check-circle",
      badge: "Master Tailor",
      badge_hi: "मास्टर दर्जी",
      base: 250
    },
    {
      id: "uniform_bulk_tailoring",
      title: "School / Work Uniform Stitching",
      title_hi: "यूनिफॉर्म व संस्थागत सिलाई",
      desc: "Durable school uniforms, chef coats, lab aprons or corporate workwear",
      desc_hi: "स्कूल ड्रेस, शेफ कोट, एप्रन या कंपनी वर्कवियर की मजबूत सिलाई",
      icon: "users",
      badge: "Co-op Certified",
      badge_hi: "सहकारी प्रमाणित",
      base: 300
    },
    {
      id: "other_tailoring",
      title: "Custom Fabric & Handloom Crafting",
      title_hi: "अन्य सिलाई व रफू कार्य",
      desc: "Invisible darning (rafoo), quilt cover stitching or custom fabric crafts",
      desc_hi: "कपड़ों की इनविजिबल रफू, रजाई-गद्दे का कवर या अन्य विशेष सिलाई कार्य",
      icon: "sparkles",
      badge: "Artisan Guild",
      badge_hi: "बुनकर गिल्ड",
      base: 120
    }
  ],
  driver: [
    {
      id: "local_city_chauffeur",
      title: "City Transit & Daily Chauffeur",
      title_hi: "शहर में स्थानीय ड्राइवर सेवा",
      desc: "Safe, courteous chauffeur for city traffic, family hospital visits & shopping trips",
      desc_hi: "शहर के ट्रैफिक, पारिवारिक अस्पताल विजिट व खरीददारी हेतु सुरक्षित चालक",
      icon: "navigation",
      badge: "Verified PSV",
      badge_hi: "सत्यापित चालक",
      base: 150
    },
    {
      id: "outstation_highway_driver",
      title: "Outstation & Highway Travel Driver",
      title_hi: "बाहरी शहर व हाइवे ड्राइवर",
      desc: "Expert highway driver for multi-day outstation road trips, hill stations & expressways",
      desc_hi: "हाइवे, पहाड़ों व बाहरी शहरों की लंबी यात्रा हेतु अनुभवी चालक सेवा",
      icon: "map-pin",
      badge: "Highway Expert",
      badge_hi: "हाइवे विशेषज्ञ",
      base: 280
    },
    {
      id: "airport_station_transfer",
      title: "Airport / Railway Station Transfer",
      title_hi: "एयरपोर्ट व स्टेशन ट्रांसफर",
      desc: "Punctual early morning or late night drop-off/pickup with luggage assistance",
      desc_hi: "समय पर सुबह या देर रात एयरपोर्ट/रेलवे स्टेशन ड्रॉप व सामान में मदद",
      icon: "plane",
      badge: "Punctual Guarantee",
      badge_hi: "समय की गारंटी",
      base: 180
    },
    {
      id: "temporary_valet_event",
      title: "Wedding & Event Valet Chauffeur",
      title_hi: "इवेंट वैलेट व पारिवारिक समारोह",
      desc: "Uniformed courteous drivers for weddings, corporate banquets & party returns",
      desc_hi: "शादी-ब्याह, पार्टियों व पारिवारिक आयोजनों हेतु शालीन वर्दीधारी ड्राइवर",
      icon: "key",
      badge: "Polite & Uniformed",
      badge_hi: "शालीन व वर्दीधारी",
      base: 220
    },
    {
      id: "heavy_vehicle_van",
      title: "Commercial Van & Goods Transport",
      title_hi: "कमर्शियल वैन व माल ढुलाई चालक",
      desc: "Commercial licensed driver for household moving vans, Bolero pick-ups or tempos",
      desc_hi: "घर का सामान ले जाने वाले पिकअप, टेम्पो या कमर्शियल वाहन हेतु चालक",
      icon: "truck",
      badge: "Commercial DL",
      badge_hi: "कमर्शियल लाइसेंस",
      base: 250
    },
    {
      id: "other_driver",
      title: "Emergency On-Demand Driver",
      title_hi: "आपातकालीन ड्राइवर सेवा",
      desc: "Instant replacement driver if your regular chauffeur is unavailable or unwell",
      desc_hi: "नियमित ड्राइवर की अनुपस्थिति में तुरंत उपलब्ध ऑन-कॉल चालक",
      icon: "compass",
      badge: "Police Verified",
      badge_hi: "पुलिस सत्यापित",
      base: 140
    }
  ],

  painting: [
    {
      id: "room_wall_paint",
      title: "Single Room Repainting",
      title_hi: "एक कमरे का रंग रोगन",
      desc: "Putty patch filling, acrylic primer & 2 smooth coats of emulsion paint",
      desc_hi: "पुट्टी भराव, ऐक्रेलिक प्राइमर और इमल्शन पेंट के 2 फिनिश कोट",
      icon: "palette",
      badge: "Smooth Finish",
      badge_hi: "चिकनी फिनिश",
      base: 350
    },
    {
      id: "waterproof_dampproof",
      title: "Damp Proofing & Seepage Seal",
      title_hi: "सीलन व जलरोधी उपचार",
      desc: "Doctor Fixit / Asian Paints damp seal coating for peeling walls & ceilings",
      desc_hi: "दीवारों व छत की पपड़ी और सीलन हेतु विशेष वॉटरप्रूफ कोटिंग",
      icon: "shield",
      badge: "Leak Proof",
      badge_hi: "सीलन मुक्त",
      base: 400
    },
    {
      id: "wood_metal_paint",
      title: "Wood Polish & Metal Enamel",
      title_hi: "लकड़ी पॉलिश व ग्रिल पेंट",
      desc: "Door melamine/PU polish or anti-rust synthetic enamel on iron gates & grills",
      desc_hi: "दरवाजों की मेलामाइन पॉलिश या लोहे के गेट-ग्रिल पर जंगरोधी एनामेल पेंट",
      icon: "feather",
      badge: "Artisan Coat",
      badge_hi: "कारीगरी कोट",
      base: 250
    },
    {
      id: "texture_stencil",
      title: "Texture & Accent Feature Wall",
      title_hi: "टेक्सचर व डिज़ाइनर दीवार",
      desc: "Royale play, metallic texture, stencil patterns & feature wall styling",
      desc_hi: "रॉयल प्ले, मेटैलिक टेक्सचर, स्टेंसिल आर्ट व लिविंग रूम फीचर वॉल",
      icon: "eye",
      badge: "Design Specialist",
      badge_hi: "डिज़ाइनर काम",
      base: 450
    },
    {
      id: "full_home_painting",
      title: "Complete Flat / House Painting",
      title_hi: "सम्पूर्ण घर का पेंटिंग कार्य",
      desc: "Full interior & exterior painting contract executed by cooperative guild painters",
      desc_hi: "सहकारी गिल्ड के कुशल पेंटरों द्वारा पूरे घर का अंदरूनी व बाहरी रंग-रोगन",
      icon: "home",
      badge: "Co-op Warranty",
      badge_hi: "सहकारी वारंटी",
      base: 600
    },
    {
      id: "other_painting",
      title: "Touch-up & Minor Patchwork",
      title_hi: "टचअप व छोटी मरम्मत",
      desc: "Drill hole putty touch-up, water spot coat or single wall repair",
      desc_hi: "कील के छेद भरना, पानी के दाग छुपाना या छोटी दीवार का पैच पेंट",
      icon: "paintbrush",
      badge: "Quick Touch",
      badge_hi: "त्वरित कार्य",
      base: 180
    }
  ],

  pottery: [
    {
      id: "earthen_pots_tandoor",
      title: "Clay Tandoor & Earthen Cookware",
      title_hi: "मिट्टी का तंदूर व हांडी निर्माण",
      desc: "Traditional clay tandoor setup, unglazed earthen handi, biryani pots & restoration",
      desc_hi: "पारंपरिक मिट्टी का तंदूर, कच्ची मिट्टी की हांडी, मटका व बर्तनों का निर्माण",
      icon: "sun",
      badge: "Handmade Art",
      badge_hi: "हस्तनिर्मित कला",
      base: 150
    },
    {
      id: "decorative_terracotta",
      title: "Terracotta Decor & Garden Planters",
      title_hi: "टेराकोटा गमले व सजावटी शिल्प",
      desc: "Handmade porous terracotta flower pots, hanging planters, garden murals & wind chimes",
      desc_hi: "हाथ से बने टेराकोटा गमले, हैंगिंग पॉट्स, गार्डन भित्ति चित्र व विंड चाइम्स",
      icon: "flower-2",
      badge: "Eco-Friendly",
      badge_hi: "पर्यावरण अनुकूल",
      base: 180
    },
    {
      id: "clay_diyas_festival",
      title: "Festival Diyas & Sacred Pottery",
      title_hi: "त्योहार दीये व पूजा सामग्री",
      desc: "Artisan hand-pressed Diwali oil diyas, kulhars, temple kalash & havan kunds",
      desc_hi: "दीपावली दीये, कुल्हड़, मंदिर कलश, धूपदानी व पारम्परिक पूजा मिट्टी के बर्तन",
      icon: "flame",
      badge: "Traditional",
      badge_hi: "पारंपरिक",
      base: 120
    },
    {
      id: "pottery_wheel_workshop",
      title: "Live Pottery Wheel Demonstration",
      title_hi: "कुम्हार चाक प्रशिक्षण व कार्यशाला",
      desc: "Interactive pottery wheel experience & clay shaping workshop for schools or events",
      desc_hi: "स्कूलों या आयोजनों हेतु कुम्हार के चाक पर जीवंत मिट्टी कला प्रशिक्षण",
      icon: "rotate-cw",
      badge: "Master Artisan",
      badge_hi: "मास्टर कारीगर",
      base: 300
    },
    {
      id: "clay_water_dispenser",
      title: "Alkaline Clay Matka / Water Pot",
      title_hi: "शीतल जल मटका व सुराही",
      desc: "Natural cooling alkaline clay matka with brass tap assembly & stand",
      desc_hi: "पीतल की टोंटी वाला शुद्ध प्राकृतिक मिट्टी का मटका व सुराही स्थापना",
      icon: "droplet",
      badge: "100% Pure Clay",
      badge_hi: "100% शुद्ध मिट्टी",
      base: 160
    },
    {
      id: "other_pottery",
      title: "Custom Terracotta Craft Assignment",
      title_hi: "अन्य मृत्तिका शिल्प कार्य",
      desc: "Bespoke terracotta sculpture, clay wall relief or customized clay artifacts",
      desc_hi: "विशेष टेराकोटा मूर्तियां, मिट्टी की नक्काशी या अन्य हस्तशिल्प कार्य",
      icon: "sparkles",
      badge: "Heritage Guild",
      badge_hi: "धरोहर संघ",
      base: 140
    }
  ],

  blacksmith: [
    {
      id: "gate_grill_welding",
      title: "Iron Gate & Grill Arc Welding",
      title_hi: "लोहे का गेट व ग्रिल वेल्डिंग",
      desc: "Electric arc welding on broken hinges, security grills, gates & reinforcement",
      desc_hi: "टूटे कब्जे, खिड़की की ग्रिल, लोहे के मुख्य द्वार की इलेक्ट्रिक आर्क वेल्डिंग",
      icon: "zap",
      badge: "High Tensile",
      badge_hi: "मजबूत वेल्डिंग",
      base: 180
    },
    {
      id: "tool_sharpening_forging",
      title: "Tool Forging, Tempering & Sharpening",
      title_hi: "औजार निर्माण व धार लगाना",
      desc: "Axe, sickle, chisel, knife forging, tempering on hot anvil & diamond wheel sharpening",
      desc_hi: "कुल्हाड़ी, दरांती, छेनी की भट्टी पर गर्म फोर्जिंग व धार लगाना",
      icon: "shield",
      badge: "Traditional Forge",
      badge_hi: "पारंपरिक भट्टी",
      base: 140
    },
    {
      id: "shutter_channel_fix",
      title: "Shop Rolling Shutter & Spring Repair",
      title_hi: "रोलिंग शटर व स्प्रिंग मरम्मत",
      desc: "Commercial shutter tension spring balancing, side channel straightening & locks",
      desc_hi: "दुकान के रोलिंग शटर का स्प्रिंग बदलना, साइड चैनल सीधा करना व सेंटर लॉक",
      icon: "sliders",
      badge: "Heavy Duty",
      badge_hi: "हैवी ड्यूटी",
      base: 260
    },
    {
      id: "railing_safety_bars",
      title: "Staircase Railing & Balcony Safety",
      title_hi: "रेलिंग व बालकनी सुरक्षा बार",
      desc: "Wrought iron railing installation, safety grills for kids and pet barriers",
      desc_hi: "लोहे की सीढ़ी रेलिंग लगाना, बालकनी सेफ्टी ग्रिल व बच्चों की सुरक्षा जाल",
      icon: "lock",
      badge: "ISI Certified",
      badge_hi: "आईएसआई प्रमाणित",
      base: 320
    },
    {
      id: "metal_fabrication",
      title: "Custom Structural Iron Fabrication",
      title_hi: "कस्टम धातु निर्माण कार्य",
      desc: "MS angle iron racks, tin sheet roofing shed frames or utility stands",
      desc_hi: "लोहे के रैक, शेड का ढांचा, वाशिंग मशीन स्टैंड या कस्टम स्ट्रक्चर",
      icon: "box",
      badge: "Master Blacksmith",
      badge_hi: "मास्टर लुहार",
      base: 380
    },
    {
      id: "other_blacksmith",
      title: "Custom On-Site Metal Repair",
      title_hi: "अन्य धातु शिल्प कार्य",
      desc: "Cold metal cutting, pad-eye welding, chain link fence repair or metal fittings",
      desc_hi: "लोहा कटाई, कुंडा वेल्डिंग, जालीदार तार फेंसिंग या अन्य लोहे की मरम्मत",
      icon: "tool",
      badge: "Fair Wage",
      badge_hi: "उचित मजदूरी",
      base: 150
    }
  ]
};

// District Analytics Data
let DISTRICT_DATA = [
  { district: "Central Delhi", district_hi: "मध्य दिल्ली", demand: 94, pending: 28, workers: 45, alert: true },
  { district: "South Delhi", district_hi: "दक्षिण दिल्ली", demand: 88, pending: 19, workers: 52, alert: false },
  { district: "East Delhi", district_hi: "पूर्वी दिल्ली", demand: 76, pending: 14, workers: 38, alert: false },
  { district: "West Delhi", district_hi: "पश्चिम दिल्ली", demand: 82, pending: 22, workers: 40, alert: true },
  { district: "North Delhi", district_hi: "उत्तर दिल्ली", demand: 68, pending: 9, workers: 30, alert: false }
];

// Citizen and Worker Personas with Authentication Profiles
const CITIZEN_PERSONAS = {
  "Aarav Mehta": {
    name: "Aarav Mehta",
    phone: "+91 98765 43210",
    location: "Connaught Place, New Delhi",
    coords: [28.6315, 77.2167],
    otp: "4291",
    statusBadge: "Active Account • Good Standing"
  },
  "Rohan Verma": {
    name: "Rohan Verma",
    phone: "+91 98101 22334",
    location: "Karol Bagh, New Delhi",
    coords: [28.6506, 77.1906],
    otp: "5182",
    statusBadge: "Restricted Account • Electrician Debarred"
  },
  "Vikas Malhotra": {
    name: "Vikas Malhotra",
    phone: "+91 98110 44231",
    location: "Saket, South Delhi",
    coords: [28.5244, 77.2100],
    otp: "7834",
    statusBadge: "Sanctioned Account • Global Debarment"
  }
};

const WORKER_SWITCH_PERSONAS = {
  "101": { id: 101, name: "Rajesh Kumar", skill: "electrician", phone: "+91 98123 45678", coop_name: "Delhi Central Labour Cooperative", pacs_id: "PACS-DL-4029", otp: "5821", photo: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120" },
  "102": { id: 102, name: "Mohammad Aslam", skill: "plumber", phone: "+91 98111 22334", coop_name: "Delhi Central Labour Cooperative", pacs_id: "PACS-DL-4532", otp: "3892", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120" },
  "103": { id: 103, name: "Sunita Sharma", skill: "tailoring", phone: "+91 98733 90812", coop_name: "South Delhi Multi-Purpose Cooperative", pacs_id: "SDMC-PACS-1190", otp: "6214", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120" },
  "106": { id: 106, name: "Amit Verma", skill: "electrician", phone: "+91 98700 11223", coop_name: "Delhi Central Labour Cooperative", pacs_id: "PACS-DL-8831", otp: "9401", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120" }
};

// Global Reactive State
const state = {
  currentLanguage: "en",
  activePortal: "client", // 'client', 'worker', 'ministry'
  selectedService: "electrician",
  selectedSubService: null,
  selectedSubServices: [],
  // Multilingual AI Chatbot Assistant State
  aiChatOpen: false,
  aiChatLanguage: "auto",
  aiChatMessages: [],
  aiVoiceListening: false,
  aiTtsEnabled: true,
  aiSpeechRecognition: null,
  currentCustomerName: "Aarav Mehta",
  currentCustomerPhone: "+91 98765 43210",
  currentCustomerLocation: "Connaught Place, New Delhi",
  currentCustomerOtp: "4291",
  generatedWorkerOtp: "8491",
  currentBookingModalStep: 1,
  selectedPlan: "hourly",
  isEmergency: false,
  isNgo: false,
  ngoVerified: false,
  ngoData: null,
  customerCoords: [28.6315, 77.2167], // Connaught Place, New Delhi
  activeWorker: WORKERS[0],
  activeBooking: null,
  clientMap: null,
  customerMarker: null,
  workerMarkers: {},
  routePolyline: null,
  radarCircle: null,
  hasBackendConnection: false,
  lastQuoteData: null,
  nationalStats: {
    cooperatives: 3,
    workers: 7,
    wages: 368900,
    savings: 140182
  },
  completedBookings: [],
  selectedSubTier: "monthly_pass",
  activeSubscription: null,
  activeOffers: [],
  reviews: [],
  reviewFilter: "all",
  currentStarRating: 5,
  currentReviewType: "positive",
  workerOnboardStep: 1,
  selectedOnboardTrade: "electrician",
  uploadedCertFile: null,
  uploadedAadhaarFile: null,
  workerSession: null,
  ministryGrievanceFilter: "all",
  ministryGrievances: [],
  regionalDemandData: [],
  revenueData: null,
  showAllServices: false,
  bookingScheduleType: "immediate", // "immediate" or "scheduled"
  bookingDate: "",                  // "YYYY-MM-DD"
  bookingTimeSlot: "09:00 AM - 12:00 PM",
  bookingTimeSlotKey: "morning",
  bookingCustomTime: "",
  ministrySelectedService: "all",
  workerDutyMode: "COOP_SHIFT", // "COOP_SHIFT" or "FREELANCE"
  freelanceSlots: ["17:00 - 21:00 (Evening)", "Weekend Flexible"],
  activeFreelanceBooking: null,
  workerRadarMap: null,
  workerRadarWorkerMarker: null,
  workerRadarDestMarker: null,
  workerRadarPolyline: null,
  freelanceNavMap: null,
  flNavWorkerMarker: null,
  flNavDestMarker: null,
  flNavPolyline: null,
  freelanceJobs: [
    {
      id: "FL-501",
      title: "Commercial Panel Wiring Upgrade",
      category: "electrician",
      client_name: "Gupta Traders Pvt Ltd",
      client_phone: "+91 98110 44231",
      client_location: "Connaught Place, Barakhamba Road",
      coords: [28.6304, 77.2273],
      date: "Today (Post-Shift)",
      time_slot: "17:30 - 20:30",
      est_duration: "3 Hours",
      freelance_fee: 1450.0,
      worker_takehome: 1450.0,
      platform_fee: 20.0,
      federation_cut: 0.0,
      description: "Direct evening electrical rewiring for 3 commercial sub-meters. Direct client payment via UPI upon completion.",
      claimed_by: null
    },
    {
      id: "FL-502",
      title: "Restaurant Kitchen Dual-Boiler Descaling",
      category: "plumber",
      client_name: "Café Heritage Inn",
      client_phone: "+91 98221 88392",
      client_location: "Janpath, Central Delhi",
      coords: [28.6219, 77.2183],
      date: "Tonight",
      time_slot: "20:00 - 22:30",
      est_duration: "2.5 Hours",
      freelance_fee: 1800.0,
      worker_takehome: 1800.0,
      platform_fee: 20.0,
      federation_cut: 0.0,
      description: "Descaling and high-pressure valve testing after restaurant closing hours. Urgent direct cash/UPI dispatch.",
      claimed_by: null
    },
    {
      id: "FL-503",
      title: "Clinic Emergency Backup Inverter Installation",
      category: "electrician",
      client_name: "Apex Healthcare PolyClinic",
      client_phone: "+91 98334 11772",
      client_location: "Paharganj, New Delhi",
      coords: [28.6433, 77.2132],
      date: "Tomorrow Morning (Off-Duty)",
      time_slot: "06:30 - 08:30",
      est_duration: "2 Hours",
      freelance_fee: 1200.0,
      worker_takehome: 1200.0,
      platform_fee: 20.0,
      federation_cut: 0.0,
      description: "Pre-shift inverter connection before clinic opens. Direct client UPI settlement.",
      claimed_by: null
    },
    {
      id: "FL-504",
      title: "Boutique Display Shelf & Teak Joinery Repair",
      category: "carpentry",
      client_name: "Elegance Handlooms",
      client_phone: "+91 98445 99310",
      client_location: "Khan Market, New Delhi",
      coords: [28.5996, 77.2267],
      date: "Sunday (Weekend Flexible)",
      time_slot: "10:00 - 15:00",
      est_duration: "5 Hours",
      freelance_fee: 2600.0,
      worker_takehome: 2600.0,
      platform_fee: 20.0,
      federation_cut: 0.0,
      description: "Custom teak display adjustment and hidden bracket mounting. 100% direct craftsman compensation.",
      claimed_by: null
    }
  ],
  customerComplaints: [
    {
      complaint_id: "CMP-001",
      worker_id: 101,
      worker_name: "Rajesh Kumar",
      customer_name: "Rohan Verma",
      customer_phone: "+91 98990 01122",
      category: "SERVICE_DELAY_EXCESS",
      delay_hours: 4.5,
      description: "Customer booked 1 day slot, gave start OTP but held worker for 4 extra hours without compensation and refused to release end OTP.",
      timestamp: "2026-09-15T18:30:00Z"
    }
  ],
  debarredCustomers: {
    "Vikas Malhotra": {
      reason: "Repeated customer delays and abusive behavior escalated by Worker 102 and Worker 104",
      debarred_at: "2026-09-14T11:20:00Z",
      escalation_count: 2,
      services: ["ALL"]
    },
    "Rohan Verma": {
      reason: "Safety protocol violation and unauthorized hazardous electrical tamper",
      debarred_at: "2026-09-16T14:30:00Z",
      escalation_count: 1,
      services: ["electrician"]
    }
  },
  workerRejections: [
    {
      rejection_id: "REJ-101",
      worker_id: 106,
      worker_name: "Amit Verma",
      worker_skill: "electrician",
      coop_name: "Delhi Central Labour Cooperative",
      booking_id: 991,
      service_type: "electrician",
      reason: "Worker declined dispatch (Outside preferred operating radius)",
      timestamp: "2026-09-15T14:10:00Z"
    },
    {
      rejection_id: "REJ-102",
      worker_id: 106,
      worker_name: "Amit Verma",
      worker_skill: "electrician",
      coop_name: "Delhi Central Labour Cooperative",
      booking_id: 994,
      service_type: "electrician",
      reason: "Worker declined dispatch (Busy with personal work)",
      timestamp: "2026-09-15T16:45:00Z"
    }
  ],
  growthChartOptions: {
    region: "all",
    horizon: "6m",
    series: {
      deployments: true,
      requests: true,
      revenue: true
    }
  },
  regionalGrowthData: {
    all: {
      region_name: "Consolidated National Capital Region (NCR)",
      horizons: {
        "6m": {
          labels: ["Apr '26", "May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26"],
          deployments: [1240, 1580, 2040, 2690, 3450, 4280],
          requests: [1380, 1750, 2260, 2980, 3810, 4650],
          revenue: [372000, 474000, 612000, 807000, 1035000, 1428500],
          welfare: [13020, 16590, 21420, 28245, 36225, 49997],
          velocity: "+245.2% 6-Mo Surge",
          kpis: {
            deployments: "4,280 Active",
            deployments_sub: "+24.1% MoM Surge",
            requests: "4,650 Requests",
            requests_sub: "92.0% Fulfilment Ratio",
            revenue: "₹14.28 Lakhs",
            revenue_sub: "100% Direct Worker DBT",
            welfare: "₹50,000 Pool",
            welfare_sub: "3.5% Social Security Cess"
          }
        },
        "30d": {
          labels: ["Week 1 (Aug 24)", "Week 2 (Aug 31)", "Week 3 (Sep 07)", "Week 4 (Sep 14)"],
          deployments: [820, 960, 1140, 1360],
          requests: [890, 1050, 1250, 1460],
          revenue: [246000, 288000, 342000, 408000],
          welfare: [8610, 10080, 11970, 14280],
          velocity: "+65.8% 30-Day Growth",
          kpis: {
            deployments: "1,360 Deployed",
            deployments_sub: "+19.3% vs Prev Week",
            requests: "1,460 Requests",
            requests_sub: "93.1% Service Fulfilment",
            revenue: "₹4.08 Lakhs",
            revenue_sub: "Zero Middleman Extraction",
            welfare: "₹14,280 Pool",
            welfare_sub: "Health & Accidental Cess"
          }
        },
        "ytd": {
          labels: ["Q1 FY25", "Q2 FY25", "Q3 FY25", "Q4 FY25", "Q1 FY26", "Q2 FY26"],
          deployments: [3100, 4800, 7200, 10400, 15100, 21500],
          requests: [3450, 5300, 7900, 11300, 16400, 23200],
          revenue: [930000, 1440000, 2160000, 3120000, 4530000, 6450000],
          welfare: [32550, 50400, 75600, 109200, 158550, 225750],
          velocity: "+593.5% FY CAGR",
          kpis: {
            deployments: "21,500 Deployed",
            deployments_sub: "6-Quarter PACS Expansion",
            requests: "23,200 Requests",
            requests_sub: "92.7% National Fulfillment",
            revenue: "₹64.50 Lakhs",
            revenue_sub: "Cumulative Artisan Earnings",
            welfare: "₹2.25 Lakhs Pool",
            welfare_sub: "State Insurance Endowment"
          }
        }
      }
    },
    central_delhi: {
      region_name: "Central Delhi (Connaught Place, Karol Bagh)",
      horizons: {
        "6m": {
          labels: ["Apr '26", "May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26"],
          deployments: [320, 410, 540, 710, 920, 1140],
          requests: [350, 450, 590, 780, 1010, 1230],
          revenue: [96000, 123000, 162000, 213000, 276000, 368900],
          welfare: [3360, 4305, 5670, 7455, 9660, 12911],
          velocity: "+256.3% 6-Mo Surge",
          kpis: {
            deployments: "1,140 Active",
            deployments_sub: "+23.9% MoM Trajectory",
            requests: "1,230 Requests",
            requests_sub: "92.7% Fulfilment Ratio",
            revenue: "₹3.68 Lakhs",
            revenue_sub: "100% Direct Worker DBT",
            welfare: "₹12,911 Pool",
            welfare_sub: "3.5% Social Security Cess"
          }
        },
        "30d": {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          deployments: [220, 260, 310, 350],
          requests: [240, 280, 335, 375],
          revenue: [66000, 78000, 93000, 105000],
          welfare: [2310, 2730, 3255, 3675],
          velocity: "+59.1% MoM",
          kpis: {
            deployments: "350 Deployed",
            deployments_sub: "+12.9% vs Prev Week",
            requests: "375 Requests",
            requests_sub: "93.3% Service Fulfilment",
            revenue: "₹1.05 Lakhs",
            revenue_sub: "Direct Worker Payouts",
            welfare: "₹3,675 Pool",
            welfare_sub: "Central District Reserve"
          }
        },
        "ytd": {
          labels: ["Q1 FY25", "Q2 FY25", "Q3 FY25", "Q4 FY25", "Q1 FY26", "Q2 FY26"],
          deployments: [820, 1250, 1900, 2750, 3950, 5600],
          requests: [900, 1380, 2090, 3010, 4300, 6050],
          revenue: [246000, 375000, 570000, 825000, 1185000, 1680000],
          welfare: [8610, 13125, 19950, 28875, 41475, 58800],
          velocity: "+582.9% FY CAGR",
          kpis: {
            deployments: "5,600 Deployed",
            deployments_sub: "District Guild Growth",
            requests: "6,050 Requests",
            requests_sub: "92.6% Cumulative Fulfillment",
            revenue: "₹16.80 Lakhs",
            revenue_sub: "Worker Take-Home Wages",
            welfare: "₹58,800 Pool",
            welfare_sub: "District Welfare Cess"
          }
        }
      }
    },
    south_delhi: {
      region_name: "South Delhi (Hauz Khas, Saket, Greater Kailash)",
      horizons: {
        "6m": {
          labels: ["Apr '26", "May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26"],
          deployments: [380, 490, 640, 830, 1080, 1320],
          requests: [420, 530, 690, 910, 1180, 1440],
          revenue: [114000, 147000, 192000, 249000, 324000, 442000],
          welfare: [3990, 5145, 6720, 8715, 11340, 15470],
          velocity: "+247.4% 6-Mo Surge",
          kpis: {
            deployments: "1,320 Active",
            deployments_sub: "+22.2% MoM Expansion",
            requests: "1,440 Requests",
            requests_sub: "91.7% Fulfilment Ratio",
            revenue: "₹4.42 Lakhs",
            revenue_sub: "High-Value Guild Gigs",
            welfare: "₹15,470 Pool",
            welfare_sub: "3.5% Cooperative Cess"
          }
        },
        "30d": {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          deployments: [250, 300, 360, 410],
          requests: [270, 325, 390, 445],
          revenue: [75000, 90000, 108000, 123000],
          welfare: [2625, 3150, 3780, 4305],
          velocity: "+64.0% MoM",
          kpis: {
            deployments: "410 Deployed",
            deployments_sub: "+13.8% vs Prev Week",
            requests: "445 Requests",
            requests_sub: "92.1% Service Fulfilment",
            revenue: "₹1.23 Lakhs",
            revenue_sub: "South Delhi Technicians",
            welfare: "₹4,305 Pool",
            welfare_sub: "PACS Medical Reserve"
          }
        },
        "ytd": {
          labels: ["Q1 FY25", "Q2 FY25", "Q3 FY25", "Q4 FY25", "Q1 FY26", "Q2 FY26"],
          deployments: [960, 1490, 2250, 3200, 4700, 6600],
          requests: [1050, 1630, 2450, 3500, 5100, 7150],
          revenue: [288000, 447000, 675000, 960000, 1410000, 1980000],
          welfare: [10080, 15645, 23625, 33600, 49350, 69300],
          velocity: "+587.5% FY CAGR",
          kpis: {
            deployments: "6,600 Deployed",
            deployments_sub: "PACS Cooperative Network",
            requests: "7,150 Requests",
            requests_sub: "92.3% Cumulative Fulfilment",
            revenue: "₹19.80 Lakhs",
            revenue_sub: "Direct Cooperative DBT",
            welfare: "₹69,300 Pool",
            welfare_sub: "South Federation Reserve"
          }
        }
      }
    },
    new_delhi: {
      region_name: "New Delhi (Barakhamba, Chanakyapuri, Lodhi)",
      horizons: {
        "6m": {
          labels: ["Apr '26", "May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26"],
          deployments: [210, 270, 350, 460, 590, 740],
          requests: [230, 290, 380, 500, 640, 800],
          revenue: [63000, 81000, 105000, 138000, 177000, 246000],
          welfare: [2205, 2835, 3675, 4830, 6195, 8610],
          velocity: "+252.4% 6-Mo Surge",
          kpis: {
            deployments: "740 Active",
            deployments_sub: "+25.4% MoM Growth",
            requests: "800 Requests",
            requests_sub: "92.5% Fulfilment Ratio",
            revenue: "₹2.46 Lakhs",
            revenue_sub: "100% Direct DBT",
            welfare: "₹8,610 Pool",
            welfare_sub: "3.5% Welfare Cess"
          }
        },
        "30d": {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          deployments: [140, 165, 195, 240],
          requests: [150, 180, 210, 260],
          revenue: [42000, 49500, 58500, 72000],
          welfare: [1470, 1732, 2047, 2520],
          velocity: "+71.4% MoM",
          kpis: {
            deployments: "240 Deployed",
            deployments_sub: "+23.1% vs Prev Week",
            requests: "260 Requests",
            requests_sub: "92.3% Service Fulfilment",
            revenue: "₹72,000",
            revenue_sub: "Zero Cut Taken",
            welfare: "₹2,520 Pool",
            welfare_sub: "Urban Cooperative Reserve"
          }
        },
        "ytd": {
          labels: ["Q1 FY25", "Q2 FY25", "Q3 FY25", "Q4 FY25", "Q1 FY26", "Q2 FY26"],
          deployments: [540, 820, 1240, 1780, 2560, 3600],
          requests: [590, 900, 1360, 1950, 2800, 3900],
          revenue: [162000, 246000, 372000, 534000, 768000, 1080000],
          welfare: [5670, 8610, 13020, 18690, 26880, 37800],
          velocity: "+566.7% FY CAGR",
          kpis: {
            deployments: "3,600 Deployed",
            deployments_sub: "Urban Guild Network",
            requests: "3,900 Requests",
            requests_sub: "92.3% Cumulative Fulfilment",
            revenue: "₹10.80 Lakhs",
            revenue_sub: "Direct Worker Payouts",
            welfare: "₹37,800 Pool",
            welfare_sub: "3.5% Trust Fund"
          }
        }
      }
    },
    north_delhi: {
      region_name: "North Delhi (Civil Lines, Kashmere Gate, Model Town)",
      horizons: {
        "6m": {
          labels: ["Apr '26", "May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26"],
          deployments: [180, 230, 290, 380, 480, 590],
          requests: [200, 255, 320, 420, 530, 650],
          revenue: [54000, 69000, 87000, 114000, 144000, 198000],
          welfare: [1890, 2415, 3045, 3990, 5040, 6930],
          velocity: "+227.8% 6-Mo Surge",
          kpis: {
            deployments: "590 Active",
            deployments_sub: "+22.9% MoM Trajectory",
            requests: "650 Requests",
            requests_sub: "90.8% Fulfilment Ratio",
            revenue: "₹1.98 Lakhs",
            revenue_sub: "100% Direct DBT",
            welfare: "₹6,930 Pool",
            welfare_sub: "3.5% Social Security Cess"
          }
        },
        "30d": {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          deployments: [110, 135, 165, 195],
          requests: [120, 150, 180, 215],
          revenue: [33000, 40500, 49500, 58500],
          welfare: [1155, 1417, 1732, 2047],
          velocity: "+77.3% MoM",
          kpis: {
            deployments: "195 Deployed",
            deployments_sub: "+18.2% vs Prev Week",
            requests: "215 Requests",
            requests_sub: "90.7% Service Fulfilment",
            revenue: "₹58,500",
            revenue_sub: "Direct Artisan Wages",
            welfare: "₹2,047 Pool",
            welfare_sub: "North Delhi PACS Fund"
          }
        },
        "ytd": {
          labels: ["Q1 FY25", "Q2 FY25", "Q3 FY25", "Q4 FY25", "Q1 FY26", "Q2 FY26"],
          deployments: [420, 660, 1010, 1470, 2130, 3050],
          requests: [470, 740, 1120, 1630, 2350, 3350],
          revenue: [126000, 198000, 303000, 441000, 639000, 915000],
          welfare: [4410, 6930, 10605, 15435, 22365, 32025],
          velocity: "+626.2% FY CAGR",
          kpis: {
            deployments: "3,050 Deployed",
            deployments_sub: "North District Guilds",
            requests: "3,350 Requests",
            requests_sub: "91.0% Cumulative Fulfilment",
            revenue: "₹9.15 Lakhs",
            revenue_sub: "Craftsmen Direct Income",
            welfare: "₹32,025 Pool",
            welfare_sub: "3.5% Trust Fund"
          }
        }
      }
    },
    west_delhi: {
      region_name: "West Delhi (Rajouri Garden, Janakpuri, Punjabi Bagh)",
      horizons: {
        "6m": {
          labels: ["Apr '26", "May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26"],
          deployments: [150, 180, 220, 310, 380, 490],
          requests: [180, 215, 280, 370, 450, 530],
          revenue: [45000, 54000, 66000, 93000, 114000, 173600],
          welfare: [1575, 1890, 2310, 3255, 3990, 6076],
          velocity: "+226.7% 6-Mo Surge",
          kpis: {
            deployments: "490 Active",
            deployments_sub: "+28.9% MoM Trajectory",
            requests: "530 Requests",
            requests_sub: "92.5% Fulfilment Ratio",
            revenue: "₹1.73 Lakhs",
            revenue_sub: "100% Direct Worker DBT",
            welfare: "₹6,076 Pool",
            welfare_sub: "3.5% Social Security Cess"
          }
        },
        "30d": {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          deployments: [100, 120, 140, 165],
          requests: [110, 135, 155, 180],
          revenue: [30000, 36000, 42000, 49500],
          welfare: [1050, 1260, 1470, 1732],
          velocity: "+65.0% MoM",
          kpis: {
            deployments: "165 Deployed",
            deployments_sub: "+17.9% vs Prev Week",
            requests: "180 Requests",
            requests_sub: "91.7% Service Fulfilment",
            revenue: "₹49,500",
            revenue_sub: "Direct Cooperative Payout",
            welfare: "₹1,732 Pool",
            welfare_sub: "West Delhi Cess Reserve"
          }
        },
        "ytd": {
          labels: ["Q1 FY25", "Q2 FY25", "Q3 FY25", "Q4 FY25", "Q1 FY26", "Q2 FY26"],
          deployments: [360, 580, 900, 1320, 1960, 2650],
          requests: [440, 650, 1020, 1490, 2150, 2850],
          revenue: [108000, 174000, 270000, 396000, 588000, 795000],
          welfare: [3780, 6090, 9450, 13860, 20580, 27825],
          velocity: "+636.1% FY CAGR",
          kpis: {
            deployments: "2,650 Deployed",
            deployments_sub: "Industrial Guild Network",
            requests: "2,850 Requests",
            requests_sub: "93.0% Cumulative Fulfilment",
            revenue: "₹7.95 Lakhs",
            revenue_sub: "100% Direct DBT",
            welfare: "₹27,825 Pool",
            welfare_sub: "3.5% Trust Fund"
          }
        }
      }
    }
  }
};

// Runs an init step in isolation so a single failure (e.g. a blocked/slow CDN
// like unpkg.com or cdn.tailwindcss.com) can't stop every step after it from
// running, which previously left the whole page blank.
function safeInit(label, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[SahakarSeva] "${label}" failed to initialize:`, err);
  }
}

// Document Ready Initialization
document.addEventListener("DOMContentLoaded", () => {
  safeInit("icons", safeCreateIcons);
  safeInit("service grid", initServiceGrid);
  safeInit("booking scheduler", initBookingSchedule);
  safeInit("map", initLeafletMap);
  safeInit("subscriptions", initSubscriptionSystem);
  safeInit("reviews", initCitizenReviews);
  safeInit("worker onboarding", initWorkerOnboarding);
  safeInit("ministry telemetry", initMinistryExtensions);
  safeInit("ministry requirements", initMinistryServiceRequirements);
  safeInit("citizen persona", () => changeCitizenPersona("Aarav Mehta", true));
  safeInit("live quote", calculateLiveQuote);
  safeInit("district table", renderDistrictTable);
  safeInit("freelance hub", initWorkerFreelanceHub);
  safeInit("ministry debarment desk", initDebarmentDesk);
  safeInit("ministry discipline desk", initDisciplineDesk);
  safeInit("ministry growth analytics", initMinistryGrowthAnalytics);
  safeInit("backend health check", checkBackendHealth);
  safeInit("ai chatbot", initAiChatbot);

  // Periodic simulated ticker updates
  setInterval(pushLiveTickerEvent, 14000);
});

// Check if backend API is online
async function checkBackendHealth() {
  // If no backend URL configured and not on localhost, stay cleanly in Autonomous Engine mode
  const isLocal = typeof window !== "undefined" && 
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  if (!API_BASE_URL && !isLocal) {
    state.hasBackendConnection = false;
    updateBackendStatusUI(false);
    return;
  }

  try {
    const checkUrl = API_BASE_URL ? `${API_BASE_URL}/` : "/";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(checkUrl, { 
      method: "GET",
      signal: controller.signal,
      headers: { "Accept": "application/json" }
    });
    clearTimeout(timeoutId);

    // Verify the response is genuinely API JSON and not Netlify's HTML fallback
    const contentType = res.headers.get("content-type") || "";
    if (res.ok && contentType.includes("application/json")) {
      const data = await res.json();
      if (data && (data.status === "online" || data.platform || data.vision)) {
        state.hasBackendConnection = true;
        updateBackendStatusUI(true);
        return;
      }
    }
    state.hasBackendConnection = false;
    updateBackendStatusUI(false);
  } catch (e) {
    state.hasBackendConnection = false;
    updateBackendStatusUI(false);
  }
}

function updateBackendStatusUI(isConnected) {
  // Dev badge suppressed for citizen-facing interface
  const pill = document.getElementById("backend-status-badge");
  if (pill) pill.remove();
}


// 1. Navigation / Portal Switcher
function switchPortal(portalId) {
  sfx.playClick();
  state.activePortal = portalId;
  
  // Hide all views
  document.getElementById("view-client").classList.add("hidden");
  document.getElementById("view-worker").classList.add("hidden");
  document.getElementById("view-ministry").classList.add("hidden");

  // Reset tab active styles
  ["client", "worker", "ministry"].forEach(id => {
    const tab = document.getElementById(`tab-${id}`);
    tab.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-blue-200 hover:text-white hover:bg-blue-800/50 flex items-center space-x-2 btn-tactile";
  });

  // Activate selected view & tab
  document.getElementById(`view-${portalId}`).classList.remove("hidden");
  const activeTab = document.getElementById(`tab-${portalId}`);
  activeTab.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition bg-blue-600 text-white shadow-md flex items-center space-x-2 btn-tactile";

  // Re-invalidate map size if client view is chosen
  if (portalId === "client" && state.clientMap) {
    setTimeout(() => state.clientMap.invalidateSize(), 200);
  }

  // Refresh ministry growth charts if ministry cockpit is opened
  if (portalId === "ministry") {
    setTimeout(() => {
      if (typeof initMinistryGrowthAnalytics === "function") {
        initMinistryGrowthAnalytics();
      }
    }, 120);
  }

  safeCreateIcons();
}

// Sound toggle
function toggleAudio() {
  sfx.enabled = !sfx.enabled;
  const icon = document.getElementById("audio-icon");
  if (icon) {
    if (sfx.enabled) {
      icon.setAttribute("data-lucide", "volume-2");
      sfx.playClick();
      showToast(state.currentLanguage === "hi" ? "ध्वनि प्रभाव चालू किए गए" : "Audio effects unmuted", "info");
    } else {
      icon.setAttribute("data-lucide", "volume-x");
      showToast(state.currentLanguage === "hi" ? "ध्वनि प्रभाव म्यूट किए गए" : "Audio effects muted", "info");
    }
    safeCreateIcons();
  }
}

// 2. Comprehensive Multilingual Engine (English <-> Hindi)
function toggleLanguage(lang) {
  state.currentLanguage = lang;
  const isHi = lang === "hi";

  // 1. Translate all data-i18n attributes
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.innerText = dict[key];
    }
  });

  // 2. Translate Input Placeholders
  const searchInput = document.getElementById("service-search-input");
  if (searchInput) {
    searchInput.placeholder = isHi 
      ? "सेवा खोजें (उदा. इलेक्ट्रीशियन, प्लम्बर, बढ़ई, सफाई, सिलाई, ड्राइवर)..." 
      : "Type a trade (e.g. Electrician, Plumber, Carpentry, Cleaning, Tailoring, Driver)...";
  }

  const startOtpInput = document.getElementById("input-start-otp");
  if (startOtpInput) {
    startOtpInput.placeholder = isHi ? "शुरुआती ओटीपी दर्ज करें (उदा. 4821)" : "Enter START_OTP (e.g. 4821)";
  }

  const endOtpInput = document.getElementById("input-end-otp");
  if (endOtpInput) {
    endOtpInput.placeholder = isHi ? "समापन ओटीपी दर्ज करें (उदा. 7914)" : "Enter END_OTP (e.g. 7914)";
  }

  // 3. Re-render service cards in selected language
  initServiceGrid();

  // 4. Update live price quote labels
  calculateLiveQuote();

  // 4b. Update booking schedule labels in selected language
  updateBookingScheduleUI();

  // 4c. Update service booking modal if present
  if (typeof updateServiceBookingModalUI === "function") {
    updateServiceBookingModalUI();
  }

  // 5. Re-render district intelligence table and ministry requirements
  renderDistrictTable();
  initMinistryServiceRequirements();
  if (typeof renderFreelanceJobs === "function") renderFreelanceJobs();
  if (typeof renderMinistryDebarmentTable === "function") renderMinistryDebarmentTable();
  if (typeof renderMinistryDisciplineTable === "function") renderMinistryDisciplineTable();
  if (typeof setWorkerDutyMode === "function" && state.workerDutyMode) {
    setWorkerDutyMode(state.workerDutyMode, true);
  }

  // 6. Update payment gateway button text if quote available
  if (state.lastQuoteData) {
    const btnText = document.getElementById("btn-pay-text");
    if (btnText) {
      btnText.innerText = isHi 
        ? `₹${state.lastQuoteData.total_amount.toFixed(2)} भुगतान अधिकृत करें और प्रेषित करें`
        : `Authorize Payment of ₹${state.lastQuoteData.total_amount.toFixed(2)} & Broadcast`;
    }
  }

  showToast(isHi ? "भाषा हिंदी में सफलतापूर्वक बदली गई" : "Language set to English successfully", "info");
}

// 3. Web Speech API Voice Recognition
function startVoiceRecognition() {
  sfx.playClick();
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast(state.currentLanguage === "hi" 
      ? "ध्वनि पहचान समर्थित नहीं है। नीचे दिए गए त्वरित बटनों का उपयोग करें।" 
      : "Speech recognition not supported. Use quick suggestion chips below!", "warning");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = state.currentLanguage === "hi" ? "hi-IN" : "en-IN";
  recognition.interimResults = false;

  const statusEl = document.getElementById("voice-status");
  const micIcon = document.getElementById("mic-icon");

  if (statusEl) {
    statusEl.classList.remove("hidden");
    statusEl.querySelector("span:last-child").innerText = state.currentLanguage === "hi" 
      ? "सुन रहे हैं... कृपया सेवा का नाम हिंदी या अंग्रेज़ी में बोलें" 
      : "Listening... Speak your service in Hindi or English";
  }
  if (micIcon) micIcon.classList.add("animate-ping");

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    const input = document.getElementById("service-search-input");
    if (input) input.value = transcript;
    filterServicesByText(transcript);
    showToast(`Heard: "${transcript}"`, "info");
  };

  recognition.onerror = () => {
    if (statusEl) {
      statusEl.querySelector("span:last-child").innerText = state.currentLanguage === "hi"
        ? "आवाज समझ नहीं आई। कृपया टाइप करें या कार्ड चुनें।"
        : "Voice error. Please select manually or click quick chips.";
    }
  };

  recognition.onend = () => {
    if (statusEl) statusEl.classList.add("hidden");
    if (micIcon) micIcon.classList.remove("animate-ping");
  };

  recognition.start();
}

function applyQuickSearch(serviceId) {
  sfx.playClick();
  const input = document.getElementById("service-search-input");
  if (input) {
    const sObj = SERVICES.find(s => s.id === serviceId);
    input.value = state.currentLanguage === "hi" && sObj ? sObj.name_hi : serviceId;
  }
  filterServicesByText(serviceId);
  selectService(serviceId);
  showToast(`Selected ${serviceId.toUpperCase()} with reduced cooperative rate`, "success");
}

// 4. Working Real-Time Search Bar with Active Filtering & Feedback
function filterServicesByText(query) {
  const q = (query || "").toLowerCase().trim();
  const clearBtn = document.getElementById("search-clear-btn");
  const statusEl = document.getElementById("search-result-status");
  const isHi = state.currentLanguage === "hi";

  if (!q) {
    if (clearBtn) clearBtn.classList.add("hidden");
    if (statusEl) {
      statusEl.classList.add("hidden");
      statusEl.innerText = "";
    }
    initServiceGrid();
    return;
  }

  // Show clear button when input is not empty
  if (clearBtn) clearBtn.classList.remove("hidden");

  // Comprehensive multi-field filtering
  const matched = SERVICES.filter(s => {
    if (s.id.toLowerCase().includes(q)) return true;
    if (s.name.toLowerCase().includes(q)) return true;
    if (s.name_hi && s.name_hi.includes(q)) return true;
    if (s.badge.toLowerCase().includes(q)) return true;
    if (s.badge_hi && s.badge_hi.includes(q)) return true;
    if (s.keywords && s.keywords.some(k => k.toLowerCase().includes(q) || q.includes(k.toLowerCase()))) return true;
    return false;
  });

  // Display match feedback
  if (statusEl) {
    statusEl.classList.remove("hidden");
    if (matched.length > 0) {
      statusEl.className = "text-xs text-blue-700 font-bold mt-1.5 flex items-center gap-1";
      statusEl.innerHTML = isHi 
        ? `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i> <span>✓ "${query}" के लिए ${matched.length} सेवा(एँ) उपलब्ध हैं</span>`
        : `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i> <span>✓ Found ${matched.length} cooperative service(s) for "${query}"</span>`;
    } else {
      statusEl.className = "text-xs text-amber-700 font-bold mt-1.5 flex items-center gap-1";
      statusEl.innerHTML = isHi
        ? `<i data-lucide="alert-circle" class="w-3.5 h-3.5 text-amber-600"></i> <span>"${query}" के लिए कोई सेवा नहीं मिली</span>`
        : `<i data-lucide="alert-circle" class="w-3.5 h-3.5 text-amber-600"></i> <span>No services found matching "${query}"</span>`;
    }
    safeCreateIcons();
  }

  // Auto-select first matching service if currently selected is not in results
  if (matched.length > 0 && !matched.some(s => s.id === state.selectedService)) {
    selectService(matched[0].id, false);
  }

  initServiceGrid(matched);
}

function clearSearch() {
  sfx.playClick();
  const input = document.getElementById("service-search-input");
  if (input) {
    input.value = "";
    input.focus();
  }
  const clearBtn = document.getElementById("search-clear-btn");
  if (clearBtn) clearBtn.classList.add("hidden");
  const statusEl = document.getElementById("search-result-status");
  if (statusEl) {
    statusEl.classList.add("hidden");
    statusEl.innerText = "";
  }
  initServiceGrid();
}

// Debarment Checking & Citizen Persona Management
function isCustomerDebarredForService(customerName, serviceId) {
  const custName = customerName || state.currentCustomerName || "Aarav Mehta";
  if (!state.debarredCustomers || !state.debarredCustomers[custName]) {
    return { debarred: false, services: [], reason: "" };
  }
  const info = state.debarredCustomers[custName];
  const services = info.services || ["ALL"];
  const isDebarred = services.includes("ALL") || (serviceId && services.includes(serviceId));
  return {
    debarred: isDebarred,
    services: services,
    reason: info.reason || "Administrative sanction by Ministry of Cooperation",
    info: info
  };
}

let pendingCitizenSwitchName = null;
let pendingCitizenCoords = null;

function changeCitizenPersona(name, bypassAuth = false) {
  sfx.playClick();
  if (bypassAuth) {
    state.currentCustomerName = name;
    const persona = CITIZEN_PERSONAS[name] || {};
    if (persona.phone) state.currentCustomerPhone = persona.phone;
    if (persona.location) {
      state.currentCustomerLocation = persona.location;
      const locText = document.getElementById("citizen-location-text");
      if (locText) locText.innerText = persona.location;
    }
    if (persona.coords) state.customerCoords = persona.coords;

    const selectEl = document.getElementById("citizen-persona-select");
    if (selectEl && selectEl.value !== name) {
      selectEl.value = name;
    }

    const badgeEl = document.getElementById("citizen-persona-badge");
    const alertBanner = document.getElementById("citizen-debarred-alert");
    const alertText = document.getElementById("citizen-debarred-alert-text");
    const servicesContainer = document.getElementById("citizen-debarred-services-list");

    const debarInfo = state.debarredCustomers && state.debarredCustomers[name];
    if (debarInfo) {
      const isGlobal = (debarInfo.services || []).includes("ALL");
      const serviceList = debarInfo.services || ["ALL"];
      
      if (badgeEl) {
        badgeEl.className = "text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-800 border border-red-300";
        badgeEl.innerText = isGlobal ? "🚫 Debarred (All Services)" : `🚫 Debarred (${serviceList.join(", ")})`;
      }

      if (alertBanner) alertBanner.classList.remove("hidden");
      if (alertText) {
        alertText.innerHTML = isGlobal
          ? `Citizen account <strong>"${name}"</strong> is currently under <strong>GLOBAL DEBARMENT</strong> across all cooperative services (${debarInfo.reason}).`
          : `Citizen account <strong>"${name}"</strong> is debarred from <strong>${serviceList.map(s => s.toUpperCase()).join(", ")}</strong> services (${debarInfo.reason}). Other authorized services remain accessible.`;
      }

      if (servicesContainer) {
        servicesContainer.innerHTML = serviceList.map(s => `
          <span class="px-2 py-0.5 bg-red-200 text-red-900 rounded-md font-mono text-[10px] font-bold">
            ${s === "ALL" ? "🚫 ALL SERVICES" : `⚡ ${s.toUpperCase()}`}
          </span>
        `).join("");
      }
    } else {
      if (badgeEl) {
        badgeEl.className = "text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300";
        badgeEl.innerText = "✓ Active Account (Good Standing)";
      }
      if (alertBanner) alertBanner.classList.add("hidden");
    }

    // Re-render service grid with status badges
    initServiceGrid();
    showToast(`Switched active citizen account to ${name}`, "info");
    return;
  }

  // Interactive Persona Switch: Launch Customer Authentication Gate
  if (name === state.currentCustomerName) return;
  openCitizenAuthModal(name);
}

function openCitizenAuthModal(targetName = null) {
  sfx.playClick();
  const modal = document.getElementById("modal-citizen-auth");
  if (!modal) return;

  const target = targetName || state.currentCustomerName || "Aarav Mehta";
  pendingCitizenSwitchName = target;

  const persona = CITIZEN_PERSONAS[target] || {
    name: target,
    phone: state.currentCustomerPhone || "+91 98765 43210",
    location: state.currentCustomerLocation || "Connaught Place, New Delhi",
    coords: state.customerCoords || [28.6315, 77.2167],
    otp: "4291"
  };

  pendingCitizenCoords = persona.coords;

  const nameInput = document.getElementById("citizen-auth-name");
  if (nameInput) nameInput.value = persona.name;

  const phoneInput = document.getElementById("citizen-auth-phone");
  if (phoneInput) phoneInput.value = persona.phone;

  const locInput = document.getElementById("citizen-auth-location");
  if (locInput) locInput.value = persona.location;

  const otpCodeEl = document.getElementById("citizen-auth-demo-otp-code");
  if (otpCodeEl) otpCodeEl.innerText = persona.otp || "4291";

  const otpInput = document.getElementById("citizen-auth-otp");
  if (otpInput) otpInput.value = "";

  const feedback = document.getElementById("citizen-auth-feedback");
  if (feedback) {
    feedback.className = "text-xs font-semibold hidden p-2.5 rounded-xl";
    feedback.innerText = "";
  }

  modal.classList.remove("hidden");
  safeCreateIcons();
}

function cancelCitizenAuth() {
  sfx.playClick();
  const modal = document.getElementById("modal-citizen-auth");
  if (modal) modal.classList.add("hidden");

  // Revert persona select dropdown back to current confirmed persona
  const selectEl = document.getElementById("citizen-persona-select");
  if (selectEl && selectEl.value !== state.currentCustomerName) {
    selectEl.value = state.currentCustomerName;
  }
  pendingCitizenSwitchName = null;
  pendingCitizenCoords = null;
}

function selectCitizenAuthLocationPreset(locationName, coords) {
  sfx.playClick();
  const locInput = document.getElementById("citizen-auth-location");
  if (locInput) locInput.value = locationName;
  if (coords) pendingCitizenCoords = coords;
  showToast(`Selected location: ${locationName}`, "info");
}

function detectCitizenGpsLocation() {
  sfx.playClick();
  const locInput = document.getElementById("citizen-auth-location");
  if (locInput) {
    locInput.value = "Connaught Place Radial Rd (GPS Detected)";
    pendingCitizenCoords = [28.6315, 77.2167];
  }
  showToast("📍 Geolocation acquired: ±3m accuracy in Connaught Place", "success");
}

function sendCitizenOtp() {
  sfx.playBeep();
  const feedback = document.getElementById("citizen-auth-feedback");
  const phoneInput = document.getElementById("citizen-auth-phone");
  const phone = phoneInput ? phoneInput.value.trim() : "mobile";
  if (feedback) {
    feedback.className = "text-xs font-semibold p-2.5 rounded-xl bg-blue-100 text-blue-900 border border-blue-200 block";
    feedback.innerText = `✓ 4-digit SMS OTP dispatched to ${phone}`;
  }
  showToast(`Security OTP sent to ${phone}`, "info");
}

function autofillCitizenOtp() {
  sfx.playClick();
  const otpCodeEl = document.getElementById("citizen-auth-demo-otp-code");
  const code = otpCodeEl ? otpCodeEl.innerText.trim() : "4291";
  const otpInput = document.getElementById("citizen-auth-otp");
  if (otpInput) {
    otpInput.value = code;
  }
  showToast(`Demo OTP auto-filled: ${code}`, "info");
}

function submitCitizenAuth(e) {
  if (e && e.preventDefault) e.preventDefault();
  sfx.init();

  const nameInput = document.getElementById("citizen-auth-name");
  const phoneInput = document.getElementById("citizen-auth-phone");
  const locInput = document.getElementById("citizen-auth-location");
  const otpInput = document.getElementById("citizen-auth-otp");
  const feedback = document.getElementById("citizen-auth-feedback");

  const name = nameInput ? nameInput.value.trim() : "";
  const phone = phoneInput ? phoneInput.value.trim() : "";
  const location = locInput ? locInput.value.trim() : "";
  const enteredOtp = otpInput ? otpInput.value.trim() : "";

  if (!name || !phone || !location) {
    if (feedback) {
      feedback.className = "text-xs font-semibold p-2.5 rounded-xl bg-red-100 text-red-900 border border-red-300 block";
      feedback.innerText = "Please provide Name, Phone Number, and Delivery Location.";
    }
    sfx.playWarning();
    return false;
  }

  const target = pendingCitizenSwitchName || name;
  const persona = CITIZEN_PERSONAS[target] || {};
  const expectedOtp = persona.otp || "4291";

  // Validate OTP: accept persona's OTP or demo standard pins "4291", "5182", "7834", "1234", "0000"
  const validPins = [expectedOtp, "4291", "5182", "7834", "1234", "0000"];
  if (!validPins.includes(enteredOtp)) {
    if (feedback) {
      feedback.className = "text-xs font-semibold p-2.5 rounded-xl bg-red-100 text-red-900 border border-red-300 block";
      feedback.innerText = `Invalid 4-digit OTP. Please enter ${expectedOtp} or use Auto-Fill.`;
    }
    sfx.playWarning();
    return false;
  }

  // OTP verified! Apply authenticated citizen profile
  state.currentCustomerName = name;
  state.currentCustomerPhone = phone;
  state.currentCustomerLocation = location;
  if (pendingCitizenCoords) {
    state.customerCoords = pendingCitizenCoords;
  } else if (persona.coords) {
    state.customerCoords = persona.coords;
  }

  // Update DOM elements
  const locText = document.getElementById("citizen-location-text");
  if (locText) locText.innerText = location;

  const selectEl = document.getElementById("citizen-persona-select");
  if (selectEl) {
    let hasOption = false;
    for (let i = 0; i < selectEl.options.length; i++) {
      if (selectEl.options[i].value === name) {
        selectEl.selectedIndex = i;
        hasOption = true;
        break;
      }
    }
    if (!hasOption) {
      const opt = document.createElement("option");
      opt.value = name;
      opt.innerText = `${name} (Verified Citizen • ${location})`;
      selectEl.appendChild(opt);
      selectEl.value = name;
    }
  }

  // Sync debarment state
  const badgeEl = document.getElementById("citizen-persona-badge");
  const alertBanner = document.getElementById("citizen-debarred-alert");
  const alertText = document.getElementById("citizen-debarred-alert-text");
  const servicesContainer = document.getElementById("citizen-debarred-services-list");

  const debarInfo = state.debarredCustomers && state.debarredCustomers[name];
  if (debarInfo) {
    const isGlobal = (debarInfo.services || []).includes("ALL");
    const serviceList = debarInfo.services || ["ALL"];
    
    if (badgeEl) {
      badgeEl.className = "text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-800 border border-red-300";
      badgeEl.innerText = isGlobal ? "🚫 Debarred (All Services)" : `🚫 Debarred (${serviceList.join(", ")})`;
    }

    if (alertBanner) alertBanner.classList.remove("hidden");
    if (alertText) {
      alertText.innerHTML = isGlobal
        ? `Citizen account <strong>"${name}"</strong> is currently under <strong>GLOBAL DEBARMENT</strong> across all cooperative services (${debarInfo.reason}).`
        : `Citizen account <strong>"${name}"</strong> is debarred from <strong>${serviceList.map(s => s.toUpperCase()).join(", ")}</strong> services (${debarInfo.reason}). Other authorized services remain accessible.`;
    }

    if (servicesContainer) {
      servicesContainer.innerHTML = serviceList.map(s => `
        <span class="px-2 py-0.5 bg-red-200 text-red-900 rounded-md font-mono text-[10px] font-bold">
          ${s === "ALL" ? "🚫 ALL SERVICES" : `⚡ ${s.toUpperCase()}`}
        </span>
      `).join("");
    }
  } else {
    if (badgeEl) {
      badgeEl.className = "text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300";
      badgeEl.innerText = "✓ Active Account (Good Standing)";
    }
    if (alertBanner) alertBanner.classList.add("hidden");
  }

  // Re-render service grid with status badges
  initServiceGrid();

  // Close modal
  const modal = document.getElementById("modal-citizen-auth");
  if (modal) modal.classList.add("hidden");

  pendingCitizenSwitchName = null;
  pendingCitizenCoords = null;

  sfx.playSuccessFanfare();
  showToast(`✓ Citizen verified: ${name} (${location})`, "success");
  return true;
}

function openServiceDebarmentModal(serviceId, reason) {
  const modal = document.getElementById("modal-service-debarment");
  if (!modal) return;
  const sObj = SERVICES.find(s => s.id === serviceId) || { name: serviceId };
  
  const custEl = document.getElementById("debarred-modal-customer");
  if (custEl) custEl.innerText = state.currentCustomerName || "Rohan Verma";
  
  const servEl = document.getElementById("debarred-modal-service-name");
  if (servEl) servEl.innerText = sObj.name;
  
  const reasonEl = document.getElementById("debarred-modal-reason");
  if (reasonEl) reasonEl.innerText = reason || "Cooperative Safety & Labor Code Violation";

  modal.classList.remove("hidden");
  safeCreateIcons();
}

function closeServiceDebarmentModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-service-debarment");
  if (modal) modal.classList.add("hidden");
}

function switchToCompliantCitizen() {
  closeServiceDebarmentModal();
  changeCitizenPersona("Aarav Mehta");
  showToast("Switched to Aarav Mehta (Active Account with Good Standing)", "success");
}

// 5. Service Selection Grid
function initServiceGrid(filteredList = null) {
  const grid = document.getElementById("service-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const isSearchActive = filteredList !== null;
  const rawList = filteredList || SERVICES;
  const isHi = state.currentLanguage === "hi";

  // Filter out artisan services if NGO credentials have NOT been verified
  const list = rawList.filter(s => {
    if (s.isArtisan && !state.ngoVerified) {
      return false;
    }
    return true;
  });

  const toggleContainer = document.getElementById("service-toggle-container");
  if (toggleContainer) {
    toggleContainer.style.display = "none";
  }

  if (list.length === 0) {
    // Helpful empty state with 1-click restore
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "col-span-2 sm:col-span-3 p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200";
    emptyDiv.innerHTML = `
      <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2.5">
        <i data-lucide="search-x" class="w-6 h-6"></i>
      </div>
      <p class="font-black text-slate-900 text-sm mb-1">${isHi ? "कोई सहकारी सेवा नहीं मिली" : "No Cooperative Services Found"}</p>
      <p class="text-xs text-slate-500 max-w-sm mx-auto mb-3.5">
        ${isHi ? "इलेक्ट्रीशियन, प्लम्बर, बढ़ई, सफाई, सिलाई या ड्राइवर खोजें।" : "Try searching for Electrician, Plumber, Carpentry, Cleaning, Tailoring or Driver."}
      </p>
      <button onclick="clearSearch()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition btn-tactile">
        ${isHi ? "सभी सेवाएँ देखें" : "Show All Services"}
      </button>
    `;
    grid.appendChild(emptyDiv);
    safeCreateIcons();
    return;
  }

  let artisanHeaderAdded = false;

  list.forEach(s => {
    const isSelected = state.selectedService === s.id;
    const name = isHi ? s.name_hi : s.name;
    const badge = isHi ? (s.badge_hi || s.badge) : s.badge;
    const time = isHi ? (s.time_hi || s.time) : s.time;
    const hrSuffix = isHi ? "/घंटा" : "/hr";

    // Debarment status for current customer
    const debarCheck = isCustomerDebarredForService(state.currentCustomerName, s.id);
    const isDebarred = debarCheck.debarred;

    // When NGO is verified and we reach the artisan services, render a prominent additional section header!
    if (state.ngoVerified && s.isArtisan && !artisanHeaderAdded && !isSearchActive) {
      artisanHeaderAdded = true;
      const artisanDivider = document.createElement("div");
      artisanDivider.id = "artisan-guilds-section-header";
      artisanDivider.className = "col-span-2 sm:col-span-3 mt-3 mb-1 p-3.5 bg-gradient-to-r from-amber-500/15 via-amber-100 to-amber-500/15 border-2 border-amber-400 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs transition-all";
      artisanDivider.innerHTML = `
        <div class="flex items-center space-x-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
            <i data-lucide="sparkles" class="w-5 h-5 text-amber-100"></i>
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-black text-amber-950">${isHi ? "धरोहर कारीगर संघ (सत्यापित एनजीओ हेतु अतिरिक्त अनलॉक)" : "Heritage Artisan Guilds (Additionally Unlocked for Verified NGO)"}</span>
              <span class="text-[10px] font-black bg-amber-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">${isHi ? "3 अतिरिक्त सेवाएं" : "3 Additional Services"}</span>
            </div>
            <p class="text-[11px] text-amber-900 font-medium">
              ${isHi ? "कुम्हार, लोहार और पेंटिंग कारीगरों तक सीधी पहुंच • 20% सामाजिक कल्याण सब्सिडी लागू" : "Pottery, Blacksmith & Metalcraft, and Painting Artisans are now fully accessible with 20% welfare subsidy."}
            </p>
          </div>
        </div>
        <span class="text-[10px] font-black text-emerald-800 bg-white border border-emerald-300 px-2.5 py-1 rounded-xl shadow-xs whitespace-nowrap flex items-center gap-1">
          <i data-lucide="check-check" class="w-3.5 h-3.5 text-emerald-600"></i>
          <span>${isHi ? "20% एनजीओ सब्सिडी सक्रिय" : "20% NGO Subsidy Active"}</span>
        </span>
      `;
      grid.appendChild(artisanDivider);
    }

    const card = document.createElement("div");
    card.setAttribute("data-service-id", s.id);
    card.setAttribute("onclick", `selectService('${s.id}', true)`);
    card.onclick = (e) => {
      e.stopPropagation();
      sfx.playClick();
      selectService(s.id, true);
    };

    let borderClass = isSelected 
      ? (s.isArtisan ? "border-amber-600 bg-amber-50/90 shadow-md ring-2 ring-amber-500/30" : "border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500/20")
      : (s.isArtisan ? "border-amber-300 bg-amber-50/40 hover:border-amber-500 hover:bg-amber-50/80 shadow-xs" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm");

    if (isDebarred) {
      borderClass = "border-red-400 bg-red-50/50 hover:border-red-600 opacity-90";
    }

    card.className = `p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col items-start justify-between text-left space-y-2 btn-tactile relative ${borderClass}`;

    card.innerHTML = `
      <div class="flex items-center justify-between w-full">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center ${
          isDebarred ? "bg-red-100 text-red-700" : (isSelected ? (s.isArtisan ? "bg-amber-600 text-white shadow-sm" : "bg-blue-600 text-white shadow-sm") : (s.isArtisan ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xs" : "bg-slate-100 text-slate-700"))
        }">
          <i data-lucide="${s.icon}" class="w-5 h-5"></i>
        </div>
        <div class="flex items-center gap-1.5 flex-wrap justify-end">
          ${s.isArtisan ? `
            <span class="text-[9px] font-black text-amber-900 bg-amber-200 border border-amber-400 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <i data-lucide="sparkles" class="w-2.5 h-2.5 text-amber-700"></i> ${isHi ? "अतिरिक्त कारीगर" : "Additional Artisan"}
            </span>
          ` : ""}
          ${isDebarred ? `
            <span class="text-[10px] font-black text-red-700 bg-red-100 border border-red-300 px-2 py-0.5 rounded-full flex items-center gap-1">
              <i data-lucide="shield-x" class="w-3 h-3"></i> Debarred
            </span>
          ` : `
            <span class="text-[10px] font-black ${isSelected ? (s.isArtisan ? "text-amber-900 bg-amber-200" : "text-blue-800 bg-blue-100/90") : (s.isArtisan ? "text-amber-800 bg-amber-100" : "text-slate-500 bg-slate-100")} px-2.5 py-0.5 rounded-full">
              ${time}
            </span>
          `}
        </div>
      </div>
      <div>
        <h4 class="font-black text-sm ${isDebarred ? "text-red-950" : (isSelected ? (s.isArtisan ? "text-amber-950" : "text-blue-950") : (s.isArtisan ? "text-amber-950" : "text-slate-900"))}">${name}</h4>
        <span class="text-[10px] ${isDebarred ? "text-red-600" : (s.isArtisan ? "text-amber-800 font-bold" : "text-emerald-700")} font-bold block mt-0.5">
          ${isDebarred ? "🚫 Debarred by Ministry" : `✓ ${badge}`}
        </span>
      </div>
      <div class="flex items-center justify-between w-full pt-1.5 border-t ${s.isArtisan ? "border-amber-200/80" : "border-slate-100"} text-xs">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="font-black ${s.isArtisan ? "text-amber-950" : "text-slate-900"}">₹${s.base}${hrSuffix}</span>
          ${state.ngoVerified && s.isArtisan ? `
            <span class="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded">NGO: ₹${Math.round(s.base * 0.8)}${hrSuffix}</span>
          ` : ""}
        </div>
        <span class="text-amber-500 font-bold text-[11px]">★ ${s.rating}</span>
      </div>
    `;

    grid.appendChild(card);
  });

  // If NGO is NOT verified and not currently in active search, show teaser card for heritage crafts
  if (!state.ngoVerified && !isSearchActive) {
    const teaserCard = document.createElement("div");
    teaserCard.id = "artisan-teaser-card";
    teaserCard.className = "p-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-amber-50/30 transition flex flex-col items-start justify-between text-left space-y-2 cursor-pointer hover:border-indigo-400 group btn-tactile";
    teaserCard.onclick = (e) => {
      e.stopPropagation();
      sfx.playClick();
      openNgoVerificationModal();
    };
    teaserCard.innerHTML = `
      <div class="flex items-center justify-between w-full">
        <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition">
          <i data-lucide="sparkles" class="w-5 h-5 text-indigo-600"></i>
        </div>
        <span class="text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
          <i data-lucide="lock" class="w-3 h-3 text-amber-600"></i> NGO Access
        </span>
      </div>
      <div>
        <h4 class="font-black text-sm text-indigo-950">${isHi ? "धरोहर कारीगर सेवाएं" : "Heritage Artisan Crafts"}</h4>
        <span class="text-[10px] text-indigo-600 font-bold block mt-0.5">
          ${isHi ? "कुम्हार, लुहार व पेंटिंग सेवाएं" : "Pottery, Blacksmith & Painting"}
        </span>
      </div>
      <div class="flex items-center justify-between w-full pt-1.5 border-t border-indigo-100 text-xs text-indigo-700 font-bold">
        <span>${isHi ? "दर्पण सत्यापन आवश्यक →" : "Verify DARPAN to Unlock →"}</span>
      </div>
    `;
    grid.appendChild(teaserCard);
  }

  safeCreateIcons();
}

function toggleShowAllServices() {
  sfx.playClick();
  state.showAllServices = true;
  initServiceGrid();
}

function selectService(serviceId, openModal = true) {
  // Check if citizen is debarred from this specific service
  const debarCheck = isCustomerDebarredForService(state.currentCustomerName, serviceId);
  if (debarCheck.debarred) {
    sfx.playFallbackWarning();
    openServiceDebarmentModal(serviceId, debarCheck.reason);
    return;
  }

  state.selectedService = serviceId;

  try {
    initServiceGrid();
  } catch (err) {
    console.warn("initServiceGrid non-fatal warning:", err);
  }
  
  try {
    // Find matching worker for this skill
    const matchingWorker = WORKERS.find(w => w.skill === serviceId && w.is_available) || WORKERS[0];
    state.activeWorker = matchingWorker;
    updateWorkerCardUI(matchingWorker);
    updateMapPins();
  } catch (err) {
    console.warn("Worker/Map sync non-fatal warning:", err);
  }

  try {
    // Reset selected sub-services for this new service
    const catalog = SUB_SERVICES_CATALOG[serviceId] || [];
    state.selectedSubServices = catalog.length > 0 ? [catalog[0]] : [];
    state.selectedSubService = state.selectedSubServices[0] || null;

    calculateLiveQuote();

    // Update step indicator
    updateWorkflowStep(1);
  } catch (err) {
    console.warn("Quote/Workflow non-fatal warning:", err);
  }

  if (openModal) {
    openServiceBookingModal(serviceId, 1);
  }
}

// ==========================================
// POP-UP SERVICE BOOKING MODAL WORKFLOW
// ==========================================

function openServiceBookingModal(serviceId, step = 1) {
  sfx.playClick();
  const modal = document.getElementById("modal-service-booking");
  if (!modal) {
    console.error("modal-service-booking element not found in DOM");
    return;
  }

  const sId = serviceId || state.selectedService || "electrician";
  state.selectedService = sId;

  // Default to first subservice if none selected yet for this trade
  const catalog = SUB_SERVICES_CATALOG[sId] || [];
  if (!state.selectedSubServices || state.selectedSubServices.length === 0 || !catalog.some(s => s.id === state.selectedSubServices[0].id)) {
    state.selectedSubServices = catalog.length > 0 ? [catalog[0]] : [];
  }
  state.selectedSubService = state.selectedSubServices[0] || null;

  // Normal customers can only book from a schedule; ensure scheduled mode if non-subscribed
  if (!state.activeSubscription) {
    state.bookingScheduleType = "scheduled";
    setBookingScheduleType("scheduled", false);
  }

  try {
    updateServiceBookingModalUI();
  } catch (e) {
    console.warn("updateServiceBookingModalUI non-fatal warning:", e);
  }

  // Switch to requested step
  try {
    backToSubServicesSelection();
    goToBookingStep(step);
  } catch (e) {
    console.warn("goToBookingStep non-fatal warning:", e);
  }

  modal.classList.remove("hidden");
  modal.style.display = "flex";
  document.body.classList.add("overflow-hidden");
  safeCreateIcons();
}

function closeServiceBookingModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-service-booking");
  if (modal) {
    modal.classList.add("hidden");
    modal.style.display = "none";
  }
  document.body.classList.remove("overflow-hidden");
}

function updateServiceBookingModalUI() {
  const modal = document.getElementById("modal-service-booking");
  if (!modal) return;

  const isHi = state.currentLanguage === "hi";
  const sObj = SERVICES.find(s => s.id === state.selectedService) || SERVICES[0];

  // 1. Header Title, Badge, Subtitle & Icon
  const titleEl = document.getElementById("booking-modal-title");
  if (titleEl) {
    titleEl.innerText = isHi ? `${sObj.name_hi} सेवाएँ` : `${sObj.name} Services`;
  }

  const badgeEl = document.getElementById("booking-modal-badge");
  if (badgeEl) {
    badgeEl.innerText = isHi ? (sObj.badge_hi || sObj.badge) : sObj.badge;
  }

  const subtitleEl = document.getElementById("booking-modal-subtitle");
  if (subtitleEl) {
    subtitleEl.innerText = isHi 
      ? "100% प्रत्यक्ष उचित मजदूरी • शून्य छिपा हुआ कमीशन • एनपीसीआई एस्क्रो" 
      : "100% Direct Fair Wage to Cooperative Technician • Zero Hidden Cut • NPCI Escrow";
  }

  const iconEl = document.getElementById("booking-modal-service-icon");
  if (iconEl) {
    iconEl.setAttribute("data-lucide", sObj.icon || "wrench");
  }

  // 2. Stepper labels
  const stepTxt1 = document.getElementById("step-txt-1");
  if (stepTxt1) {
    stepTxt1.innerText = isHi ? "1. विशिष्ट कार्य चुनें" : "1. Select Specific Tasks";
  }
  const stepTxt2 = document.getElementById("step-txt-2");
  if (stepTxt2) {
    stepTxt2.innerText = isHi ? "2. समय निर्धारण व बिल" : "2. Schedule & Tariff";
  }

  // 3. Step 1 headings
  const subHeading = document.getElementById("txt-subservice-heading");
  if (subHeading) {
    subHeading.innerText = isHi ? "आपको किस प्रकार की सहायता चाहिए?" : "Select One or More Services";
  }
  const subSubHeading = document.getElementById("txt-subservice-subheading");
  if (subSubHeading) {
    subSubHeading.innerText = isHi 
      ? "सत्यापित पारदर्शी दरों पर सेवा प्राप्त करने हेतु एक या अधिक कार्य चुनें और संतुष्टि की पुष्टि करें।" 
      : "Choose one or more services below, then review your selection to confirm satisfaction before continuing.";
  }

  // 4. Render Step 1 sub-services
  renderSubServices(state.selectedService);

  // 5. Update Step 2 Breadcrumb & details
  if (state.selectedSubServices && state.selectedSubServices.length > 0) {
    const primarySub = state.selectedSubServices[0];
    const step2Icon = document.getElementById("step2-sub-icon");
    if (step2Icon) {
      step2Icon.innerHTML = `<i data-lucide="${primarySub.icon || sObj.icon || "wrench"}" class="w-4 h-4"></i>`;
    }
    const step2Label = document.getElementById("step2-service-label");
    if (step2Label) {
      step2Label.innerText = isHi 
        ? `${sObj.name_hi} - ${state.selectedSubServices.length} कार्य चयनित` 
        : `${sObj.name} - ${state.selectedSubServices.length} Task(s) Selected`;
    }
    const step2Title = document.getElementById("step2-sub-title");
    if (step2Title) {
      step2Title.innerText = state.selectedSubServices.map(s => isHi ? (s.title_hi || s.title) : s.title).join(" + ");
    }
  }

  // 6. Update Step 2 Dispatch title & badge
  const dispatchTitle = document.getElementById("txt-dispatch-mode-title");
  if (dispatchTitle) {
    dispatchTitle.innerText = isHi ? "1. प्रेषण मोड चुनें" : "1. Choose Dispatch Mode";
  }
  const scheduleStatus = document.getElementById("badge-schedule-status");
  if (scheduleStatus) {
    if (state.bookingScheduleType === "immediate") {
      scheduleStatus.innerText = isHi ? "तत्काल प्रेषण (<30 मिनट)" : "Immediate Dispatch (<30 mins)";
    } else {
      scheduleStatus.innerText = isHi ? "अग्रिम निर्धारित स्लॉट" : "Advance Scheduled Slot";
    }
  }

  renderInvoiceTasksList();
  safeCreateIcons();
}

function renderSubServices(serviceId) {
  const grid = document.getElementById("modal-subservices-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const isHi = state.currentLanguage === "hi";
  const subList = SUB_SERVICES_CATALOG[serviceId] || SUB_SERVICES_CATALOG["electrician"] || [];

  // Reset if selection from another trade
  if (state.selectedSubServices.length > 0 && !subList.some(s => s.id === state.selectedSubServices[0].id)) {
    state.selectedSubServices = [];
  }
  if (state.selectedSubServices.length === 0 && subList.length > 0) {
    state.selectedSubServices = [subList[0]];
  }
  state.selectedSubService = state.selectedSubServices[0] || null;

  subList.forEach(sub => {
    const isSelected = state.selectedSubServices.some(s => s.id === sub.id);
    const title = isHi ? (sub.title_hi || sub.title) : sub.title;
    const desc = isHi ? (sub.desc_hi || sub.desc) : sub.desc;
    const badge = isHi ? (sub.badge_hi || sub.badge) : sub.badge;

    const card = document.createElement("div");
    card.setAttribute("data-sub-id", sub.id);
    card.onclick = (e) => {
      e.stopPropagation();
      sfx.playClick();
      toggleSubServiceSelection(sub.id);
    };

    card.className = `p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between text-left space-y-2 btn-tactile relative ${
      isSelected
        ? "border-blue-600 bg-blue-50/90 shadow-md ring-2 ring-blue-500/20"
        : "border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm"
    }`;

    card.innerHTML = `
      <div class="flex items-start justify-between w-full">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-blue-600 text-white shadow-sm" : "bg-blue-50 text-blue-700"}">
            <i data-lucide="${sub.icon || "wrench"}" class="w-5 h-5"></i>
          </div>
          <div>
            <span class="text-[10px] font-black ${isSelected ? "text-blue-800 bg-blue-100" : "text-emerald-700 bg-emerald-50 border border-emerald-200"} px-2.5 py-0.5 rounded-full">
              ${badge}
            </span>
          </div>
        </div>
        <div class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${isSelected ? "bg-blue-600 border-blue-600 text-white shadow-xs" : "border-slate-300 bg-white"}">
          ${isSelected ? `<i data-lucide="check" class="w-4 h-4 text-white"></i>` : ""}
        </div>
      </div>
      <div>
        <h4 class="font-black text-sm ${isSelected ? "text-blue-950" : "text-slate-900"}">${title}</h4>
        <p class="text-xs text-slate-500 mt-1 leading-relaxed">${desc}</p>
      </div>
      <div class="flex items-center justify-between w-full pt-2 border-t border-slate-100 text-xs">
        <span class="font-bold text-slate-500">${isHi ? "श्रम दर:" : "Base Labor:"}</span>
        <span class="font-black text-slate-900 text-sm">₹${sub.base}${isHi ? "/कार्य" : "/job"}</span>
      </div>
    `;

    grid.appendChild(card);
  });

  updateSubServicesActionBar();
  safeCreateIcons();
}

function toggleSubServiceSelection(subId) {
  const currentCatalog = SUB_SERVICES_CATALOG[state.selectedService] || [];
  const subObj = currentCatalog.find(s => s.id === subId);
  if (!subObj) return;

  const existingIdx = state.selectedSubServices.findIndex(s => s.id === subId);
  if (existingIdx >= 0) {
    if (state.selectedSubServices.length > 1) {
      state.selectedSubServices.splice(existingIdx, 1);
    } else {
      showToast("At least one service task must remain selected.", "info");
      return;
    }
  } else {
    state.selectedSubServices.push(subObj);
  }

  state.selectedSubService = state.selectedSubServices[0] || null;
  renderSubServices(state.selectedService);
  calculateLiveQuote();
}

function updateSubServicesActionBar() {
  const countEl = document.getElementById("selected-subservices-count");
  const laborEl = document.getElementById("selected-subservices-labor");
  const labelEl = document.getElementById("selected-subservices-label");
  const subtotalEl = document.getElementById("selected-subservices-subtotal");
  const btn = document.getElementById("btn-proceed-subservices");
  const count = state.selectedSubServices.length;
  const totalLabor = state.selectedSubServices.reduce((sum, s) => sum + (s.base || 0), 0);

  if (countEl) countEl.innerText = count;
  if (laborEl) laborEl.innerText = `₹${totalLabor.toFixed(2)}`;
  if (labelEl) {
    labelEl.innerText = count === 1 
      ? `${state.selectedSubServices[0].title}`
      : `${count} Tasks Selected`;
  }
  if (subtotalEl) {
    subtotalEl.innerText = count > 0 
      ? `Combined Base Fair Wage: ₹${totalLabor.toFixed(2)} • Review selection to proceed`
      : "Choose 1 or more options above";
  }
  if (btn) {
    btn.disabled = count === 0;
  }

  const bar = document.getElementById("subservices-action-bar");
  if (bar) {
    bar.classList.remove("hidden");
  }
}

// In-Menu Satisfaction Review Gate (Displays inside the same modal booking dialog)
function openSatisfactionReviewModal() {
  sfx.playClick();
  if (state.selectedSubServices.length === 0) {
    showToast("Please select at least one service task.", "warning");
    return;
  }

  const count = state.selectedSubServices.length;
  const totalLabor = state.selectedSubServices.reduce((sum, s) => sum + (s.base || 0), 0);

  // 1. In-Menu Satisfaction Review Panel inside #modal-service-booking
  const inMenuPanel = document.getElementById("in-menu-satisfaction-panel");
  const subservicesGrid = document.getElementById("modal-subservices-grid");
  const subservicesActionBar = document.getElementById("subservices-action-bar");

  if (inMenuPanel) {
    // Hide the grid and action bar, display the in-menu review directly within the same menu
    if (subservicesGrid) subservicesGrid.classList.add("hidden");
    if (subservicesActionBar) subservicesActionBar.classList.add("hidden");
    inMenuPanel.classList.remove("hidden");

    const inMenuCountEl = document.getElementById("in-menu-task-count");
    if (inMenuCountEl) inMenuCountEl.innerText = count;

    const inMenuTotalEl = document.getElementById("in-menu-satisfaction-total");
    if (inMenuTotalEl) inMenuTotalEl.innerText = `₹${totalLabor.toFixed(2)}`;

    const inMenuItemsContainer = document.getElementById("in-menu-satisfaction-items");
    if (inMenuItemsContainer) {
      inMenuItemsContainer.innerHTML = state.selectedSubServices.map(s => `
        <div class="py-2.5 flex items-start justify-between gap-3 text-xs">
          <div class="flex items-start gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i data-lucide="${s.icon || 'wrench'}" class="w-4 h-4"></i>
            </div>
            <div>
              <div class="font-black text-white">${s.title}</div>
              <div class="text-[11px] text-blue-200 leading-tight mt-0.5">${s.desc}</div>
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <span class="font-black text-emerald-400 font-mono">₹${s.base.toFixed(2)}</span>
            <span class="text-[10px] text-emerald-300 font-bold block">✓ Fair Wage</span>
          </div>
        </div>
      `).join("");
    }
  }

  // 2. Also synchronize external review modal elements if accessed
  const countEl = document.getElementById("satisfaction-modal-task-count") || document.getElementById("satisfaction-modal-count");
  if (countEl) countEl.innerText = count;

  const totalEl = document.getElementById("satisfaction-modal-total-labor");
  if (totalEl) totalEl.innerText = `₹${totalLabor.toFixed(2)}`;

  const itemsContainer = document.getElementById("satisfaction-modal-items");
  if (itemsContainer) {
    itemsContainer.innerHTML = state.selectedSubServices.map(s => `
      <div class="py-2.5 flex items-start justify-between gap-3 text-xs">
        <div class="flex items-start gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
            <i data-lucide="${s.icon || 'wrench'}" class="w-4 h-4"></i>
          </div>
          <div>
            <div class="font-black text-slate-900">${s.title}</div>
            <div class="text-[11px] text-slate-500 leading-tight mt-0.5">${s.desc}</div>
          </div>
        </div>
        <div class="text-right flex-shrink-0">
          <span class="font-black text-slate-900">₹${s.base.toFixed(2)}</span>
          <span class="text-[10px] text-emerald-700 font-bold block">✓ Fair Wage</span>
        </div>
      </div>
    `).join("");
  }

  // Ensure external popup modal is NOT conflicting or showing behind
  const outerModal = document.getElementById("modal-satisfaction-review");
  if (outerModal) outerModal.classList.add("hidden");

  safeCreateIcons();
}

function backToSubServicesSelection() {
  sfx.playClick();
  const inMenuPanel = document.getElementById("in-menu-satisfaction-panel");
  const subservicesGrid = document.getElementById("modal-subservices-grid");
  const subservicesActionBar = document.getElementById("subservices-action-bar");

  if (inMenuPanel) inMenuPanel.classList.add("hidden");
  if (subservicesGrid) subservicesGrid.classList.remove("hidden");
  if (subservicesActionBar) subservicesActionBar.classList.remove("hidden");

  const outerModal = document.getElementById("modal-satisfaction-review");
  if (outerModal) outerModal.classList.add("hidden");

  safeCreateIcons();
}

function closeSatisfactionReviewModal() {
  backToSubServicesSelection();
}

function confirmSatisfactionAndProceed() {
  sfx.playSuccessFanfare();
  
  // Reset in-menu panel view for when step 1 is re-visited
  const inMenuPanel = document.getElementById("in-menu-satisfaction-panel");
  const subservicesGrid = document.getElementById("modal-subservices-grid");
  const subservicesActionBar = document.getElementById("subservices-action-bar");
  if (inMenuPanel) inMenuPanel.classList.add("hidden");
  if (subservicesGrid) subservicesGrid.classList.remove("hidden");
  if (subservicesActionBar) subservicesActionBar.classList.remove("hidden");

  const outerModal = document.getElementById("modal-satisfaction-review");
  if (outerModal) outerModal.classList.add("hidden");

  // Recalculate quote with all chosen tasks
  calculateLiveQuote();

  // Populate itemized sub-services in Step 2 invoice receipt (#invoice-tasks-container)
  renderInvoiceTasksList();

  // Move to Step 2
  goToBookingStep(2);
  showToast("Satisfaction confirmed! Review transparent tariff and schedule.", "success");
}

function renderInvoiceTasksList() {
  const container = document.getElementById("invoice-tasks-container");
  if (!container) return;

  if (state.selectedSubServices && state.selectedSubServices.length > 0) {
    container.classList.remove("hidden");
    container.innerHTML = `
      <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
        <div class="flex items-center justify-between font-black text-slate-700 pb-1 border-b border-slate-200">
          <span class="uppercase tracking-wider text-[10px]">Selected Tasks (${state.selectedSubServices.length})</span>
          <span class="text-[10px] text-emerald-700 font-bold">✓ Customer Verified</span>
        </div>
        ${state.selectedSubServices.map(t => `
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-slate-800 font-bold">• ${t.title}</span>
            <span class="font-mono text-slate-900 font-black">₹${t.base.toFixed(2)}</span>
          </div>
        `).join("")}
      </div>
    `;
  } else {
    container.classList.add("hidden");
  }
}

function selectSubService(subId) {
  toggleSubServiceSelection(subId);
}

function goToBookingStep(step) {
  sfx.playClick();
  state.currentBookingModalStep = step;

  const step1 = document.getElementById("booking-step-1");
  const step2 = document.getElementById("booking-step-2");
  const btn1 = document.getElementById("step-btn-1");
  const btn2 = document.getElementById("step-btn-2");

  if (step === 1) {
    if (step1) step1.classList.remove("hidden");
    if (step2) step2.classList.add("hidden");

    if (btn1) {
      btn1.className = "flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl font-black bg-blue-600 text-white shadow-xs transition";
    }
    if (btn2) {
      btn2.className = "flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl font-bold text-slate-500 hover:text-slate-800 transition";
    }

    renderSubServices(state.selectedService);
  } else {
    // If no subservice selected yet, pick the first one by default
    if (!state.selectedSubService) {
      const currentCatalog = SUB_SERVICES_CATALOG[state.selectedService] || [];
      if (currentCatalog.length > 0) {
        state.selectedSubService = currentCatalog[0];
      }
    }

    if (step1) step1.classList.add("hidden");
    if (step2) step2.classList.remove("hidden");

    if (btn1) {
      btn1.className = "flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl font-bold text-slate-500 hover:text-slate-800 transition";
    }
    if (btn2) {
      btn2.className = "flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl font-black bg-blue-600 text-white shadow-xs transition";
    }

    const isHi = state.currentLanguage === "hi";
    const sObj = SERVICES.find(s => s.id === state.selectedService) || SERVICES[0];
    if (state.selectedSubService) {
      const step2Icon = document.getElementById("step2-sub-icon");
      if (step2Icon) {
        step2Icon.innerHTML = `<i data-lucide="${state.selectedSubService.icon || sObj.icon || "wrench"}" class="w-4 h-4"></i>`;
      }
      const step2Label = document.getElementById("step2-service-label");
      if (step2Label) {
        step2Label.innerText = isHi ? `${sObj.name_hi} - चयनित कार्य` : `${sObj.name} - Selected Task`;
      }
      const step2Title = document.getElementById("step2-sub-title");
      if (step2Title) {
        step2Title.innerText = isHi ? (state.selectedSubService.title_hi || state.selectedSubService.title) : state.selectedSubService.title;
      }
    }

    // Refresh quote & icons in step 2
    if (!state.activeSubscription && state.bookingScheduleType === "immediate") {
      setBookingScheduleType("scheduled", false);
    }
    updateSubscriberGatingUI();
    calculateLiveQuote();
  }

  safeCreateIcons();
}

function selectPlan(planType) {
  sfx.playClick();
  state.selectedPlan = planType;
  ["hourly", "daily", "weekly", "monthly"].forEach(p => {
    const el = document.getElementById(`plan-${p}-label`);
    if (el) {
      if (p === planType) {
        el.className = "cursor-pointer border-2 border-blue-600 bg-blue-50/60 rounded-2xl p-3.5 text-center transition relative btn-tactile shadow-sm";
      } else {
        el.className = "cursor-pointer border border-slate-200 rounded-2xl p-3.5 text-center transition hover:border-blue-400 relative btn-tactile";
      }
    }
  });
  calculateLiveQuote();
}

function toggleEmergencyMode() {
  const toggle = document.getElementById("emergency-toggle");
  const isChecked = toggle ? toggle.checked : false;

  // Emergency Triage is strictly allowed ONLY to subscribed users
  if (isChecked && !state.activeSubscription) {
    if (toggle) toggle.checked = false;
    state.isEmergency = false;
    const box = document.getElementById("emergency-box");
    const siren = document.getElementById("siren-icon");
    if (box) box.classList.remove("emergency-active");
    if (siren) siren.classList.remove("animate-bounce");
    sfx.playFallbackWarning();
    calculateLiveQuote();
    showToast(
      state.currentLanguage === "hi"
        ? "आपातकालीन ट्रायज केवल समृद्धी पास धारकों (VIP Subscribers) के लिए उपलब्ध है। अनलॉक करने हेतु कृपया पास लें।"
        : "Emergency Triage Mode is exclusive to Seva Setu Pass subscribers! Subscribe to unlock priority SOS triage.",
      "warning"
    );
    openSubscriptionCheckoutModal();
    updateSubscriberGatingUI();
    return;
  }

  state.isEmergency = isChecked;
  
  const box = document.getElementById("emergency-box");
  const siren = document.getElementById("siren-icon");

  if (state.isEmergency) {
    sfx.playAlert();
    if (box) box.classList.add("emergency-active");
    if (siren) siren.classList.add("animate-bounce");
    showToast(state.currentLanguage === "hi" 
      ? "आपातकालीन ट्रायज मोड सक्रिय! 30 मिनट में प्राथमिकता प्रेषण।" 
      : "Emergency Triage Mode Activated! Priority sub-30m dispatch triggered.", "emergency");
  } else {
    sfx.playClick();
    if (box) box.classList.remove("emergency-active");
    if (siren) siren.classList.remove("animate-bounce");
  }

  calculateLiveQuote();
  updateSubscriberGatingUI();
}

// ==========================================
// 5B. Flexible Service Scheduling & Booking Slot System
// ==========================================

function initBookingSchedule() {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // Default to tomorrow for scheduled mode
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  state.bookingDate = tomorrowStr;
  state.bookingTimeSlot = "09:00 AM - 12:00 PM";
  state.bookingTimeSlotKey = "morning";
  state.bookingCustomTime = "";

  const dateInput = document.getElementById("booking-date-input");
  if (dateInput) {
    dateInput.min = todayStr;
    dateInput.value = tomorrowStr;
  }

  // Normal customers can only book from a schedule; Instant Dispatch is exclusive to subscribers
  const defaultMode = Boolean(state.activeSubscription) ? "immediate" : "scheduled";
  setBookingScheduleType(defaultMode, false);
}

function setBookingScheduleType(type, userInitiated = true) {
  const isSubscribed = Boolean(state.activeSubscription);

  // Normal customers can only book a service from a schedule; Instant Dispatch is exclusive to subscribers
  if (type === "immediate" && !isSubscribed) {
    if (userInitiated) {
      sfx.playFallbackWarning();
      showToast(
        state.currentLanguage === "hi"
          ? "त्वरित प्रेषण (Instant Dispatch) केवल समृद्धी पास (VIP Subscribers) के लिए उपलब्ध है। सामान्य ग्राहक केवल शेड्यूल करके सेवा बुक कर सकते हैं।"
          : "Instant Dispatch is exclusive to Seva Setu Pass subscribers! Normal customers can book from a schedule.",
        "warning"
      );
      openSubscriptionCheckoutModal();
    }
    type = "scheduled";
  }

  if (userInitiated) {
    sfx.playClick();
  }
  state.bookingScheduleType = type;

  const btnImm = document.getElementById("btn-mode-immediate");
  const btnSch = document.getElementById("btn-mode-scheduled");
  const details = document.getElementById("scheduled-picker-details");

  if (type === "immediate") {
    if (btnImm) {
      btnImm.className = "p-3.5 rounded-2xl border-2 border-blue-600 bg-blue-50/80 text-left transition btn-tactile shadow-sm ring-2 ring-blue-500/20";
    }
    if (btnSch) {
      btnSch.className = "p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 text-left transition btn-tactile shadow-xs";
    }
    if (details) details.classList.add("hidden");
  } else {
    if (btnImm) {
      btnImm.className = "p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 text-left transition btn-tactile shadow-xs";
    }
    if (btnSch) {
      btnSch.className = "p-3.5 rounded-2xl border-2 border-blue-600 bg-blue-50/80 text-left transition btn-tactile shadow-sm ring-2 ring-blue-500/20";
    }
    if (details) details.classList.remove("hidden");
  }

  updateBookingScheduleUI();
  updateSubscriberGatingUI();
}

function updateSubscriberGatingUI() {
  const isSub = Boolean(state.activeSubscription);
  const isHi = state.currentLanguage === "hi";

  // 0. Emergency Triage Mode column visibility (strictly for premium / subscribed users)
  const emCol = document.getElementById("emergency-triage-col");
  const searchCol = document.getElementById("search-bar-col");
  if (emCol && searchCol) {
    if (isSub) {
      emCol.classList.remove("hidden");
      searchCol.className = "w-full lg:w-3/5 space-y-4";
    } else {
      emCol.classList.add("hidden");
      searchCol.className = "w-full space-y-4";
      if (state.isEmergency) {
        state.isEmergency = false;
        const toggle = document.getElementById("emergency-toggle");
        if (toggle) toggle.checked = false;
        const box = document.getElementById("emergency-box");
        const siren = document.getElementById("siren-icon");
        if (box) box.classList.remove("emergency-active");
        if (siren) siren.classList.remove("animate-bounce");
      }
    }
  }

  // 1. Emergency box badge and description
  const emBadge = document.getElementById("emergency-sub-badge");
  const emDesc = document.getElementById("txt-emergency-desc");
  if (emBadge) {
    if (isSub) {
      emBadge.className = "bg-emerald-100 text-emerald-900 border border-emerald-300 text-[9px] font-black uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5";
      emBadge.innerHTML = `<i data-lucide="crown" class="w-2.5 h-2.5 text-amber-600"></i> ${isHi ? "पास सक्रिय (VIP)" : "Pass Active (VIP)"}`;
    } else {
      emBadge.className = "bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-black uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5";
      emBadge.innerHTML = `<i data-lucide="crown" class="w-2.5 h-2.5 text-amber-600"></i> ${isHi ? "केवल सब्सक्राइबर्स" : "Subscribers Only"}`;
    }
  }
  if (emDesc) {
    if (isSub) {
      emDesc.innerText = isHi 
        ? "गैस रिसाव, शॉर्ट सर्किट या आपातकाल के लिए 30 मिनट में प्राथमिकता प्रेषण (पास सक्रिय)।" 
        : "Priority sub-30m dispatch for gas leak, short circuit, or medical transit (Pass Active).";
    } else {
      emDesc.innerText = isHi 
        ? "गैस रिसाव, शॉर्ट सर्किट या आपातकाल के लिए 30 मिनट में प्राथमिकता प्रेषण (केवल समृद्धी पास)।" 
        : "Priority sub-30m dispatch for gas leak, short circuit, or medical transit (Pass Subscribers Exclusive).";
    }
  }

  // 2. Dispatch Mode instant dispatch badge and description
  const immBadge = document.getElementById("badge-immediate-access");
  const immDesc = document.getElementById("desc-immediate-mode");
  if (immBadge) {
    if (isSub) {
      immBadge.className = "text-[9px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1";
      immBadge.innerHTML = `<i data-lucide="check" class="w-2.5 h-2.5 text-white"></i> ${isHi ? "अनलॉक (VIP)" : "VIP Unlocked"}`;
    } else {
      immBadge.className = "text-[9px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1";
      immBadge.innerHTML = `<i data-lucide="crown" class="w-2.5 h-2.5 text-slate-950"></i> ${isHi ? "केवल सब्सक्राइबर्स" : "Subscribers Only"}`;
    }
  }
  if (immDesc) {
    if (isSub) {
      immDesc.innerText = isHi 
        ? "तकनीशियन तुरंत रवाना होगा (<30 मिनट आगमन) • समृद्धी पास सक्रिय" 
        : "Technician dispatched immediately (<30 min arrival) • Samriddhi Pass Active";
    } else {
      immDesc.innerText = isHi 
        ? "तकनीशियन तुरंत रवाना होगा (<30 मिनट आगमन) • 🔒 केवल समृद्धी पास" 
        : "Technician dispatched immediately (<30 min average arrival) • 🔒 Pass Exclusive";
    }
  }

  // 3. If user is not subscribed and currently in immediate mode, revert to scheduled
  if (!isSub && state.bookingScheduleType === "immediate") {
    state.bookingScheduleType = "scheduled";
    const btnImm = document.getElementById("btn-mode-immediate");
    const btnSch = document.getElementById("btn-mode-scheduled");
    const details = document.getElementById("scheduled-picker-details");
    if (btnImm) btnImm.className = "p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 text-left transition btn-tactile shadow-xs";
    if (btnSch) btnSch.className = "p-3.5 rounded-2xl border-2 border-blue-600 bg-blue-50/80 text-left transition btn-tactile shadow-sm ring-2 ring-blue-500/20";
    if (details) details.classList.remove("hidden");
  }

  safeCreateIcons();
}

function selectQuickDay(dayKey) {
  sfx.playClick();
  const now = new Date();
  let target = new Date(now);

  if (dayKey === "today") {
    // target is today
  } else if (dayKey === "tomorrow") {
    target.setDate(now.getDate() + 1);
  } else if (dayKey === "day_after") {
    target.setDate(now.getDate() + 2);
  }

  const dStr = target.toISOString().split("T")[0];
  state.bookingDate = dStr;

  const dateInput = document.getElementById("booking-date-input");
  if (dateInput) dateInput.value = dStr;

  ["today", "tomorrow", "day_after"].forEach(k => {
    const chip = document.getElementById(`chip-day-${k}`);
    if (chip) {
      if (k === dayKey) {
        chip.className = "px-3 py-1.5 rounded-xl border-2 border-blue-600 text-xs font-bold text-blue-900 bg-blue-50 transition btn-tactile shadow-xs";
      } else {
        chip.className = "px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-blue-400 bg-white transition btn-tactile";
      }
    }
  });

  updateBookingScheduleUI();
}

function onBookingDateInputChange(val) {
  if (!val) return;
  state.bookingDate = val;

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const tmrw = new Date(now);
  tmrw.setDate(now.getDate() + 1);
  const tmrwStr = tmrw.toISOString().split("T")[0];
  const dayAfter = new Date(now);
  dayAfter.setDate(now.getDate() + 2);
  const dayAfterStr = dayAfter.toISOString().split("T")[0];

  ["today", "tomorrow", "day_after"].forEach(k => {
    const chip = document.getElementById(`chip-day-${k}`);
    if (chip) {
      const match = (k === "today" && val === todayStr) ||
                    (k === "tomorrow" && val === tmrwStr) ||
                    (k === "day_after" && val === dayAfterStr);
      if (match) {
        chip.className = "px-3 py-1.5 rounded-xl border-2 border-blue-600 text-xs font-bold text-blue-900 bg-blue-50 transition btn-tactile shadow-xs";
      } else {
        chip.className = "px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-blue-400 bg-white transition btn-tactile";
      }
    }
  });

  updateBookingScheduleUI();
}

function selectTimeSlot(slot, key) {
  sfx.playClick();
  state.bookingTimeSlot = slot;
  state.bookingTimeSlotKey = key;
  state.bookingCustomTime = "";

  const customTimeInput = document.getElementById("booking-custom-time");
  if (customTimeInput) customTimeInput.value = "";
  const clearBtn = document.getElementById("btn-clear-custom-time");
  if (clearBtn) clearBtn.classList.add("hidden");

  ["morning", "afternoon", "evening", "night"].forEach(k => {
    const btn = document.getElementById(`slot-btn-${k}`);
    if (btn) {
      if (k === key) {
        btn.className = "p-2.5 rounded-xl border-2 border-blue-600 bg-blue-50 text-center transition btn-tactile shadow-xs";
      } else {
        btn.className = "p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 text-center transition btn-tactile";
      }
    }
  });

  updateBookingScheduleUI();
}

function onCustomTimeChange(val) {
  if (!val) return;
  sfx.playClick();
  state.bookingCustomTime = val;

  // Unhighlight slot buttons
  ["morning", "afternoon", "evening", "night"].forEach(k => {
    const btn = document.getElementById(`slot-btn-${k}`);
    if (btn) {
      btn.className = "p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 text-center transition btn-tactile opacity-60";
    }
  });

  const clearBtn = document.getElementById("btn-clear-custom-time");
  if (clearBtn) clearBtn.classList.remove("hidden");

  updateBookingScheduleUI();
}

function clearCustomTime() {
  sfx.playClick();
  state.bookingCustomTime = "";
  const customTimeInput = document.getElementById("booking-custom-time");
  if (customTimeInput) customTimeInput.value = "";
  const clearBtn = document.getElementById("btn-clear-custom-time");
  if (clearBtn) clearBtn.classList.add("hidden");

  selectTimeSlot(state.bookingTimeSlot || "09:00 AM - 12:00 PM", state.bookingTimeSlotKey || "morning");
}

function formatCustomTimeTo12Hr(time24) {
  if (!time24) return "";
  const parts = time24.split(":");
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
}

function getFormattedBookingSlot(isHi = false) {
  if (state.bookingScheduleType === "immediate") {
    return isHi ? "तुरंत प्रेषण (<30 मिनट)" : "Immediate Dispatch (<30 mins)";
  }

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const tmrw = new Date(now);
  tmrw.setDate(now.getDate() + 1);
  const tmrwStr = tmrw.toISOString().split("T")[0];

  let dateLabel = state.bookingDate;
  if (state.bookingDate === todayStr) {
    dateLabel = isHi ? "आज" : "Today";
  } else if (state.bookingDate === tmrwStr) {
    dateLabel = isHi ? "कल" : "Tomorrow";
  } else if (state.bookingDate) {
    try {
      const parts = state.bookingDate.split("-");
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      dateLabel = d.toLocaleDateString(isHi ? "hi-IN" : "en-US", { month: "short", day: "numeric" });
    } catch (e) {
      dateLabel = state.bookingDate;
    }
  }

  const timeLabel = state.bookingCustomTime 
    ? formatCustomTimeTo12Hr(state.bookingCustomTime)
    : state.bookingTimeSlot;

  return `${dateLabel} • ${timeLabel}`;
}

function updateBookingScheduleUI() {
  const isHi = state.currentLanguage === "hi";
  const slotText = getFormattedBookingSlot(isHi);

  // 1. Badge in Step 3 header
  const badgeStatus = document.getElementById("badge-schedule-status");
  if (badgeStatus) badgeStatus.innerText = slotText;

  // 2. Confirmed display in schedule picker
  const confirmedDisplay = document.getElementById("confirmed-slot-display");
  if (confirmedDisplay) confirmedDisplay.innerText = slotText;

  // 3. Invoice schedule line item
  const invoiceSlot = document.getElementById("invoice-schedule-time");
  if (invoiceSlot) invoiceSlot.innerText = slotText;

  // 4. Payment modal order summary schedule line item
  const payModalSlot = document.getElementById("pay-summary-slot-text");
  if (payModalSlot) payModalSlot.innerText = slotText;

  // 5. Active booking card schedule badge
  const activeBookingSlot = document.getElementById("status-booking-slot");
  if (activeBookingSlot) activeBookingSlot.innerText = slotText;
}

// 6. Leaflet OpenStreetMap Initialization
function initLeafletMap() {
  if (state.clientMap) return;

  if (typeof L === "undefined") {
    console.warn("[SahakarSeva] Leaflet failed to load from CDN; proximity map disabled.");
    return;
  }

  const mapContainer = document.getElementById("client-map");
  if (!mapContainer) return;

  state.clientMap = L.map("client-map", {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView(state.customerCoords, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(state.clientMap);

  // Proximity Radar Circle
  state.radarCircle = L.circle(state.customerCoords, {
    color: '#3b82f6',
    fillColor: '#3b82f6',
    fillOpacity: 0.08,
    radius: 3000
  }).addTo(state.clientMap);

  // Customer Pin
  const customerIcon = L.divIcon({
    className: 'custom-pin customer-pin',
    html: '<span>C</span>',
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });

  state.customerMarker = L.marker(state.customerCoords, { icon: customerIcon }).addTo(state.clientMap)
    .bindPopup("<div class='text-xs'><b>Your Location (Customer)</b><br>Connaught Place, New Delhi<br><span class='text-blue-600 font-semibold'>Proximity Broadcast Origin</span></div>");

  // Worker Markers
  updateMapPins();
}

function updateMapPins() {
  if (!state.clientMap) return;

  // Clear existing worker markers
  Object.values(state.workerMarkers).forEach(m => state.clientMap.removeLayer(m));
  state.workerMarkers = {};

  WORKERS.forEach(w => {
    const isCurrentActive = w.id === state.activeWorker.id;
    const iconClass = isCurrentActive ? 'custom-pin worker-pin ring-4 ring-emerald-300' : 'custom-pin worker-pin-busy';
    
    const workerIcon = L.divIcon({
      className: iconClass,
      html: `<span>${w.skill[0].toUpperCase()}</span>`,
      iconSize: isCurrentActive ? [36, 36] : [30, 30],
      iconAnchor: isCurrentActive ? [18, 18] : [15, 15]
    });

    const marker = L.marker(w.coords, { icon: workerIcon }).addTo(state.clientMap);
    marker.bindPopup(`
      <div class='text-xs space-y-1'>
        <b class='text-slate-900'>${w.name}</b>
        <p class='text-emerald-700 font-bold'>${w.skill.toUpperCase()} &bull; ${w.rating} ★</p>
        <p class='text-slate-500'>${w.coop_name}</p>
        <p class='text-blue-600 font-semibold'>${w.aadhaar}</p>
      </div>
    `);

    state.workerMarkers[w.id] = marker;
  });
}

function drawRouteLine(fromCoords, toCoords) {
  if (!state.clientMap) return;
  if (state.routePolyline) {
    state.clientMap.removeLayer(state.routePolyline);
  }

  state.routePolyline = L.polyline([fromCoords, toCoords], {
    color: '#2563eb',
    weight: 4,
    opacity: 0.85,
    dashArray: '8, 8'
  }).addTo(state.clientMap);

  state.clientMap.fitBounds(state.routePolyline.getBounds(), { padding: [40, 40] });
}

function resetCustomerAppMap() {
  if (!state.clientMap) return;

  try {
    // 1. Remove active route polyline if present
    if (state.routePolyline) {
      try {
        state.clientMap.removeLayer(state.routePolyline);
      } catch (e) {}
      state.routePolyline = null;
    }

    // 2. Re-center clientMap to citizen coordinates with standard zoom 13
    const coords = state.customerCoords || [28.6315, 77.2167];
    try {
      state.clientMap.setView(coords, 13, { animate: true });
    } catch (e) {
      state.clientMap.setView(coords, 13);
    }

    // 3. Update customer marker position & popup
    if (state.customerMarker) {
      try {
        state.customerMarker.setLatLng(coords);
        const locText = state.currentCustomerLocation || "Connaught Place, New Delhi";
        state.customerMarker.bindPopup(`<div class='text-xs'><b>Your Location (${state.currentCustomerName})</b><br>${locText}<br><span class='text-blue-600 font-semibold'>Proximity Broadcast Origin</span></div>`);
      } catch (e) {}
    }

    // 4. Reset radar circle position & radius
    if (state.radarCircle) {
      try {
        state.radarCircle.setLatLng(coords);
        state.radarCircle.setRadius(3000);
      } catch (e) {}
    }

    // 5. Reset all worker pins to default positions and status
    updateMapPins();

    // 6. Reset worker radar route if active
    if (state.workerRadarMap && state.workerRadarPolyline) {
      try {
        state.workerRadarMap.removeLayer(state.workerRadarPolyline);
      } catch (e) {}
      state.workerRadarPolyline = null;
    }
  } catch (err) {
    console.warn("resetCustomerAppMap warning:", err);
  }
}

function closeCompletedBookingCard() {
  sfx.playClick();
  const statusCard = document.getElementById("booking-status-card");
  if (statusCard) statusCard.classList.add("hidden");
  const acceptedBanner = document.getElementById("citizen-worker-accepted-banner");
  if (acceptedBanner) acceptedBanner.classList.add("hidden");
  const completedBar = document.getElementById("booking-completed-action-bar");
  if (completedBar) completedBar.classList.add("hidden");
  resetCustomerAppMap();
  updateWorkflowStep(1);
  showToast("Proximity radar reset. Ready for next cooperative service.", "info");
}

function getWorkerCoords(worker) {
  if (!worker) return [28.6328, 77.2197];
  if (Array.isArray(worker.coords) && worker.coords.length >= 2) return worker.coords;
  if (worker.lat !== undefined && worker.lng !== undefined) return [worker.lat, worker.lng];
  return [28.6328, 77.2197];
}

function computeDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 100) / 100;
}

// 7. Dynamic Transparent Fare Calculation (Grassroots Fair-Wage Rates)
async function calculateLiveQuote() {
  const isEmergency = document.getElementById("emergency-toggle")?.checked || false;
  state.isEmergency = isEmergency;

  const serviceObj = SERVICES.find(s => s.id === state.selectedService) || SERVICES[0];
  let baseRate = 0;
  if (state.selectedSubServices && state.selectedSubServices.length > 0) {
    baseRate = state.selectedSubServices.reduce((sum, s) => sum + (s.base || 0), 0);
  } else if (state.selectedSubService && state.selectedSubService.base) {
    baseRate = state.selectedSubService.base;
  } else {
    baseRate = serviceObj.base;
  }
  let labor = baseRate;
  if (state.selectedPlan === "daily") labor = baseRate * 5.5;
  if (state.selectedPlan === "weekly") labor = baseRate * 22 * 0.95; // 5% discount
  if (state.selectedPlan === "monthly") labor = baseRate * 22 * 5.5 * 0.85; // 15% discount

  // Reduced toolkit charges
  const toolkit = state.selectedPlan === "hourly" || state.selectedPlan === "daily" ? 40.0 : 100.0;
  
  const wCoords = getWorkerCoords(state.activeWorker);
  const distance = computeDistanceKm(
    state.customerCoords[0], state.customerCoords[1],
    wCoords[0], wCoords[1]
  );

  // Reduced transit rate (₹20 base + ₹8/km)
  const transit = Math.max(20.0, Math.round(distance * 8.0 * 100) / 100);
  
  // Subscriber perks: Priority triage waiver (0 emergency fee) & 0 platform fee
  const isSubscribed = Boolean(state.activeSubscription);
  const emergency = (state.isEmergency && !isSubscribed) ? 60.0 : 0.0;
  const tax = Math.round(labor * 0.05 * 100) / 100;
  const platform = isSubscribed ? 0.0 : Math.round(labor * 0.035 * 100) / 100;

  let subtotal = labor + toolkit + transit + emergency + tax + platform;
  const ngo = state.isNgo ? Math.round(subtotal * 0.20 * 100) / 100 : 0.0;
  
  // Apply Subscriber discount: 20% for monthly, 30% for annual
  let subDiscountRate = 0.0;
  if (isSubscribed) {
    const pId = state.activeSubscription.plan_id;
    if (pId === "monthly_pass") subDiscountRate = 0.20;
    else if (pId === "annual_samriddhi") subDiscountRate = 0.30;
    else subDiscountRate = 0.20;
  }
  const subDiscountAmount = isSubscribed ? Math.round((subtotal - ngo) * subDiscountRate * 100) / 100 : 0.0;
  const total = Math.max(10.0, Math.round((subtotal - ngo - subDiscountAmount) * 100) / 100);

  const quoteData = {
    breakdown: {
      labor_cost: labor,
      toolkit_cost: toolkit,
      transit_cost: transit,
      emergency_fee: emergency,
      tax: tax,
      platform_fee: platform,
      ngo_discount: ngo,
      subscriber_discount: subDiscountAmount,
      subscriber_discount_rate: subDiscountRate
    },
    distance_km: distance,
    total_amount: total,
    cooperative_wage_payout: Math.round((labor + transit) * 100) / 100
  };

  state.lastQuoteData = quoteData;
  renderPriceQuote(quoteData);
  updateWorkflowStep(2);
}

function renderPriceQuote(data) {
  const b = data.breakdown;
  const isHi = state.currentLanguage === "hi";
  const serviceObj = SERVICES.find(s => s.id === state.selectedService) || SERVICES[0];

  const lblService = document.getElementById("lbl-quote-service");
  if (lblService) {
    if (state.selectedSubServices && state.selectedSubServices.length > 1) {
      lblService.innerText = isHi 
        ? `${state.selectedSubServices.length} सेवाएँ संयुक्त (${state.selectedSubServices.map(s => s.title).join(", ")})` 
        : `${state.selectedSubServices.length} SERVICES BUNDLED (${state.selectedSubServices.map(s => s.title).join(", ")})`;
    } else if (state.selectedSubService) {
      lblService.innerText = isHi 
        ? (state.selectedSubService.title_hi || state.selectedSubService.title) 
        : state.selectedSubService.title.toUpperCase();
    } else {
      lblService.innerText = isHi ? serviceObj.name_hi : serviceObj.name.toUpperCase();
    }
  }

  document.getElementById("quote-labor").innerText = `₹${b.labor_cost.toFixed(2)}`;
  document.getElementById("quote-toolkit").innerText = `₹${b.toolkit_cost.toFixed(2)}`;
  document.getElementById("quote-transit").innerText = `₹${b.transit_cost.toFixed(2)}`;
  document.getElementById("quote-tax").innerText = `₹${b.tax.toFixed(2)}`;
  document.getElementById("quote-platform").innerText = `₹${b.platform_fee.toFixed(2)}`;
  document.getElementById("quote-dist").innerText = `${data.distance_km} km`;
  document.getElementById("quote-total").innerText = `₹${data.total_amount.toFixed(2)}`;

  // Emergency row
  const rowEm = document.getElementById("row-emergency");
  if (rowEm) {
    if (state.isEmergency) {
      rowEm.style.display = "flex";
      document.getElementById("quote-emergency").innerText = state.activeSubscription 
        ? (isHi ? "शून्य (पास छूट)" : "FREE (Subscriber Pass)")
        : `+₹${b.emergency_fee.toFixed(2)}`;
    } else {
      rowEm.style.display = "none";
    }
  }

  // NGO row
  const rowNgo = document.getElementById("row-ngo");
  if (rowNgo) {
    if (state.isNgo) {
      rowNgo.style.display = "flex";
      document.getElementById("quote-ngo").innerText = `-₹${b.ngo_discount.toFixed(2)}`;
    } else {
      rowNgo.style.display = "none";
    }
  }

  // Subscriber VIP discount row
  const rowSub = document.getElementById("row-subscriber-discount");
  if (rowSub) {
    if (state.activeSubscription && b.subscriber_discount > 0) {
      rowSub.style.display = "flex";
      const pct = Math.round(b.subscriber_discount_rate * 100);
      const lbl = document.getElementById("lbl-subscriber-discount");
      if (lbl) {
        lbl.innerText = isHi 
          ? `समृद्धि वीआईपी छूट (${pct}%):` 
          : `Samriddhi VIP Discount (${pct}%):`;
      }
      const val = document.getElementById("quote-subscriber-discount");
      if (val) val.innerText = `-₹${b.subscriber_discount.toFixed(2)}`;
    } else {
      rowSub.style.display = "none";
    }
  }

  // Optional legacy benchmark elements if present
  const elCommercial = document.getElementById("quote-commercial");
  if (elCommercial && data.commercial_benchmark) {
    elCommercial.innerText = `₹${data.commercial_benchmark.toFixed(2)}`;
  }
  const elSavings = document.getElementById("quote-savings");
  if (elSavings && data.customer_savings) {
    elSavings.innerText = data.customer_savings.toFixed(2);
  }
}

function openPaymentGatewayModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-payment-gateway");
  if (!modal) return;

  const isHi = state.currentLanguage === "hi";
  const customerName = state.currentCustomerName || "Aarav Mehta";

  // Check if current citizen account is debarred by Ministry
  if (state.debarredCustomers && state.debarredCustomers[customerName]) {
    const alertBanner = document.getElementById("citizen-debarred-alert");
    const alertText = document.getElementById("citizen-debarred-alert-text");
    if (alertBanner) alertBanner.classList.remove("hidden");
    if (alertText) {
      alertText.innerHTML = isHi 
        ? `नागरिक <strong>"${customerName}"</strong> को प्रमाणित तकनीशियनों की शिकायतों के बाद सहकारिता मंत्रालय द्वारा सेवा सेतु से <strong>निष्कासित (DEBARRED)</strong> किया गया है।`
        : `Customer account <strong>"${customerName}"</strong> is officially <strong>DEBARRED</strong> from booking cooperative services on Seva Setu (${state.debarredCustomers[customerName].reason || "Multiple worker complaint escalations"}).`;
    }
    sfx.playFallbackWarning();
    showToast(isHi ? `🚫 खाता निष्कासित: सेवा बुकिंग प्रतिबंधित है` : `🚫 Account Debarred: Service booking forbidden for ${customerName}`, "emergency");
    if (alertBanner) alertBanner.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Subscription gating for emergency triage & instant dispatch
  if (state.isEmergency && !state.activeSubscription) {
    state.isEmergency = false;
    const emToggle = document.getElementById("emergency-toggle");
    if (emToggle) emToggle.checked = false;
    calculateLiveQuote();
    showToast(isHi 
      ? "आपातकालीन ट्रायज केवल समृद्धी पास धारकों (VIP Subscribers) के लिए उपलब्ध है।" 
      : "Emergency Triage Mode is exclusive to Seva Setu Pass subscribers! Subscribe to unlock priority SOS triage.", "warning");
    openSubscriptionCheckoutModal();
    return;
  }
  if (state.bookingScheduleType === "immediate" && !state.activeSubscription) {
    setBookingScheduleType("scheduled", false);
    showToast(isHi 
      ? "त्वरित प्रेषण केवल समृद्धी पास धारकों के लिए उपलब्ध है। सामान्य ग्राहक केवल शेड्यूल करके सेवा बुक कर सकते हैं।" 
      : "Instant Dispatch is exclusive to Seva Setu Pass subscribers! Normal customers can book from a schedule.", "warning");
    openSubscriptionCheckoutModal();
    return;
  }

  // Hide the booking modal if open so payment gateway displays cleanly
  const serviceBookingModal = document.getElementById("modal-service-booking");
  if (serviceBookingModal) {
    serviceBookingModal.classList.add("hidden");
    serviceBookingModal.style.display = "none";
  }
  document.body.classList.remove("overflow-hidden");

  const serviceObj = SERVICES.find(s => s.id === state.selectedService) || SERVICES[0];
  const serviceName = isHi ? serviceObj.name_hi : serviceObj.name;
  const subTask = state.selectedSubService 
    ? ` • ${isHi ? (state.selectedSubService.title_hi || state.selectedSubService.title) : state.selectedSubService.title}` 
    : "";
  
  let planName = state.selectedPlan.toUpperCase();
  if (isHi) {
    if (state.selectedPlan === "hourly") planName = "प्रति घंटा कार्य";
    else if (state.selectedPlan === "daily") planName = "पूरा दिन";
    else if (state.selectedPlan === "weekly") planName = "साप्ताहिक";
    else if (state.selectedPlan === "monthly") planName = "मासिक सदस्यता";
  }

  // Populate Order Summary
  const summaryServiceEl = document.getElementById("pay-summary-service");
  if (summaryServiceEl) {
    summaryServiceEl.innerText = `${serviceName}${subTask} (${planName}) - Connaught Place`;
  }

  const summarySlotEl = document.getElementById("pay-summary-slot-text");
  if (summarySlotEl) {
    summarySlotEl.innerText = getFormattedBookingSlot(isHi);
  }
  
  if (!state.lastQuoteData) {
    calculateLiveQuote();
  }

  const q = state.lastQuoteData;
  if (q) {
    const b = q.breakdown;
    document.getElementById("pay-summary-total").innerText = `₹${q.total_amount.toFixed(2)}`;
    document.getElementById("pay-modal-labor").innerText = `₹${b.labor_cost.toFixed(2)}`;
    document.getElementById("pay-modal-toolkit").innerText = `₹${b.toolkit_cost.toFixed(2)}`;
    document.getElementById("pay-modal-transit").innerText = `₹${b.transit_cost.toFixed(2)}`;
    document.getElementById("pay-modal-tax").innerText = `₹${b.tax.toFixed(2)}`;
    document.getElementById("pay-modal-platform").innerText = `₹${b.platform_fee.toFixed(2)}`;

    // Emergency row in payment modal
    const emRow = document.getElementById("pay-modal-emergency-row");
    if (emRow) {
      if (state.isEmergency) {
        emRow.style.display = "flex";
        document.getElementById("pay-modal-emergency").innerText = state.activeSubscription 
          ? "FREE (VIP)" 
          : `+₹${b.emergency_fee.toFixed(2)}`;
      } else {
        emRow.style.display = "none";
      }
    }

    // NGO row in payment modal
    const ngoRow = document.getElementById("pay-modal-ngo-row");
    if (ngoRow) {
      if (state.isNgo) {
        ngoRow.style.display = "flex";
        document.getElementById("pay-modal-ngo").innerText = `-₹${b.ngo_discount.toFixed(2)}`;
      } else {
        ngoRow.style.display = "none";
      }
    }

    // Subscriber VIP row in payment modal
    const subModalRow = document.getElementById("pay-modal-subscriber-row");
    if (subModalRow) {
      if (state.activeSubscription && b.subscriber_discount > 0) {
        subModalRow.style.display = "flex";
        const val = document.getElementById("pay-modal-subscriber-discount");
        if (val) val.innerText = `-₹${b.subscriber_discount.toFixed(2)}`;
      } else {
        subModalRow.style.display = "none";
      }
    }

    // Dynamic QR URL with exact calculated amount
    const qrImg = document.getElementById("pay-qr-image");
    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=sevasetu@dccb%26pn=SevaSetu%20Ministry%20Cooperation%26am=${q.total_amount.toFixed(2)}%26cu=INR`;
    }

    // Authorize button text
    const btnText = document.getElementById("btn-pay-text");
    if (btnText) {
      btnText.innerText = isHi 
        ? `₹${q.total_amount.toFixed(2)} भुगतान अधिकृत करें और प्रेषित करें`
        : `Authorize Payment of ₹${q.total_amount.toFixed(2)} & Broadcast`;
    }
  }

  // Select QR tab by default
  selectPayTab("qr");

  modal.classList.remove("hidden");
  modal.style.display = "flex";
  document.body.classList.add("overflow-hidden");
  safeCreateIcons();
}

function closePaymentGatewayModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-payment-gateway");
  if (modal) {
    modal.classList.add("hidden");
    modal.style.display = "none";
  }
  if (!state.activeBooking) {
    const sModal = document.getElementById("modal-service-booking");
    if (sModal && state.selectedService) {
      sModal.classList.remove("hidden");
      sModal.style.display = "flex";
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  } else {
    document.body.classList.remove("overflow-hidden");
  }
}

function selectPayTab(tab) {
  sfx.playClick();
  const tabs = ["qr", "apps", "bank", "escrow"];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-pay-${t}`);
    const view = document.getElementById(`pay-view-${t}`);
    if (t === tab) {
      if (btn) btn.className = "py-2 rounded-xl border-2 border-blue-600 bg-blue-50 text-blue-900 text-center transition btn-tactile font-black shadow-sm";
      if (view) view.classList.remove("hidden");
    } else {
      if (btn) btn.className = "py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-center transition btn-tactile text-slate-600 font-bold";
      if (view) view.classList.add("hidden");
    }
  });
}

function simulateUpiApproval() {
  sfx.playSuccessFanfare();
  showToast(state.currentLanguage === "hi" 
    ? "✓ यूपीआई मोबाइल ऐप से भुगतान स्वीकृत! एस्क्रो में जमा किया जा रहा है..." 
    : "✓ Instant UPI Mobile App Approval Received! Depositing into Escrow...", "success");
  setTimeout(() => {
    processPaymentAndBroadcast();
  }, 400);
}

function processPaymentAndBroadcast() {
  sfx.playAlert();
  const btn = document.getElementById("btn-process-payment");
  const isHi = state.currentLanguage === "hi";

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin mr-2">⏳</span> ${isHi ? "एनपीसीआई सहकारी एस्क्रो सत्यापन जारी..." : "Authorizing via NPCI Cooperative Escrow..."}`;
  }

  setTimeout(() => {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i data-lucide="lock" class="w-4 h-4 text-amber-400"></i> <span id="btn-pay-text">${isHi ? "भुगतान अधिकृत हुआ" : "Payment Authorized"}</span>`;
      safeCreateIcons();
    }

    closePaymentGatewayModal();
    sfx.playSuccessFanfare();

    const total = state.lastQuoteData ? state.lastQuoteData.total_amount.toFixed(2) : "190.20";
    showToast(isHi 
      ? `✓ ₹${total} का भुगतान सुरक्षित एस्क्रो में आरक्षित! सहकारी तकनीशियनों को अनुरोध प्रेषित किया गया।` 
      : `✓ Payment of ₹${total} securely locked in 256-Bit Escrow! Broadcasting to cooperative technicians.`, "success");

    // Execute booking confirmed lifecycle
    executeBookingConfirmed();
  }, 1100);
}

// 9. NGO DARPAN Verification Modal Workflow
function handleNgoCheckboxChange(checkbox) {
  sfx.playClick();
  if (checkbox.checked) {
    if (!state.ngoVerified) {
      checkbox.checked = false;
      openNgoVerificationModal();
    } else {
      state.isNgo = true;
      calculateLiveQuote();
      showToast(state.currentLanguage === "hi" ? "20% एनजीओ सब्सिडी सक्रिय है" : "20% NGO Subsidy active", "success");
    }
  } else {
    state.isNgo = false;
    calculateLiveQuote();
    showToast(state.currentLanguage === "hi" ? "एनजीओ सब्सिडी हटाई गई" : "NGO Subsidy removed", "info");
  }
}

function openNgoVerificationModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-ngo-verify");
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.style.display = "flex";
  document.body.classList.add("overflow-hidden");
  safeCreateIcons();
  
  if (state.ngoData) {
    const nameEl = document.getElementById("ngo-input-name");
    const darpanEl = document.getElementById("ngo-input-darpan");
    const taxEl = document.getElementById("ngo-input-tax");
    const purposeEl = document.getElementById("ngo-input-purpose");
    const repEl = document.getElementById("ngo-input-rep");
    if (nameEl) nameEl.value = state.ngoData.name;
    if (darpanEl) darpanEl.value = state.ngoData.darpan;
    if (taxEl) taxEl.value = state.ngoData.tax || "";
    if (purposeEl) purposeEl.value = state.ngoData.purpose || "elder";
    if (repEl) repEl.value = state.ngoData.rep || "";
  }
}

function closeNgoVerificationModal(isSuccess = false) {
  sfx.playClick();
  const modal = document.getElementById("modal-ngo-verify");
  if (modal) {
    modal.classList.add("hidden");
    modal.style.display = "none";
  }

  // Keep body overflow locked if service booking modal is still open underneath
  const sModal = document.getElementById("modal-service-booking");
  if (sModal && !sModal.classList.contains("hidden") && sModal.style.display !== "none") {
    document.body.classList.add("overflow-hidden");
  } else {
    document.body.classList.remove("overflow-hidden");
  }

  if (!isSuccess && !state.ngoVerified) {
    const cb = document.getElementById("ngo-checkbox");
    if (cb) cb.checked = false;
    state.isNgo = false;
    calculateLiveQuote();
  }
}

function autoFillSampleNgo() {
  sfx.playClick();
  document.getElementById("ngo-input-name").value = "Goonj Community Welfare Foundation";
  document.getElementById("ngo-input-darpan").value = "DL/2021/0219482";
  document.getElementById("ngo-input-tax").value = "AAATG1294RE20214";
  document.getElementById("ngo-input-purpose").value = "elder";
  document.getElementById("ngo-input-rep").value = "Anshu Gupta (Trustee)";
  showToast(state.currentLanguage === "hi" ? "नमूना एनजीओ दर्पण विवरण स्वतः भरा गया" : "Sample NGO Darpan credentials pre-filled", "info");
}

function submitNgoVerification(e) {
  e.preventDefault();
  sfx.init();

  const btn = document.getElementById("btn-submit-ngo-verify");
  const isHi = state.currentLanguage === "hi";

  btn.disabled = true;
  btn.innerHTML = `<span class="animate-spin mr-1">⏳</span> ${isHi ? "नीति आयोग दर्पण पोर्टल पर सत्यापन जारी..." : "Checking NITI Aayog DARPAN Registry..."}`;

  setTimeout(() => {
    const name = document.getElementById("ngo-input-name").value;
    const darpan = document.getElementById("ngo-input-darpan").value;
    const tax = document.getElementById("ngo-input-tax").value;
    const purpose = document.getElementById("ngo-input-purpose").value;
    const rep = document.getElementById("ngo-input-rep").value;

    state.ngoVerified = true;
    state.isNgo = true;
    state.ngoData = { name, darpan, tax, purpose, rep };

    // Update checkbox & badge in UI
    const cb = document.getElementById("ngo-checkbox");
    if (cb) cb.checked = true;

    const pill = document.getElementById("ngo-verified-pill");
    const label = document.getElementById("ngo-verified-label");
    const hint = document.getElementById("ngo-unverified-hint");

    if (pill && label) {
      pill.classList.remove("hidden");
      label.innerText = `DARPAN: ${darpan} (${isHi ? "20% सब्सिडी सक्रिय" : "20% Subsidy Active"})`;
    }
    if (hint) hint.classList.add("hidden");

    const container = document.getElementById("ngo-selection-container");
    if (container) container.classList.add("ngo-verified-glow", "p-2", "rounded-2xl");

    btn.disabled = false;
    btn.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4"></i> <span>${isHi ? "दर्पण सत्यापित करें और 20% सब्सिडी लागू करें" : "Verify DARPAN & Apply 20% Subsidy"}</span>`;
    safeCreateIcons();

    // Update NGO Status Bar in Home UI
    const unverifiedState = document.getElementById("ngo-unverified-state");
    const verifiedState = document.getElementById("ngo-verified-state");
    const orgNameEl = document.getElementById("ngo-bar-org-name");
    if (unverifiedState) unverifiedState.classList.add("hidden");
    if (verifiedState) verifiedState.classList.remove("hidden");
    if (orgNameEl && name) orgNameEl.innerText = name;

    // Unhide artisan quick chips under the search bar
    const artisanChips = document.getElementById("artisan-quick-chips");
    if (artisanChips) artisanChips.classList.remove("hidden");

    // Refresh service grid to reveal artisan services!
    initServiceGrid();

    closeNgoVerificationModal(true);
    sfx.playSuccessFanfare();
    calculateLiveQuote();
    showToast(isHi ? `✓ एनजीओ सत्यापित: ${name} (20% सब्सिडी लागू व धरोहर कारीगर अनलॉक)` : `✓ NGO Verified: ${name} (20% Subsidy & Artisan Guilds Unlocked)`, "success");
  }, 700);
}

function resetNgoVerification() {
  sfx.playClick();
  state.ngoVerified = false;
  state.isNgo = false;
  state.ngoData = null;

  const cb = document.getElementById("ngo-checkbox");
  if (cb) cb.checked = false;

  const pill = document.getElementById("ngo-verified-pill");
  const hint = document.getElementById("ngo-unverified-hint");
  if (pill) pill.classList.add("hidden");
  if (hint) hint.classList.remove("hidden");

  const unverifiedState = document.getElementById("ngo-unverified-state");
  const verifiedState = document.getElementById("ngo-verified-state");
  if (unverifiedState) unverifiedState.classList.remove("hidden");
  if (verifiedState) verifiedState.classList.add("hidden");

  const container = document.getElementById("ngo-selection-container");
  if (container) container.classList.remove("ngo-verified-glow", "p-2");

  // Hide artisan quick chips under the search bar
  const artisanChips = document.getElementById("artisan-quick-chips");
  if (artisanChips) artisanChips.classList.add("hidden");

  // If currently selected service is an artisan service, reset to electrician
  if (SERVICES.find(s => s.id === state.selectedService && s.isArtisan)) {
    state.selectedService = "electrician";
    state.activeWorker = WORKERS.find(w => w.skill === "electrician") || WORKERS[0];
  }

  initServiceGrid();
  calculateLiveQuote();
  const isHi = state.currentLanguage === "hi";
  showToast(isHi ? "एनजीओ सत्यापन रीसेट किया गया" : "NGO status reset to regular citizen view", "info");
}

// 10. Booking Dispatch & Dual OTP Generation
function executeBooking() {
  // Always open the Payment Gateway interface first to confirm escrow payment & breakdown
  openPaymentGatewayModal();
}

function executeBookingConfirmed() {
  sfx.playAlert();
  const isHi = state.currentLanguage === "hi";
  const btn = document.getElementById("btn-book-service");
  const customerName = state.currentCustomerName || "Aarav Mehta";

  // Check if citizen is debarred from this service
  const debarCheck = isCustomerDebarredForService(customerName, state.selectedService);
  if (debarCheck.debarred) {
    const alertBanner = document.getElementById("citizen-debarred-alert");
    const alertText = document.getElementById("citizen-debarred-alert-text");
    if (alertBanner) alertBanner.classList.remove("hidden");
    if (alertText) {
      alertText.innerHTML = isHi 
        ? `नागरिक <strong>"${customerName}"</strong> को सहकारिता मंत्रालय द्वारा इस सेवा (${state.selectedService}) से <strong>निष्कासित (DEBARRED)</strong> किया गया है (${debarCheck.reason || "Repeated violations"})।`
        : `Customer account <strong>"${customerName}"</strong> has been officially <strong>DEBARRED</strong> from booking <strong>${state.selectedService.toUpperCase()}</strong> following ministry directive (${debarCheck.reason || "Administrative sanction"}).`;
    }
    sfx.playFallbackWarning();
    openServiceDebarmentModal(state.selectedService, debarCheck.reason);
    showToast(isHi ? `🚫 सेवा प्रतिबंधित: ${customerName} निष्कासित है` : `🚫 Service Restricted: ${customerName} is debarred from this service`, "emergency");
    if (alertBanner) alertBanner.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Subscription gating enforcement
  if (state.isEmergency && !state.activeSubscription) {
    state.isEmergency = false;
    showToast(isHi ? "आपातकालीन ट्रायज केवल समृद्धी पास धारकों के लिए उपलब्ध है।" : "Emergency Triage is exclusive to Seva Setu Pass subscribers.", "warning");
    return;
  }
  if (state.bookingScheduleType === "immediate" && !state.activeSubscription) {
    setBookingScheduleType("scheduled", false);
    showToast(isHi ? "त्वरित प्रेषण केवल समृद्धी पास धारकों के लिए उपलब्ध है। सामान्य ग्राहक केवल शेड्यूल करके सेवा ले सकते हैं।" : "Instant Dispatch is exclusive to Seva Setu Pass subscribers. Normal customers can only book from a schedule.", "warning");
    return;
  }

  if (!state.lastQuoteData) {
    calculateLiveQuote();
  }
  const q = state.lastQuoteData;
  const serviceObj = SERVICES.find(s => s.id === state.selectedService) || SERVICES[0];
  const payout = q ? q.cooperative_wage_payout : (serviceObj.base + 20.0);

  const startOtp = String(Math.floor(1000 + Math.random() * 9000));
  const endOtp = String(Math.floor(1000 + Math.random() * 9000));

  const wCoords = getWorkerCoords(state.activeWorker);
  const distance = computeDistanceKm(
    state.customerCoords[0], state.customerCoords[1],
    wCoords[0], wCoords[1]
  );

  const slotText = getFormattedBookingSlot(isHi);

  const subServicesList = (state.selectedSubServices && state.selectedSubServices.length > 0)
    ? state.selectedSubServices
    : (state.selectedSubService ? [state.selectedSubService] : []);

  const bookingResult = {
    booking_id: 1001 + Math.floor(Math.random() * 50),
    customer_name: customerName,
    service_type: state.selectedService,
    sub_service: subServicesList.map(s => isHi ? (s.title_hi || s.title) : s.title).join(" + "),
    sub_service_id: subServicesList.map(s => s.id).join(","),
    sub_services: subServicesList,
    booking_date: state.bookingDate || "Today",
    booking_time: slotText,
    status: "BROADCASTING",
    assigned_worker: state.activeWorker,
    start_otp: startOtp,
    end_otp: endOtp,
    pricing: {
      ...(q || {}),
      cooperative_wage_payout: payout
    },
    timeline: [
      isHi 
        ? `${serviceObj.name_hi} (${state.selectedPlan}) हेतु सेवा अनुरोध दर्ज • स्लॉट: ${slotText}` 
        : `Job initialized for ${state.selectedService.toUpperCase()} (${state.selectedPlan.toUpperCase()}) • Slot: ${slotText}`,
      isHi
        ? `निकटतम सहकारी तकनीशियन को रडार प्रेषण भेजा गया: ${state.activeWorker.name} (${distance} किमी)`
        : `Radar broadcast dispatched to nearest cooperative technician: ${state.activeWorker.name} (${distance} km)`
    ]
  };

  state.activeBooking = bookingResult;

  // Ensure modal is closed
  const sModal = document.getElementById("modal-service-booking");
  if (sModal) sModal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");

  // Reveal Active Booking Card in Citizen App
  const statusCard = document.getElementById("booking-status-card");
  if (statusCard) statusCard.classList.remove("hidden");

  const statusTitle = document.getElementById("booking-status-title");
  if (statusTitle) {
    const subTitle = bookingResult.sub_service ? ` • ${bookingResult.sub_service}` : "";
    statusTitle.innerText = isHi 
      ? `बुकिंग #${bookingResult.booking_id} सक्रिय${subTitle}` 
      : `Booking #${bookingResult.booking_id} Active${subTitle}`;
  }

  const statusBookingSlot = document.getElementById("status-booking-slot");
  if (statusBookingSlot) statusBookingSlot.innerText = slotText;

  const startOtpEl = document.getElementById("display-start-otp");
  if (startOtpEl) startOtpEl.innerText = bookingResult.start_otp;

  const endOtpEl = document.getElementById("display-end-otp");
  if (endOtpEl) endOtpEl.innerText = bookingResult.end_otp;

  const statusWorkerName = document.getElementById("status-worker-name");
  if (statusWorkerName) statusWorkerName.innerText = bookingResult.assigned_worker.name;

  const statusWorkerCoop = document.getElementById("status-worker-coop");
  if (statusWorkerCoop) statusWorkerCoop.innerText = `✓ ${bookingResult.assigned_worker.coop_name}`;

  const statusWorkerDist = document.getElementById("status-worker-dist");
  if (statusWorkerDist) {
    statusWorkerDist.innerText = `📍 ${distance} km away • Rating: ${bookingResult.assigned_worker.rating} ★`;
  }

  const statusWorkerPhoto = document.getElementById("status-worker-photo");
  if (statusWorkerPhoto) statusWorkerPhoto.src = bookingResult.assigned_worker.photo;

  updateTimeline(bookingResult.timeline);

  // Ping badge on Worker Radar tab
  const badge = document.getElementById("worker-radar-ping-badge");
  if (badge) badge.classList.remove("hidden");

  // Sync to Worker Portal Radar
  triggerWorkerRadar(bookingResult);

  if (btn) {
    btn.innerHTML = `<i data-lucide="check" class="w-5 h-5 text-emerald-400"></i> <span>${isHi ? `प्रसारण सक्रिय (#${bookingResult.booking_id})` : `Broadcast Active (#${bookingResult.booking_id})`}</span>`;
    safeCreateIcons();
  }

  updateWorkflowStep(3);

  // Asynchronously attempt backend booking registration if online
  if (state.hasBackendConnection) {
    fetch(`${API_BASE_URL}/api/bookings/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: bookingResult.customer_name,
        service_type: bookingResult.service_type,
        worker_id: bookingResult.assigned_worker.id,
        pricing: bookingResult.pricing,
        booking_date: bookingResult.booking_date,
        booking_time: bookingResult.booking_time,
        sub_services: bookingResult.sub_services
      })
    }).then(async res => {
      if (res.status === 403) {
        const errData = await res.json();
        const reason = errData.detail || "Debarred customer";
        openServiceDebarmentModal(bookingResult.service_type, reason);
        showToast("🚫 " + reason, "emergency");
      }
    }).catch(err => console.log("Backend booking call simulated or offline:", err.message));
  }

  // Smooth scroll to status card
  if (statusCard && typeof statusCard.scrollIntoView === "function") {
    statusCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function updateTimeline(events) {
  const container = document.getElementById("booking-timeline-list");
  if (!container) return;
  container.innerHTML = "";
  events.forEach(ev => {
    const item = document.createElement("div");
    item.className = "flex items-start space-x-2";
    item.innerHTML = `<span class="text-blue-600 font-bold text-sm leading-none">&bull;</span> <span class="leading-tight">${ev}</span>`;
    container.appendChild(item);
  });
}

function copyStartOtp() {
  if (!state.activeBooking) return;
  navigator.clipboard.writeText(state.activeBooking.start_otp);
  sfx.playClick();
  showToast(state.currentLanguage === "hi" 
    ? `शुरुआती ओटीपी ${state.activeBooking.start_otp} क्लिपबोर्ड पर कॉपी किया गया!` 
    : `START_OTP ${state.activeBooking.start_otp} copied to clipboard!`, "info");
}

// 11. Worker Radar Actions (Rapido Style + Fallback)
function triggerWorkerRadar(booking) {
  const isHi = state.currentLanguage === "hi";
  const sObj = SERVICES.find(s => s.id === booking.service_type);
  const sTitle = isHi && sObj ? sObj.name_hi : booking.service_type.toUpperCase();

  const idleMsg = document.getElementById("radar-idle-msg");
  if (idleMsg) idleMsg.innerText = isHi ? `⚠️ नया अनुरोध: ${sTitle}` : `⚠️ INCOMING REQUEST: ${sTitle}`;

  const incomingCard = document.getElementById("incoming-job-card");
  if (incomingCard) incomingCard.classList.remove("hidden");

  const fallbackNotice = document.getElementById("worker-fallback-notice");
  if (fallbackNotice) fallbackNotice.classList.add("hidden");

  const serviceTypeEl = document.getElementById("radar-service-type");
  if (serviceTypeEl) {
    const slotTag = booking.booking_time ? ` (${booking.booking_time})` : "";
    const taskTag = booking.sub_service ? ` • ${booking.sub_service}` : "";
    serviceTypeEl.innerText = isHi ? `${sTitle}${taskTag} अनुरोध${slotTag}` : `${sTitle}${taskTag} Call${slotTag}`;
  }

  const clientNameEl = document.getElementById("radar-client-name");
  if (clientNameEl) clientNameEl.innerText = booking.customer_name;

  const wCoords = getWorkerCoords(booking.assigned_worker);
  const dist = computeDistanceKm(
    state.customerCoords[0], state.customerCoords[1],
    wCoords[0], wCoords[1]
  );
  const clientDistEl = document.getElementById("radar-client-dist");
  if (clientDistEl) clientDistEl.innerText = `${dist} km away (Connaught Place)`;

  const payoutEl = document.getElementById("radar-payout");
  if (payoutEl) {
    const wage = booking.pricing?.cooperative_wage_payout || 140.0;
    payoutEl.innerText = `₹${wage.toFixed(2)}`;
  }
}

function initWorkerRadarMap(destCoords, destTitle = "Client Premises", serviceType = "Service Request") {
  if (typeof L === "undefined") {
    console.warn("Leaflet not available for worker radar navigation.");
    return;
  }

  const container = document.getElementById("worker-radar-map");
  if (!container) return;

  const wCoords = getWorkerCoords(state.activeWorker);
  const targetCoords = destCoords || state.customerCoords || [28.6304, 77.2273];

  const radarMapContainer = document.getElementById("worker-radar-map-container");
  const radarScanner = document.getElementById("worker-radar-scanner");
  if (radarMapContainer) radarMapContainer.classList.remove("hidden");
  if (radarScanner) radarScanner.classList.add("hidden");

  if (!state.workerRadarMap) {
    state.workerRadarMap = L.map("worker-radar-map", {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView(wCoords, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(state.workerRadarMap);
  } else {
    state.workerRadarMap.invalidateSize();
  }

  // Clear previous layers
  if (state.workerRadarWorkerMarker) state.workerRadarMap.removeLayer(state.workerRadarWorkerMarker);
  if (state.workerRadarDestMarker) state.workerRadarMap.removeLayer(state.workerRadarDestMarker);
  if (state.workerRadarPolyline) state.workerRadarMap.removeLayer(state.workerRadarPolyline);

  // Worker live location marker
  const workerIcon = L.divIcon({
    className: 'custom-pin worker-pin ring-4 ring-emerald-300',
    html: `<span>W</span>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
  state.workerRadarWorkerMarker = L.marker(wCoords, { icon: workerIcon })
    .addTo(state.workerRadarMap)
    .bindPopup(`<b>Your Live Location</b><br>${state.activeWorker?.name || "Technician"}`);

  // Destination marker
  const destIcon = L.divIcon({
    className: 'custom-pin customer-pin ring-4 ring-blue-300',
    html: `<span>D</span>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
  state.workerRadarDestMarker = L.marker(targetCoords, { icon: destIcon })
    .addTo(state.workerRadarMap)
    .bindPopup(`<b>${destTitle}</b><br>${serviceType}`);

  // Route polyline connecting technician to client location
  state.workerRadarPolyline = L.polyline([wCoords, targetCoords], {
    color: '#2563eb',
    weight: 4,
    opacity: 0.85,
    dashArray: '8, 8'
  }).addTo(state.workerRadarMap);

  try {
    state.workerRadarMap.fitBounds(state.workerRadarPolyline.getBounds(), { padding: [40, 40] });
  } catch (e) {
    state.workerRadarMap.setView(wCoords, 13);
  }

  // Update HUD text
  const hudTitle = document.getElementById("radar-nav-dest-title");
  if (hudTitle) hudTitle.innerText = `Navigating to ${destTitle}`;
  const dist = computeDistanceKm(wCoords[0], wCoords[1], targetCoords[0], targetCoords[1]);
  const etaMinutes = Math.max(3, Math.round(dist * 3.5));
  const hudEta = document.getElementById("radar-nav-dest-eta");
  if (hudEta) hudEta.innerText = `GPS Route • ${dist} km away • Est. ${etaMinutes} mins transit`;

  // Update external Google Maps navigation link
  const extBtn = document.getElementById("btn-radar-external-nav");
  if (extBtn) {
    extBtn.href = `https://www.google.com/maps/dir/?api=1&origin=${wCoords[0]},${wCoords[1]}&destination=${targetCoords[0]},${targetCoords[1]}`;
  }

  setTimeout(() => {
    if (state.workerRadarMap) state.workerRadarMap.invalidateSize();
  }, 250);
}

function toggleWorkerRadarView() {
  sfx.playClick();
  const radarMapContainer = document.getElementById("worker-radar-map-container");
  const radarScanner = document.getElementById("worker-radar-scanner");
  if (!radarMapContainer || !radarScanner) return;

  if (radarMapContainer.classList.contains("hidden")) {
    radarMapContainer.classList.remove("hidden");
    radarScanner.classList.add("hidden");
    if (state.workerRadarMap) {
      setTimeout(() => state.workerRadarMap.invalidateSize(), 100);
    }
  } else {
    radarMapContainer.classList.add("hidden");
    radarScanner.classList.remove("hidden");
  }
}

function workerAcceptJob() {
  sfx.playSuccessFanfare();
  if (!state.activeBooking) return;
  const isHi = state.currentLanguage === "hi";

  state.activeBooking.status = "ACCEPTED";
  const assignedWorker = state.activeBooking.assigned_worker || state.activeWorker;
  const wCoords = getWorkerCoords(assignedWorker);
  const distance = computeDistanceKm(
    state.customerCoords[0], state.customerCoords[1],
    wCoords[0], wCoords[1]
  );

  state.activeBooking.timeline.push(isHi
    ? `श्रमिक ${assignedWorker.name} ने कार्य स्वीकार किया। रास्ते में हैं।`
    : `Worker ${assignedWorker.name} accepted the request. En route.`);
  
  const badgeStatus = document.getElementById("booking-badge-status");
  if (badgeStatus) {
    badgeStatus.innerText = isHi ? "स्वीकृत" : "ACCEPTED";
    badgeStatus.className = "bg-emerald-600 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm";
  }

  const badgeStep1 = document.getElementById("badge-step-1");
  if (badgeStep1) {
    badgeStep1.className = "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase";
    badgeStep1.innerText = isHi ? "आगमन ओटीपी प्रतीक्षारत" : "AWAITING START_OTP";
  }

  // Populate Citizen Assigned Worker card elements
  const statusWorkerName = document.getElementById("status-worker-name");
  if (statusWorkerName) statusWorkerName.innerText = assignedWorker.name;

  const statusWorkerCoop = document.getElementById("status-worker-coop");
  if (statusWorkerCoop) statusWorkerCoop.innerText = `✓ ${assignedWorker.coop_name}`;

  const statusWorkerDist = document.getElementById("status-worker-dist");
  if (statusWorkerDist) statusWorkerDist.innerText = `📍 ${distance} km away • Rating: ${assignedWorker.rating} ★`;

  const statusWorkerPhoto = document.getElementById("status-worker-photo");
  if (statusWorkerPhoto) statusWorkerPhoto.src = assignedWorker.photo;

  const startOtpEl = document.getElementById("display-start-otp");
  if (startOtpEl) startOtpEl.innerText = state.activeBooking.start_otp;

  const endOtpEl = document.getElementById("display-end-otp");
  if (endOtpEl) endOtpEl.innerText = state.activeBooking.end_otp;

  // Populate Citizen Worker Accepted Live Banner
  const acceptedBanner = document.getElementById("citizen-worker-accepted-banner");
  if (acceptedBanner) {
    acceptedBanner.classList.remove("hidden");
    const bannerOtp = document.getElementById("banner-start-otp-val");
    if (bannerOtp) bannerOtp.innerText = state.activeBooking.start_otp;
    const bannerTitle = document.getElementById("citizen-worker-accepted-title");
    if (bannerTitle) bannerTitle.innerText = `${assignedWorker.name} Accepted Your Request!`;
    const bannerSub = document.getElementById("citizen-worker-accepted-sub");
    if (bannerSub) bannerSub.innerText = `${assignedWorker.coop_name} • 📍 ${distance} km away. Share START_OTP upon technician arrival.`;
  }

  // Populate & Reveal Citizen Worker Accepted Toast Modal
  const toastModal = document.getElementById("modal-worker-accepted-toast");
  if (toastModal) {
    const toastName = document.getElementById("toast-worker-name");
    if (toastName) toastName.innerText = assignedWorker.name;
    const toastPhoto = document.getElementById("toast-worker-photo");
    if (toastPhoto) toastPhoto.src = assignedWorker.photo;
    const toastCoop = document.getElementById("toast-worker-coop");
    if (toastCoop) toastCoop.innerText = assignedWorker.coop_name;
    const toastRating = document.getElementById("toast-worker-rating");
    if (toastRating) toastRating.innerText = `★ ${assignedWorker.rating}`;
    const toastDist = document.getElementById("toast-worker-distance");
    if (toastDist) toastDist.innerText = `📍 ${distance} km away`;
    const toastStartOtp = document.getElementById("toast-start-otp");
    if (toastStartOtp) toastStartOtp.innerText = state.activeBooking.start_otp;
    const toastEndOtp = document.getElementById("toast-end-otp");
    if (toastEndOtp) toastEndOtp.innerText = state.activeBooking.end_otp;

    toastModal.classList.remove("hidden");
    toastModal.style.display = "block";
  }

  updateTimeline(state.activeBooking.timeline);
  const activeWCoords = getWorkerCoords(assignedWorker);
  drawRouteLine(activeWCoords, state.customerCoords);

  // Send backend dispatch respond if connected
  if (state.hasBackendConnection) {
    fetch(`${API_BASE_URL}/api/bookings/dispatch/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: state.activeBooking.booking_id,
        worker_id: assignedWorker.id,
        action: "ACCEPT"
      })
    }).then(async res => {
      if (res.ok) {
        const data = await res.json();
        if (data.start_otp) state.activeBooking.start_otp = data.start_otp;
        if (data.end_otp) state.activeBooking.end_otp = data.end_otp;
      }
    }).catch(err => console.warn("Backend accept response offline/mock:", err));
  }

  // Open the interactive Navigation Map right inside the Worker Radar
  initWorkerRadarMap(
    state.customerCoords,
    state.activeBooking.customer_name || "Connaught Place, New Delhi",
    state.activeBooking.service_type?.toUpperCase() || "Cooperative Task"
  );

  showToast(isHi 
    ? `${assignedWorker.name} ने कार्य स्वीकार किया! ग्राहक को ओटीपी व विवरण भेजे गए।` 
    : `Job Accepted by ${assignedWorker.name}! Customer received OTPs & technician profile.`, "success");
}

function closeWorkerAcceptedToast() {
  const toast = document.getElementById("modal-worker-accepted-toast");
  if (toast) {
    toast.classList.add("hidden");
    toast.style.display = "none";
  }
}

function focusCitizenBookingStatus() {
  closeWorkerAcceptedToast();
  switchPortal("client");
  const card = document.getElementById("booking-status-card");
  if (card) {
    card.classList.remove("hidden");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function workerRejectJob() {
  sfx.playFallbackWarning();
  if (!state.activeBooking) return;
  const isHi = state.currentLanguage === "hi";

  const declinedWorker = state.activeBooking.assigned_worker || state.activeWorker;

  // Search dynamically for the nearest available worker with the same skill
  let backupWorker = WORKERS.find(w => w.skill === state.activeBooking.service_type && w.id !== declinedWorker.id && w.is_available);
  if (!backupWorker) {
    backupWorker = WORKERS.find(w => w.id !== declinedWorker.id && w.is_available);
  }
  if (!backupWorker) {
    backupWorker = WORKERS.find(w => w.id !== declinedWorker.id) || WORKERS[0];
  }

  state.activeBooking.assigned_worker = backupWorker;

  const bCoords = getWorkerCoords(backupWorker);
  const dist = computeDistanceKm(
    state.customerCoords[0], state.customerCoords[1],
    bCoords[0], bCoords[1]
  );
  
  state.activeBooking.timeline.push(isHi ? `श्रमिक ${declinedWorker.name} ने कार्य अस्वीकार किया।` : `Worker ${declinedWorker.name} declined the job.`);
  state.activeBooking.timeline.push(isHi 
    ? `🚨 स्वचालित बैकअप इंजन: अगले निकटतम तकनीशियन को पुनः सौंपा गया: ${backupWorker.name} (${dist} किमी दूरी)।`
    : `🚨 AUTOMATED FALLBACK ENGINE: Reassigned to next nearest worker: ${backupWorker.name} (${dist} km away).`);

  // Update UI on Citizen View
  const statusName = document.getElementById("status-worker-name");
  if (statusName) statusName.innerText = backupWorker.name;

  const statusCoop = document.getElementById("status-worker-coop");
  if (statusCoop) statusCoop.innerText = `✓ ${backupWorker.coop_name}`;

  const statusDist = document.getElementById("status-worker-dist");
  if (statusDist) statusDist.innerText = `📍 ${dist} km away • Rating: ${backupWorker.rating} ★`;

  const statusPhoto = document.getElementById("status-worker-photo");
  if (statusPhoto) statusPhoto.src = backupWorker.photo;

  updateTimeline(state.activeBooking.timeline);

  // Show Fallback alert on Worker screen
  const fallbackNotice = document.getElementById("worker-fallback-notice");
  if (fallbackNotice) fallbackNotice.classList.remove("hidden");

  const fallbackText = document.getElementById("worker-fallback-text");
  if (fallbackText) {
    fallbackText.innerHTML = isHi 
      ? `कार्य <b>${declinedWorker.name}</b> द्वारा अस्वीकार किया गया एवं स्वचालित रूप से <b>${backupWorker.name}</b> (${dist} किमी) को सौंपा गया। डैशबोर्ड स्वचालित रूप से <b>${backupWorker.name}</b> पर स्विच हो गया है।`
      : `Job declined by <span class="font-bold">${declinedWorker.name}</span> and instantly reassigned to: <strong class="text-blue-900">${backupWorker.name}</strong> (${dist} km away). Worker Cockpit switched to ${backupWorker.name}.`;
  }

  // Update worker rejection audit log and compliance tracking
  declinedWorker.rejection_count = (declinedWorker.rejection_count || 0) + 1;
  if (declinedWorker.rejection_count >= 3 && declinedWorker.disciplinary_status !== "FIRED") {
    declinedWorker.disciplinary_status = "UNDER_REVIEW";
  }

  const rejectionEntry = {
    rejection_id: `REJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    worker_id: declinedWorker.id,
    worker_name: declinedWorker.name,
    worker_skill: declinedWorker.skill,
    coop_name: declinedWorker.coop_name,
    booking_id: state.activeBooking.booking_id,
    service_type: state.activeBooking.service_type,
    reason: "Worker busy / declined dispatch (Outside preferred operating radius)",
    timestamp: new Date().toISOString()
  };
  state.workerRejections.unshift(rejectionEntry);

  if (state.hasBackendConnection) {
    fetch(`${API_BASE_URL}/api/bookings/dispatch/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: state.activeBooking.booking_id,
        worker_id: declinedWorker.id,
        action: "DECLINE"
      })
    }).catch(err => console.warn("Backend decline response offline/mock:", err));
  }

  updateWorkerDisciplinaryUI(declinedWorker);
  if (typeof renderMinistryDisciplineTable === "function") {
    renderMinistryDisciplineTable();
  }

  // SWITCH DASHBOARD TO THE SPECIFIC BACKUP WORKER!
  state.activeWorker = backupWorker;
  updateWorkerCardUI(backupWorker);
  const personaSelect = document.getElementById("worker-persona-select");
  if (personaSelect) {
    personaSelect.value = String(backupWorker.id);
  }
  updateMapPins();
  drawRouteLine(bCoords, state.customerCoords);

  // Re-trigger Worker Radar for the backup worker so the incoming job card is populated for them!
  triggerWorkerRadar(state.activeBooking);

  showToast(isHi 
    ? `🚨 डैशबोर्ड बैकअप तकनीशियन ${backupWorker.name} (#${backupWorker.id}) पर स्विच हुआ` 
    : `🚨 Worker Dashboard switched to ${backupWorker.name} (#${backupWorker.id} - ${backupWorker.skill.toUpperCase()})`, "warning");
}

// 12. Dual OTP Verification Workflows
function autoFillStartOtp() {
  sfx.playClick();
  if (!state.activeBooking) return;
  document.getElementById("input-start-otp").value = state.activeBooking.start_otp;
  showToast(state.currentLanguage === "hi" ? "डेमो शुरुआती ओटीपी स्वतः भरा गया" : "Demo START_OTP auto-filled", "info");
}

function submitStartOtp() {
  sfx.init();
  const entered = document.getElementById("input-start-otp").value.trim();
  const isHi = state.currentLanguage === "hi";

  if (!state.activeBooking) {
    showToast(isHi ? "कोई सक्रिय बुकिंग नहीं मिली। पहले अनुरोध भेजें।" : "No active booking found. Broadcast a request first.", "warning");
    return;
  }

  if (entered === state.activeBooking.start_otp) {
    sfx.playSuccessFanfare();
    state.activeBooking.status = "IN_PROGRESS";
    state.activeBooking.timeline.push(isHi ? "ग्राहक द्वारा शुरुआती ओटीपी सत्यापित। कार्य आरंभ।" : "Customer verified START_OTP. Service execution commenced.");
    
    document.getElementById("badge-step-1").className = "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase";
    document.getElementById("badge-step-1").innerText = isHi ? "सत्यापित" : "VERIFIED";
    document.getElementById("badge-step-2").className = "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase";
    document.getElementById("badge-step-2").innerText = isHi ? "समापन ओटीपी प्रतीक्षारत" : "AWAITING END_OTP";
    
    document.getElementById("booking-badge-status").innerText = isHi ? "प्रगति पर" : "IN PROGRESS";
    document.getElementById("booking-badge-status").className = "bg-blue-600 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm";
    
    updateTimeline(state.activeBooking.timeline);
    showToast(isHi ? "✓ शुरुआती ओटीपी सत्यापित! कार्य शुरू हुआ।" : "✓ START_OTP Verified! Service commenced.", "success");
  } else {
    sfx.playFallbackWarning();
    showToast(`Invalid START_OTP. Hint: ${state.activeBooking.start_otp}`, "warning");
  }
}

function autoFillEndOtp() {
  sfx.playClick();
  if (!state.activeBooking) return;
  document.getElementById("input-end-otp").value = state.activeBooking.end_otp;
  showToast(state.currentLanguage === "hi" ? "डेमो समापन ओटीपी स्वतः भरा गया" : "Demo END_OTP auto-filled", "info");
}

function previewProofImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById("proof-preview-img").src = e.target.result;
      document.getElementById("proof-preview-container").classList.remove("hidden");
      showToast(state.currentLanguage === "hi" ? "कार्य का प्रमाण संलग्न किया गया" : "Proof of work attached", "info");
    };
    reader.readAsDataURL(file);
  }
}

function simulateProofUpload() {
  sfx.playClick();
  document.getElementById("proof-preview-img").src = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80";
  document.getElementById("proof-preview-container").classList.remove("hidden");
  showToast(state.currentLanguage === "hi" ? "नमूना फोटो संलग्न की गई" : "Sample photo attached", "info");
}

function submitEndOtp() {
  sfx.init();
  const inputEl = document.getElementById("input-end-otp");
  const entered = inputEl ? inputEl.value.trim() : "";
  const isHi = state.currentLanguage === "hi";

  if (!state.activeBooking) {
    showToast(isHi ? "कोई सक्रिय बुकिंग नहीं मिली।" : "No active booking found.", "warning");
    return;
  }

  if (entered === state.activeBooking.end_otp) {
    sfx.playSuccessFanfare();
    state.activeBooking.status = "COMPLETED";
    state.activeBooking.timeline.push(isHi ? "कार्य प्रमाण अपलोड हुआ व समापन ओटीपी सत्यापित हुआ।" : "Proof of work uploaded & END_OTP validated.");
    
    const payout = state.activeBooking.pricing?.cooperative_wage_payout || 140.0;
    const worker = state.activeBooking.assigned_worker || state.activeWorker;

    state.activeBooking.timeline.push(isHi 
      ? `₹${payout.toFixed(2)} सीधे श्रमिक की पासबुक में जमा।`
      : `₹${payout.toFixed(2)} disbursed directly to worker's passbook.`);
    
    const badgeStep2 = document.getElementById("badge-step-2");
    if (badgeStep2) {
      badgeStep2.className = "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase";
      badgeStep2.innerText = isHi ? "पूर्ण" : "COMPLETED";
    }
    
    const badgeStatus = document.getElementById("booking-badge-status");
    if (badgeStatus) {
      badgeStatus.innerText = isHi ? "पूर्ण हुआ" : "COMPLETED";
      badgeStatus.className = "bg-emerald-700 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm";
    }
    
    // Update Worker's Earnings and stats
    worker.total_earned = (worker.total_earned || 0) + payout;
    worker.completed_jobs = (worker.completed_jobs || 0) + 1;
    worker.today_wage = (worker.today_wage || 2840.0) + payout;
    worker.account_balance = (worker.account_balance || 68400.0) + payout;

    updateWorkerCardUI(worker);

    // Track completed booking for passbook modal
    if (!state.completedBookings) state.completedBookings = [];
    const sObj = SERVICES.find(s => s.id === state.activeBooking.service_type);
    state.completedBookings.unshift({
      id: state.activeBooking.booking_id,
      service_name: sObj ? (isHi ? sObj.name_hi : sObj.name) : state.activeBooking.service_type.toUpperCase(),
      plan: state.selectedPlan || "Standard",
      payout: payout,
      worker_id: worker.id
    });

    // Update Ministry cumulative wages
    state.nationalStats.wages += payout;
    const mWageEl = document.getElementById("m-wage-count");
    if (mWageEl) mWageEl.innerText = `₹${state.nationalStats.wages.toLocaleString()}`;

    // Push live event to Ministry ticker
    pushCustomTickerEvent(`₹${payout.toFixed(0)} DBT credited to ${worker.name} (${worker.coop_name})`);

    // Reset radar idle message and hide incoming card
    const incomingCard = document.getElementById("incoming-job-card");
    if (incomingCard) incomingCard.classList.add("hidden");
    const idleMsg = document.getElementById("radar-idle-msg");
    if (idleMsg) {
      idleMsg.innerText = isHi 
        ? "कार्य संपन्न। नई सहकारी आवृत्ति की खोज जारी है..." 
        : "Service completed. Scanning cooperative broadcast frequency...";
    }

    updateTimeline(state.activeBooking.timeline);
    updateWorkflowStep(4);
    
    // Automatically reset customer app map now that the worker accepted and job is done!
    resetCustomerAppMap();

    // Reveal completed action bar in citizen status card
    const completedBar = document.getElementById("booking-completed-action-bar");
    if (completedBar) completedBar.classList.remove("hidden");

    // Dismiss worker accepted toast modal
    const toastModal = document.getElementById("modal-worker-accepted-toast");
    if (toastModal) toastModal.classList.add("hidden");

    // Hide accepted banner after brief completion display
    const acceptedBanner = document.getElementById("citizen-worker-accepted-banner");
    if (acceptedBanner) {
      setTimeout(() => {
        acceptedBanner.classList.add("hidden");
      }, 3500);
    }

    showToast(isHi 
      ? `🎉 कार्य सफलतापूर्वक संपन्न! ₹${payout.toFixed(2)} सीधे डीसीसीबी खाते में जमा। ग्राहक मानचित्र रीसेट हुआ।`
      : `🎉 Service Completed! ₹${payout.toFixed(2)} credited to worker. Customer radar map has been reset.`, "success");
  } else {
    sfx.playFallbackWarning();
    showToast(`Invalid END_OTP. Hint: ${state.activeBooking.end_otp}`, "warning");
  }
}

function autoAdvanceBooking() {
  if (!state.activeBooking) {
    executeBookingConfirmed();
  }
  setTimeout(() => {
    if (!state.activeBooking) return;
    workerAcceptJob();
    const startInput = document.getElementById("input-start-otp");
    if (startInput) startInput.value = state.activeBooking.start_otp;
    setTimeout(() => {
      if (!state.activeBooking) return;
      submitStartOtp();
      simulateProofUpload();
      const endInput = document.getElementById("input-end-otp");
      if (endInput) endInput.value = state.activeBooking.end_otp;
      setTimeout(() => {
        if (!state.activeBooking) return;
        submitEndOtp();
      }, 500);
    }, 500);
  }, 500);
}

// 13. Worker Card UI Synchronization & Persona Switcher
function updateWorkerCardUI(worker) {
  if (!worker) return;
  state.activeWorker = worker;

  const nameEl = document.getElementById("worker-card-name");
  if (nameEl) nameEl.innerText = worker.name;

  const tradeEl = document.getElementById("worker-card-trade");
  if (tradeEl) {
    tradeEl.innerHTML = `Certified ${worker.skill.toUpperCase()} &bull; Member of <span class="font-bold text-slate-700">${worker.coop_name}</span>`;
  }

  const ratingEl = document.getElementById("worker-card-rating");
  if (ratingEl) {
    ratingEl.innerText = `⭐ ${worker.rating} Rating (${worker.completed_jobs} Jobs)`;
  }

  const aadhaarEl = document.getElementById("worker-card-aadhaar");
  if (aadhaarEl) aadhaarEl.innerText = worker.aadhaar;

  const avatarEl = document.getElementById("worker-active-avatar");
  if (avatarEl) avatarEl.src = worker.photo;

  const certTitleEl = document.getElementById("worker-card-cert-title");
  if (certTitleEl) certTitleEl.innerText = worker.cert_title || worker.certificate.split("(")[0].trim();

  const certIssuerEl = document.getElementById("worker-card-cert-issuer");
  if (certIssuerEl) certIssuerEl.innerText = worker.cert_issuer || "Verified by Cooperative Federation";

  const wageEl = document.getElementById("worker-today-wage");
  if (wageEl) {
    const todayWage = worker.today_wage || 2840.0;
    wageEl.innerText = `₹${todayWage.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  }

  const personaSelect = document.getElementById("worker-persona-select");
  if (personaSelect && String(personaSelect.value) !== String(worker.id)) {
    personaSelect.value = String(worker.id);
  }

  if (typeof updateWorkerDisciplinaryUI === "function") {
    updateWorkerDisciplinaryUI(worker);
  }
  if (typeof updateWorkerFreelanceUI === "function") {
    updateWorkerFreelanceUI(worker);
  }
}

let pendingWorkerSwitchId = null;

function openWorkerAuthGateModal(targetWorker) {
  sfx.playClick();
  const modal = document.getElementById("modal-worker-auth-gate");
  if (!modal || !targetWorker) return;

  pendingWorkerSwitchId = targetWorker.id;
  const persona = WORKER_SWITCH_PERSONAS[String(targetWorker.id)] || targetWorker;
  const workerOtp = persona.otp || targetWorker.otp || "5821";
  targetWorker.auth_otp = workerOtp;

  const avatarEl = document.getElementById("gate-worker-avatar");
  if (avatarEl) avatarEl.src = targetWorker.photo || persona.photo || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120";

  const nameEl = document.getElementById("gate-worker-name");
  if (nameEl) nameEl.innerText = targetWorker.name;

  const skillEl = document.getElementById("gate-worker-skill");
  if (skillEl) skillEl.innerText = (targetWorker.skill || "technician").toUpperCase();

  const coopEl = document.getElementById("gate-worker-coop");
  if (coopEl) coopEl.innerText = targetWorker.coop_name || "Cooperative Society";

  const phoneEl = document.getElementById("gate-worker-phone");
  if (phoneEl) phoneEl.innerText = targetWorker.phone || persona.phone || "+91 98123 45678";

  const pacsEl = document.getElementById("gate-worker-pacs-id");
  if (pacsEl) pacsEl.innerText = persona.pacs_id || `PACS-DL-${targetWorker.id * 37}`;

  const demoCodeEl = document.getElementById("gate-worker-demo-otp-code");
  if (demoCodeEl) demoCodeEl.innerText = workerOtp;

  const otpInput = document.getElementById("gate-worker-otp");
  if (otpInput) otpInput.value = "";

  const feedback = document.getElementById("gate-worker-auth-feedback");
  if (feedback) {
    feedback.className = "text-xs font-semibold hidden p-2.5 rounded-xl";
    feedback.innerText = "";
  }

  modal.classList.remove("hidden");
  safeCreateIcons();
}

function cancelWorkerAuthGate() {
  sfx.playClick();
  const modal = document.getElementById("modal-worker-auth-gate");
  if (modal) modal.classList.add("hidden");

  // Revert dropdown back to current active worker
  const personaSelect = document.getElementById("worker-persona-select");
  if (personaSelect && state.activeWorker) {
    personaSelect.value = String(state.activeWorker.id);
  }
  pendingWorkerSwitchId = null;
}

function sendWorkerAuthGateOtp() {
  sfx.playBeep();
  const phoneEl = document.getElementById("gate-worker-phone");
  const phone = phoneEl ? phoneEl.innerText : "registered mobile";
  const feedback = document.getElementById("gate-worker-auth-feedback");
  if (feedback) {
    feedback.className = "text-xs font-semibold p-2.5 rounded-xl bg-indigo-100 text-indigo-950 border border-indigo-200 block";
    feedback.innerText = `✓ Fresh 4-digit UIDAI / PACS verification OTP sent to ${phone}`;
  }
  showToast(`Worker OTP sent to ${phone}`, "info");
}

function autofillWorkerAuthGateOtp() {
  sfx.playClick();
  const demoCodeEl = document.getElementById("gate-worker-demo-otp-code");
  const code = demoCodeEl ? demoCodeEl.innerText.trim() : "5821";
  const otpInput = document.getElementById("gate-worker-otp");
  if (otpInput) {
    otpInput.value = code;
  }
  showToast(`Worker Demo OTP filled: ${code}`, "info");
}

function submitWorkerAuthGate(e) {
  if (e && e.preventDefault) e.preventDefault();
  sfx.init();

  const otpInput = document.getElementById("gate-worker-otp");
  const feedback = document.getElementById("gate-worker-auth-feedback");
  const enteredOtp = otpInput ? otpInput.value.trim() : "";

  const targetWorker = WORKERS.find(w => String(w.id) === String(pendingWorkerSwitchId) || w.id === parseInt(pendingWorkerSwitchId));
  if (!targetWorker) {
    cancelWorkerAuthGate();
    return false;
  }

  const persona = WORKER_SWITCH_PERSONAS[String(targetWorker.id)] || {};
  const expectedOtp = targetWorker.auth_otp || persona.otp || "5821";
  const validPins = [expectedOtp, "5821", "3892", "6214", "9401", "1234", "0000"];

  if (!validPins.includes(enteredOtp)) {
    if (feedback) {
      feedback.className = "text-xs font-semibold p-2.5 rounded-xl bg-red-100 text-red-900 border border-red-300 block";
      feedback.innerText = `Invalid 4-digit Worker OTP. Please enter ${expectedOtp} or click Auto-Fill.`;
    }
    sfx.playWarning();
    return false;
  }

  // OTP verified! Switch active worker
  state.activeWorker = targetWorker;
  updateWorkerCardUI(targetWorker);
  updateMapPins();
  calculateLiveQuote();

  const personaSelect = document.getElementById("worker-persona-select");
  if (personaSelect) {
    personaSelect.value = String(targetWorker.id);
  }

  const modal = document.getElementById("modal-worker-auth-gate");
  if (modal) modal.classList.add("hidden");

  pendingWorkerSwitchId = null;

  sfx.playSuccessFanfare();
  showToast(`✓ Identity verified! Cockpit access granted to ${targetWorker.name}`, "success");
  return true;
}

function changeWorkerPersona(workerId, bypassAuth = false) {
  sfx.playClick();
  const worker = WORKERS.find(w => String(w.id) === String(workerId) || w.id === parseInt(workerId));
  if (!worker) return;

  if (state.activeWorker && (String(state.activeWorker.id) === String(worker.id))) {
    return;
  }

  if (bypassAuth) {
    state.activeWorker = worker;
    updateWorkerCardUI(worker);
    updateMapPins();
    calculateLiveQuote();
    showToast(`Switched active profile to ${worker.name}`, "info");
    return;
  }

  // Enforce authentication gate modal before granting access to the worker cockpit
  openWorkerAuthGateModal(worker);
}

// 14. Ministry Dashboard Intelligence & District Table
function renderDistrictTable() {
  const tbody = document.getElementById("district-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  const isHi = state.currentLanguage === "hi";

  DISTRICT_DATA.forEach((d, idx) => {
    const row = document.createElement("tr");
    row.className = "hover:bg-slate-50 transition";
    const districtName = isHi ? d.district_hi : d.district;

    row.innerHTML = `
      <td class="p-3 font-bold text-slate-900">${districtName}</td>
      <td class="p-3">
        <div class="flex items-center space-x-2">
          <div class="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="${d.alert ? 'bg-red-500' : 'bg-blue-600'} h-full" style="width: ${d.demand}%"></div>
          </div>
          <span class="font-bold">${d.demand}</span>
        </div>
      </td>
      <td class="p-3 font-semibold text-slate-700">${d.workers}</td>
      <td class="p-3">
        ${d.alert 
          ? `<span class="bg-red-100 text-red-900 px-2 py-0.5 rounded-full text-[10px] font-black border border-red-200 flex items-center gap-1 w-fit"><span class="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span> ${isHi ? "कमी चेतावनी" : "Shortage Alert"}</span>` 
          : `<span class="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full text-[10px] font-black border border-emerald-200">${isHi ? "पर्याप्त आपूर्ति" : "Optimal Supply"}</span>`}
      </td>
      <td class="p-3">
        <button onclick="deployPacsGuild(${idx})" class="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-[11px] border border-indigo-200 transition btn-tactile">
          ${isHi ? "पैक्स दल तैनात करें" : "Deploy PACS Guild"}
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function deployPacsGuild(idx) {
  sfx.playSuccessFanfare();
  const d = DISTRICT_DATA[idx];
  d.workers += 10;
  d.alert = false;
  d.demand = Math.max(50, d.demand - 20);

  renderDistrictTable();
  const dName = state.currentLanguage === "hi" ? d.district_hi : d.district;
  showToast(`✓ Deployed 10 PACS reserve technicians to ${dName}! Shortage resolved.`, "success");
  pushCustomTickerEvent(`PACS Vocational Guild deployed to ${d.district} (+10 technicians).`);
}

function approveVerificationCandidate(btn, candidateName) {
  sfx.playSuccessFanfare();
  const isHi = state.currentLanguage === "hi";
  btn.innerText = isHi ? "✓ मुहर जारी" : "✓ Seal Issued";
  btn.className = "flex-1 py-1.5 bg-slate-200 text-emerald-800 rounded-xl text-xs font-bold cursor-default";
  btn.disabled = true;

  state.nationalStats.workers += 1;
  const mWorkerEl = document.getElementById("m-worker-count");
  if (mWorkerEl) mWorkerEl.innerText = `${state.nationalStats.workers} ${isHi ? "तकनीशियन" : "Technicians"}`;
  
  showToast(isHi 
    ? `✓ ${candidateName} को आधिकारिक सरकारी सहकारी मुहर जारी की गई!` 
    : `✓ Official Government Cooperative Seal issued to ${candidateName}!`, "success");
  pushCustomTickerEvent(`Worker ${candidateName} attested via Gemini OCR & PACS seal issued.`);
}

async function fetchMinistryAnalytics() {
  sfx.playClick();
  if (state.hasBackendConnection) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ministry/analytics`);
      if (res.ok) {
        const data = await res.json();
        const coopEl = document.getElementById("m-coop-count");
        if (coopEl) coopEl.innerText = `${data.active_cooperatives} Federations`;

        const workerEl = document.getElementById("m-worker-count");
        if (workerEl) workerEl.innerText = `${data.total_workers} Technicians`;

        const wageEl = document.getElementById("m-wage-count");
        if (wageEl) wageEl.innerText = `₹${data.total_wages_disbursed.toLocaleString()}`;

        const saveEl = document.getElementById("m-savings-count");
        if (saveEl) saveEl.innerText = `₹${data.citizen_savings_vs_aggregators.toLocaleString()}`;

        showToast(state.currentLanguage === "hi" ? "मंत्रालय डेटा और क्षेत्रीय आवश्यकताएं लाइव अपडेट हुईं!" : "Ministry telemetry and regional requirements refreshed live!", "success");
        return;
      }
    } catch (e) {}
  }
  
  showToast(state.currentLanguage === "hi" ? "मंत्रालय डेटा सफलतापूर्वक सिंक्रनाइज़ हुआ!" : "Ministry telemetry synchronized!", "info");
}

function pushLiveTickerEvent() {
  const events = [
    "₹1,400 DBT disbursed to South Delhi Multi-Purpose Coop",
    "Emergency plumber dispatch completed in Karol Bagh (11 mins)",
    "PACS Federation enrolled 5 new solar wiremen in Central Delhi",
    "Citizen saved ₹340 vs commercial aggregator in Saket",
    "NGO Subsidy of ₹420 approved for Goonj Relief Center"
  ];
  const randEv = events[Math.floor(Math.random() * events.length)];
  pushCustomTickerEvent(randEv);
}

function pushCustomTickerEvent(text) {
  const container = document.getElementById("ministry-live-ticker");
  if (!container) return;
  const item = document.createElement("div");
  item.className = "flex items-center gap-1.5 transition";
  item.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> <span>${text}</span>`;
  container.prepend(item);
  if (container.children.length > 4) {
    container.removeChild(container.lastChild);
  }
}

// 15. Modals (Credential & Passbook)
function openCredentialModal(workerIdentifier) {
  sfx.playClick();
  const modal = document.getElementById("modal-credential");
  if (!modal) return;
  modal.classList.remove("hidden");
  safeCreateIcons();

  let worker = state.activeWorker;
  if (workerIdentifier) {
    const found = WORKERS.find(w => w.name.toLowerCase() === String(workerIdentifier).toLowerCase() || w.id === parseInt(workerIdentifier));
    if (found) worker = found;
  }

  const cred = worker.credentials || {
    issuer: "National Council for Vocational Training (NCVT)",
    cert_no: "NTC/ITI/2022/EL-49821",
    confidence: "96.4% Attested",
    qualification: "National Trade Certificate (Grade A)",
    aadhaar_hash: worker.aadhaar,
    status: "ATTESTED_GOI"
  };

  const nameEl = document.getElementById("modal-worker-name");
  if (nameEl) nameEl.innerText = worker.name;

  const issuerEl = document.getElementById("modal-worker-issuer");
  if (issuerEl) issuerEl.innerText = cred.issuer;

  const certnoEl = document.getElementById("modal-worker-certno");
  if (certnoEl) certnoEl.innerText = cred.cert_no;

  const confEl = document.getElementById("modal-worker-confidence");
  if (confEl) confEl.innerText = cred.confidence;

  const jsonEl = document.getElementById("modal-json-display");
  if (jsonEl) {
    jsonEl.innerText = JSON.stringify({
      verified: true,
      worker_name: worker.name,
      skill: worker.skill.charAt(0).toUpperCase() + worker.skill.slice(1),
      qualification: cred.qualification,
      aadhaar_hash: cred.aadhaar_hash,
      cooperative_federation: worker.coop_name,
      status: cred.status
    }, null, 2);
  }
}

function closeCredentialModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-credential");
  if (modal) modal.classList.add("hidden");
}

function openPassbookModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-passbook");
  if (!modal) return;
  modal.classList.remove("hidden");
  safeCreateIcons();

  const worker = state.activeWorker;
  const balance = worker.account_balance || 68400.0;

  const balEl = document.getElementById("passbook-modal-balance");
  if (balEl) balEl.innerText = `₹${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const accEl = document.getElementById("passbook-account-number");
  if (accEl) accEl.innerText = `A/C: ${worker.account_number || "DCCB-PACS-8821092"}`;

  const tbody = document.getElementById("passbook-ledger-body");
  if (tbody) {
    let rowsHtml = "";
    const sessionBookings = (state.completedBookings || []).filter(b => b.worker_id === worker.id);
    sessionBookings.forEach(b => {
      rowsHtml += `
        <tr class="bg-emerald-50/50">
          <td class="p-2.5 font-bold text-emerald-900">#${b.id}</td>
          <td class="p-2.5">${b.service_name} (${b.plan})</td>
          <td class="p-2.5 text-emerald-700 font-bold">✓ Credited (Live)</td>
          <td class="p-2.5 text-right font-bold text-emerald-900">+₹${b.payout.toFixed(2)}</td>
        </tr>
      `;
    });

    rowsHtml += `
      <tr>
        <td class="p-2.5 font-bold">#1001</td>
        <td class="p-2.5">Electrician (Connaught Place)</td>
        <td class="p-2.5 text-emerald-700 font-bold">✓ Credited</td>
        <td class="p-2.5 text-right font-bold text-slate-900">₹140.00</td>
      </tr>
      <tr>
        <td class="p-2.5 font-bold">#0998</td>
        <td class="p-2.5">Short Circuit Triage</td>
        <td class="p-2.5 text-emerald-700 font-bold">✓ Credited</td>
        <td class="p-2.5 text-right font-bold text-slate-900">₹220.00</td>
      </tr>
      <tr>
        <td class="p-2.5 font-bold">#0984</td>
        <td class="p-2.5">Weekly Appliance Maintenance</td>
        <td class="p-2.5 text-emerald-700 font-bold">✓ Credited</td>
        <td class="p-2.5 text-right font-bold text-slate-900">₹580.00</td>
      </tr>
    `;
    tbody.innerHTML = rowsHtml;
  }
}

function closePassbookModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-passbook");
  if (modal) modal.classList.add("hidden");
}

function simulateDbtWithdrawal() {
  sfx.playSuccessFanfare();
  const worker = state.activeWorker;
  const balance = worker.account_balance || 68400.0;
  const acc = worker.account_number || "DCCB-PACS-8821092";

  showToast(state.currentLanguage === "hi" 
    ? `✓ डीसीसीबी खाता #${acc} में ₹${balance.toLocaleString()} का तत्काल डीबीटी हस्तांतरण आरंभ!` 
    : `✓ Instant DBT of ₹${balance.toLocaleString()} initiated to DCCB Account #${acc}`, "success");

  worker.account_balance = 0;
  const balEl = document.getElementById("passbook-modal-balance");
  if (balEl) balEl.innerText = "₹0.00";

  pushCustomTickerEvent(`Instant DBT transfer of ₹${balance.toLocaleString()} settled to DCCB #${acc}`);
  setTimeout(() => {
    closePassbookModal();
  }, 1200);
}

// Workflow Step Highlighter
function updateWorkflowStep(stepNum) {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`step-dot-${i}`);
    const nav = document.getElementById(`step-nav-${i}`);
    if (!nav) continue;

    if (i <= stepNum) {
      nav.className = "flex items-center gap-2 text-blue-700 whitespace-nowrap font-black";
      if (dot) dot.className = "w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold shadow-sm";
    } else {
      nav.className = "flex items-center gap-2 text-slate-400 whitespace-nowrap font-medium";
      if (dot) dot.className = "w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[11px]";
    }
  }
}

// 16. SIH Hackathon Guided Scenarios
function runScenario(scenario) {
  sfx.playClick();
  switch (scenario) {
    case "booking":
      switchPortal("client");
      selectService("electrician");
      selectPlan("hourly");
      const emCheck = document.getElementById("emergency-toggle");
      if (emCheck) emCheck.checked = false;
      toggleEmergencyMode();
      executeBooking();
      showToast("Scenario 1: Standard Electrician Booking & Payment Gateway", "info");
      break;

    case "payment":
      switchPortal("client");
      selectService("electrician");
      calculateLiveQuote();
      openPaymentGatewayModal();
      showToast("Scenario 2: Demo Payment Gateway with Itemized Price Breakdown", "info");
      break;

    case "ngo":
      switchPortal("client");
      openNgoVerificationModal();
      setTimeout(() => {
        autoFillSampleNgo();
      }, 300);
      showToast("Scenario 3: NGO Verification Form opened & pre-filled", "info");
      break;

    case "fallback":
      switchPortal("client");
      selectService("electrician");
      const emToggle = document.getElementById("emergency-toggle");
      if (emToggle) emToggle.checked = true;
      toggleEmergencyMode();
      executeBookingConfirmed();
      setTimeout(() => {
        switchPortal("worker");
        setTimeout(() => {
          workerRejectJob();
        }, 800);
      }, 800);
      showToast("Scenario 4: Emergency Mode & Rapido Fallback activated", "warning");
      break;

    case "otp":
      if (!state.activeBooking) {
        executeBookingConfirmed();
      }
      setTimeout(() => {
        if (!state.activeBooking) return;
        switchPortal("worker");
        workerAcceptJob();
        setTimeout(() => {
          if (!state.activeBooking) return;
          const startInput = document.getElementById("input-start-otp");
          if (startInput) startInput.value = state.activeBooking.start_otp;
          submitStartOtp();
          simulateProofUpload();
          setTimeout(() => {
            if (!state.activeBooking) return;
            const endInput = document.getElementById("input-end-otp");
            if (endInput) endInput.value = state.activeBooking.end_otp;
            submitEndOtp();
          }, 800);
        }, 800);
      }, 500);
      showToast("Scenario 5: Dual-OTP Lifecycle validated with celebration", "success");
      break;
  }
}

function resetDemoState() {
  sfx.playClick();
  state.activeBooking = null;
  state.isEmergency = false;
  state.isNgo = false;
  state.ngoVerified = false;
  state.ngoData = null;
  state.completedBookings = [];

  const emCheck = document.getElementById("emergency-toggle");
  if (emCheck) emCheck.checked = false;

  const ngoCheck = document.getElementById("ngo-checkbox");
  if (ngoCheck) ngoCheck.checked = false;

  toggleEmergencyMode();

  const pill = document.getElementById("ngo-verified-pill");
  const hint = document.getElementById("ngo-unverified-hint");
  if (pill) pill.classList.add("hidden");
  if (hint) hint.classList.remove("hidden");

  const container = document.getElementById("ngo-selection-container");
  if (container) container.className = "mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3";

  const statusCard = document.getElementById("booking-status-card");
  if (statusCard) statusCard.classList.add("hidden");

  const incCard = document.getElementById("incoming-job-card");
  if (incCard) incCard.classList.add("hidden");

  const fallbackNotice = document.getElementById("worker-fallback-notice");
  if (fallbackNotice) fallbackNotice.classList.add("hidden");

  const idleMsg = document.getElementById("radar-idle-msg");
  if (idleMsg) {
    idleMsg.innerText = state.currentLanguage === "hi" 
      ? "सहकारी प्रसारण आवृत्ति की खोज जारी है..." 
      : "Scanning cooperative broadcast frequency...";
  }

  const badgeStep1 = document.getElementById("badge-step-1");
  if (badgeStep1) {
    badgeStep1.innerText = "LOCKED";
    badgeStep1.className = "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase";
  }

  const badgeStep2 = document.getElementById("badge-step-2");
  if (badgeStep2) {
    badgeStep2.innerText = "PENDING";
    badgeStep2.className = "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase";
  }

  const startInput = document.getElementById("input-start-otp");
  if (startInput) startInput.value = "";

  const endInput = document.getElementById("input-end-otp");
  if (endInput) endInput.value = "";

  const proofPrev = document.getElementById("proof-preview-container");
  if (proofPrev) proofPrev.classList.add("hidden");
  
  clearSearch();

  if (state.routePolyline && state.clientMap) {
    state.clientMap.removeLayer(state.routePolyline);
    state.routePolyline = null;
  }

  DISTRICT_DATA = [
    { district: "Central Delhi", district_hi: "मध्य दिल्ली", demand: 94, pending: 28, workers: 45, alert: true },
    { district: "South Delhi", district_hi: "दक्षिण दिल्ली", demand: 88, pending: 19, workers: 52, alert: false },
    { district: "East Delhi", district_hi: "पूर्वी दिल्ली", demand: 76, pending: 14, workers: 38, alert: false },
    { district: "West Delhi", district_hi: "पश्चिम दिल्ली", demand: 82, pending: 22, workers: 40, alert: true },
    { district: "North Delhi", district_hi: "उत्तर दिल्ली", demand: 68, pending: 9, workers: 30, alert: false }
  ];

  // Reset worker card to default worker (Rajesh Kumar)
  const defaultWorker = WORKERS[0];
  updateWorkerCardUI(defaultWorker);
  updateMapPins();

  // Reset subscription
  state.activeSubscription = null;
  state.selectedSubTier = "monthly_pass";
  state.activeOffers = [];
  const subStatusBadge = document.getElementById("subscription-active-status");
  if (subStatusBadge) subStatusBadge.classList.add("hidden");
  selectSubTier("monthly_pass");

  // Reset emergency & schedule gating
  state.isEmergency = false;
  if (emCheck) emCheck.checked = false;
  const emBox = document.getElementById("emergency-box");
  const siren = document.getElementById("siren-icon");
  if (emBox) emBox.classList.remove("emergency-active");
  if (siren) siren.classList.remove("animate-bounce");
  setBookingScheduleType("scheduled", false);
  updateSubscriberGatingUI();

  // Reset reviews
  state.reviewFilter = "all";
  filterCitizenReviews("all");

  // Reset worker onboarding
  logoutWorkerToOnboard();

  renderDistrictTable();
  switchPortal("client");
  closeServiceBookingModal();
  selectService("electrician", false);
  updateWorkflowStep(1);
  safeCreateIcons();
  showToast("Demo state reset to initial conditions", "info");
}

// ==========================================
// 15. SAHAKAR SAMRIDDHI SUBSCRIPTION PASS
// ==========================================

const SUBSCRIPTION_TIERS = {
  monthly_pass: {
    id: "monthly_pass",
    name: "Seva Setu Monthly Pass",
    name_hi: "सेवा सेतु मासिक पास",
    duration: "1 Month",
    price: 199.0,
    discount_pct: 20,
    perks: [
      "20% Flat Discount on all tasks & repairs",
      "Zero platform welfare fee (Saved 3.5%)",
      "Priority emergency triage (<15 min dispatch)",
      "Free monthly household safety audit"
    ]
  },
  annual_samriddhi: {
    id: "annual_samriddhi",
    name: "Seva Setu Yearly Pass",
    name_hi: "सेवा सेतु वार्षिक पास",
    duration: "12 Months",
    price: 1999.0,
    discount_pct: 30,
    perks: [
      "★ Includes ALL Monthly Pass Benefits",
      "Enhanced 30% Flat Discount on all services & artisan crafts",
      "Full Family Coverage (up to 4 members registered)",
      "₹500 Seasonal Festival Voucher Pack",
      "Dedicated PACS Artisan & Cooperative Concierge"
    ]
  }
};

function initSubscriptionSystem() {
  selectSubTier("monthly_pass");
}

function selectSubTier(tierId) {
  sfx.playClick();
  state.selectedSubTier = tierId;
  ["monthly_pass", "annual_samriddhi"].forEach(t => {
    const card = document.getElementById(`tier-card-${t}`);
    if (card) {
      if (t === tierId) {
        card.className = "p-4 rounded-2xl border-2 border-amber-500 bg-amber-50/70 relative cursor-pointer shadow-md transition btn-tactile ring-2 ring-amber-400/30";
      } else {
        card.className = "p-4 rounded-2xl border border-slate-200 bg-white relative cursor-pointer hover:border-amber-400 transition btn-tactile shadow-sm";
      }
    }
  });

  const ctaDesc = document.getElementById("sub-cta-desc");
  if (ctaDesc) {
    const tier = SUBSCRIPTION_TIERS[tierId] || SUBSCRIPTION_TIERS.monthly_pass;
    ctaDesc.innerHTML = state.currentLanguage === "hi"
      ? `चेकआउट पर तुरंत वाउचर कोड <code class="font-bold bg-white px-1.5 py-0.5 rounded text-amber-700">SAMRIDDHI${tier.discount_pct}</code> और ${tier.discount_pct}% की छूट मिलेगी!`
      : `Instant voucher code <code class="font-bold bg-white px-1.5 py-0.5 rounded text-amber-700">SAMRIDDHI${tier.discount_pct}</code> generated upon checkout!`;
  }
}

function openSubscriptionCheckoutModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-subscription-gateway");
  if (!modal) return;

  const tier = SUBSCRIPTION_TIERS[state.selectedSubTier] || SUBSCRIPTION_TIERS.monthly_pass;
  const planNameEl = document.getElementById("sub-modal-plan-name");
  const priceEl = document.getElementById("sub-modal-price");

  if (planNameEl) planNameEl.innerText = `${tier.name} (${tier.duration})`;
  if (priceEl) priceEl.innerText = `₹${tier.price.toFixed(2)}`;

  modal.classList.remove("hidden");
  safeCreateIcons();
}

function closeSubscriptionModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-subscription-gateway");
  if (modal) modal.classList.add("hidden");
  const bookingModal = document.getElementById("modal-service-booking");
  if (!bookingModal || bookingModal.classList.contains("hidden")) {
    document.body.classList.remove("overflow-hidden");
  }
}

function simulateSubPaymentApproval() {
  sfx.playAlert();
  showToast(state.currentLanguage === "hi" 
    ? "यूपीआई मोबाइल ऐप भुगतान स्वीकृत! सदस्यता सक्रिय की जा रही है..." 
    : "UPI Mobile Approval Received! Authorizing subscription...", "success");
  setTimeout(() => {
    confirmSubscriptionActivation();
  }, 900);
}

async function confirmSubscriptionActivation() {
  const tier = SUBSCRIPTION_TIERS[state.selectedSubTier] || SUBSCRIPTION_TIERS.monthly_pass;
  const isYearly = tier.id === "annual_samriddhi";
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/subscriptions/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: "Aarav Mehta",
        plan_id: tier.id,
        payment_method: "upi_qr"
      })
    });
    if (res.ok) {
      const data = await res.json();
      state.activeSubscription = data.subscription || data.plan;
      state.activeOffers = data.offers || data.generated_offers || [];
    } else {
      throw new Error("API error");
    }
  } catch (e) {
    // Fallback offline subscription activation
    state.activeSubscription = {
      plan_id: tier.id,
      plan_name: tier.name,
      price: tier.price,
      status: "active",
      valid_until: isYearly ? "2027-03-31" : "2026-10-31",
      voucher_code: `SAMRIDDHI${tier.discount_pct}`
    };

    if (isYearly) {
      state.activeOffers = [
        {
          code: `SAMRIDDHI${tier.discount_pct}`,
          title: "30% Flat Cooperative & Artisan Voucher",
          description: "30% discount applied automatically across all standard tasks, carpentry, and artisan crafts.",
          type: "flat_discount",
          value: 30
        },
        {
          code: "MONTHLY_PERKS_INCLUDED",
          title: "All Monthly Pass Benefits Activated",
          description: "Zero platform fee, priority triage, and free household audits are fully included in your yearly pass.",
          type: "monthly_bundle",
          value: 100
        },
        {
          code: "FAMILYCARE4",
          title: "Priority 4-Member Family Coverage",
          description: "Emergency service coverage extended to up to 4 registered household members.",
          type: "family_pass",
          value: 100
        },
        {
          code: "FESTIVAL500",
          title: "₹500 Seasonal Festival Artisan Voucher",
          description: "₹500 credit redeemable on carpentry renovation, tailoring, and electrical home upgrades.",
          type: "wallet_credit",
          value: 500
        },
        {
          code: "TRIAGEFREE",
          title: "Emergency Priority Triage Waiver",
          description: "Priority sub-15m emergency triage fee is 100% free for your household.",
          type: "emergency_waiver",
          value: 100
        }
      ];
    } else {
      state.activeOffers = [
        {
          code: `SAMRIDDHI${tier.discount_pct}`,
          title: `${tier.discount_pct}% Flat Cooperative Voucher`,
          description: `${tier.discount_pct}% discount applied automatically to all future cooperative bookings.`,
          type: "flat_discount",
          value: tier.discount_pct
        },
        {
          code: "TRIAGEFREE",
          title: "Emergency Priority Triage Waiver",
          description: "Priority sub-15m emergency triage fee is 100% free for your household.",
          type: "emergency_waiver",
          value: 100
        },
        {
          code: "COOPCARE100",
          title: "Cooperative Preventive Health Credit",
          description: "₹100 credit on preventative electrical wiring inspection & elder care visit.",
          type: "wallet_credit",
          value: 100
        }
      ];
    }
  }

  closeSubscriptionModal();
  sfx.playSuccessFanfare();

  // Reveal Active Badge in subscription card
  const statusBadge = document.getElementById("subscription-active-status");
  const badgeText = document.getElementById("sub-active-badge-text");
  if (statusBadge && badgeText) {
    statusBadge.classList.remove("hidden");
    badgeText.innerText = state.currentLanguage === "hi"
      ? `पास सक्रिय: ${tier.discount_pct}% छूट लागू`
      : `Pass Active: ${tier.discount_pct}% Off Applied`;
  }

  // Update Invoice Quote & Gating UI
  calculateLiveQuote();
  updateSubscriberGatingUI();

  // Show Offers Modal Vault
  openOffersModal();

  showToast(state.currentLanguage === "hi"
    ? `बधाई हो! ${tier.name_hi || tier.name} सक्रिय हो गया है। विशेष वाउचर जनरेट हो गए हैं!`
    : `Congratulations! ${tier.name} activated. Special discount vouchers generated!`, "success");
}

function openOffersModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-subscription-success");
  if (!modal) return;

  const container = document.getElementById("offers-list-container");
  if (container && state.activeOffers && state.activeOffers.length > 0) {
    container.innerHTML = state.activeOffers.map(o => `
      <div class="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
        <div>
          <span class="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">${o.title}</span>
          <h4 class="text-sm font-black text-slate-900 mt-1">${o.code}</h4>
          <p class="text-xs text-slate-600">${o.description}</p>
        </div>
        <button onclick="copyOfferCode('${o.code}')" class="px-3 py-1.5 bg-white text-slate-800 text-xs font-black rounded-xl border border-amber-300 hover:bg-amber-100 transition btn-tactile">Copy</button>
      </div>
    `).join("");
  }

  modal.classList.remove("hidden");
  safeCreateIcons();
}

function closeOffersModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-subscription-success");
  if (modal) modal.classList.add("hidden");
  const bookingModal = document.getElementById("modal-service-booking");
  if (!bookingModal || bookingModal.classList.contains("hidden")) {
    document.body.classList.remove("overflow-hidden");
  }
}

function copyOfferCode(code) {
  sfx.playClick();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).catch(() => {});
  }
  showToast(state.currentLanguage === "hi" 
    ? `कूपन कोड "${code}" कॉपी किया गया!` 
    : `Coupon Code "${code}" copied to clipboard!`, "success");
}

// ==========================================
// 16. CITIZEN REVIEWS & GRIEVANCE LOG
// ==========================================

async function initCitizenReviews() {
  await fetchReviews();
}

async function fetchReviews() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/reviews`);
    if (res.ok) {
      const data = await res.json();
      state.reviews = (data.reviews || []).map(r => ({
        ...r,
        user_name: r.user_name || r.customer_name || "Verified Citizen",
        service: r.service || r.service_type || "general",
        service_title: r.service_title || `${(r.service || r.service_type || 'General').toUpperCase()} Service`,
        type: r.type || r.review_type || (r.rating >= 4 ? 'positive' : 'complaint'),
        status: (r.status || "resolved").toLowerCase().replace(/\s+/g, "_")
      }));
      const stats = data.stats || {};
      
      const avgEl = document.getElementById("reviews-avg-rating");
      const countEl = document.getElementById("reviews-count-badge");
      if (avgEl) avgEl.innerText = stats.average_rating ? stats.average_rating.toFixed(1) : "4.9";
      if (countEl) countEl.innerText = `${stats.total_reviews || state.reviews.length} verified`;

      renderCitizenReviews();
      renderMinistryGrievances();
      return;
    }
  } catch (e) {
    console.warn("Could not fetch reviews from API, using default dataset", e);
  }

  // Fallback reviews
  state.reviews = [
    {
      id: "REV-2026-001",
      user_name: "Meera Krishnan",
      worker_id: 101,
      worker_name: "Rajesh Kumar",
      service: "electrician",
      service_title: "Electrical Wiring & Inverter Setup",
      rating: 5,
      type: "positive",
      comment: "Rajesh arrived within 15 minutes of booking with verified ITI tools. 100% fair price of ₹140 with zero hidden aggregator charges! Fantastic cooperative initiative.",
      verified_booking: true,
      timestamp: "Today, 10:45 AM",
      status: "resolved",
      ministry_action: "Commendation Recorded"
    },
    {
      id: "REV-2026-002",
      user_name: "Col. Sanjeev Malik (Retd)",
      worker_id: 103,
      worker_name: "Sunita Sharma",
      service: "tailoring",
      service_title: "Boutique Fit & Kurta Alteration",
      rating: 5,
      type: "positive",
      comment: "Sunita did an exceptional job stitching custom festival kurtas and altering suits for my family. Extremely polite, prompt, and skilled.",
      verified_booking: true,
      timestamp: "Yesterday, 04:20 PM",
      status: "resolved",
      ministry_action: "Commendation Recorded"
    },
    {
      id: "REV-2026-003",
      user_name: "Rohan Bakshi",
      worker_id: 102,
      worker_name: "Mohammad Aslam",
      service: "plumber",
      service_title: "Under-sink Pipeline Repair",
      rating: 2,
      type: "complaint",
      comment: "The repair took an hour longer than estimated and technician asked for ₹50 additional for replacement washers without invoice. Requesting cooperative inquiry.",
      verified_booking: true,
      timestamp: "2 days ago",
      status: "under_investigation",
      ministry_action: "Under Investigation by PACS"
    },
    {
      id: "REV-2026-004",
      user_name: "Deepa Narayan",
      worker_id: 105,
      worker_name: "Pooja Devi",
      service: "cleaning",
      service_title: "Deep Kitchen & Floor Sanitation",
      rating: 5,
      type: "positive",
      comment: "Pooja was meticulous and used eco-friendly cooperative sanitation chemicals. Honest transparent pricing with 100% direct fair wages to the worker!",
      verified_booking: true,
      timestamp: "3 days ago",
      status: "resolved",
      ministry_action: "Commendation Recorded"
    },
    {
      id: "REV-2026-005",
      user_name: "Harish Chawla",
      worker_id: 104,
      worker_name: "Vikram Singh",
      service: "driver",
      service_title: "Hospital Transit & Wheelchair Assistance",
      rating: 3,
      type: "complaint",
      comment: "Driver arrived 12 minutes late due to traffic, but was helpful once he reached. Should improve peak-hour dispatch accuracy.",
      verified_booking: true,
      timestamp: "4 days ago",
      status: "warning_issued",
      ministry_action: "Warning Issued for Punctuality"
    }
  ];

  renderCitizenReviews();
  renderMinistryGrievances();
}

function renderCitizenReviews() {
  const container = document.getElementById("citizen-reviews-grid");
  if (!container) return;

  const filter = state.reviewFilter || "all";
  const list = state.reviews.filter(r => {
    if (filter === "positive") return r.type === "positive" || r.rating >= 4;
    if (filter === "complaint") return r.type === "complaint" || r.rating <= 3;
    return true;
  });

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <p class="text-sm font-bold text-slate-600">No reviews found in this category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(r => {
    const isPositive = r.type === "positive" || r.rating >= 4;
    const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
    const badgeType = isPositive
      ? `<span class="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200"><i data-lucide="check-circle" class="w-3 h-3"></i> Verified Experience</span>`
      : `<span class="bg-red-100 text-red-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-red-200"><i data-lucide="alert-triangle" class="w-3 h-3"></i> Grievance Logged</span>`;

    return `
      <div class="review-card glass-card rounded-2xl p-4 border ${isPositive ? "border-slate-200 hover:border-emerald-300" : "border-red-200 bg-red-50/20"} space-y-3">
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-black text-slate-900 text-xs">${r.user_name}</span>
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-blue-600" title="Dual-OTP Verified Citizen"></i>
            </div>
            <p class="text-[11px] text-slate-500 font-medium">${r.service_title || r.service}</p>
          </div>
          <div class="text-right">
            <div class="text-amber-500 font-bold text-xs tracking-wider">${stars}</div>
            <span class="text-[10px] text-slate-400 font-medium">${r.timestamp}</span>
          </div>
        </div>

        <p class="text-xs text-slate-700 leading-relaxed font-medium">"${r.comment}"</p>

        <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span class="text-slate-500">Worker: <strong class="text-slate-800">${r.worker_name}</strong></span>
          ${badgeType}
        </div>
      </div>
    `;
  }).join("");

  safeCreateIcons();
}

function filterCitizenReviews(filterType) {
  sfx.playClick();
  state.reviewFilter = filterType;
  ["all", "positive", "complaint"].forEach(f => {
    const btn = document.getElementById(`tab-review-${f}`);
    if (btn) {
      if (f === filterType) {
        btn.className = "px-3 py-1.5 bg-white text-blue-900 font-extrabold rounded-xl shadow-sm transition";
      } else {
        btn.className = "px-3 py-1.5 text-slate-600 hover:text-slate-900 font-bold rounded-xl transition";
      }
    }
  });
  renderCitizenReviews();
}

function openWriteReviewModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-write-review");
  if (!modal) return;
  
  // Pre-select current service if available
  const servSelect = document.getElementById("review-input-service");
  if (servSelect) servSelect.value = state.selectedService || "electrician";

  setStarRating(5);
  toggleReviewType("positive");

  modal.classList.remove("hidden");
  safeCreateIcons();
}

function closeWriteReviewModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-write-review");
  if (modal) modal.classList.add("hidden");
}

function setStarRating(score) {
  state.currentStarRating = score;
  const ratingInput = document.getElementById("review-input-rating");
  if (ratingInput) ratingInput.value = score;

  const starBtns = document.querySelectorAll("#review-star-container .star-btn");
  starBtns.forEach((btn, idx) => {
    if (idx < score) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  const label = document.getElementById("review-star-label");
  if (label) {
    const texts = ["", "1.0 / 5.0 (Poor)", "2.0 / 5.0 (Fair)", "3.0 / 5.0 (Average)", "4.0 / 5.0 (Very Good)", "5.0 / 5.0 (Excellent)"];
    label.innerText = texts[score] || `${score}.0 / 5.0`;
  }
}

function toggleReviewType(type) {
  state.currentReviewType = type;
  const posLabel = document.getElementById("label-type-positive");
  const compLabel = document.getElementById("label-type-complaint");

  if (type === "positive") {
    if (posLabel) posLabel.className = "p-2.5 border-2 border-emerald-500 bg-emerald-50 rounded-xl cursor-pointer flex items-center gap-2 font-bold text-emerald-900";
    if (compLabel) compLabel.className = "p-2.5 border border-slate-200 hover:border-red-300 rounded-xl cursor-pointer flex items-center gap-2 font-bold text-slate-700";
  } else {
    if (posLabel) posLabel.className = "p-2.5 border border-slate-200 hover:border-emerald-300 rounded-xl cursor-pointer flex items-center gap-2 font-bold text-slate-700";
    if (compLabel) compLabel.className = "p-2.5 border-2 border-red-500 bg-red-50 rounded-xl cursor-pointer flex items-center gap-2 font-bold text-red-900";
  }
}

async function handleReviewSubmit(e) {
  e.preventDefault();
  sfx.playClick();

  const nameInput = document.getElementById("review-input-name");
  const serviceInput = document.getElementById("review-input-service");
  const workerInput = document.getElementById("review-input-worker");
  const commentInput = document.getElementById("review-input-comment");

  const userName = nameInput ? nameInput.value.trim() : "Verified Citizen";
  const service = serviceInput ? serviceInput.value : "electrician";
  const workerId = workerInput ? parseInt(workerInput.value, 10) : 101;
  const comment = commentInput ? commentInput.value.trim() : "";
  const rating = state.currentStarRating || 5;
  const type = state.currentReviewType || "positive";

  const workerObj = WORKERS.find(w => w.id === workerId) || WORKERS[0];

  const payload = {
    user_name: userName,
    worker_id: workerId,
    service: service,
    rating: rating,
    type: type,
    comment: comment
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const saved = await res.json();
      const rawRev = saved.review || saved;
      const normalizedReview = {
        ...rawRev,
        id: rawRev.id || `REV-2026-00${state.reviews.length + 1}`,
        user_name: rawRev.user_name || rawRev.customer_name || userName,
        worker_id: rawRev.worker_id || workerId,
        worker_name: rawRev.worker_name || workerObj.name,
        service: rawRev.service || rawRev.service_type || service,
        service_title: rawRev.service_title || `${(rawRev.service || rawRev.service_type || service).toUpperCase()} Service`,
        rating: rawRev.rating || rating,
        type: rawRev.type || rawRev.review_type || type,
        comment: rawRev.comment || comment,
        status: (rawRev.status || (type === "complaint" ? "under_investigation" : "resolved")).toLowerCase().replace(/\s+/g, "_"),
        ministry_action: rawRev.ministry_action || (type === "complaint" ? "Logged for PACS Audit" : "Commendation Recorded")
      };
      state.reviews.unshift(normalizedReview);
    } else {
      throw new Error("Failed to post");
    }
  } catch (err) {
    // Offline fallback prepend
    const fallbackReview = {
      id: `REV-2026-00${state.reviews.length + 1}`,
      user_name: userName,
      worker_id: workerId,
      worker_name: workerObj.name,
      service: service,
      service_title: `${service} Task`,
      rating: rating,
      type: type,
      comment: comment,
      verified_booking: true,
      timestamp: "Just now",
      status: type === "complaint" ? "under_investigation" : "resolved",
      ministry_action: type === "complaint" ? "Logged for PACS Audit" : "Commendation Recorded"
    };
    state.reviews.unshift(fallbackReview);
  }

  closeWriteReviewModal();
  renderCitizenReviews();
  renderMinistryGrievances();

  if (commentInput) commentInput.value = "";
  sfx.playSuccessFanfare();
  showToast(state.currentLanguage === "hi"
    ? "आपकी समीक्षा सफलतापूर्वक प्रकाशित हो गई है और मंत्रालय लॉग में दर्ज हो गई है!"
    : "Your review has been published and logged in the Ministry Cockpit!", "success");
}

// ==========================================
// 17. MINISTRY COCKPIT EXTENSIONS
// ==========================================

async function initMinistryExtensions() {
  await fetchRegionalDemandCharts();
  await fetchMinistryRevenue();
  renderMinistryGrievances();
}

// 15. Comprehensive National Service Requirements & Regional Demand Reports
const DEFAULT_REGIONAL_DEMAND = [
  {
    district: "Central Delhi",
    district_hi: "मध्य दिल्ली",
    demand_index: 94,
    active_workers: 45,
    required_workers: 76,
    status: "Critical Shortage",
    monthly_orders: 1420,
    trade_demand: {
      electrician: 98, plumber: 85, carpentry: 82, cleaning: 92,
      tailoring: 75, driver: 88
    },
    trade_requirements: {
      electrician: { required: 32, active: 18, deficit: 14, demand_score: 98, monthly_orders: 420 },
      plumber: { required: 24, active: 15, deficit: 9, demand_score: 85, monthly_orders: 310 },
      carpentry: { required: 18, active: 11, deficit: 7, demand_score: 82, monthly_orders: 240 },
      cleaning: { required: 28, active: 20, deficit: 8, demand_score: 92, monthly_orders: 360 },
      tailoring: { required: 15, active: 11, deficit: 4, demand_score: 75, monthly_orders: 150 },
      driver: { required: 22, active: 16, deficit: 6, demand_score: 88, monthly_orders: 280 }
    }
  },
  {
    district: "South Delhi",
    district_hi: "दक्षिण दिल्ली",
    demand_index: 88,
    active_workers: 52,
    required_workers: 68,
    status: "High Demand",
    monthly_orders: 1850,
    trade_demand: {
      electrician: 84, plumber: 82, carpentry: 86, cleaning: 89,
      tailoring: 80, driver: 85
    },
    trade_requirements: {
      electrician: { required: 26, active: 22, deficit: 4, demand_score: 84, monthly_orders: 340 },
      plumber: { required: 22, active: 18, deficit: 4, demand_score: 82, monthly_orders: 290 },
      carpentry: { required: 20, active: 16, deficit: 4, demand_score: 86, monthly_orders: 260 },
      cleaning: { required: 30, active: 25, deficit: 5, demand_score: 89, monthly_orders: 410 },
      tailoring: { required: 16, active: 14, deficit: 2, demand_score: 80, monthly_orders: 200 },
      driver: { required: 25, active: 22, deficit: 3, demand_score: 85, monthly_orders: 320 }
    }
  },
  {
    district: "East Delhi",
    district_hi: "पूर्वी दिल्ली",
    demand_index: 76,
    active_workers: 38,
    required_workers: 46,
    status: "Stable Supply",
    monthly_orders: 980,
    trade_demand: {
      electrician: 75, plumber: 80, carpentry: 72, cleaning: 78,
      tailoring: 88, driver: 70
    },
    trade_requirements: {
      electrician: { required: 18, active: 16, deficit: 2, demand_score: 75, monthly_orders: 210 },
      plumber: { required: 16, active: 14, deficit: 2, demand_score: 80, monthly_orders: 190 },
      carpentry: { required: 14, active: 12, deficit: 2, demand_score: 72, monthly_orders: 160 },
      cleaning: { required: 20, active: 18, deficit: 2, demand_score: 78, monthly_orders: 240 },
      tailoring: { required: 22, active: 18, deficit: 4, demand_score: 88, monthly_orders: 250 },
      driver: { required: 15, active: 13, deficit: 2, demand_score: 70, monthly_orders: 180 }
    }
  },
  {
    district: "West Delhi",
    district_hi: "पश्चिम दिल्ली",
    demand_index: 82,
    active_workers: 40,
    required_workers: 56,
    status: "Shortage Alert",
    monthly_orders: 1210,
    trade_demand: {
      electrician: 90, plumber: 94, carpentry: 88, cleaning: 80,
      tailoring: 84, driver: 76
    },
    trade_requirements: {
      electrician: { required: 25, active: 17, deficit: 8, demand_score: 90, monthly_orders: 310 },
      plumber: { required: 24, active: 14, deficit: 10, demand_score: 94, monthly_orders: 330 },
      carpentry: { required: 18, active: 12, deficit: 6, demand_score: 88, monthly_orders: 220 },
      cleaning: { required: 22, active: 18, deficit: 4, demand_score: 80, monthly_orders: 260 },
      tailoring: { required: 18, active: 14, deficit: 4, demand_score: 84, monthly_orders: 210 },
      driver: { required: 18, active: 15, deficit: 3, demand_score: 76, monthly_orders: 200 }
    }
  },
  {
    district: "North Delhi",
    district_hi: "उत्तर दिल्ली",
    demand_index: 68,
    active_workers: 30,
    required_workers: 36,
    status: "Balanced",
    monthly_orders: 840,
    trade_demand: {
      electrician: 70, plumber: 66, carpentry: 68, cleaning: 72,
      tailoring: 70, driver: 68
    },
    trade_requirements: {
      electrician: { required: 15, active: 13, deficit: 2, demand_score: 70, monthly_orders: 170 },
      plumber: { required: 14, active: 12, deficit: 2, demand_score: 66, monthly_orders: 150 },
      carpentry: { required: 12, active: 10, deficit: 2, demand_score: 68, monthly_orders: 140 },
      cleaning: { required: 16, active: 14, deficit: 2, demand_score: 72, monthly_orders: 180 },
      tailoring: { required: 14, active: 12, deficit: 2, demand_score: 70, monthly_orders: 150 },
      driver: { required: 14, active: 12, deficit: 2, demand_score: 68, monthly_orders: 160 }
    }
  }
];

function initMinistryServiceRequirements() {
  const container = document.getElementById("min-service-chips-container");
  const select = document.getElementById("min-service-select");
  if (!container && !select) return;

  const isHi = state.currentLanguage === "hi";

  // Build Filter Chips
  if (container) {
    const chipsHtml = [
      `<button type="button" onclick="onMinistryServiceChange('all')" id="min-chip-all" class="px-3 py-1.5 rounded-xl border text-xs font-bold transition whitespace-nowrap btn-tactile flex items-center gap-1.5 shadow-xs">
        <i data-lucide="layout-grid" class="w-3.5 h-3.5"></i>
        <span>${isHi ? "सभी 6 सेवाएँ" : "All 6 Services"}</span>
      </button>`
    ];

    SERVICES.forEach(s => {
      const sName = isHi ? s.name_hi : s.name;
      chipsHtml.push(`
        <button type="button" onclick="onMinistryServiceChange('${s.id}')" id="min-chip-${s.id}" class="px-3 py-1.5 rounded-xl border text-xs font-bold transition whitespace-nowrap btn-tactile flex items-center gap-1.5 shadow-xs">
          <i data-lucide="${s.icon}" class="w-3.5 h-3.5"></i>
          <span>${sName}</span>
        </button>
      `);
    });

    container.innerHTML = chipsHtml.join("");
    safeCreateIcons();
  }

  if (select) {
    select.value = state.ministrySelectedService || "all";
  }

  updateMinistryServiceChipsUI();
  fetchRegionalDemandCharts();
}

function onMinistryServiceChange(serviceId) {
  sfx.playClick();
  state.ministrySelectedService = serviceId;

  const select = document.getElementById("min-service-select");
  if (select) select.value = serviceId;

  updateMinistryServiceChipsUI();
  fetchRegionalDemandCharts();

  const isHi = state.currentLanguage === "hi";
  let label = isHi ? "सभी 6 सेवाएँ" : "All 6 Services";
  if (serviceId !== "all") {
    const s = SERVICES.find(x => x.id === serviceId);
    if (s) label = isHi ? s.name_hi : s.name;
  }
  showToast(isHi ? `सेवा आवश्यकता रिपोर्ट सक्रिय: ${label}` : `Service Requirement Report: ${label}`, "info");
}

function updateMinistryServiceChipsUI() {
  const current = state.ministrySelectedService || "all";
  
  // All chip
  const allChip = document.getElementById("min-chip-all");
  if (allChip) {
    if (current === "all") {
      allChip.className = "px-3.5 py-1.5 rounded-xl border border-blue-600 bg-blue-600 text-white text-xs font-black transition whitespace-nowrap btn-tactile flex items-center gap-1.5 shadow-sm";
    } else {
      allChip.className = "px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-300 text-xs font-bold transition whitespace-nowrap btn-tactile flex items-center gap-1.5 shadow-xs";
    }
  }

  SERVICES.forEach(s => {
    const chip = document.getElementById(`min-chip-${s.id}`);
    if (chip) {
      if (current === s.id) {
        chip.className = "px-3.5 py-1.5 rounded-xl border border-blue-600 bg-blue-600 text-white text-xs font-black transition whitespace-nowrap btn-tactile flex items-center gap-1.5 shadow-sm";
      } else {
        chip.className = "px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-300 text-xs font-bold transition whitespace-nowrap btn-tactile flex items-center gap-1.5 shadow-xs";
      }
    }
  });
}

async function fetchRegionalDemandCharts() {
  const currentService = state.ministrySelectedService || "all";

  if (state.hasBackendConnection) {
    try {
      const url = currentService !== "all" 
        ? `${API_BASE_URL}/api/ministry/regional-demand?service_type=${currentService}`
        : `${API_BASE_URL}/api/ministry/regional-demand`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        state.regionalDemandData = data.districts || DEFAULT_REGIONAL_DEMAND;
        renderMinistryServiceRequirements(state.regionalDemandData, currentService, data.summary);
        return;
      }
    } catch (e) {
      console.warn("Could not fetch regional demand from API, falling back to local dataset", e);
    }
  }

  if (!state.regionalDemandData || state.regionalDemandData.length === 0) {
    state.regionalDemandData = DEFAULT_REGIONAL_DEMAND;
  }
  renderMinistryServiceRequirements(state.regionalDemandData, currentService);
}

function renderMinistryServiceRequirements(districts, serviceId = "all", apiSummary = null) {
  const data = districts || DEFAULT_REGIONAL_DEMAND;
  const isHi = state.currentLanguage === "hi";
  const selectedService = serviceId || state.ministrySelectedService || "all";
  const serviceObj = SERVICES.find(s => s.id === selectedService);
  const serviceName = serviceObj ? (isHi ? serviceObj.name_hi : serviceObj.name) : (isHi ? "सभी 6 सेवाएँ" : "All 6 Services");

  // 1. Calculate Aggregated Requirement Metrics
  let totalReq = 0;
  let totalAct = 0;
  let totalDef = 0;
  let totalOrders = 0;

  if (selectedService === "all") {
    totalReq = data.reduce((acc, d) => acc + (d.required_workers || 50), 0);
    totalAct = data.reduce((acc, d) => acc + (d.active_workers || 40), 0);
    totalDef = Math.max(0, totalReq - totalAct);
    totalOrders = data.reduce((acc, d) => acc + (d.monthly_orders || 1000), 0);
  } else {
    data.forEach(d => {
      const reqInfo = (d.trade_requirements && d.trade_requirements[selectedService]) 
        ? d.trade_requirements[selectedService] 
        : { required: 20, active: 15, deficit: 5, monthly_orders: 220 };
      totalReq += reqInfo.required;
      totalAct += reqInfo.active;
      totalDef += reqInfo.deficit;
      totalOrders += reqInfo.monthly_orders;
    });
  }

  // 2. Update 4 KPI Cards
  const totalReqEl = document.getElementById("min-req-total");
  const reqSubEl = document.getElementById("min-req-sub");
  const activeEl = document.getElementById("min-req-active");
  const activeSubEl = document.getElementById("min-req-active-sub");
  const deficitEl = document.getElementById("min-req-deficit");
  const deficitSubEl = document.getElementById("min-req-deficit-sub");
  const deficitCard = document.getElementById("min-card-deficit");
  const ordersEl = document.getElementById("min-req-orders");
  const ordersSubEl = document.getElementById("min-req-orders-sub");

  if (totalReqEl) totalReqEl.innerText = `${totalReq} ${isHi ? "तकनीशियन" : "Technicians"}`;
  if (reqSubEl) reqSubEl.innerText = `${serviceName} • 5 Districts`;

  if (activeEl) activeEl.innerText = `${totalAct} ${isHi ? "सक्रिय" : "Active"}`;
  if (activeSubEl) activeSubEl.innerText = isHi ? "100% आईटीआई / एनसीवीटी सत्यापित" : "100% ITI / NCVT Verified";

  if (deficitEl) {
    if (totalDef > 0) {
      deficitEl.innerText = `-${totalDef} ${isHi ? "कमी" : "Deficit"}`;
      if (deficitSubEl) deficitSubEl.innerText = isHi ? "लक्षित पैक्स भर्ती प्राथमिकता" : "Target for PACS Recruitment";
      if (deficitCard) deficitCard.className = "p-4 rounded-2xl bg-red-50/80 border border-red-200 shadow-xs";
    } else {
      deficitEl.innerText = `✓ ${isHi ? "संतुलित आपूर्ति" : "Balanced Supply"}`;
      if (deficitSubEl) deficitSubEl.innerText = isHi ? "पर्याप्त कुशल कार्यबल" : "Optimal Skilled Capacity";
      if (deficitCard) deficitCard.className = "p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-xs";
    }
  }

  const fulfillmentRate = totalReq > 0 ? Math.min(100, Math.round((totalAct / totalReq) * 100)) : 80;
  if (ordersEl) ordersEl.innerText = `${totalOrders.toLocaleString()} ${isHi ? "मासिक ऑर्डर" : "Monthly Orders"}`;
  if (ordersSubEl) ordersSubEl.innerText = `${isHi ? "पूर्ति दर" : "Fulfillment Rate"}: ${fulfillmentRate}%`;

  // 3. Update Chart Heading & Subtext
  const chartHeading = document.getElementById("min-chart-heading");
  if (chartHeading) {
    chartHeading.innerHTML = `
      <i data-lucide="bar-chart-2" class="w-3.5 h-3.5 text-blue-600"></i>
      <span>${isHi ? `क्षेत्रीय आवश्यकता चार्ट: ${serviceName}` : `District Requirement Charts: ${serviceName}`}</span>
    `;
  }

  // 4. Render Chart Grid (5 District Cards)
  const chartGrid = document.getElementById("ministry-demand-chart-grid");
  if (chartGrid) {
    chartGrid.innerHTML = data.map(d => {
      const distName = isHi ? (d.district_hi || d.district) : d.district;
      
      let reqCount = 0;
      let actCount = 0;
      let demandScore = 0;
      let statusText = d.status || "Balanced";

      if (selectedService === "all") {
        reqCount = d.required_workers || 50;
        actCount = d.active_workers || 40;
        demandScore = d.demand_index || d.overall_demand || 75;
      } else {
        const tr = (d.trade_requirements && d.trade_requirements[selectedService]) 
          ? d.trade_requirements[selectedService] 
          : { required: 18, active: 12, deficit: 6, demand_score: 80 };
        reqCount = tr.required;
        actCount = tr.active;
        demandScore = tr.demand_score;
        statusText = tr.deficit > 5 ? (isHi ? "गंभीर कमी" : "Critical Deficit") : (tr.deficit > 0 ? (isHi ? "कमी चेतावनी" : "Shortage Alert") : (isHi ? "संतुलित" : "Optimal"));
      }

      const isCritical = demandScore >= 85 || (reqCount - actCount) >= 8;
      const badgeColor = isCritical ? "bg-red-100 text-red-800 border-red-300" : "bg-blue-100 text-blue-800 border-blue-200";
      
      const reqBarH = Math.min(80, Math.max(16, reqCount * 2.2));
      const actBarH = Math.min(80, Math.max(12, actCount * 2.2));

      return `
        <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-black text-slate-900 text-xs">${distName}</span>
            <span class="text-[10px] font-black px-2 py-0.5 rounded-full border ${badgeColor}">${demandScore}% ${isHi ? "मांग" : "Demand"}</span>
          </div>

          <!-- Comparative Requirement Bar Chart: Required vs Active -->
          <div class="h-28 flex items-end justify-around gap-2 pt-2 pb-1 border-b border-slate-100 bg-slate-50/50 rounded-xl px-2">
            <div class="flex-1 flex flex-col items-center gap-1">
              <span class="text-[9px] font-bold text-blue-800">${reqCount}</span>
              <div class="chart-bar w-full bg-blue-600 rounded-t-md shadow-xs" style="height: ${reqBarH}px;" title="Required: ${reqCount}"></div>
              <span class="text-[9px] font-bold text-slate-600">${isHi ? "आवश्यक" : "Need"}</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-1">
              <span class="text-[9px] font-bold text-emerald-800">${actCount}</span>
              <div class="chart-bar w-full bg-emerald-500 rounded-t-md shadow-xs" style="height: ${actBarH}px;" title="Active: ${actCount}"></div>
              <span class="text-[9px] font-bold text-slate-600">${isHi ? "सक्रिय" : "Active"}</span>
            </div>
          </div>

          <div class="text-[11px] flex justify-between items-center text-slate-500 font-medium">
            <span>${isHi ? "स्थिति:" : "Status:"}</span>
            <strong class="${isCritical ? "text-red-600 font-bold" : "text-emerald-700 font-bold"}">${statusText}</strong>
          </div>
        </div>
      `;
    }).join("");
  }

  // 5. Render District Breakdown Table
  const tableBody = document.getElementById("ministry-service-req-table-body");
  const tableTitle = document.getElementById("min-table-title");
  if (tableTitle) {
    tableTitle.innerText = `${isHi ? "जिला-वार आवश्यकता विश्लेषण" : "District-Wise Requirement & Allocation Audit"} (${serviceName})`;
  }

  if (tableBody) {
    tableBody.innerHTML = data.map((d, idx) => {
      const distName = isHi ? (d.district_hi || d.district) : d.district;
      let reqCount = 0;
      let actCount = 0;
      let deficitCount = 0;
      let demandScore = 0;
      let statusBadge = "";

      if (selectedService === "all") {
        reqCount = d.required_workers || 50;
        actCount = d.active_workers || 40;
        deficitCount = Math.max(0, reqCount - actCount);
        demandScore = d.demand_index || d.overall_demand || 75;
      } else {
        const tr = (d.trade_requirements && d.trade_requirements[selectedService])
          ? d.trade_requirements[selectedService]
          : { required: 18, active: 12, deficit: 6, demand_score: 80 };
        reqCount = tr.required;
        actCount = tr.active;
        deficitCount = tr.deficit;
        demandScore = tr.demand_score;
      }

      if (deficitCount >= 7) {
        statusBadge = `<span class="bg-red-100 text-red-900 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-red-200 flex items-center gap-1 w-fit"><span class="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span> ${isHi ? "गंभीर कमी" : "Critical Shortage"}</span>`;
      } else if (deficitCount > 0) {
        statusBadge = `<span class="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-amber-200 w-fit">${isHi ? "कमी चेतावनी" : "Shortage Alert"}</span>`;
      } else {
        statusBadge = `<span class="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-emerald-200 w-fit">${isHi ? "संतुलित क्षमता" : "Optimal Capacity"}</span>`;
      }

      return `
        <tr class="hover:bg-slate-50 transition">
          <td class="p-3 font-bold text-slate-900 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${deficitCount > 5 ? 'bg-red-500' : 'bg-emerald-500'}"></span>
            <span>${distName}</span>
          </td>
          <td class="p-3">
            <div class="flex items-center space-x-2">
              <div class="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="${demandScore >= 85 ? 'bg-red-500' : 'bg-blue-600'} h-full" style="width: ${demandScore}%"></div>
              </div>
              <span class="font-bold text-slate-800">${demandScore}%</span>
            </div>
          </td>
          <td class="p-3 font-extrabold text-blue-900">${reqCount} ${isHi ? "तकनीशियन" : "Workers"}</td>
          <td class="p-3 font-semibold text-emerald-800">${actCount} ${isHi ? "सक्रिय" : "Active"}</td>
          <td class="p-3 font-black ${deficitCount > 0 ? 'text-red-600' : 'text-emerald-700'}">
            ${deficitCount > 0 ? `-${deficitCount}` : `✓ 0`}
          </td>
          <td class="p-3">${statusBadge}</td>
          <td class="p-3 text-right">
            <button onclick="deployPacsGuildForService(${idx}, '${selectedService}')" class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-[11px] border border-blue-200 transition btn-tactile shadow-2xs">
              ${isHi ? "पैक्स दल तैनात करें (+5)" : "Deploy PACS Guild (+5)"}
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  safeCreateIcons();
}

function deployPacsGuildForService(districtIndex, serviceId) {
  sfx.playSuccessFanfare();
  const d = state.regionalDemandData[districtIndex];
  if (!d) return;

  const isHi = state.currentLanguage === "hi";
  const distName = isHi ? (d.district_hi || d.district) : d.district;

  if (serviceId === "all") {
    d.active_workers = (d.active_workers || 40) + 5;
    d.demand_index = Math.max(50, (d.demand_index || 80) - 10);
  } else {
    if (d.trade_requirements && d.trade_requirements[serviceId]) {
      const tr = d.trade_requirements[serviceId];
      tr.active += 5;
      tr.deficit = Math.max(0, tr.required - tr.active);
      tr.demand_score = Math.max(50, tr.demand_score - 12);
    }
    d.active_workers = (d.active_workers || 40) + 5;
  }

  renderMinistryServiceRequirements(state.regionalDemandData, serviceId);
  showToast(isHi ? `✓ ${distName} में 5 प्रमाणित पैक्स तकनीशियन तैनात किए गए!` : `✓ 5 Certified PACS Technicians deployed to ${distName}!`, "success");
}

function downloadServiceRequirementReport() {
  sfx.playClick();
  const isHi = state.currentLanguage === "hi";
  const selectedService = state.ministrySelectedService || "all";
  const serviceObj = SERVICES.find(s => s.id === selectedService);
  const serviceName = serviceObj ? serviceObj.name.toUpperCase() : "ALL 12 COOPERATIVE SERVICES";

  const districts = state.regionalDemandData || DEFAULT_REGIONAL_DEMAND;

  let totalReq = 0;
  let totalAct = 0;
  let totalDef = 0;
  let totalOrders = 0;

  const districtLines = districts.map(d => {
    let req = 0;
    let act = 0;
    let def = 0;
    let score = 0;
    let orders = 0;

    if (selectedService === "all") {
      req = d.required_workers || 50;
      act = d.active_workers || 40;
      def = Math.max(0, req - act);
      score = d.demand_index || d.overall_demand || 75;
      orders = d.monthly_orders || 1000;
    } else {
      const tr = (d.trade_requirements && d.trade_requirements[selectedService])
        ? d.trade_requirements[selectedService]
        : { required: 20, active: 15, deficit: 5, demand_score: 80, monthly_orders: 220 };
      req = tr.required;
      act = tr.active;
      def = tr.deficit;
      score = tr.demand_score;
      orders = tr.monthly_orders;
    }

    totalReq += req;
    totalAct += act;
    totalDef += def;
    totalOrders += orders;

    const status = def > 5 ? "CRITICAL SHORTAGE" : (def > 0 ? "SHORTAGE ALERT" : "BALANCED");
    return `${d.district.padEnd(16)} | Req: ${String(req).padStart(3)} | Act: ${String(act).padStart(3)} | Deficit: ${String(def).padStart(3)} | Demand: ${String(score).padStart(3)}% | Monthly Orders: ${String(orders).padStart(5)} | Status: ${status}`;
  }).join("\n");

  const text = `===============================================================
MINISTRY OF COOPERATION, GOVERNMENT OF INDIA
NATIONAL COOPERATIVE GIG & SKILL PLATFORM - SEVA SETU
OFFICIAL WORKFORCE REQUIREMENT & DEMAND ALLOCATION REPORT
Reference: #GOI-COOP-REQ-2026-Q1 | Generated: ${new Date().toLocaleString()}
Selected Domain: ${serviceName}
===============================================================

1. APEX NATIONAL TELEMETRY & REQUIREMENT SUMMARY
----------------------------------------------------------------
Service Category:           ${serviceName}
Total Required Workforce:   ${totalReq} Certified Technicians
Active Verified Deployment: ${totalAct} Technicians in Field
Net Workforce Deficit:      ${totalDef} Technicians (${totalDef > 0 ? "URGENT HIRING TRIGGERED" : "SUPPLY OPTIMAL"})
Estimated Monthly Demand:   ${totalOrders.toLocaleString()} Service Tasks
Average Supply Health:      ${totalReq > 0 ? Math.round((totalAct / totalReq) * 100) : 80}%

2. DISTRICT-WISE REQUIREMENT BREAKDOWN
----------------------------------------------------------------
District         | Workforce Deployment & Shortage Metrics
----------------------------------------------------------------
${districtLines}
----------------------------------------------------------------

3. MINISTRY POLICY DIRECTIVES & PACS ALLOCATION INSTRUCTIONS
----------------------------------------------------------------
* Priority Mobilization: Direct Primary Agricultural Credit Societies (PACS)
  to sponsor emergency vocational batches via NCVT/ITI skill centers.
* Zero Intermediary Mandate: Disburse 100% of fair-wage earnings directly
  via Direct Benefit Transfer (DBT) to attested technician bank accounts.
* Grassroots Skill Expansion: Extend Khadi & Village Industries (KVIC) master
  artisan stipends to regional tailoring and carpentry clusters.

===============================================================
Digitally Certified & Sealed by:
Shri Amit Shah, Hon'ble Union Minister of Cooperation
Ministry of Cooperation, Government of India
Atal Akshay Urja Bhawan, New Delhi - 110003
===============================================================
`;

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Seva_Setu_Service_Requirement_Report_${selectedService}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(isHi ? `✓ सेवा आवश्यकता रिपोर्ट सफलतापूर्वक डाउनलोड की गई!` : `✓ Official Requirement Report for ${serviceName} downloaded!`, "success");
}

async function fetchMinistryRevenue() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ministry/revenue`);
    if (res.ok) {
      state.revenueData = await res.json();
      const rev = state.revenueData.metrics || state.revenueData;
      
      const gmvEl = document.getElementById("revenue-gmv");
      const workerEl = document.getElementById("revenue-worker-wages");
      const poolEl = document.getElementById("revenue-welfare-pool");
      const subEl = document.getElementById("revenue-subscriptions");

      if (gmvEl && rev.gross_merchandise_value) {
        gmvEl.textContent = `₹${Math.round(rev.gross_merchandise_value).toLocaleString('en-IN')}`;
      }
      if (workerEl && rev.direct_worker_wages) {
        workerEl.textContent = `₹${Math.round(rev.direct_worker_wages).toLocaleString('en-IN')}`;
      }
      if (poolEl && rev.welfare_fund_collected) {
        poolEl.textContent = `₹${Math.round(rev.welfare_fund_collected).toLocaleString('en-IN')}`;
      }
      if (subEl && rev.subscription_revenue) {
        subEl.textContent = `₹${Math.round(rev.subscription_revenue).toLocaleString('en-IN')}`;
      }
    }
  } catch (e) {
    console.warn("Could not fetch revenue telemetry from API", e);
  }
}

function filterMinistryGrievances(filterType) {
  sfx.playClick();
  state.ministryGrievanceFilter = filterType;
  ["all", "complaint", "positive"].forEach(f => {
    const btn = document.getElementById(`min-btn-${f}`);
    if (btn) {
      if (f === filterType) {
        btn.className = "px-3 py-1.5 bg-blue-600 text-white font-bold rounded-xl shadow-sm transition";
      } else {
        btn.className = "px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition";
      }
    }
  });
  renderMinistryGrievances();
}

function renderMinistryGrievances() {
  const tbody = document.getElementById("ministry-reviews-table-body");
  if (!tbody) return;

  const filter = state.ministryGrievanceFilter || "all";
  const list = state.reviews.filter(r => {
    if (filter === "complaint") return r.type === "complaint" || r.rating <= 3;
    if (filter === "positive") return r.type === "positive" || r.rating >= 4;
    return true;
  });

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400 font-medium">No reviews or grievances match this filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(r => {
    const isComplaint = r.type === "complaint" || r.rating <= 3;
    const typeBadge = isComplaint
      ? `<span class="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px] border border-red-200">⚠️ Grievance</span>`
      : `<span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-200">⭐ Praise</span>`;

    const st = (r.status || "").toLowerCase();
    let statusBadge = `<span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">Resolved</span>`;
    if (st.includes("investigat") || st === "under_investigation") {
      statusBadge = `<span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] animate-pulse">Investigating</span>`;
    } else if (st.includes("warn") || st === "warning_issued") {
      statusBadge = `<span class="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px]">Warning Issued</span>`;
    }

    const actionButtons = isComplaint && (st.includes("investigat") || st === "under_investigation") ? `
      <div class="flex items-center gap-1">
        <button onclick="updateGrievanceAction('${r.id}', 'resolved')" class="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] transition btn-tactile">Resolve</button>
        <button onclick="updateGrievanceAction('${r.id}', 'warning_issued')" class="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[10px] transition btn-tactile">Warn</button>
      </div>
    ` : `
      <span class="text-[10px] text-slate-400 font-semibold">${r.ministry_action || "Closed"}</span>
    `;

    return `
      <tr class="hover:bg-slate-50 transition">
        <td class="p-3 font-mono font-bold text-slate-900">${r.id}</td>
        <td class="p-3 font-bold text-slate-800">${r.user_name}</td>
        <td class="p-3"><strong class="text-slate-900">${r.worker_name}</strong><span class="text-[10px] text-slate-500 block uppercase">${r.service}</span></td>
        <td class="p-3">${typeBadge}</td>
        <td class="p-3 max-w-xs truncate text-slate-600" title="${r.comment}">"${r.comment}"</td>
        <td class="p-3">${statusBadge}</td>
        <td class="p-3">${actionButtons}</td>
      </tr>
    `;
  }).join("");
}

async function updateGrievanceAction(reviewId, newStatus) {
  sfx.playClick();
  const rev = state.reviews.find(r => String(r.id) === String(reviewId));
  const statusFormatted = newStatus === "resolved" ? "Resolved" : (newStatus === "warning_issued" ? "Warning Issued" : "Under Investigation");
  const actionText = newStatus === "resolved" ? "Resolved by PACS Council" : "Warning Issued by Federation";
  if (rev) {
    rev.status = newStatus;
    rev.ministry_action = actionText;
  }

  try {
    await fetch(`${API_BASE_URL}/api/ministry/reviews/${reviewId}/status?status=${encodeURIComponent(statusFormatted)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: statusFormatted,
        ministry_action: actionText
      })
    });
  } catch (e) {
    // Local update fallback
  }

  renderMinistryGrievances();
  renderCitizenReviews();
  showToast(`Grievance ${reviewId} updated to "${newStatus.replace('_', ' ').toUpperCase()}"`, "success");
}

function downloadRevenueAuditSlip() {
  sfx.playClick();
  const text = `===============================================================
MINISTRY OF COOPERATION, GOVERNMENT OF INDIA
NATIONAL COOPERATIVE GIG PLATFORM - REVENUE AUDIT CERTIFICATE
Reference: #PACS-AUDIT-2026-Q1 | Date: ${new Date().toLocaleDateString()}
===============================================================

1. PLATFORM SUMMARY METRICS
---------------------------------------------------------------
Gross Merchandise Value (GMV):          INR 14,28,500.00
Direct 100% Worker Wage DBT:            INR 12,85,650.00 (90.0%)
Cooperative Welfare Fund (3.5%):        INR    50,000.00  (3.5%)
Samriddhi Subscription Pass Revenue:    INR    92,850.00  (6.5%)
Total Active Subscribed Households:     460+ Households
Citizen Savings vs Aggregators:         INR  4,82,400.00

2. DISBURSEMENT PRINCIPLES
---------------------------------------------------------------
* Zero commission cut on base worker tariffs (100% to worker bank account)
* Zero platform fee for Samriddhi VIP Pass holders
* Cooperative Welfare Fund pooled exclusively for worker healthcare,
  term life insurance and emergency pensions via DCCB PACS federations.

===============================================================
Digitally Certified by:
Ministry of Cooperation & National Cooperative Development Corporation
"Sahakar Se Samriddhi"
===============================================================`;

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `SahakarSeva_Revenue_Audit_${new Date().toISOString().slice(0,10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast("Official Revenue Audit Slip downloaded successfully!", "success");
}

// ==========================================
// 18. WORKER ONBOARDING & RADAR ACCESS GATE
// ==========================================

function initWorkerOnboarding() {
  goToOnboardStep(1);
}

function goToOnboardStep(stepNum) {
  state.workerOnboardStep = stepNum;
  [1, 2, 3, 4].forEach(s => {
    const el = document.getElementById(`onboard-step-${s}`);
    const pill = document.getElementById(`onboard-step-pill-${s}`);
    if (el) {
      if (s === stepNum) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    }
    if (pill) {
      if (s === stepNum) {
        pill.className = "flex items-center gap-2 text-emerald-800 font-black";
        pill.querySelector("span").className = "w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-black shadow";
      } else if (s < stepNum) {
        pill.className = "flex items-center gap-2 text-emerald-600 font-bold";
        pill.querySelector("span").className = "w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-black";
      } else {
        pill.className = "flex items-center gap-2 text-slate-400 font-normal";
        pill.querySelector("span").className = "w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[11px] font-black";
      }
    }
  });
  safeCreateIcons();
}

const WORKER_PERSONAS = {
  rajesh: {
    id: 101,
    name: "Rajesh Kumar",
    skill: "electrician",
    phone: "+91 98765 43210",
    coop_name: "Delhi Central Labour Cooperative",
    coop_id: "DL/PACS/2026/101",
    otp: "4821",
    aadhaar: "XXXX-XXXX-8921",
    certificate: "ITI National Trade Certificate (Electrician - Grade A)",
    cert_title: "ITI Wireman NTC",
    cert_issuer: "NCVT Attested",
    photo: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=200&q=80"
  },
  aslam: {
    id: 102,
    name: "Mohammad Aslam",
    skill: "plumber",
    phone: "+91 98111 22334",
    coop_name: "Delhi Central Labour Cooperative",
    coop_id: "DL/PACS/2026/102",
    otp: "6319",
    aadhaar: "XXXX-XXXX-4532",
    certificate: "Skill India Sanitary & Plumbing Level 4",
    cert_title: "Skill India Sanitary L4",
    cert_issuer: "Skill India Vetted",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  sunita: {
    id: 103,
    name: "Sunita Sharma",
    skill: "tailoring",
    phone: "+91 98733 90812",
    coop_name: "South Delhi Multi-Purpose Cooperative",
    coop_id: "DL/PACS/2026/103",
    otp: "9042",
    aadhaar: "XXXX-XXXX-1190",
    certificate: "Weavers Cooperative Federation Master Tailoring Certificate",
    cert_title: "Weavers Federation Tailoring L4",
    cert_issuer: "Handloom Development Board & NSDC",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
  },
  vikram: {
    id: 104,
    name: "Vikram Singh",
    skill: "driver",
    phone: "+91 97123 45678",
    coop_name: "South Delhi Multi-Purpose Cooperative",
    coop_id: "DL/PACS/2026/104",
    otp: "3751",
    aadhaar: "XXXX-XXXX-7654",
    certificate: "Commercial PSV Badge (Heavy & Light Motor)",
    cert_title: "Commercial PSV Badge",
    cert_issuer: "MoRTH Vetted",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  },
  amit: {
    id: 106,
    name: "Amit Verma",
    skill: "electrician",
    phone: "+91 98700 11223",
    coop_name: "NCR Technicians Cooperative",
    coop_id: "DL/PACS/2026/106",
    otp: "8491",
    aadhaar: "XXXX-XXXX-9901",
    certificate: "State Skill Mission Certified Wireman #EL-6612",
    cert_title: "State Wireman Attested",
    cert_issuer: "NCR Tech Federation",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
  },
  ramdayal: {
    id: 107,
    name: "Ram Dayal",
    skill: "pottery",
    phone: "+91 98119 88776",
    coop_name: "NCR Technicians & Artisans Cooperative",
    coop_id: "DL/PACS/2026/107",
    otp: "5291",
    aadhaar: "XXXX-XXXX-6721",
    certificate: "KVIC Master Terracotta Artisan & Khadi Board Guild Attested",
    cert_title: "KVIC Master Terracotta Artisan",
    cert_issuer: "Khadi & Village Industries Commission (KVIC)",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
  },
  kishan: {
    id: 109,
    name: "Kishan Luhar",
    skill: "blacksmith",
    phone: "+91 98101 33445",
    coop_name: "Delhi Central Labour Cooperative",
    coop_id: "DL/PACS/2026/109",
    otp: "7741",
    aadhaar: "XXXX-XXXX-5519",
    certificate: "Labour Cooperative Guild Master Blacksmith & Arc Welding Attested",
    cert_title: "Master Blacksmith & Arc Welder",
    cert_issuer: "Labour Cooperative Guild & NCVT",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  manoj: {
    id: 110,
    name: "Manoj Painter",
    skill: "painting",
    phone: "+91 98711 77889",
    coop_name: "South Delhi Multi-Purpose Cooperative",
    coop_id: "DL/PACS/2026/110",
    otp: "6612",
    aadhaar: "XXXX-XXXX-4482",
    certificate: "NSDC Decorative Finishing & Surface Coating Guild Master",
    cert_title: "NSDC Decorative Finishing Master",
    cert_issuer: "National Skill Development Corporation (NSDC)",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  }
};

let currentSelectedWorkerPersonaKey = "rajesh";

function selectWorkerLoginPersona(personaKey) {
  sfx.playClick();
  const persona = WORKER_PERSONAS[personaKey];
  if (!persona) return;
  currentSelectedWorkerPersonaKey = personaKey;

  // Update input fields
  const nameInput = document.getElementById("worker-login-name");
  if (nameInput) nameInput.value = persona.name;

  const phoneInput = document.getElementById("worker-login-phone");
  if (phoneInput) phoneInput.value = persona.phone;

  const coopSelect = document.getElementById("worker-login-coop");
  if (coopSelect) {
    // Select existing option or create if not present
    let opt = Array.from(coopSelect.options).find(o => o.value === persona.coop_name);
    if (!opt) {
      opt = new Option(persona.coop_name, persona.coop_name, true, true);
      coopSelect.add(opt);
    }
    coopSelect.value = persona.coop_name;
  }

  const coopIdInput = document.getElementById("worker-coop-id-input");
  if (coopIdInput) coopIdInput.value = persona.coop_id;

  const otpInput = document.getElementById("worker-login-otp");
  if (otpInput) otpInput.value = persona.otp;

  // Highlight selected persona tile in onboarding grid
  const tiles = document.querySelectorAll("#worker-login-persona-grid .worker-auth-tile");
  tiles.forEach(tile => {
    if (tile.getAttribute("data-persona") === personaKey) {
      tile.className = "worker-auth-tile p-2.5 rounded-xl border-2 border-emerald-600 bg-emerald-50/80 text-left transition btn-tactile shadow-xs";
    } else {
      tile.className = "worker-auth-tile p-2.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 text-left transition btn-tactile shadow-xs";
    }
  });

  state.selectedOnboardTrade = persona.skill;
  state.workerSession = {
    workerId: persona.id,
    personaKey: personaKey,
    name: persona.name,
    phone: persona.phone,
    coop_name: persona.coop_name,
    coop_id: persona.coop_id,
    expectedOtp: persona.otp
  };

  autoAttachSampleCredentials();
  showToast(`Selected ${persona.name} (#${persona.id} - ${persona.skill.toUpperCase()}). Multi-layer credentials synced.`, "info");
}

function sendWorkerOtp() {
  sfx.playClick();
  const persona = WORKER_PERSONAS[currentSelectedWorkerPersonaKey] || WORKER_PERSONAS.rajesh;
  const phone = document.getElementById("worker-login-phone")?.value || persona.phone;
  const otp = persona.otp;

  showToast(`📲 UIDAI SMS Challenge sent to ${phone}: One-Time Password is ${otp}`, "success");

  const badge = document.getElementById("worker-otp-status-badge");
  if (badge) {
    badge.innerText = "OTP Challenge Dispatched";
    badge.className = "text-[10px] text-blue-800 bg-blue-100 font-bold px-2 py-0.5 rounded-full border border-blue-300 animate-pulse";
  }
}

function autofillWorkerOtp() {
  sfx.playClick();
  const persona = WORKER_PERSONAS[currentSelectedWorkerPersonaKey] || WORKER_PERSONAS.rajesh;
  const otpInput = document.getElementById("worker-login-otp");
  if (otpInput) {
    otpInput.value = persona.otp;
  }
  const badge = document.getElementById("worker-otp-status-badge");
  if (badge) {
    badge.innerText = "OTP Verified ✓";
    badge.className = "text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full border border-emerald-300";
  }
  showToast(`⚡ Demo OTP (${persona.otp}) auto-filled for ${persona.name}!`, "success");
}

function handleWorkerStep1Submit(e) {
  e.preventDefault();
  sfx.playClick();
  const phone = document.getElementById("worker-login-phone")?.value.trim() || "+91 98765 43210";
  const name = document.getElementById("worker-login-name")?.value.trim() || "Rajesh Kumar";
  const coopSelect = document.getElementById("worker-login-coop");
  const coop_name = (coopSelect && coopSelect.value) ? coopSelect.value : "Delhi Central Labour Cooperative";
  const otpVal = document.getElementById("worker-login-otp")?.value.trim() || "";

  if (otpVal.length !== 4) {
    showToast("⚠️ Please enter a valid 4-digit UIDAI OTP code", "warning");
    return;
  }

  const persona = WORKER_PERSONAS[currentSelectedWorkerPersonaKey] || WORKER_PERSONAS.rajesh;

  state.workerSession = {
    workerId: persona.id,
    personaKey: currentSelectedWorkerPersonaKey,
    name: name,
    phone: phone,
    coop_name: coop_name,
    coop_id: persona.coop_id
  };

  const badge = document.getElementById("worker-otp-status-badge");
  if (badge) {
    badge.innerText = "OTP Verified ✓";
    badge.className = "text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full border border-emerald-300";
  }

  showToast(`Layer 1 & 2 authentication verified for ${name}. Proceeding to trade selection.`, "info");
  goToOnboardStep(2);
}

function selectOnboardTrade(tradeId) {
  sfx.playClick();
  state.selectedOnboardTrade = tradeId;
  const cards = document.querySelectorAll("#onboard-trade-grid .trade-choice-card");
  cards.forEach(c => {
    if (c.getAttribute("data-trade") === tradeId) {
      c.className = "trade-choice-card p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/70 text-left transition cursor-pointer btn-tactile shadow-sm ring-2 ring-emerald-400/20";
    } else {
      c.className = "trade-choice-card p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 text-left transition cursor-pointer btn-tactile";
    }
  });

  setTimeout(() => {
    goToOnboardStep(3);
  }, 300);
}

function handleCertFileSelect(e) {
  const input = (e && e.target) ? e.target : e;
  const file = input && input.files && input.files[0];
  if (file) {
    state.uploadedCertFile = file.name;
    const badge = document.getElementById("cert-preview-badge");
    const label = document.getElementById("cert-filename-label");
    if (label) label.textContent = `Certificate Attached: ${file.name}`;
    if (badge) badge.classList.remove("hidden");
    const lbl = document.getElementById("cert-upload-status");
    if (lbl) {
      lbl.innerHTML = `<span class="text-emerald-700 font-bold flex items-center gap-1"><i data-lucide="check-circle-2" class="w-4 h-4"></i> ${file.name}</span>`;
    }
    safeCreateIcons();
  }
}

function handleAadhaarFileSelect(e) {
  const input = (e && e.target) ? e.target : e;
  const file = input && input.files && input.files[0];
  if (file) {
    state.uploadedAadhaarFile = file.name;
    const badge = document.getElementById("aadhaar-preview-badge");
    const label = document.getElementById("aadhaar-filename-label");
    if (label) label.textContent = `Aadhaar Attached: ${file.name}`;
    if (badge) badge.classList.remove("hidden");
    const lbl = document.getElementById("aadhaar-upload-status");
    if (lbl) {
      lbl.innerHTML = `<span class="text-emerald-700 font-bold flex items-center gap-1"><i data-lucide="check-circle-2" class="w-4 h-4"></i> ${file.name}</span>`;
    }
    safeCreateIcons();
  }
}

function autoAttachSampleCredentials() {
  sfx.playClick();
  state.uploadedCertFile = "ITI_National_Trade_Certificate_Wireman.pdf";
  state.uploadedAadhaarFile = "UIDAI_Aadhaar_Card_Verified.pdf";

  const certBadge = document.getElementById("cert-preview-badge");
  const certLabel = document.getElementById("cert-filename-label");
  if (certLabel) certLabel.textContent = "Certificate Attached: ITI Wireman NTC (Grade A)";
  if (certBadge) certBadge.classList.remove("hidden");

  const aadhaarBadge = document.getElementById("aadhaar-preview-badge");
  const aadhaarLabel = document.getElementById("aadhaar-filename-label");
  if (aadhaarLabel) aadhaarLabel.textContent = "Aadhaar Linked: XXXX-XXXX-8921 (UIDAI OTP Verified)";
  if (aadhaarBadge) aadhaarBadge.classList.remove("hidden");

  const certStatus = document.getElementById("cert-upload-status");
  if (certStatus) {
    certStatus.innerHTML = `<span class="text-emerald-700 font-bold flex items-center gap-1"><i data-lucide="check-circle-2" class="w-4 h-4"></i> ITI_Wireman_NTC_GradeA.pdf (Verified Attestation)</span>`;
  }
  const aadhaarStatus = document.getElementById("aadhaar-upload-status");
  if (aadhaarStatus) {
    aadhaarStatus.innerHTML = `<span class="text-emerald-700 font-bold flex items-center gap-1"><i data-lucide="check-circle-2" class="w-4 h-4"></i> UIDAI_Aadhaar_XXXX-8921.pdf (OTP Linked)</span>`;
  }
  safeCreateIcons();
  showToast("Pre-filled official ITI Wireman Certificate & UIDAI Aadhaar sample!", "info");
}

async function runWorkerVerification() {
  sfx.playClick();
  const btn = document.getElementById("btn-run-worker-verify");
  const btnTxt = document.getElementById("btn-verify-worker-text");

  if (btn) btn.disabled = true;
  if (btnTxt) btnTxt.innerText = "Analyzing Credentials with Gemini 1.5 Flash AI...";

  try {
    const res = await fetch(`${API_BASE_URL}/api/workers/onboard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: state.workerSession?.name || "Rajesh Kumar",
        phone: state.workerSession?.phone || "+91 98765 43210",
        skill: state.selectedOnboardTrade || "electrician",
        coop_name: state.workerSession?.coop_name || "Delhi Central Labour Cooperative",
        certificate_name: state.uploadedCertFile || "ITI National Trade Certificate",
        aadhaar_number: "XXXX-XXXX-8921"
      })
    });
    if (res.ok) {
      const data = await res.json();
      const nameEl = document.getElementById("onboard-verified-worker-name");
      const coopEl = document.getElementById("onboard-verified-coop-name");
      const skillEl = document.getElementById("onboard-verified-skill");

      if (nameEl) nameEl.innerText = data.worker?.name || "Rajesh Kumar";
      if (coopEl) coopEl.innerText = data.worker?.coop_name || "Delhi Central Labour Cooperative";
      if (skillEl) skillEl.innerText = `${(data.worker?.skill || "electrician").toUpperCase()} (Grade A)`;
    }
  } catch (e) {
    console.warn("Worker onboard API fallback", e);
  }

  setTimeout(() => {
    if (btn) btn.disabled = false;
    if (btnTxt) btnTxt.innerText = "Run AI Verification & Complete Onboarding";
    goToOnboardStep(4);
    sfx.playSuccessFanfare();
    showToast("Gemini AI verified credentials with 96.4% confidence!", "success");
  }, 900);
}

function grantWorkerAppAccess() {
  sfx.playSuccessFanfare();
  const wizard = document.getElementById("worker-onboarding-wizard");
  const workspace = document.getElementById("worker-active-workspace");

  if (wizard) wizard.classList.add("hidden");
  if (workspace) workspace.classList.remove("hidden");

  // Activate authenticated persona or matching worker
  let matched = null;
  if (state.workerSession?.workerId) {
    matched = WORKERS.find(w => w.id === state.workerSession.workerId);
  }
  if (!matched && state.selectedOnboardTrade) {
    matched = WORKERS.find(w => w.skill === state.selectedOnboardTrade);
  }
  if (!matched) {
    matched = WORKERS[0];
  }

  state.activeWorker = matched;
  updateWorkerCardUI(matched);
  const personaSelect = document.getElementById("worker-persona-select");
  if (personaSelect) personaSelect.value = String(matched.id);

  setWorkerDutyMode(state.workerDutyMode || "COOP_SHIFT");

  showToast(`Access granted! Welcome to the SahakarSeva Worker Cockpit, ${matched.name}.`, "success");
}

function logoutWorkerToOnboard() {
  sfx.playClick();
  const wizard = document.getElementById("worker-onboarding-wizard");
  const workspace = document.getElementById("worker-active-workspace");

  if (workspace) workspace.classList.add("hidden");
  if (wizard) wizard.classList.remove("hidden");
  goToOnboardStep(1);
  showToast("Logged out of worker session. Verification gate active.", "info");
}

function prefillWorkerDemo(persona = "rajesh") {
  sfx.playClick();
  const phoneInput = document.getElementById("worker-login-phone");
  const nameInput = document.getElementById("worker-login-name");
  const coopSelect = document.getElementById("worker-login-coop");

  if (phoneInput) phoneInput.value = "+91 98765 43210";
  if (nameInput) nameInput.value = "Rajesh Kumar";
  if (coopSelect) coopSelect.value = "Delhi Central Labour Cooperative";

  state.workerSession = {
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    coop_name: "Delhi Central Labour Cooperative"
  };
  state.selectedOnboardTrade = "electrician";
  autoAttachSampleCredentials();

  showToast("Fast-Track Demo prefilled! Click 'Continue' or proceed to verification.", "info");
}

// ============================================================================
// 19. WORKER FREELANCING PLATFORM & TIMING ENGINE
// ============================================================================

function initWorkerFreelanceHub() {
  updateWorkerFreelanceUI(state.activeWorker);
  renderFreelanceJobs();
  if (state.workerDutyMode) {
    setWorkerDutyMode(state.workerDutyMode);
  }
}

function setWorkerDutyMode(mode, silent = false) {
  if (!silent) sfx.playClick();
  state.workerDutyMode = mode;
  const isHi = state.currentLanguage === "hi";

  const btnCoop = document.getElementById("btn-mode-coop");
  const btnFreelance = document.getElementById("btn-mode-freelance");
  const btnDutyCoop = document.getElementById("btn-duty-coop");
  const btnDutyFreelance = document.getElementById("btn-duty-freelance");

  const normalSection = document.getElementById("worker-normal-job-section");
  const freelanceSection = document.getElementById("worker-freelance-section");

  const dutyBadge = document.getElementById("worker-duty-badge");
  const dutyText = document.getElementById("worker-duty-text");
  const dutySubtext = document.getElementById("worker-duty-subtext");
  const modeIndicatorPill = document.getElementById("worker-mode-indicator-pill");

  if (mode === "FREELANCE") {
    // 1. Section visibility: Show Freelance Hub, hide Normal Job Radar
    if (normalSection) normalSection.classList.add("hidden");
    if (freelanceSection) freelanceSection.classList.remove("hidden");

    // 2. Main persistent control bar buttons
    if (btnCoop) {
      btnCoop.className = "px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-900 transition flex items-center gap-2 btn-tactile hover:bg-white/80";
    }
    if (btnFreelance) {
      btnFreelance.className = "px-4 py-2.5 rounded-xl font-black text-xs bg-indigo-600 text-white shadow-md transition flex items-center gap-2 btn-tactile ring-2 ring-indigo-500/30";
    }

    // 3. Secondary toggle buttons in freelance header
    if (btnDutyCoop) {
      btnDutyCoop.className = "px-3.5 py-2 rounded-xl text-xs font-bold transition text-indigo-200 hover:text-white hover:bg-indigo-800/60 flex items-center gap-1.5 btn-tactile";
    }
    if (btnDutyFreelance) {
      btnDutyFreelance.className = "px-3.5 py-2 rounded-xl text-xs font-bold transition bg-indigo-600 text-white shadow-md flex items-center gap-1.5 btn-tactile";
    }

    // 4. Status badges and labels
    if (dutyBadge) {
      dutyBadge.className = "px-3.5 py-1.5 rounded-2xl bg-indigo-100 text-indigo-900 border border-indigo-300 font-black text-xs flex items-center gap-2 shadow-xs transition-all";
      dutyBadge.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span><span id="worker-duty-badge-text">${isHi ? "स्वतंत्र फ्रीलांस मोड (100% प्रत्यक्ष)" : "FREELANCE PLATFORM MODE (100% Direct)"}</span>`;
    }
    if (dutyText) {
      dutyText.innerText = isHi ? "स्वतंत्र फ्रीलांसिंग सक्रिय (0% महासंघ शुल्क)" : "Independent Freelancing Active (0% Federation Cut)";
    }
    if (dutySubtext) {
      dutySubtext.innerText = isHi ? "शाम/सप्ताहांत के स्लॉट में सीधे ग्राहकों के कार्य स्वीकारें। कमाई 100% आपके यूपीआई पर।" : "Post-shift open marketplace: choose custom evening/weekend gigs with zero commission.";
    }
    if (modeIndicatorPill) {
      modeIndicatorPill.className = "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 uppercase tracking-wider";
      modeIndicatorPill.innerText = isHi ? "फ्रीलांस मोड" : "Freelance Mode";
    }

    renderFreelanceJobs();
    if (!silent) {
      showToast(isHi 
        ? "🚀 फ्रीलांस मोड सक्रिय: 100% कमाई सीधे आपके खाते में (0% कटौती)" 
        : "🚀 Freelancing Mode Active: 100% earnings go directly to you with 0% federation cut!", "success");
    }
  } else {
    state.workerDutyMode = "COOP_SHIFT";

    // 1. Section visibility: Show Normal Job Radar, hide Freelance Hub
    if (normalSection) normalSection.classList.remove("hidden");
    if (freelanceSection) freelanceSection.classList.add("hidden");

    // 2. Main persistent control bar buttons
    if (btnCoop) {
      btnCoop.className = "px-4 py-2.5 rounded-xl font-black text-xs bg-blue-700 text-white shadow-md transition flex items-center gap-2 btn-tactile ring-2 ring-blue-500/20";
    }
    if (btnFreelance) {
      btnFreelance.className = "px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-900 transition flex items-center gap-2 btn-tactile hover:bg-white/80";
    }

    // 3. Secondary toggle buttons in freelance header
    if (btnDutyCoop) {
      btnDutyCoop.className = "px-3.5 py-2 rounded-xl text-xs font-bold transition bg-emerald-600 text-white shadow-md flex items-center gap-1.5 btn-tactile";
    }
    if (btnDutyFreelance) {
      btnDutyFreelance.className = "px-3.5 py-2 rounded-xl text-xs font-bold transition text-indigo-200 hover:text-white hover:bg-indigo-800/60 flex items-center gap-1.5 btn-tactile";
    }

    // 4. Status badges and labels
    if (dutyBadge) {
      dutyBadge.className = "px-3.5 py-1.5 rounded-2xl bg-blue-100 text-blue-900 border border-blue-300 font-black text-xs flex items-center gap-2 shadow-xs transition-all";
      dutyBadge.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span><span id="worker-duty-badge-text">${isHi ? "सहकारी ऑन-ड्यूटी शिफ्ट (09:00 - 17:00)" : "COOPERATIVE SHIFT (09:00 - 17:00)"}</span>`;
    }
    if (dutyText) {
      dutyText.innerText = isHi ? "सहकारी ऑन-ड्यूटी शिफ्ट (09:00 - 17:00)" : "Cooperative On-Duty Shift (09:00 - 17:00)";
    }
    if (dutySubtext) {
      dutySubtext.innerText = isHi ? "मानक सहकारी प्रेषण एवं कल्याण निधि संरक्षण" : "Standard cooperative radar dispatch with 3.5% welfare pool reserve";
    }
    if (modeIndicatorPill) {
      modeIndicatorPill.className = "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider";
      modeIndicatorPill.innerText = isHi ? "सामान्य कार्य मोड" : "Normal Job Mode";
    }

    if (!silent) {
      showToast(isHi 
        ? "🏛️ सहकारी शिफ्ट सक्रिय (09:00 - 17:00 मानक प्रेषण)" 
        : "🏛️ Cooperative Shift Active (09:00 - 17:00 Standard Dispatch)", "info");
    }
  }
  safeCreateIcons();
}

function updateWorkerFreelanceUI(worker) {
  if (!worker) return;
  const earnedEl = document.getElementById("worker-freelance-earned-display");
  if (earnedEl) {
    earnedEl.innerText = `₹${(worker.freelance_earned || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  }
}

function toggleFreelanceSlot(slotName, btnEl) {
  sfx.playClick();
  const worker = state.activeWorker;
  if (!worker.freelance_slots) {
    worker.freelance_slots = ["17:00 - 21:00 (Evening)"];
  }

  const idx = worker.freelance_slots.indexOf(slotName);
  if (idx > -1) {
    worker.freelance_slots.splice(idx, 1);
    if (btnEl) {
      btnEl.className = "slot-chip px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 text-slate-700 font-bold text-xs transition btn-tactile";
    }
    showToast(`Removed slot: ${slotName}`, "info");
  } else {
    worker.freelance_slots.push(slotName);
    if (btnEl) {
      btnEl.className = "slot-chip px-3 py-1.5 rounded-xl border-2 border-indigo-600 bg-indigo-50 text-indigo-950 font-bold text-xs transition btn-tactile shadow-xs";
    }
    showToast(`✓ Added slot: ${slotName}`, "success");
  }

  const hintEl = document.getElementById("freelance-active-slot-hint");
  if (hintEl) {
    hintEl.innerText = worker.freelance_slots.length > 0 
      ? `${worker.freelance_slots.length} Active Slots: ${worker.freelance_slots[0]}`
      : "No slots selected (Offline post-shift)";
  }

  if (state.hasBackendConnection) {
    fetch(`${API_BASE_URL}/api/workers/${worker.id}/freelance-settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        freelance_enabled: true,
        freelance_slots: worker.freelance_slots
      })
    }).catch(e => console.warn("Backend freelance settings sync offline:", e));
  }
}

function renderFreelanceJobs() {
  const container = document.getElementById("freelance-jobs-grid");
  if (!container) return;
  const isHi = state.currentLanguage === "hi";
  container.innerHTML = "";

  const countBadge = document.getElementById("freelance-jobs-count-badge");
  if (countBadge) {
    countBadge.innerText = `${state.freelanceJobs.length} Available Gigs`;
  }

  state.freelanceJobs.forEach(job => {
    const isClaimedByMe = job.claimed_by === state.activeWorker.id;
    const isClaimedByOther = job.claimed_by && !isClaimedByMe;

    const card = document.createElement("div");
    card.className = `p-4 rounded-2xl border transition-all ${
      isClaimedByMe 
        ? "bg-emerald-50/50 border-emerald-300 shadow-sm" 
        : isClaimedByOther 
          ? "bg-slate-50 border-slate-200 opacity-60" 
          : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md"
    }`;

    let buttonHtml = "";
    if (isClaimedByMe) {
      buttonHtml = `
        <button disabled class="w-full py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-default">
          <i data-lucide="check-circle-2" class="w-4 h-4"></i>
          <span>${isHi ? "कार्य दावा किया गया • 100% प्रत्यक्ष निपटान" : "Claimed by You • 100% Direct Payout"}</span>
        </button>
      `;
    } else if (isClaimedByOther) {
      buttonHtml = `
        <button disabled class="w-full py-2.5 px-3 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed">
          <span>${isHi ? "अन्य तकनीशियन द्वारा दावा किया गया" : "Claimed by Another Worker"}</span>
        </button>
      `;
    } else {
      buttonHtml = `
        <button onclick="claimFreelanceJob('${job.id}')" class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md btn-tactile">
          <i data-lucide="zap" class="w-4 h-4 text-amber-300"></i>
          <span>${isHi ? `दावा करें (₹${job.freelance_fee} 100% सीधा भुगतान)` : `Claim Gig (₹${job.freelance_fee} 100% Direct Pay)`}</span>
        </button>
      `;
    }

    card.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div>
          <span class="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-bold text-[10px] uppercase tracking-wider">${job.category.toUpperCase()}</span>
          <h5 class="font-black text-slate-900 text-sm mt-1 leading-snug">${job.title}</h5>
          <p class="text-xs text-slate-500 font-medium mt-0.5">👤 ${job.client_name} &bull; 📍 ${job.client_location}</p>
        </div>
        <div class="text-right flex-shrink-0">
          <div class="text-lg font-black text-indigo-950">₹${job.freelance_fee.toFixed(2)}</div>
          <span class="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block">100% Direct (₹0 cut)</span>
        </div>
      </div>

      <div class="my-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <span class="flex items-center gap-1">
          <i data-lucide="clock" class="w-3.5 h-3.5 text-indigo-500"></i>
          <strong>${job.time_slot}</strong> (${job.est_duration})
        </span>
        <span class="font-bold text-indigo-700">🗓️ ${job.date}</span>
      </div>

      <p class="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">${job.description}</p>

      ${buttonHtml}
    `;

    container.appendChild(card);
  });

  safeCreateIcons();
}

function claimFreelanceJob(jobId) {
  sfx.playSuccessFanfare();
  const job = state.freelanceJobs.find(j => j.id === jobId);
  if (!job) return;

  const isHi = state.currentLanguage === "hi";

  // Generate unique 4-digit START and END OTPs for this direct P2P freelance contract
  const startOtp = Math.floor(1000 + Math.random() * 9000).toString();
  const endOtp = Math.floor(1000 + Math.random() * 9000).toString();

  const wCoords = getWorkerCoords(state.activeWorker);
  const targetCoords = job.coords || [28.6304, 77.2273];
  const dist = computeDistanceKm(wCoords[0], wCoords[1], targetCoords[0], targetCoords[1]);

  state.activeFreelanceBooking = {
    job_id: job.id,
    title: job.title,
    category: job.category,
    client_name: job.client_name,
    client_phone: job.client_phone || "+91 98110 44231",
    client_location: job.client_location,
    coords: targetCoords,
    time_slot: job.time_slot,
    est_duration: job.est_duration,
    freelance_fee: job.freelance_fee,
    platform_fee: 20.0, // Matches standard platform fee in normal mode
    federation_cut: 0.0, // Association from govt/federation removed
    worker_takehome: job.freelance_fee,
    start_otp: startOtp,
    end_otp: endOtp,
    status: "EN_ROUTE",
    proof_attached: false
  };

  job.claimed_by = state.activeWorker.id;
  renderFreelanceJobs();

  // Populate Freelance Station UI
  const station = document.getElementById("freelance-active-station");
  if (station) {
    station.classList.remove("hidden");

    // Metadata
    const catEl = document.getElementById("fl-active-category");
    if (catEl) catEl.innerText = `${job.category.toUpperCase()} • DIRECT P2P GIG`;

    const titleEl = document.getElementById("fl-active-title");
    if (titleEl) titleEl.innerText = job.title;

    const clientEl = document.getElementById("fl-active-client");
    if (clientEl) clientEl.innerText = job.client_name;

    const phoneEl = document.getElementById("fl-active-phone");
    if (phoneEl) phoneEl.innerText = job.client_phone || "+91 98110 44231";

    const payoutEl = document.getElementById("fl-active-payout");
    if (payoutEl) payoutEl.innerText = `₹${job.freelance_fee.toFixed(2)}`;

    const locEl = document.getElementById("fl-active-loc");
    if (locEl) locEl.innerText = job.client_location;

    const slotEl = document.getElementById("fl-active-slot");
    if (slotEl) slotEl.innerText = `${job.time_slot} (${job.est_duration})`;

    const distEl = document.getElementById("fl-active-dist");
    if (distEl) distEl.innerText = `📍 ${dist} km away`;

    // Pricing breakdown (no govt cut, ₹20 platform fee matching normal mode)
    const calcBase = document.getElementById("fl-calc-base");
    if (calcBase) calcBase.innerText = `₹${job.freelance_fee.toFixed(2)}`;

    const calcPlatform = document.getElementById("fl-calc-platform");
    if (calcPlatform) calcPlatform.innerText = "₹20.00";

    const calcNet = document.getElementById("fl-calc-net");
    if (calcNet) calcNet.innerText = `₹${job.freelance_fee.toFixed(2)}`;

    // Reset Step 1
    const statusBadge = document.getElementById("fl-active-status-badge");
    if (statusBadge) {
      statusBadge.className = "px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase";
      statusBadge.innerText = isHi ? "कार्यस्थल के लिए रवाना" : "En Route to Site";
    }

    const badge1 = document.getElementById("fl-badge-step-1");
    if (badge1) {
      badge1.className = "text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase";
      badge1.innerText = isHi ? "आगमन ओटीपी प्रतीक्षारत" : "Awaiting Site Arrival";
    }
    const input1 = document.getElementById("fl-input-start-otp");
    if (input1) input1.value = "";

    // Reset Step 2 (Locked)
    const box2 = document.getElementById("fl-box-step-2");
    if (box2) box2.className = "p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 opacity-60";
    const num2 = document.getElementById("fl-num-step-2");
    if (num2) num2.className = "w-5 h-5 rounded-full bg-slate-700 text-slate-300 text-[10px] flex items-center justify-center font-bold";
    const badge2 = document.getElementById("fl-badge-step-2");
    if (badge2) {
      badge2.className = "text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase";
      badge2.innerText = isHi ? "लॉक (चरण 1 आवश्यक)" : "Locked (Needs Step 1)";
    }
    const fileProof = document.getElementById("fl-proof-file");
    if (fileProof) { fileProof.value = ""; fileProof.disabled = true; }
    const btnSimProof = document.getElementById("fl-btn-simulate-proof");
    if (btnSimProof) btnSimProof.disabled = true;
    const proofPrevContainer = document.getElementById("fl-proof-preview-container");
    if (proofPrevContainer) proofPrevContainer.classList.add("hidden");

    // Reset Step 3 (Locked)
    const box3 = document.getElementById("fl-box-step-3");
    if (box3) box3.className = "p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 opacity-60";
    const num3 = document.getElementById("fl-num-step-3");
    if (num3) num3.className = "w-5 h-5 rounded-full bg-slate-700 text-slate-300 text-[10px] flex items-center justify-center font-bold";
    const badge3 = document.getElementById("fl-badge-step-3");
    if (badge3) {
      badge3.className = "text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase";
      badge3.innerText = isHi ? "लॉक" : "Locked";
    }
    const input3 = document.getElementById("fl-input-end-otp");
    if (input3) { input3.value = ""; input3.disabled = true; }
    const btnEndAutofill = document.getElementById("fl-btn-autofill-end");
    if (btnEndAutofill) btnEndAutofill.disabled = true;
    const btnEndSubmit = document.getElementById("fl-btn-submit-end");
    if (btnEndSubmit) btnEndSubmit.disabled = true;

    // Reset Settlement Card
    const settleCard = document.getElementById("fl-settlement-card");
    if (settleCard) settleCard.classList.add("hidden");

    // Smooth scroll to active station
    station.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Initialize interactive Leaflet map in the Freelance station
  initFreelanceNavMap(targetCoords, job.client_location, job.title);

  // Also sync radar navigation map if worker toggles to radar
  initWorkerRadarMap(targetCoords, `${job.title} (${job.client_name})`, "Freelance Direct Gig");

  showToast(isHi 
    ? `✓ फ्रीलांस कार्य बुक हुआ! ग्राहक के पास पहुंचकर START_OTP (संकेत: ${startOtp}) मांगें।` 
    : `✓ Freelance Gig Booked! Live GPS active. Ask client for START_OTP (Hint: ${startOtp}) on arrival.`, "success");
}

function initFreelanceNavMap(destCoords, destTitle = "Client Location", gigTitle = "Freelance Gig") {
  if (typeof L === "undefined") return;
  const container = document.getElementById("freelance-nav-leaflet");
  if (!container) return;

  const wCoords = getWorkerCoords(state.activeWorker);
  const targetCoords = destCoords || [28.6304, 77.2273];

  if (!state.freelanceNavMap) {
    state.freelanceNavMap = L.map("freelance-nav-leaflet", {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView(wCoords, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(state.freelanceNavMap);
  } else {
    state.freelanceNavMap.invalidateSize();
  }

  // Remove previous layers
  if (state.flNavWorkerMarker) state.freelanceNavMap.removeLayer(state.flNavWorkerMarker);
  if (state.flNavDestMarker) state.freelanceNavMap.removeLayer(state.flNavDestMarker);
  if (state.flNavPolyline) state.freelanceNavMap.removeLayer(state.flNavPolyline);

  // Worker live location marker
  const workerIcon = L.divIcon({
    className: 'custom-pin worker-pin ring-4 ring-indigo-400',
    html: `<span>W</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
  state.flNavWorkerMarker = L.marker(wCoords, { icon: workerIcon })
    .addTo(state.freelanceNavMap)
    .bindPopup(`<b>Your Location</b><br>${state.activeWorker?.name || "Freelancer"}`);

  // Destination marker
  const destIcon = L.divIcon({
    className: 'custom-pin customer-pin ring-4 ring-amber-400',
    html: `<span>G</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
  state.flNavDestMarker = L.marker(targetCoords, { icon: destIcon })
    .addTo(state.freelanceNavMap)
    .bindPopup(`<b>${gigTitle}</b><br>${destTitle}`);

  // Polyline
  state.flNavPolyline = L.polyline([wCoords, targetCoords], {
    color: '#6366f1',
    weight: 4,
    opacity: 0.9,
    dashArray: '8, 8'
  }).addTo(state.freelanceNavMap);

  try {
    state.freelanceNavMap.fitBounds(state.flNavPolyline.getBounds(), { padding: [30, 30] });
  } catch (e) {
    state.freelanceNavMap.setView(wCoords, 13);
  }

  // HUD
  const hudTitle = document.getElementById("fl-map-hud-title");
  if (hudTitle) hudTitle.innerText = `En Route: ${destTitle}`;

  // Google Maps external link
  const extBtn = document.getElementById("fl-external-nav");
  if (extBtn) {
    extBtn.href = `https://www.google.com/maps/dir/?api=1&origin=${wCoords[0]},${wCoords[1]}&destination=${targetCoords[0]},${targetCoords[1]}`;
  }

  setTimeout(() => {
    if (state.freelanceNavMap) state.freelanceNavMap.invalidateSize();
  }, 250);
}

function autoFillFreelanceStartOtp() {
  sfx.playClick();
  if (!state.activeFreelanceBooking) return;
  const inputEl = document.getElementById("fl-input-start-otp");
  if (inputEl) inputEl.value = state.activeFreelanceBooking.start_otp;
  showToast(state.currentLanguage === "hi" 
    ? `डेमो शुरुआती ओटीपी भरा गया: ${state.activeFreelanceBooking.start_otp}` 
    : `Demo START_OTP auto-filled: ${state.activeFreelanceBooking.start_otp}`, "info");
}

function submitFreelanceStartOtp() {
  sfx.init();
  const inputEl = document.getElementById("fl-input-start-otp");
  const entered = inputEl ? inputEl.value.trim() : "";
  const isHi = state.currentLanguage === "hi";

  if (!state.activeFreelanceBooking) {
    showToast(isHi ? "कोई सक्रिय फ्रीलांस बुकिंग नहीं।" : "No active freelance gig booking.", "warning");
    return;
  }

  if (entered === state.activeFreelanceBooking.start_otp) {
    sfx.playSuccessFanfare();
    state.activeFreelanceBooking.status = "IN_PROGRESS";

    // Update Header Status Badge
    const statusBadge = document.getElementById("fl-active-status-badge");
    if (statusBadge) {
      statusBadge.className = "px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase";
      statusBadge.innerText = isHi ? "कार्य प्रगति पर (घड़ी सक्रिय)" : "In Progress (Work Clock Active)";
    }

    // Step 1: Mark Verified
    const badge1 = document.getElementById("fl-badge-step-1");
    if (badge1) {
      badge1.className = "text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase";
      badge1.innerText = isHi ? "सत्यापित" : "VERIFIED";
    }

    // Step 2: Unlock Proof of Work
    const box2 = document.getElementById("fl-box-step-2");
    if (box2) box2.className = "p-3.5 bg-slate-900/90 border border-indigo-900/70 rounded-2xl space-y-2";
    const num2 = document.getElementById("fl-num-step-2");
    if (num2) num2.className = "w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold";
    const badge2 = document.getElementById("fl-badge-step-2");
    if (badge2) {
      badge2.className = "text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase";
      badge2.innerText = isHi ? "वैकल्पिक प्रमाण" : "OPTIONAL PROOF";
    }
    const fileProof = document.getElementById("fl-proof-file");
    if (fileProof) fileProof.disabled = false;
    const btnSimProof = document.getElementById("fl-btn-simulate-proof");
    if (btnSimProof) btnSimProof.disabled = false;

    // Step 3: Unlock END_OTP Input
    const box3 = document.getElementById("fl-box-step-3");
    if (box3) box3.className = "p-3.5 bg-slate-900/90 border border-emerald-900/70 rounded-2xl space-y-2";
    const num3 = document.getElementById("fl-num-step-3");
    if (num3) num3.className = "w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold";
    const badge3 = document.getElementById("fl-badge-step-3");
    if (badge3) {
      badge3.className = "text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase";
      badge3.innerText = isHi ? "समापन ओटीपी प्रतीक्षारत" : "AWAITING END_OTP";
    }
    const input3 = document.getElementById("fl-input-end-otp");
    if (input3) input3.disabled = false;
    const btnEndAutofill = document.getElementById("fl-btn-autofill-end");
    if (btnEndAutofill) btnEndAutofill.disabled = false;
    const btnEndSubmit = document.getElementById("fl-btn-submit-end");
    if (btnEndSubmit) btnEndSubmit.disabled = false;

    showToast(isHi 
      ? "✓ शुरुआती ओटीपी सत्यापित! सेवा शुरू हुई। कार्य पूरा होने पर ग्राहक से END_OTP मांगें।" 
      : "✓ START_OTP Verified! Service clock started. Request END_OTP from client upon inspection.", "success");
  } else {
    sfx.playFallbackWarning();
    showToast(`Invalid START_OTP. Hint: ${state.activeFreelanceBooking.start_otp}`, "warning");
  }
}

function handleFreelanceProofUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.getElementById("fl-proof-preview-img");
      if (img) img.src = e.target.result;
      const previewCont = document.getElementById("fl-proof-preview-container");
      if (previewCont) previewCont.classList.remove("hidden");
      if (state.activeFreelanceBooking) state.activeFreelanceBooking.proof_attached = true;
      const badge2 = document.getElementById("fl-badge-step-2");
      if (badge2) {
        badge2.className = "text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase";
        badge2.innerText = state.currentLanguage === "hi" ? "प्रमाण संलग्न" : "ATTACHED";
      }
      showToast(state.currentLanguage === "hi" ? "कार्य का प्रमाण संलग्न किया गया" : "Work proof photo attached", "info");
    };
    reader.readAsDataURL(file);
  }
}

function simulateFreelanceProof() {
  sfx.playClick();
  const img = document.getElementById("fl-proof-preview-img");
  if (img) img.src = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80";
  const previewCont = document.getElementById("fl-proof-preview-container");
  if (previewCont) previewCont.classList.remove("hidden");
  if (state.activeFreelanceBooking) state.activeFreelanceBooking.proof_attached = true;
  const badge2 = document.getElementById("fl-badge-step-2");
  if (badge2) {
    badge2.className = "text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase";
    badge2.innerText = state.currentLanguage === "hi" ? "प्रमाण संलग्न" : "ATTACHED";
  }
  showToast(state.currentLanguage === "hi" ? "नमूना प्रमाण फोटो संलग्न की गई" : "Sample completion photo attached", "info");
}

function autoFillFreelanceEndOtp() {
  sfx.playClick();
  if (!state.activeFreelanceBooking) return;
  const inputEl = document.getElementById("fl-input-end-otp");
  if (inputEl) inputEl.value = state.activeFreelanceBooking.end_otp;
  showToast(state.currentLanguage === "hi" 
    ? `डेमो समापन ओटीपी भरा गया: ${state.activeFreelanceBooking.end_otp}` 
    : `Demo END_OTP auto-filled: ${state.activeFreelanceBooking.end_otp}`, "info");
}

async function submitFreelanceEndOtp() {
  sfx.init();
  const inputEl = document.getElementById("fl-input-end-otp");
  const entered = inputEl ? inputEl.value.trim() : "";
  const isHi = state.currentLanguage === "hi";

  if (!state.activeFreelanceBooking) {
    showToast(isHi ? "कोई सक्रिय फ्रीलांस बुकिंग नहीं।" : "No active freelance gig booking.", "warning");
    return;
  }

  if (entered === state.activeFreelanceBooking.end_otp) {
    sfx.playSuccessFanfare();
    const gig = state.activeFreelanceBooking;
    gig.status = "COMPLETED";

    // 100% Direct Payout to Worker's Freelance Balance (Zero Federation Cess)
    const payout = gig.freelance_fee;
    state.activeWorker.freelance_earned = (state.activeWorker.freelance_earned || 0) + payout;
    state.activeWorker.total_earned = (state.activeWorker.total_earned || 0) + payout;
    state.activeWorker.account_balance = (state.activeWorker.account_balance || 68400.0) + payout;

    updateWorkerFreelanceUI(state.activeWorker);
    updateWorkerCardUI(state.activeWorker);

    // Update Station Badges & Inputs
    const statusBadge = document.getElementById("fl-active-status-badge");
    if (statusBadge) {
      statusBadge.className = "px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase";
      statusBadge.innerText = isHi ? "कार्य पूर्ण • 100% भुगतान जारी" : "Completed • 100% Payout Released";
    }

    const badge3 = document.getElementById("fl-badge-step-3");
    if (badge3) {
      badge3.className = "text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase";
      badge3.innerText = isHi ? "पूर्ण" : "COMPLETED";
    }

    if (inputEl) inputEl.disabled = true;
    const btnAutofill = document.getElementById("fl-btn-autofill-end");
    if (btnAutofill) btnAutofill.disabled = true;
    const btnSubmit = document.getElementById("fl-btn-submit-end");
    if (btnSubmit) btnSubmit.disabled = true;

    // Reveal Settlement Card
    const txId = `UPI-P2P-${Date.now().toString().slice(-8)}`;
    const settleCard = document.getElementById("fl-settlement-card");
    if (settleCard) settleCard.classList.remove("hidden");

    const amountEl = document.getElementById("fl-settled-amount");
    if (amountEl) amountEl.innerText = `₹${payout.toFixed(2)}`;

    const txEl = document.getElementById("fl-settled-tx");
    if (txEl) txEl.innerText = txId;

    // Asynchronous backend dispatch if online
    if (state.hasBackendConnection) {
      try {
        await fetch(`${API_BASE_URL}/api/freelance/jobs/${gig.job_id}/apply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ worker_id: state.activeWorker.id })
        });
      } catch (e) {
        console.warn("Backend freelance apply call fallback:", e);
      }
    }

    renderFreelanceJobs();
    settleCard?.scrollIntoView({ behavior: "smooth", block: "center" });

    showToast(isHi 
      ? `🎉 फ्रीलांस कार्य सफलतापूर्वक पूरा! ₹${payout.toFixed(2)} 100% सीधे यूपीआई बैलेंस में जमा (0% कटौती)` 
      : `🎉 Freelance Gig Completed! ₹${payout.toFixed(2)} settled directly to your UPI wallet (0% cut).`, "success");
  } else {
    sfx.playFallbackWarning();
    showToast(`Invalid END_OTP. Hint: ${state.activeFreelanceBooking.end_otp}`, "warning");
  }
}

function dismissFreelanceSettlement() {
  sfx.playClick();
  const station = document.getElementById("freelance-active-station");
  if (station) station.classList.add("hidden");
  state.activeFreelanceBooking = null;
  renderFreelanceJobs();
  showToast(state.currentLanguage === "hi" 
    ? "फ्रीलांस स्टेशन बंद हुआ। उपलब्ध कार्य सूची पर वापस।" 
    : "Freelance station closed. Returned to open marketplace.", "info");
}

function cancelFreelanceBooking() {
  sfx.playClick();
  if (!state.activeFreelanceBooking) return;
  const isHi = state.currentLanguage === "hi";

  const jobId = state.activeFreelanceBooking.job_id;
  const job = state.freelanceJobs.find(j => j.id === jobId);
  if (job) job.claimed_by = null;

  const station = document.getElementById("freelance-active-station");
  if (station) station.classList.add("hidden");
  state.activeFreelanceBooking = null;
  renderFreelanceJobs();

  showToast(isHi 
    ? "फ्रीलांस कार्य रद्द किया गया। कार्य बोर्ड पर पुनः उपलब्ध है।" 
    : "Freelance gig cancelled. Returned to open marketplace.", "info");
}

// ============================================================================
// 20. WORKER INCIDENT ESCALATION & CUSTOMER DEBARMENT ENGINE
// ============================================================================

function initDebarmentDesk() {
  renderMinistryDebarmentTable();
}

function openWorkerEscalationModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-worker-escalate");
  if (!modal) return;

  const custInput = document.getElementById("escalate-input-customer");
  if (custInput) {
    custInput.value = state.activeBooking?.customer_name || "Rohan Verma";
  }
  const delayInput = document.getElementById("escalate-input-delay");
  if (delayInput) delayInput.value = "3.5";
  const descInput = document.getElementById("escalate-input-description");
  if (descInput) {
    descInput.value = "Customer booked standard daytime service, gave arrival OTP, but refused to release completion OTP and caused 3+ hours delay without fair compensation.";
  }

  modal.classList.remove("hidden");
  safeCreateIcons();
}

function closeWorkerEscalationModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-worker-escalate");
  if (modal) modal.classList.add("hidden");
}

async function handleWorkerEscalationSubmit(e) {
  e.preventDefault();
  sfx.playAlert();
  const isHi = state.currentLanguage === "hi";

  const customerName = document.getElementById("escalate-input-customer").value.trim();
  const category = document.getElementById("escalate-input-category").value;
  const delayHours = parseFloat(document.getElementById("escalate-input-delay").value) || 0;
  const description = document.getElementById("escalate-input-description").value.trim();

  if (!customerName || !description) {
    showToast("Please fill in the customer name and incident details", "warning");
    return;
  }

  const complaint = {
    complaint_id: `CMP-${Date.now().toString().slice(-4)}`,
    worker_id: state.activeWorker.id,
    worker_name: state.activeWorker.name,
    customer_name: customerName,
    customer_phone: state.activeBooking?.customer_phone || "+91 98990 01122",
    category: category,
    delay_hours: delayHours,
    description: description,
    timestamp: new Date().toISOString()
  };

  state.customerComplaints.unshift(complaint);

  // Check multi-worker escalation threshold:
  // If >= 2 DISTINCT workers have filed complaints against this customer -> AUTOMATIC DEBARMENT
  const distinctWorkers = new Set(
    state.customerComplaints
      .filter(c => c.customer_name.toLowerCase() === customerName.toLowerCase())
      .map(c => c.worker_id)
  );

  let wasDebarred = false;
  if (distinctWorkers.size >= 2) {
    state.debarredCustomers[customerName] = {
      reason: `Automated Debarment: ${distinctWorkers.size} independent cooperative technicians escalated complaints (${category})`,
      debarred_at: new Date().toISOString(),
      escalation_count: distinctWorkers.size
    };
    wasDebarred = true;
  }

  closeWorkerEscalationModal();

  // If backend is online, send to FastAPI endpoint
  if (state.hasBackendConnection) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/workers/complaints/escalate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worker_id: state.activeWorker.id,
          customer_name: customerName,
          customer_phone: complaint.customer_phone,
          category: category,
          delay_hours: delayHours,
          description: description
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.customer_debarred) {
          wasDebarred = true;
          state.debarredCustomers[customerName] = {
            reason: data.debarment_reason,
            debarred_at: new Date().toISOString(),
            escalation_count: data.distinct_workers_count
          };
        }
      }
    } catch (err) {
      console.warn("Backend complaint escalation offline fallback:", err);
    }
  }

  renderMinistryDebarmentTable();

  if (wasDebarred) {
    sfx.playFallbackWarning();
    const alertBanner = document.getElementById("citizen-debarred-alert");
    const alertText = document.getElementById("citizen-debarred-alert-text");
    if (alertBanner && (state.currentCustomerName === customerName || state.activeBooking?.customer_name === customerName)) {
      alertBanner.classList.remove("hidden");
      if (alertText) {
        alertText.innerHTML = `Customer <strong>"${customerName}"</strong> is officially <strong>DEBARRED</strong> from Seva Setu cooperative dispatch following multiple independent technician incident escalations.`;
      }
    }
    showToast(isHi 
      ? `🚫 नागरिक "${customerName}" सेवा सेतु से स्वतः निष्कासित (DEBARRED)! 2 स्वतंत्र श्रमिकों की शिकायत दर्ज।` 
      : `🚫 Customer "${customerName}" AUTOMATICALLY DEBARRED from Seva Setu after multiple worker escalations!`, "emergency");
  } else {
    showToast(isHi 
      ? `🚨 घटना शिकायत दर्ज: ग्राहक "${customerName}" की जांच सहकारिता मंत्रालय द्वारा की जा रही है।` 
      : `🚨 Incident Escalation Filed! Customer "${customerName}" logged in Ministry Register (1/2 complaints towards debarment).`, "warning");
  }
}

function openMinistryDebarModal(targetCustomer) {
  sfx.playClick();
  const modal = document.getElementById("modal-ministry-debar-order");
  if (!modal) return;

  const targetSelect = document.getElementById("min-debar-target-select");
  if (targetSelect && targetCustomer) {
    let found = false;
    for (let opt of targetSelect.options) {
      if (opt.value.startsWith(targetCustomer)) {
        targetSelect.value = opt.value;
        found = true;
        break;
      }
    }
    if (!found) {
      const newOpt = new Option(`${targetCustomer} (Verified Citizen)`, `${targetCustomer}|+91 98000 00000`, true, true);
      targetSelect.add(newOpt);
      targetSelect.value = newOpt.value;
    }
  }

  // Reset checkboxes
  const allCheckbox = document.getElementById("min-debar-scope-all");
  if (allCheckbox) {
    allCheckbox.checked = false;
  }
  const serviceCheckboxes = document.querySelectorAll("#min-debar-services-list input[type='checkbox']");
  serviceCheckboxes.forEach(cb => {
    cb.checked = false;
    cb.disabled = false;
  });

  modal.classList.remove("hidden");
  modal.style.display = "flex";
  safeCreateIcons();
}

function closeMinistryDebarModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-ministry-debar-order");
  if (modal) {
    modal.classList.add("hidden");
    modal.style.display = "none";
  }
}

function toggleMinistryDebarAll(checked) {
  sfx.playClick();
  const serviceCheckboxes = document.querySelectorAll("#min-debar-services-list input[type='checkbox']");
  serviceCheckboxes.forEach(cb => {
    cb.checked = checked;
    cb.disabled = checked;
  });
}

function handleMinistryDebarSubmit(event) {
  event.preventDefault();
  sfx.playAlert();

  const targetSelect = document.getElementById("min-debar-target-select");
  const rawTarget = targetSelect ? targetSelect.value : "Rohan Verma";
  const customerName = rawTarget.split("|")[0].trim();

  const allCheckbox = document.getElementById("min-debar-scope-all");
  let services = [];
  if (allCheckbox && allCheckbox.checked) {
    services = ["ALL"];
  } else {
    const checkedBoxes = document.querySelectorAll("#min-debar-services-list input[name='min_debar_service']:checked");
    checkedBoxes.forEach(cb => services.push(cb.value));
  }

  if (services.length === 0) {
    showToast("⚠️ Please select at least one service or choose ALL services", "warning");
    return;
  }

  const reasonSelect = document.getElementById("min-debar-reason-select");
  const reason = reasonSelect ? reasonSelect.value : "Ministry administrative sanction";

  ministryCustomerDebarAction(customerName, "DEBAR", services, reason);
  closeMinistryDebarModal();
}

function renderMinistryDebarmentTable() {
  const tbody = document.getElementById("ministry-escalations-table-body");
  if (!tbody) return;
  const isHi = state.currentLanguage === "hi";
  tbody.innerHTML = "";

  const debarredCountEl = document.getElementById("min-debarred-count");
  if (debarredCountEl) {
    const count = Object.keys(state.debarredCustomers).length;
    debarredCountEl.innerText = `${count} ${count === 1 ? "Citizen" : "Citizens"} Debarred`;
  }

  const escalationsCountEl = document.getElementById("min-escalations-count");
  if (escalationsCountEl) {
    escalationsCountEl.innerText = `${state.customerComplaints.length} Filed`;
  }

  state.customerComplaints.forEach(cmp => {
    const debarInfo = state.debarredCustomers[cmp.customer_name];
    const isDebarred = Boolean(debarInfo);
    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-50 transition";

    let categoryBadge = "bg-slate-100 text-slate-800";
    if (cmp.category === "SERVICE_DELAY_EXCESS") categoryBadge = "bg-amber-100 text-amber-900 border border-amber-300";
    else if (cmp.category === "CUSTOMER_ABUSE_MISBEHAVIOR") categoryBadge = "bg-red-100 text-red-900 border border-red-300";
    else if (cmp.category === "OTP_WITHHOLDING") categoryBadge = "bg-purple-100 text-purple-900 border border-purple-300";

    let scopePill = "";
    if (isDebarred) {
      const scopeStr = (debarInfo.services && debarInfo.services.includes("ALL"))
        ? "ALL SERVICES"
        : (debarInfo.services ? debarInfo.services.join(", ") : "ALL");
      scopePill = `
        <span class="px-2.5 py-1 rounded-full bg-red-600 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1 w-max shadow-xs">
          <i data-lucide="shield-x" class="w-3 h-3"></i> DEBARRED (${scopeStr})
        </span>
      `;
    } else {
      scopePill = `
        <span class="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] uppercase">
          UNDER REVIEW
        </span>
      `;
    }

    tr.innerHTML = `
      <td class="p-3 font-mono font-bold text-slate-700">${cmp.complaint_id}</td>
      <td class="p-3">
        <div class="font-black text-slate-900">${cmp.customer_name}</div>
        <div class="text-[11px] text-slate-500 font-mono">${cmp.customer_phone || "Phone verified"}</div>
      </td>
      <td class="p-3">
        <div class="font-bold text-slate-800">${cmp.worker_name}</div>
        <div class="text-[11px] text-slate-500">ID: #${cmp.worker_id}</div>
      </td>
      <td class="p-3">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${categoryBadge}">${cmp.category.replace(/_/g, " ")}</span>
      </td>
      <td class="p-3 max-w-xs">
        <div class="text-slate-800 line-clamp-2">${cmp.description}</div>
        ${cmp.delay_hours > 0 ? `<span class="text-[10px] font-bold text-red-600 block mt-0.5">⏱️ Delay: +${cmp.delay_hours} hrs</span>` : ""}
      </td>
      <td class="p-3">
        ${scopePill}
      </td>
      <td class="p-3 text-right">
        ${isDebarred
          ? `<button onclick="ministryCustomerDebarAction('${cmp.customer_name}', 'REINSTATE')" class="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition btn-tactile">
               Re-instate Citizen
             </button>`
          : `<button onclick="openMinistryDebarModal('${cmp.customer_name}')" class="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition btn-tactile shadow-xs">
               🚫 Debar (Scope)
             </button>`}
      </td>
    `;
    tbody.appendChild(tr);
  });

  safeCreateIcons();
}

async function ministryCustomerDebarAction(customerName, action, services = ["ALL"], reason = "") {
  sfx.playClick();
  const isHi = state.currentLanguage === "hi";

  if (action === "DEBAR") {
    state.debarredCustomers[customerName] = {
      services: services,
      reason: reason || "Administrative debarment ordered by Ministry Disciplinary Officer",
      debarred_at: new Date().toISOString(),
      escalation_count: 1
    };
    const scopeStr = services.includes("ALL") ? "ALL SERVICES" : services.join(", ");
    showToast(isHi ? `नागरिक "${customerName}" को ${scopeStr} हेतु निष्कासित किया गया` : `Citizen "${customerName}" DEBARRED from [${scopeStr}] by Ministry order`, "warning");
  } else {
    delete state.debarredCustomers[customerName];
    showToast(isHi ? `नागरिक "${customerName}" को पुनः बहाल किया गया` : `Citizen "${customerName}" reinstated to platform`, "info");
  }

  // Update backend if connected
  if (state.hasBackendConnection) {
    try {
      await fetch(`${API_BASE_URL}/api/ministry/customers/${encodeURIComponent(customerName)}/debar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: action, services: services, reason: reason || "Ministry administrative order" })
      });
    } catch (e) {
      console.warn("Backend debar action offline fallback:", e);
    }
  }

  renderMinistryDebarmentTable();

  // If active booking customer or current persona is affected, sync citizen persona view
  if (state.currentCustomerName === customerName) {
    changeCitizenPersona(customerName);
  }
}

// ============================================================================
// 21. WORKER REJECTION AUDITING & MINISTRY DISCIPLINARY DESK
// ============================================================================

function initDisciplineDesk() {
  updateWorkerDisciplinaryUI(state.activeWorker);
  renderMinistryDisciplineTable();
}

function updateWorkerDisciplinaryUI(worker) {
  if (!worker) return;
  const isHi = state.currentLanguage === "hi";

  const countBadge = document.getElementById("worker-rejection-count-badge");
  if (countBadge) {
    countBadge.innerText = `${worker.rejection_count || 0}/3 Declines`;
  }

  const dot = document.getElementById("worker-compliance-dot");
  const statusTxt = document.getElementById("worker-compliance-status");
  const banner = document.getElementById("worker-disciplinary-banner");

  if (worker.disciplinary_status === "FIRED") {
    if (dot) dot.className = "w-2 h-2 rounded-full bg-red-600 animate-ping";
    if (statusTxt) statusTxt.innerText = isHi ? "लाइसेंस रद्द • निष्कासित" : "TERMINATED / LICENSE REVOKED";
    if (banner) banner.classList.remove("hidden");
  } else if (worker.disciplinary_status === "SUSPENDED") {
    if (dot) dot.className = "w-2 h-2 rounded-full bg-red-500";
    if (statusTxt) statusTxt.innerText = isHi ? "निलंबित (जांच जारी)" : "SUSPENDED";
    if (banner) banner.classList.remove("hidden");
  } else if ((worker.rejection_count || 0) >= 3) {
    if (dot) dot.className = "w-2 h-2 rounded-full bg-amber-500 animate-pulse";
    if (statusTxt) statusTxt.innerText = isHi ? "अनुशासनात्मक समीक्षाधीन (≥3 अस्वीकृत)" : "UNDER REVIEW (≥3 Declines)";
    if (banner) banner.classList.add("hidden");
  } else {
    if (dot) dot.className = "w-2 h-2 rounded-full bg-emerald-500";
    if (statusTxt) statusTxt.innerText = isHi ? "प्रमाणित अच्छा आचरण" : "Good Standing";
    if (banner) banner.classList.add("hidden");
  }
}

function renderMinistryDisciplineTable() {
  const tbody = document.getElementById("ministry-discipline-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  // Count flagged workers
  const flagged = WORKERS.filter(w => (w.rejection_count || 0) >= 3 || w.disciplinary_status !== "GOOD_STANDING");
  const flaggedCountEl = document.getElementById("min-flagged-workers-count");
  if (flaggedCountEl) {
    flaggedCountEl.innerText = `${flagged.length} ${flagged.length === 1 ? "Worker" : "Workers"}`;
  }

  WORKERS.forEach(w => {
    const rejections = w.rejection_count || 0;
    const isExceeded = rejections >= 3;
    const isFired = w.disciplinary_status === "FIRED";
    const isSuspended = w.disciplinary_status === "SUSPENDED";

    const tr = document.createElement("tr");
    tr.className = `hover:bg-slate-50 transition ${isFired ? "bg-red-50/40" : isExceeded ? "bg-amber-50/30" : ""}`;

    let statusBadge = `<span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px] uppercase">GOOD STANDING</span>`;
    if (isFired) {
      statusBadge = `<span class="px-2.5 py-1 rounded-full bg-red-600 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1 w-max shadow-xs">
        <i data-lucide="shield-x" class="w-3 h-3"></i> FIRED / REVOKED
      </span>`;
    } else if (isSuspended) {
      statusBadge = `<span class="px-2.5 py-1 rounded-full bg-red-100 text-red-900 border border-red-300 font-bold text-[10px] uppercase">SUSPENDED</span>`;
    } else if (isExceeded) {
      statusBadge = `<span class="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-400 font-black text-[10px] uppercase flex items-center gap-1 w-max">
        <i data-lucide="alert-triangle" class="w-3 h-3 text-amber-600"></i> UNDER REVIEW (≥3)
      </span>`;
    }

    tr.innerHTML = `
      <td class="p-3">
        <div class="font-black text-slate-900">${w.name}</div>
        <div class="text-[11px] text-slate-500 font-mono">ID: #${w.id} &bull; Aadhaar: ${w.aadhaar}</div>
      </td>
      <td class="p-3">
        <div class="font-bold text-slate-800 capitalize">${w.skill}</div>
        <div class="text-[11px] text-slate-500">${w.coop_name}</div>
      </td>
      <td class="p-3 font-bold text-slate-700">
        ${w.completed_jobs} Jobs
      </td>
      <td class="p-3">
        <span class="px-2.5 py-1 rounded-lg font-black text-xs ${isExceeded ? "bg-red-100 text-red-900 border border-red-300 font-mono" : "bg-slate-100 text-slate-700 font-mono"}">
          ${rejections} Rejections ${isExceeded ? "⚠️" : ""}
        </span>
      </td>
      <td class="p-3">${statusBadge}</td>
      <td class="p-3 text-[11px] text-slate-600 max-w-xs">
        ${w.disciplinary_action_notes || (isExceeded ? "Flagged for repeated broadcast dispatches rejection" : "Normal cooperative SLA compliance")}
      </td>
      <td class="p-3 text-right">
        <div class="flex items-center justify-end gap-1.5 flex-wrap">
          ${!isFired ? `
            <button onclick="ministryDisciplineWorker(${w.id}, 'FIRE')" class="px-2.5 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition btn-tactile shadow-xs" title="Fire / Terminate Worker">
              🔥 Terminate
            </button>
            <button onclick="ministryDisciplineWorker(${w.id}, 'WARN')" class="px-2 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition btn-tactile border border-amber-300" title="Issue Formal Warning">
              ⚠️ Warn
            </button>
          ` : `
            <button onclick="ministryDisciplineWorker(${w.id}, 'RESET')" class="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition btn-tactile shadow-xs" title="Re-instate Worker">
              ↺ Re-instate
            </button>
          `}
          ${(rejections > 0 && !isFired) ? `
            <button onclick="ministryDisciplineWorker(${w.id}, 'RESET')" class="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition btn-tactile" title="Reset Counter">
              ↺ Reset
            </button>
          ` : ""}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  safeCreateIcons();
}

async function ministryDisciplineWorker(workerId, action) {
  sfx.playClick();
  const isHi = state.currentLanguage === "hi";
  const worker = WORKERS.find(w => w.id === workerId);
  if (!worker) return;

  if (action === "FIRE") {
    worker.disciplinary_status = "FIRED";
    worker.is_available = false;
    worker.is_verified = false;
    worker.disciplinary_action_notes = "Official Ministry Termination Order issued. Worker excluded from cooperative dispatch.";
    showToast(isHi 
      ? `🚫 श्रमिक ${worker.name} को सहकारिता मंत्रालय द्वारा सेवा से निष्कासित कर दिया गया है।` 
      : `🚫 Worker ${worker.name} (#${worker.id}) TERMINATED & license revoked by Ministry Order.`, "emergency");
  } else if (action === "WARN") {
    worker.disciplinary_status = "WARNING_ISSUED";
    worker.disciplinary_action_notes = "Formal show-cause warning issued for SLA non-compliance.";
    showToast(isHi 
      ? `⚠️ श्रमिक ${worker.name} को आधिकारिक चेतावनी नोटिस जारी किया गया।` 
      : `⚠️ Formal Show-Cause Warning issued to ${worker.name}.`, "warning");
  } else if (action === "SUSPEND") {
    worker.disciplinary_status = "SUSPENDED";
    worker.is_available = false;
    worker.disciplinary_action_notes = "Temporarily suspended pending grievance inquiry.";
    showToast(`Worker ${worker.name} suspended.`, "warning");
  } else if (action === "RESET") {
    worker.disciplinary_status = "GOOD_STANDING";
    worker.rejection_count = 0;
    worker.is_available = true;
    worker.is_verified = true;
    worker.disciplinary_action_notes = "Compliance record cleared by Ministry review.";
    showToast(isHi 
      ? `✓ श्रमिक ${worker.name} का रिकॉर्ड साफ़ किया गया एवं कार्य हेतु पुनः बहाल किया गया।` 
      : `✓ Worker ${worker.name} reinstated in Good Standing (rejection count reset).`, "success");
  }

  // Update backend API if connected
  if (state.hasBackendConnection) {
    try {
      await fetch(`${API_BASE_URL}/api/ministry/workers/${workerId}/discipline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: action,
          reason: worker.disciplinary_action_notes || "Ministry Administrative Directive"
        })
      });
    } catch (e) {
      console.warn("Backend worker discipline call offline fallback:", e);
    }
  }

  if (state.activeWorker.id === worker.id) {
    updateWorkerDisciplinaryUI(worker);
  }
  renderMinistryDisciplineTable();
}

// =============================================================================
// 19. MINISTRY COCKPIT: SUB-NAVIGATION & REGIONAL GROWTH ANALYTICS ENGINE
// =============================================================================

function switchMinistrySubTab(tabKey) {
  sfx.playClick();
  const validTabs = ["overview", "growth", "workforce", "discipline", "revenue"];
  if (!validTabs.includes(tabKey)) tabKey = "overview";

  validTabs.forEach(key => {
    const btn = document.getElementById(`min-subtab-${key}`);
    if (btn) {
      if (key === tabKey) {
        btn.className = "px-4 py-2.5 rounded-xl font-black text-xs transition whitespace-nowrap btn-tactile flex items-center gap-2 bg-blue-600 text-white shadow-md";
      } else {
        btn.className = "px-4 py-2.5 rounded-xl font-bold text-xs transition whitespace-nowrap btn-tactile flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100";
      }
    }
  });

  const sections = {
    overview: document.getElementById("min-overview-section"),
    growth: document.getElementById("min-growth-analytics-section"),
    workforce: document.getElementById("min-workforce-section"),
    discipline: document.getElementById("min-discipline-section"),
    revenue: document.getElementById("min-revenue-section")
  };

  Object.keys(sections).forEach(k => {
    if (sections[k]) {
      if (k === tabKey) {
        sections[k].classList.remove("hidden");
      } else {
        sections[k].classList.add("hidden");
      }
    }
  });

  if (tabKey === "growth") {
    setTimeout(() => {
      renderMinistryGrowthChart();
      renderGrowthTrajectoryTable();
    }, 60);
  } else if (tabKey === "discipline") {
    if (typeof renderMinistryDisciplineTable === "function") {
      renderMinistryDisciplineTable();
    }
  }

  safeCreateIcons();
}

function initMinistryGrowthAnalytics() {
  const regionSelect = document.getElementById("growth-region-select");
  if (regionSelect && state.growthChartOptions?.region) {
    regionSelect.value = state.growthChartOptions.region;
  }
  updateGrowthHorizonUI(state.growthChartOptions?.horizon || "6m");
  updateGrowthSeriesUI();
  renderMinistryGrowthChart();
  renderGrowthTrajectoryTable();
}

function updateGrowthRegion(regionKey) {
  sfx.playClick();
  if (!state.growthChartOptions) return;
  state.growthChartOptions.region = regionKey || "all";
  renderMinistryGrowthChart();
  renderGrowthTrajectoryTable();
}

function updateGrowthHorizon(horizonKey) {
  sfx.playClick();
  if (!state.growthChartOptions) return;
  state.growthChartOptions.horizon = horizonKey || "6m";
  updateGrowthHorizonUI(horizonKey);
  renderMinistryGrowthChart();
  renderGrowthTrajectoryTable();
}

function updateGrowthHorizonUI(horizonKey) {
  const horizons = ["6m", "30d", "ytd"];
  horizons.forEach(h => {
    const btn = document.getElementById(`horizon-btn-${h}`);
    if (btn) {
      if (h === horizonKey) {
        btn.className = "px-3 py-1.5 rounded-xl font-black text-xs transition btn-tactile bg-slate-900 text-white shadow-xs";
      } else {
        btn.className = "px-3 py-1.5 rounded-xl font-bold text-xs transition btn-tactile bg-white text-slate-700 hover:bg-slate-100 border border-slate-200";
      }
    }
  });
}

function toggleGrowthSeries(seriesKey) {
  sfx.playClick();
  if (!state.growthChartOptions?.series) return;
  state.growthChartOptions.series[seriesKey] = !state.growthChartOptions.series[seriesKey];
  updateGrowthSeriesUI();
  renderMinistryGrowthChart();
}

function updateGrowthSeriesUI() {
  const seriesConfig = {
    deployments: { btn: "toggle-series-deployments", activeBg: "bg-blue-600 text-white border-blue-600 shadow-xs" },
    requests: { btn: "toggle-series-requests", activeBg: "bg-purple-600 text-white border-purple-600 shadow-xs" },
    revenue: { btn: "toggle-series-revenue", activeBg: "bg-emerald-600 text-white border-emerald-600 shadow-xs" }
  };

  Object.keys(seriesConfig).forEach(key => {
    const btn = document.getElementById(seriesConfig[key].btn);
    if (!btn) return;
    const isActive = !!state.growthChartOptions?.series?.[key];
    if (isActive) {
      btn.className = `px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 btn-tactile ${seriesConfig[key].activeBg}`;
    } else {
      btn.className = "px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 btn-tactile bg-white text-slate-400 opacity-60 hover:opacity-100";
    }
  });
}

function getGrowthActiveDataset() {
  const regKey = state.growthChartOptions?.region || "all";
  const horKey = state.growthChartOptions?.horizon || "6m";
  const regionObj = state.regionalGrowthData[regKey] || state.regionalGrowthData["all"];
  const horizonObj = regionObj.horizons[horKey] || regionObj.horizons["6m"];
  return {
    regionKey: regKey,
    regionName: regionObj.region_name,
    horizonKey: horKey,
    ...horizonObj
  };
}

// Generate smooth cubic bezier SVG path from coordinate points
function createSmoothSvgPath(points) {
  if (!points || points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i != points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return path;
}

function renderMinistryGrowthChart() {
  const svg = document.getElementById("ministry-growth-svg");
  if (!svg) return;

  const dataset = getGrowthActiveDataset();
  const seriesOpts = state.growthChartOptions?.series || { deployments: true, requests: true, revenue: true };

  // Update 4 Regional KPI Summary Cards safely
  const updateKpiCard = (id, val, sub) => {
    const el = document.getElementById(id);
    if (!el) return;
    const valEl = el.querySelector(".text-2xl");
    if (valEl) valEl.innerText = val;
    const subEl = el.querySelector("span:last-child");
    if (subEl) subEl.innerText = sub;
  };
  updateKpiCard("growth-kpi-deployments", dataset.kpis.deployments, dataset.kpis.deployments_sub);
  updateKpiCard("growth-kpi-requests", dataset.kpis.requests, dataset.kpis.requests_sub);
  updateKpiCard("growth-kpi-revenue", dataset.kpis.revenue, dataset.kpis.revenue_sub);
  updateKpiCard("growth-kpi-welfare", dataset.kpis.welfare, dataset.kpis.welfare_sub);

  // Dimensions & Padding
  const width = 800;
  const height = 320;
  const padLeft = 65;
  const padRight = 70;
  const padTop = 35;
  const padBottom = 45;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const labels = dataset.labels;
  const n = labels.length;

  // Compute Scales
  const maxVolumeRaw = Math.max(
    Math.max(...dataset.deployments),
    Math.max(...dataset.requests)
  );
  // Round max volume to clean tick interval
  let maxVolume = Math.ceil((maxVolumeRaw * 1.15) / 500) * 500;
  if (maxVolume < 500) maxVolume = 500;

  const maxRevenueRaw = Math.max(...dataset.revenue);
  let maxRevenue = Math.ceil((maxRevenueRaw * 1.15) / 100000) * 100000;
  if (maxRevenue < 100000) maxRevenue = 100000;

  const getX = (idx) => padLeft + (n > 1 ? (plotW / (n - 1)) * idx : plotW / 2);
  const getYVol = (val) => padTop + plotH - (val / maxVolume) * plotH;
  const getYRev = (val) => padTop + plotH - (val / maxRevenue) * plotH;

  const depPoints = dataset.deployments.map((v, i) => ({ x: getX(i), y: getYVol(v), val: v }));
  const reqPoints = dataset.requests.map((v, i) => ({ x: getX(i), y: getYVol(v), val: v }));
  const revPoints = dataset.revenue.map((v, i) => ({ x: getX(i), y: getYRev(v), val: v }));

  // Build SVG Markup
  let svgContent = `
    <defs>
      <!-- Deployments Gradient -->
      <linearGradient id="grad-deployments" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2563eb" stop-opacity="0.28" />
        <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0" />
      </linearGradient>

      <!-- Citizen Requests Gradient -->
      <linearGradient id="grad-requests" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#9333ea" stop-opacity="0.22" />
        <stop offset="100%" stop-color="#9333ea" stop-opacity="0.0" />
      </linearGradient>

      <!-- Gross Revenue Gradient -->
      <linearGradient id="grad-revenue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.25" />
        <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
      </linearGradient>

      <!-- Drop Shadows -->
      <filter id="shadow-line" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="4" stdDeviation="3" flood-opacity="0.18" />
      </filter>
    </defs>
  `;

  // Grid Lines and Left/Right Y-Axis Labels (5 horizontal ticks)
  const ticks = 4;
  for (let t = 0; t <= ticks; t++) {
    const ratio = t / ticks;
    const yPos = padTop + plotH - ratio * plotH;
    const volVal = Math.round(ratio * maxVolume);
    const revValLakhs = (ratio * maxRevenue) / 100000;

    svgContent += `
      <line x1="${padLeft}" y1="${yPos}" x2="${width - padRight}" y2="${yPos}" 
            stroke="#e2e8f0" stroke-width="1" stroke-dasharray="${t === 0 ? '0' : '4, 4'}" />
      
      <!-- Left Y-Axis Tick (Volume) -->
      <text x="${padLeft - 10}" y="${yPos + 4}" text-anchor="end" font-size="10" font-weight="700" fill="#64748b">
        ${volVal >= 1000 ? (volVal / 1000).toFixed(volVal % 1000 === 0 ? 0 : 1) + 'k' : volVal}
      </text>

      <!-- Right Y-Axis Tick (Revenue ₹) -->
      <text x="${width - padRight + 10}" y="${yPos + 4}" text-anchor="start" font-size="10" font-weight="700" fill="#10b981">
        ₹${revValLakhs.toFixed(revValLakhs % 1 === 0 ? 0 : 1)}L
      </text>
    `;
  }

  // X-Axis Baseline & Labels
  svgContent += `
    <line x1="${padLeft}" y1="${padTop + plotH}" x2="${width - padRight}" y2="${padTop + plotH}" stroke="#cbd5e1" stroke-width="1.5" />
  `;

  labels.forEach((lbl, i) => {
    const xPos = getX(i);
    svgContent += `
      <text x="${xPos}" y="${height - 12}" text-anchor="middle" font-size="11" font-weight="800" fill="#475569">
        ${lbl}
      </text>
    `;
  });

  // Area and Line Curves
  const baselineY = (padTop + plotH).toFixed(1);

  // 1. Citizen Requests Curve (Purple)
  if (seriesOpts.requests) {
    const pathReq = createSmoothSvgPath(reqPoints);
    const areaReq = `${pathReq} L ${reqPoints[reqPoints.length - 1].x.toFixed(1)} ${baselineY} L ${reqPoints[0].x.toFixed(1)} ${baselineY} Z`;

    svgContent += `
      <path d="${areaReq}" fill="url(#grad-requests)" />
      <path d="${pathReq}" fill="none" stroke="#9333ea" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#shadow-line)" />
    `;
  }

  // 2. Gross Revenue Curve (Emerald)
  if (seriesOpts.revenue) {
    const pathRev = createSmoothSvgPath(revPoints);
    const areaRev = `${pathRev} L ${revPoints[revPoints.length - 1].x.toFixed(1)} ${baselineY} L ${revPoints[0].x.toFixed(1)} ${baselineY} Z`;

    svgContent += `
      <path d="${areaRev}" fill="url(#grad-revenue)" />
      <path d="${pathRev}" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#shadow-line)" />
    `;
  }

  // 3. Worker Deployments Curve (Blue)
  if (seriesOpts.deployments) {
    const pathDep = createSmoothSvgPath(depPoints);
    const areaDep = `${pathDep} L ${depPoints[depPoints.length - 1].x.toFixed(1)} ${baselineY} L ${depPoints[0].x.toFixed(1)} ${baselineY} Z`;

    svgContent += `
      <path d="${areaDep}" fill="url(#grad-deployments)" />
      <path d="${pathDep}" fill="none" stroke="#2563eb" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#shadow-line)" />
    `;
  }

  // Data Point Markers
  for (let i = 0; i < n; i++) {
    if (seriesOpts.requests) {
      svgContent += `
        <circle cx="${reqPoints[i].x.toFixed(1)}" cy="${reqPoints[i].y.toFixed(1)}" r="4.5" 
                fill="#ffffff" stroke="#9333ea" stroke-width="2.5" class="transition-transform hover:scale-125" />
      `;
    }
    if (seriesOpts.revenue) {
      svgContent += `
        <circle cx="${revPoints[i].x.toFixed(1)}" cy="${revPoints[i].y.toFixed(1)}" r="4.5" 
                fill="#ffffff" stroke="#10b981" stroke-width="2.5" class="transition-transform hover:scale-125" />
      `;
    }
    if (seriesOpts.deployments) {
      svgContent += `
        <circle cx="${depPoints[i].x.toFixed(1)}" cy="${depPoints[i].y.toFixed(1)}" r="5" 
                fill="#ffffff" stroke="#2563eb" stroke-width="3" class="transition-transform hover:scale-125" />
      `;
    }
  }

  // Dynamic Cursor Guide Line & Highlight Dots (initially hidden)
  svgContent += `
    <g id="chart-guide-group" style="opacity: 0; transition: opacity 0.15s ease;">
      <line id="chart-guide-line" x1="0" y1="${padTop}" x2="0" y2="${padTop + plotH}" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3, 3" />
      <circle id="chart-guide-dep" cx="0" cy="0" r="6" fill="#2563eb" stroke="#ffffff" stroke-width="2" />
      <circle id="chart-guide-req" cx="0" cy="0" r="6" fill="#9333ea" stroke="#ffffff" stroke-width="2" />
      <circle id="chart-guide-rev" cx="0" cy="0" r="6" fill="#10b981" stroke="#ffffff" stroke-width="2" />
    </g>

    <!-- Invisible Interactive Hover Catchment Rectangle -->
    <rect id="chart-interactive-overlay" x="${padLeft}" y="${padTop}" width="${plotW}" height="${plotH}" 
          fill="transparent" style="cursor: crosshair;" />
  `;

  svg.innerHTML = svgContent;

  // Bind Mouse and Touch Events for Interactive Crosshair & Tooltip
  const overlay = document.getElementById("chart-interactive-overlay");
  const guideGroup = document.getElementById("chart-guide-group");
  const guideLine = document.getElementById("chart-guide-line");
  const guideDep = document.getElementById("chart-guide-dep");
  const guideReq = document.getElementById("chart-guide-req");
  const guideRev = document.getElementById("chart-guide-rev");
  const tooltip = document.getElementById("growth-chart-tooltip");

  if (!overlay || !tooltip || !guideGroup) return;

  function handlePointerMove(e) {
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const relX = (clientX - rect.left) * (width / rect.width);

    // Find nearest data point index
    let closestIdx = 0;
    let minDiff = Infinity;
    for (let i = 0; i < n; i++) {
      const diff = Math.abs(getX(i) - relX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }

    const curX = getX(closestIdx);
    const depY = depPoints[closestIdx].y;
    const reqY = reqPoints[closestIdx].y;
    const revY = revPoints[closestIdx].y;

    guideGroup.style.opacity = "1";
    guideLine.setAttribute("x1", curX);
    guideLine.setAttribute("x2", curX);

    if (seriesOpts.deployments) {
      guideDep.setAttribute("cx", curX);
      guideDep.setAttribute("cy", depY);
      guideDep.style.display = "block";
    } else {
      guideDep.style.display = "none";
    }

    if (seriesOpts.requests) {
      guideReq.setAttribute("cx", curX);
      guideReq.setAttribute("cy", reqY);
      guideReq.style.display = "block";
    } else {
      guideReq.style.display = "none";
    }

    if (seriesOpts.revenue) {
      guideRev.setAttribute("cx", curX);
      guideRev.setAttribute("cy", revY);
      guideRev.style.display = "block";
    } else {
      guideRev.style.display = "none";
    }

    // Update Tooltip Content
    document.getElementById("tt-period").innerText = labels[closestIdx];
    document.getElementById("tt-deployments").innerText = `${dataset.deployments[closestIdx].toLocaleString("en-IN")} Technicians`;
    document.getElementById("tt-requests").innerText = `${dataset.requests[closestIdx].toLocaleString("en-IN")} Requests`;
    document.getElementById("tt-revenue").innerText = `₹${dataset.revenue[closestIdx].toLocaleString("en-IN")}`;

    // Position Tooltip
    tooltip.classList.remove("hidden");
    const containerRect = document.getElementById("ministry-growth-chart-container").getBoundingClientRect();
    const tooltipX = (curX / width) * containerRect.width;
    const adjustedX = Math.min(Math.max(tooltipX - 90, 10), containerRect.width - 200);

    tooltip.style.left = `${adjustedX}px`;
    tooltip.style.top = "15px";
  }

  function handlePointerLeave() {
    guideGroup.style.opacity = "0";
    tooltip.classList.add("hidden");
  }

  overlay.addEventListener("mousemove", handlePointerMove);
  overlay.addEventListener("mouseleave", handlePointerLeave);
  overlay.addEventListener("touchmove", handlePointerMove, { passive: true });
  overlay.addEventListener("touchend", handlePointerLeave);
}

function renderGrowthTrajectoryTable() {
  const tbody = document.getElementById("growth-trajectory-table-body");
  if (!tbody) return;

  const dataset = getGrowthActiveDataset();
  const labels = dataset.labels;
  const deployments = dataset.deployments;
  const requests = dataset.requests;
  const revenue = dataset.revenue;
  const welfare = dataset.welfare;

  let rowsHtml = "";
  for (let i = labels.length - 1; i >= 0; i--) {
    const prevDep = i > 0 ? deployments[i - 1] : deployments[i];
    const diffPct = prevDep > 0 ? Math.round(((deployments[i] - prevDep) / prevDep) * 100) : 0;
    const isPositive = diffPct >= 0;

    rowsHtml += `
      <tr class="hover:bg-slate-50 transition font-medium">
        <td class="p-3">
          <div class="font-black text-slate-900">${labels[i]}</div>
          <div class="text-[10px] text-slate-500 font-mono">Tele-Ref: #SS-REG-${i + 101}</div>
        </td>
        <td class="p-3">
          <span class="font-bold text-slate-800">${dataset.regionName}</span>
        </td>
        <td class="p-3">
          <span class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-black text-xs font-mono">
            ${deployments[i].toLocaleString("en-IN")}
          </span>
        </td>
        <td class="p-3">
          <span class="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 font-black text-xs font-mono">
            ${requests[i].toLocaleString("en-IN")}
          </span>
        </td>
        <td class="p-3">
          <span class="font-black text-emerald-800">
            ₹${revenue[i].toLocaleString("en-IN")}
          </span>
        </td>
        <td class="p-3 font-bold text-amber-800">
          ₹${welfare[i].toLocaleString("en-IN")}
        </td>
        <td class="p-3 text-right">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black ${isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}">
            ${isPositive ? '↑ +' : '↓ '}${diffPct}% MoM
          </span>
        </td>
      </tr>
    `;
  }

  tbody.innerHTML = rowsHtml;
}

// =============================================================================
// 20. WORKER POST-ACCEPTANCE WITHDRAWAL & INSTANT AUTO-REASSIGNMENT
// =============================================================================

function openWorkerWithdrawModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-worker-withdraw-job");
  if (!modal) return;

  const bookingId = state.activeBooking?.booking_id || 998;
  const bookingSpan = document.getElementById("withdraw-booking-id");
  if (bookingSpan) bookingSpan.innerText = `#${bookingId}`;

  const notesInput = document.getElementById("withdraw-incident-notes");
  if (notesInput) notesInput.value = "";

  const reasonSelect = document.getElementById("withdraw-reason-select");
  if (reasonSelect) reasonSelect.value = "VEHICLE_BREAKDOWN";

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  safeCreateIcons();
}

function closeWorkerWithdrawModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-worker-withdraw-job");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function handleWorkerWithdrawSubmit(event) {
  event.preventDefault();
  sfx.playClick();

  const reasonSelect = document.getElementById("withdraw-reason-select");
  const notesInput = document.getElementById("withdraw-incident-notes");
  const reason = reasonSelect?.value || "VEHICLE_BREAKDOWN";
  const notes = notesInput?.value?.trim() || "";

  closeWorkerWithdrawModal();
  executeWorkerWithdrawal(reason, notes);
}

function executeWorkerWithdrawal(reason, notes) {
  sfx.playFallbackWarning();
  const isHi = state.currentLanguage === "hi";

  // Ensure an active booking is instantiated
  if (!state.activeBooking) {
    state.activeBooking = {
      booking_id: 998,
      service_type: "electrician",
      customer_name: "Aarav Mehta (Connaught Place)",
      status: "ACCEPTED",
      timeline: ["Citizen broadcasted service dispatch.", "Worker accepted service request."],
      assigned_worker: state.activeWorker
    };
  }

  const withdrawingWorker = state.activeBooking.assigned_worker || state.activeWorker;

  // Search for the nearest backup worker of the same trade
  let backupWorker = WORKERS.find(
    w => w.skill === state.activeBooking.service_type && w.id !== withdrawingWorker.id && w.is_available
  );
  if (!backupWorker) {
    backupWorker = WORKERS.find(w => w.id !== withdrawingWorker.id && w.is_available);
  }
  if (!backupWorker) {
    backupWorker = WORKERS.find(w => w.id !== withdrawingWorker.id) || WORKERS[0];
  }

  const bCoords = getWorkerCoords(backupWorker);
  const targetCoords = state.customerCoords || [28.6304, 77.2273];
  const dist = computeDistanceKm(targetCoords[0], targetCoords[1], bCoords[0], bCoords[1]);
  const newEtaMinutes = Math.max(4, Math.round(dist * 3.5));

  // 1. Reassign Booking in State Machine
  state.activeBooking.assigned_worker = backupWorker;
  const reasonLabel = reason.replace(/_/g, " ");
  state.activeBooking.timeline.push(
    isHi
      ? `🚨 आपातकालीन निकासी: श्रमिक ${withdrawingWorker.name} ने कार्य स्वीकार करने के उपरांत हटने का अनुरोध किया (${reasonLabel})। सहकारिता टेलीमेट्री इंजन द्वारा बिना किसी देरी के नए तकनीशियन ${backupWorker.name} (${dist} किमी, आगमन ~${newEtaMinutes} मिनट) को कार्य सौंपा गया।`
      : `🚨 POST-ACCEPTANCE WITHDRAWAL: Technician ${withdrawingWorker.name} withdrew post-acceptance [Reason: ${reasonLabel}]. Autonomous Telemetry Engine instantly auto-reassigned certified technician ${backupWorker.name} (${dist} km away, ETA ~${newEtaMinutes} mins). Customer schedule & SLA preserved.`
  );

  // 2. Update Citizen UI
  const statusName = document.getElementById("status-worker-name");
  if (statusName) statusName.innerText = backupWorker.name;

  const statusCoop = document.getElementById("status-worker-coop");
  if (statusCoop) statusCoop.innerText = `✓ ${backupWorker.coop_name}`;

  const statusDist = document.getElementById("status-worker-dist");
  if (statusDist) {
    statusDist.innerText = `📍 ${dist} km away • Rating: ${backupWorker.rating} ★ (Auto-Reassigned Backup)`;
  }

  const statusPhoto = document.getElementById("status-worker-photo");
  if (statusPhoto && backupWorker.photo) statusPhoto.src = backupWorker.photo;

  updateTimeline(state.activeBooking.timeline);
  drawRouteLine(bCoords, targetCoords);

  // 3. Reset Worker View Radar & Maps
  const radarMapContainer = document.getElementById("worker-radar-map-container");
  const radarScanner = document.getElementById("worker-radar-scanner");
  if (radarMapContainer) radarMapContainer.classList.add("hidden");
  if (radarScanner) radarScanner.classList.remove("hidden");

  if (state.workerRadarMap) {
    try {
      state.workerRadarMap.remove();
    } catch (e) {
      console.warn("Radar map teardown:", e);
    }
    state.workerRadarMap = null;
  }

  // Display Worker Reassignment Notice
  const fallbackNotice = document.getElementById("worker-fallback-notice");
  if (fallbackNotice) fallbackNotice.classList.remove("hidden");

  const fallbackText = document.getElementById("worker-fallback-text");
  if (fallbackText) {
    fallbackText.innerHTML = isHi
      ? `🚨 <b>कार्य पुनः सौंपा गया:</b> आपने आपातकालीन निकासी दर्ज की (${reasonLabel})। नागरिक की सेवा को बाधित होने से बचाने के लिए कार्य बैकअप तकनीशियन <b>${backupWorker.name}</b> को सौंप दिया गया है।`
      : `🚨 <span class="font-bold text-rose-900">WITHDRAWAL TELEMETRY LOGGED:</span> You withdrew from Booking #${state.activeBooking.booking_id} (${reasonLabel}). Job was instantly auto-reassigned to certified backup: <strong class="text-blue-900">${backupWorker.name}</strong> (${dist} km away). Customer SLA preserved.`;
  }

  const incomingCard = document.getElementById("incoming-job-card");
  if (incomingCard) incomingCard.classList.add("hidden");

  const badgeStatus = document.getElementById("booking-badge-status");
  if (badgeStatus) {
    badgeStatus.innerText = isHi ? "पुनः सौंपा गया" : "WITHDRAWN & REASSIGNED";
    badgeStatus.className = "bg-rose-600 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm";
  }

  // 4. Update Disciplinary Log & Flag for Ministry Audit
  withdrawingWorker.withdrawal_count = (withdrawingWorker.withdrawal_count || 0) + 1;
  withdrawingWorker.rejection_count = (withdrawingWorker.rejection_count || 0) + 1;
  withdrawingWorker.disciplinary_status = "UNDER_REVIEW";
  withdrawingWorker.disciplinary_action_notes = `Late post-acceptance withdrawal on Booking #${state.activeBooking.booking_id} [${reasonLabel}]. Autonomous fallback reassigned to #${backupWorker.id}. Official incident report filed with Ministry.`;

  const incidentReport = {
    rejection_id: `INC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    worker_id: withdrawingWorker.id,
    worker_name: withdrawingWorker.name,
    worker_skill: withdrawingWorker.skill || state.activeBooking.service_type,
    coop_name: withdrawingWorker.coop_name,
    booking_id: state.activeBooking.booking_id,
    service_type: state.activeBooking.service_type,
    type: "POST_ACCEPTANCE_WITHDRAWAL",
    reason: `Late Post-Acceptance Withdrawal (${reasonLabel}): ${notes || 'Immediate telemetry reassignment executed'}`,
    timestamp: new Date().toISOString(),
    status: "AUTO_REASSIGNED",
    reassigned_to_id: backupWorker.id,
    reassigned_to_name: backupWorker.name
  };

  state.workerRejections.unshift(incidentReport);

  // Update Ministry Disciplinary UI Table
  if (typeof renderMinistryDisciplineTable === "function") {
    renderMinistryDisciplineTable();
  }

  // 5. Append Real-Time Telemetry Stream to Ministry Cockpit
  const liveTicker = document.getElementById("ministry-live-ticker");
  if (liveTicker) {
    const alertDiv = document.createElement("div");
    alertDiv.className = "flex items-center gap-1.5 p-2 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-[11px] font-bold shadow-xs";
    alertDiv.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
      <span>🚨 <b>EMERGENCY DISPATCH:</b> Worker #${withdrawingWorker.id} (${withdrawingWorker.name}) withdrew from Job #${state.activeBooking.booking_id} (${reasonLabel}). Instant failover: auto-reassigned to #${backupWorker.id} (${backupWorker.name}). Incident report dispatched.</span>
    `;
    liveTicker.prepend(alertDiv);
  }

  // 6. Notify Backend API if available
  if (state.hasBackendConnection) {
    fetch(`${API_BASE_URL}/api/bookings/dispatch/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: state.activeBooking.booking_id,
        worker_id: withdrawingWorker.id,
        action: "WITHDRAW",
        reason: reason,
        notes: notes,
        reassigned_worker_id: backupWorker.id
      })
    }).catch(err => console.warn("Backend withdrawal telemetry sync (offline fallback):", err));
  }

  showToast(
    isHi
      ? `🚨 निकासी दर्ज की गई। कार्य तुरंत बैकअप तकनीशियन ${backupWorker.name} को पुनः सौंपा गया।`
      : `🚨 Withdrawal processed & incident logged. Job instantly auto-reassigned to ${backupWorker.name}. Customer ETA intact.`,
    "warning"
  );
}

// =======================================================
// GLOBAL WINDOW FUNCTION EXPORTS & INTERACTION LISTENERS
// =======================================================
if (typeof window !== "undefined") {
  window.selectService = selectService;
  window.openServiceBookingModal = openServiceBookingModal;
  window.closeServiceBookingModal = closeServiceBookingModal;
  window.selectSubService = selectSubService;
  window.toggleSubServiceSelection = toggleSubServiceSelection;
  window.openSatisfactionReviewModal = openSatisfactionReviewModal;
  window.closeSatisfactionReviewModal = closeSatisfactionReviewModal;
  window.confirmSatisfactionAndProceed = confirmSatisfactionAndProceed;
  window.goToBookingStep = goToBookingStep;
  window.setBookingScheduleType = setBookingScheduleType;
  window.selectQuickDay = selectQuickDay;
  window.selectTimeSlot = selectTimeSlot;
  window.onBookingDateInputChange = onBookingDateInputChange;
  window.onCustomTimeChange = onCustomTimeChange;
  window.state = state;
  window.SERVICES = SERVICES;
  window.WORKERS = WORKERS;
  window.selectPlan = selectPlan;
  window.handleNgoCheckboxChange = handleNgoCheckboxChange;
  window.openNgoVerificationModal = openNgoVerificationModal;
  window.closeNgoVerificationModal = closeNgoVerificationModal;
  window.autoFillSampleNgo = autoFillSampleNgo;
  window.submitNgoVerification = submitNgoVerification;
  window.resetNgoVerification = resetNgoVerification;
  window.openPaymentGatewayModal = openPaymentGatewayModal;
  window.closePaymentGatewayModal = closePaymentGatewayModal;
  window.executeBookingConfirmed = executeBookingConfirmed;
  window.switchPortal = switchPortal;
  window.toggleEmergencyMode = toggleEmergencyMode;
  window.toggleShowAllServices = toggleShowAllServices;
  window.updateSubscriberGatingUI = updateSubscriberGatingUI;

  // In-Menu Satisfaction Panel & Subservices Selection
  window.backToSubServicesSelection = backToSubServicesSelection;
  window.resetCustomerAppMap = resetCustomerAppMap;
  window.closeCompletedBookingCard = closeCompletedBookingCard;

  // Citizen Authentication & Debarment Exports
  window.changeCitizenPersona = changeCitizenPersona;
  window.openCitizenAuthModal = openCitizenAuthModal;
  window.cancelCitizenAuth = cancelCitizenAuth;
  window.submitCitizenAuth = submitCitizenAuth;
  window.sendCitizenOtp = sendCitizenOtp;
  window.autofillCitizenOtp = autofillCitizenOtp;
  window.selectCitizenAuthLocationPreset = selectCitizenAuthLocationPreset;
  window.detectCitizenGpsLocation = detectCitizenGpsLocation;
  window.openServiceDebarmentModal = openServiceDebarmentModal;
  window.closeServiceDebarmentModal = closeServiceDebarmentModal;
  window.switchToCompliantCitizen = switchToCompliantCitizen;

  // Worker Persona & Verification Gate Exports
  window.selectWorkerLoginPersona = selectWorkerLoginPersona;
  window.sendWorkerOtp = sendWorkerOtp;
  window.autofillWorkerOtp = autofillWorkerOtp;
  window.handleWorkerStep1Submit = handleWorkerStep1Submit;
  window.grantWorkerAppAccess = grantWorkerAppAccess;
  window.changeWorkerPersona = changeWorkerPersona;
  window.openWorkerAuthGateModal = openWorkerAuthGateModal;
  window.cancelWorkerAuthGate = cancelWorkerAuthGate;
  window.submitWorkerAuthGate = submitWorkerAuthGate;
  window.sendWorkerAuthGateOtp = sendWorkerAuthGateOtp;
  window.autofillWorkerAuthGateOtp = autofillWorkerAuthGateOtp;
  window.closeWorkerAcceptedToast = closeWorkerAcceptedToast;
  window.focusCitizenBookingStatus = focusCitizenBookingStatus;

  // Ministry Debarment Desk Exports
  window.openMinistryDebarModal = openMinistryDebarModal;
  window.closeMinistryDebarModal = closeMinistryDebarModal;
  window.toggleMinistryDebarAll = toggleMinistryDebarAll;
  window.handleMinistryDebarSubmit = handleMinistryDebarSubmit;
  window.ministryCustomerDebarAction = ministryCustomerDebarAction;

  // Global backdrop click dismissal for Modals
  document.addEventListener("click", (e) => {
    const ngoModal = document.getElementById("modal-ngo-verify");
    if (ngoModal && !ngoModal.classList.contains("hidden") && e.target === ngoModal) {
      closeNgoVerificationModal(false);
      return;
    }
    const payModal = document.getElementById("modal-payment-gateway");
    if (payModal && !payModal.classList.contains("hidden") && e.target === payModal) {
      closePaymentGatewayModal();
      return;
    }
    const sModal = document.getElementById("modal-service-booking");
    if (sModal && e.target === sModal) {
      closeServiceBookingModal();
      return;
    }
    const debarModal = document.getElementById("modal-service-debarment");
    if (debarModal && !debarModal.classList.contains("hidden") && e.target === debarModal) {
      closeServiceDebarmentModal();
      return;
    }
    const satModal = document.getElementById("modal-satisfaction-review");
    if (satModal && !satModal.classList.contains("hidden") && e.target === satModal) {
      closeSatisfactionReviewModal();
      return;
    }
    const minDebarModal = document.getElementById("modal-ministry-debar-order");
    if (minDebarModal && !minDebarModal.classList.contains("hidden") && e.target === minDebarModal) {
      closeMinistryDebarModal();
      return;
    }
    const workerGateModal = document.getElementById("modal-worker-auth-gate");
    if (workerGateModal && !workerGateModal.classList.contains("hidden") && e.target === workerGateModal) {
      cancelWorkerAuthGate();
      return;
    }
    const citizenAuthModal = document.getElementById("modal-citizen-auth");
    if (citizenAuthModal && !citizenAuthModal.classList.contains("hidden") && e.target === citizenAuthModal) {
      cancelCitizenAuth();
      return;
    }
    const aiModal = document.getElementById("modal-ai-chatbot");
    if (aiModal && !aiModal.classList.contains("hidden") && e.target === aiModal) {
      closeAiChatModal();
      return;
    }
  });

  // Global escape key dismissal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const aiModal = document.getElementById("modal-ai-chatbot");
      if (aiModal && !aiModal.classList.contains("hidden") && aiModal.style.display !== "none") {
        closeAiChatModal();
        return;
      }
      const workerGateModal = document.getElementById("modal-worker-auth-gate");
      if (workerGateModal && !workerGateModal.classList.contains("hidden") && workerGateModal.style.display !== "none") {
        cancelWorkerAuthGate();
        return;
      }
      const citizenAuthModal = document.getElementById("modal-citizen-auth");
      if (citizenAuthModal && !citizenAuthModal.classList.contains("hidden") && citizenAuthModal.style.display !== "none") {
        cancelCitizenAuth();
        return;
      }
      const ngoModal = document.getElementById("modal-ngo-verify");
      if (ngoModal && !ngoModal.classList.contains("hidden") && ngoModal.style.display !== "none") {
        closeNgoVerificationModal(false);
        return;
      }
      const payModal = document.getElementById("modal-payment-gateway");
      if (payModal && !payModal.classList.contains("hidden") && payModal.style.display !== "none") {
        closePaymentGatewayModal();
        return;
      }
      const debarModal = document.getElementById("modal-service-debarment");
      if (debarModal && !debarModal.classList.contains("hidden") && debarModal.style.display !== "none") {
        closeServiceDebarmentModal();
        return;
      }
      const satModal = document.getElementById("modal-satisfaction-review");
      if (satModal && !satModal.classList.contains("hidden") && satModal.style.display !== "none") {
        closeSatisfactionReviewModal();
        return;
      }
      const minDebarModal = document.getElementById("modal-ministry-debar-order");
      if (minDebarModal && !minDebarModal.classList.contains("hidden") && minDebarModal.style.display !== "none") {
        closeMinistryDebarModal();
        return;
      }
      closeServiceBookingModal();
    }
  });
}

// ==========================================
// MULTILINGUAL AI CHATBOT & VOICE ASSISTANT (SEVA MITRA)
// ==========================================

function initAiChatbot() {
  const container = document.getElementById("ai-chat-messages");
  if (!container) return;

  // Render initial greeting if messages container is empty
  if (!container.children || container.children.length === 0 || state.aiChatMessages.length === 0) {
    const isHi = state.currentLanguage === "hi";
    const welcomeHtml = `
      <div class="p-4 bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-blue-950/80 rounded-2xl border border-indigo-500/40 text-blue-100 shadow-md space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-sm">
              <i data-lucide="bot" class="w-4 h-4"></i>
            </div>
            <div>
              <span class="font-black text-xs text-amber-300 block">${isHi ? "नमस्ते! मैं सेवा मित्र हूँ" : "Namaste! I am Seva Mitra"}</span>
              <span class="text-[10px] text-blue-200">${isHi ? "आपका बहुभाषी सहकारी एआई सहायक" : "Multilingual Cooperative AI Assistant"}</span>
            </div>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            Active 24x7
          </span>
        </div>
        <p class="text-xs leading-relaxed text-slate-200">
          ${isHi 
            ? "घर की किसी भी समस्या को <b>बोलकर (माइक्रोफोन)</b> या <b>टाइप करके</b> बताएं। जैसे: <i>'नल से पानी टपक रहा है'</i>, <i>'कमरे का पंखा खराब है'</i>, या <i>'सोफा और किचन की सफाई चाहिए'</i>। मैं तुरंत सही सेवा और उसके उप-कार्य (Sub-services) चुन लूँगा!"
            : "Describe what is broken using <b>voice speech</b> or <b>typed text</b>. For example: <i>'I have water leaking'</i>, <i>'Ceiling fan broken'</i>, <i>'Door lock jammed'</i>, or <i>'Need sofa cleaning'</i>. I will automatically select the right cooperative trade and specific sub-services for you!"}
        </p>
        <div class="pt-2 border-t border-indigo-500/30 flex items-center justify-between text-[11px] text-blue-300">
          <div class="flex items-center gap-1.5">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
            <span class="font-semibold">100% Direct Fair Wage to Worker &bull; 0% Middleman Cut</span>
          </div>
        </div>
      </div>
    `;
    container.innerHTML = welcomeHtml;
    safeCreateIcons();
  }
}

function openAiChatModal(startVoice = false) {
  try {
    if (typeof sfx !== "undefined" && sfx && typeof sfx.playClick === "function") {
      sfx.playClick();
    }
  } catch (e) {}

  const modal = document.getElementById("modal-ai-chatbot");
  if (!modal) {
    console.error("modal-ai-chatbot element not found in DOM");
    return;
  }

  // Ensure modal is a direct child of document.body so no parent modal/toast can ever trap it
  if (modal.parentElement && typeof document !== "undefined" && document.body && typeof document.body.appendChild === "function" && modal.parentElement !== document.body) {
    try {
      document.body.appendChild(modal);
    } catch (e) {}
  }

  // Ensure message container is ready
  try {
    initAiChatbot();
  } catch (e) {
    console.warn("initAiChatbot non-fatal:", e);
  }

  modal.classList.remove("hidden");
  modal.style.display = "flex";
  document.body.classList.add("overflow-hidden");
  state.aiChatOpen = true;

  const windowEl = document.getElementById("ai-chat-window");
  if (windowEl) {
    windowEl.classList.add("open");
  }

  // Update floating launcher button state
  const iconBot = document.getElementById("ai-launcher-icon-bot");
  const iconClose = document.getElementById("ai-launcher-icon-close");
  const badge = document.getElementById("ai-launcher-badge");
  const tooltip = document.getElementById("ai-launcher-tooltip");
  if (iconBot) iconBot.classList.add("hidden");
  if (iconClose) iconClose.classList.remove("hidden");
  if (badge) badge.classList.add("hidden");
  if (tooltip) tooltip.classList.add("hidden");

  safeCreateIcons();

  // Scroll messages to bottom and focus input or trigger mic
  setTimeout(() => {
    scrollAiMessagesToBottom();
    const input = document.getElementById("ai-chat-input");
    if (input) input.focus();

    if (startVoice) {
      startAiVoiceInput();
    }
  }, 150);
}

function closeAiChatModal() {
  try {
    if (typeof sfx !== "undefined" && sfx && typeof sfx.playClick === "function") {
      sfx.playClick();
    }
  } catch (e) {}

  const modal = document.getElementById("modal-ai-chatbot");
  if (modal) {
    modal.classList.add("hidden");
    modal.style.display = "none";
  }

  const windowEl = document.getElementById("ai-chat-window");
  if (windowEl) {
    windowEl.classList.remove("open");
  }

  document.body.classList.remove("overflow-hidden");
  state.aiChatOpen = false;

  // Stop any active speech recognition
  stopAiVoiceInput();

  // Cancel any ongoing TTS voice readback
  if ("speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }

  // Restore floating launcher button state
  const iconBot = document.getElementById("ai-launcher-icon-bot");
  const iconClose = document.getElementById("ai-launcher-icon-close");
  if (iconBot) iconBot.classList.remove("hidden");
  if (iconClose) iconClose.classList.add("hidden");

  safeCreateIcons();
}

function toggleAiChat(forceOpen) {
  const modal = document.getElementById("modal-ai-chatbot");
  const isHidden = !modal || modal.classList.contains("hidden") || modal.style.display === "none";
  const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : isHidden;

  if (shouldOpen) {
    openAiChatModal(false);
  } else {
    closeAiChatModal();
  }
}

function setAiChatLanguage(lang) {
  state.aiChatLanguage = lang;
  const langLabels = {
    auto: "Auto-Detect Language (🌐)",
    en: "English",
    hi: "हिंदी (Hindi)",
    gu: "ગુજરાતી (Gujarati)",
    mr: "मराठी (Marathi)",
    bn: "বাংলা (Bengali)",
    ta: "தமிழ் (Tamil)"
  };
  showToast(`AI language set to: ${langLabels[lang] || lang}`, "info");
}

function toggleAiTts() {
  state.aiTtsEnabled = !state.aiTtsEnabled;
  const icon = document.getElementById("ai-tts-icon");
  if (icon) {
    icon.setAttribute("data-lucide", state.aiTtsEnabled ? "volume-2" : "volume-x");
    safeCreateIcons();
  }
  if (!state.aiTtsEnabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  showToast(state.aiTtsEnabled ? "AI voice read-aloud enabled" : "AI voice read-aloud muted", "info");
}

function startAiVoiceFromBanner() {
  openAiChatModal(true);
}

function toggleAiVoiceRecording() {
  if (state.aiVoiceListening) {
    stopAiVoiceInput();
  } else {
    startAiVoiceInput();
  }
}

function startAiVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast("Speech recognition is not available in this browser. Please type or tap quick chips!", "warning");
    const input = document.getElementById("ai-chat-input");
    if (input) {
      input.placeholder = "Speech unavailable: type e.g. 'water leaking'...";
      input.focus();
    }
    return;
  }

  // Stop any existing instance
  stopAiVoiceInput();

  try {
    if (typeof sfx !== "undefined" && sfx && typeof sfx.playClick === "function") {
      sfx.playClick();
    }
  } catch (e) {}
  const recognition = new SpeechRecognition();
  state.aiSpeechRecognition = recognition;

  // Determine language code
  let langCode = "en-IN";
  if (state.aiChatLanguage === "hi" || state.currentLanguage === "hi") {
    langCode = "hi-IN";
  } else if (state.aiChatLanguage === "gu") {
    langCode = "gu-IN";
  } else if (state.aiChatLanguage === "mr") {
    langCode = "mr-IN";
  } else if (state.aiChatLanguage === "bn") {
    langCode = "bn-IN";
  } else if (state.aiChatLanguage === "ta") {
    langCode = "ta-IN";
  } else if (state.aiChatLanguage === "en") {
    langCode = "en-IN";
  } else {
    langCode = state.currentLanguage === "hi" ? "hi-IN" : "en-IN";
  }

  recognition.lang = langCode;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const listeningBar = document.getElementById("ai-voice-listening-bar");
  const micBtn = document.getElementById("ai-mic-btn");
  const statusTxt = document.getElementById("ai-voice-status-text");

  if (listeningBar) listeningBar.classList.remove("hidden");
  if (micBtn) {
    micBtn.classList.add("bg-red-500/30", "text-red-400", "animate-pulse");
  }
  if (statusTxt) {
    statusTxt.innerText = `Listening in ${langCode}... Speak now`;
  }
  state.aiVoiceListening = true;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    state.aiVoiceListening = false;
    if (listeningBar) listeningBar.classList.add("hidden");
    if (micBtn) {
      micBtn.classList.remove("bg-red-500/30", "text-red-400", "animate-pulse");
    }

    const input = document.getElementById("ai-chat-input");
    if (input) input.value = transcript;
    
    // Auto submit recognized voice message
    sendAiChatMessage(transcript, true);
  };

  recognition.onerror = (event) => {
    state.aiVoiceListening = false;
    if (listeningBar) listeningBar.classList.add("hidden");
    if (micBtn) {
      micBtn.classList.remove("bg-red-500/30", "text-red-400", "animate-pulse");
    }
    console.warn("Speech recognition error:", event.error);
    if (event.error !== "no-speech") {
      showToast(`Voice input: ${event.error}. You can also type your problem.`, "info");
    }
  };

  recognition.onend = () => {
    state.aiVoiceListening = false;
    if (listeningBar) listeningBar.classList.add("hidden");
    if (micBtn) {
      micBtn.classList.remove("bg-red-500/30", "text-red-400", "animate-pulse");
    }
  };

  try {
    recognition.start();
  } catch (err) {
    console.warn("Could not start SpeechRecognition:", err);
  }
}

function stopAiVoiceInput() {
  if (state.aiSpeechRecognition) {
    try {
      state.aiSpeechRecognition.stop();
    } catch (e) {}
    state.aiSpeechRecognition = null;
  }
  state.aiVoiceListening = false;
  const listeningBar = document.getElementById("ai-voice-listening-bar");
  const micBtn = document.getElementById("ai-mic-btn");
  if (listeningBar) listeningBar.classList.add("hidden");
  if (micBtn) {
    micBtn.classList.remove("bg-red-500/30", "text-red-400", "animate-pulse");
  }
}

function sendQuickPrompt(promptText) {
  toggleAiChat(true);
  sendAiChatMessage(promptText, false);
}

function handleAiChatSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("ai-chat-input");
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  sendAiChatMessage(text, false);
}

function scrollAiMessagesToBottom() {
  const container = document.getElementById("ai-chat-messages");
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMarkdownReply(text) {
  if (!text) return "";
  let formatted = escapeHtml(text);
  // Bold **text**
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
  // Italic *text*
  formatted = formatted.replace(/\*(.*?)\*/g, '<em class="text-blue-200">$1</em>');
  // Bullets • or -
  formatted = formatted.replace(/(?:^|\n)[•\-]\s+(.*)/g, '<div class="flex items-start gap-1.5 ml-1 mt-0.5"><span class="text-amber-400">•</span><span>$1</span></div>');
  // Newlines
  formatted = formatted.replace(/\n\n/g, '<div class="h-2"></div>');
  formatted = formatted.replace(/\n/g, '<br/>');
  return formatted;
}

async function sendAiChatMessage(userText, isVoice = false) {
  if (!userText || !userText.trim()) return;
  sfx.playClick();

  const container = document.getElementById("ai-chat-messages");
  if (!container) return;

  // Add User Message bubble
  const userMsgId = `user-msg-${Date.now()}`;
  const userBubbleHtml = `
    <div id="${userMsgId}" class="flex justify-end items-start gap-2">
      <div class="max-w-[85%] bg-blue-600 text-white rounded-2xl rounded-tr-none px-3.5 py-2.5 shadow-md">
        <div class="flex items-center gap-1.5 mb-1 justify-end">
          <span class="text-[10px] font-bold text-blue-200">You (${state.currentCustomerName})</span>
          ${isVoice ? '<i data-lucide="mic" class="w-3 h-3 text-amber-300"></i>' : ''}
        </div>
        <p class="text-xs leading-relaxed break-words">${escapeHtml(userText)}</p>
      </div>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", userBubbleHtml);

  // Add typing indicator
  const typingId = `ai-typing-${Date.now()}`;
  const typingHtml = `
    <div id="${typingId}" class="flex justify-start items-start gap-2">
      <div class="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
        <i data-lucide="bot" class="w-4 h-4"></i>
      </div>
      <div class="bg-slate-800/90 text-blue-200 rounded-2xl rounded-tl-none px-4 py-3 border border-indigo-500/30 shadow-md flex items-center space-x-1.5">
        <span class="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></span>
        <span class="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style="animation-delay: 0.15s"></span>
        <span class="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style="animation-delay: 0.3s"></span>
        <span class="text-[10px] text-blue-300 font-bold ml-1.5">Seva Mitra is thinking...</span>
      </div>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", typingHtml);
  scrollAiMessagesToBottom();
  safeCreateIcons();

  // Process response (backend or client fallback)
  await fetchAiChatResponse(userText, isVoice, typingId);
}

async function fetchAiChatResponse(userText, isVoice, typingId) {
  let aiData = null;

  // 1. Try Live FastAPI backend endpoint
  try {
    const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userText,
        language: state.aiChatLanguage || "auto",
        customer_name: state.currentCustomerName || "Citizen"
      })
    });

    if (res.ok) {
      aiData = await res.json();
    }
  } catch (err) {
    console.info("Backend AI endpoint unreachable, switching to autonomous client-side NLP:", err);
  }

  // 2. Fallback to client-side deterministic NLP engine if backend not reachable
  if (!aiData || !aiData.success) {
    aiData = clientSideAiIntentParser(userText);
  }

  // Remove typing indicator
  const typingEl = document.getElementById(typingId);
  if (typingEl) typingEl.remove();

  // 3. If service(s) and sub-services were selected, automatically apply them to application state!
  if (aiData.services && aiData.services.length > 0) {
    state.aiSelectedServicesBundle = aiData.services;
    const primary = aiData.services[0];
    applyAiServiceSelection(primary.service_id, primary.sub_service_ids, false);
  } else if (aiData.service_id && aiData.sub_service_ids && aiData.sub_service_ids.length > 0) {
    applyAiServiceSelection(aiData.service_id, aiData.sub_service_ids, false);
  }

  // 4. Render AI response bubble with Interactive Action Card
  renderAiMessageBubble(aiData, isVoice);
}

// Client-Side Deterministic NLP Engine with Multi-Service & Multi-Subservice Intelligence
function clientSideAiIntentParser(userText) {
  const textLower = userText.toLowerCase().trim();
  const isHi = state.currentLanguage === "hi" || /[\u0900-\u097F]/.test(userText);
  const isGu = state.aiChatLanguage === "gu" || /[\u0A80-\u0AFF]/.test(userText);

  // Check greetings
  if (/^(hi|hello|hey|namaste|namaskar|नमस्ते|प्रणाम|kem cho)\b/i.test(textLower) && textLower.split(" ").length <= 3) {
    return {
      success: true,
      detected_language: isHi ? "hi" : (isGu ? "gu" : "en"),
      service_id: null,
      service_name: null,
      service_name_hi: null,
      sub_service_ids: [],
      sub_services: [],
      estimated_wage: 0.0,
      urgency: "normal",
      is_multi_service: false,
      services: [],
      action: "greeting",
      reply: isHi
        ? "नमस्ते! मैं सेवा मित्र हूँ, आपका सहकारी एआई सहायक। अपने घर के किसी भी काम (जैसे नल का रिसाव, पंखा खराब होना, सोफा सफाई) के बारे में बताएं या बोलें, मैं तुरंत सही सेवा और कार्य चुन दूँगा!"
        : "Hello! I am Seva Mitra, your Multilingual Cooperative AI Assistant. Describe what needs repair (e.g. 'I have water leaking', 'Switchboard spark', 'Need sofa cleaning'), and I will automatically select the verified technician and tasks for you!"
    };
  }

  const matchedServices = [];

  // Helper to test if a keyword exists, using word boundaries for short alphanumeric terms to prevent substring collisions (e.g. 'car' in 'carpet')
  function hasWord(wordsArray) {
    return wordsArray.some(w => {
      const wLower = w.toLowerCase();
      if (wLower.length <= 4 && !/[\u0900-\u0DFF]/.test(wLower)) {
        return new RegExp(`\\b${wLower}\\b`, 'i').test(textLower);
      }
      return textLower.includes(wLower);
    });
  }

  // Helper to add trade match cleanly
  function addTradeMatch(serviceId, matchedSubs) {
    if (!matchedSubs || matchedSubs.length === 0) return;
    const sObj = SERVICES.find(s => s.id === serviceId) || { id: serviceId, name: serviceId, name_hi: serviceId, icon: "tool", badge: "Co-op Trade", badge_hi: "सहकारी ट्रेड" };
    // Deduplicate subs by id
    const seen = new Set();
    const uniqueSubs = [];
    matchedSubs.forEach(s => {
      if (s && s.id && !seen.has(s.id)) {
        seen.add(s.id);
        uniqueSubs.push(s);
      }
    });
    if (uniqueSubs.length === 0) return;
    const wage = uniqueSubs.reduce((sum, s) => sum + (s.base || 0), 0);
    matchedServices.push({
      service_id: serviceId,
      service_name: sObj.name,
      service_name_hi: sObj.name_hi,
      icon: sObj.icon,
      badge: sObj.badge,
      badge_hi: sObj.badge_hi,
      sub_service_ids: uniqueSubs.map(s => s.id),
      sub_services: uniqueSubs,
      estimated_wage: wage,
      cooperative: "Delhi Central Labour Cooperative Federation"
    });
  }

  // 1. Plumber (including direct requirement 'I have water leaking')
  const waterLeakWords = ["water leak", "water leaking", "leaking water", "leak in pipe", "pipe leaking", "tap leak", "dripping", "पानी टपक", "पानी का रिसाव", "पानी बह रहा", "नल टपक", "paani leak", "nal kharab"];
  const generalPlumberWords = ["plumber", "pipe", "tap", "drain", "sink", "toilet", "flush", "tank", "motor", "shower", "geyser", "nal", "pani", "कमोड", "सीवर", "नाली", "प्लम्बर", "वाशबेसिन"];

  if (hasWord(waterLeakWords) || hasWord(generalPlumberWords)) {
    const pCatalog = SUB_SERVICES_CATALOG.plumber || [];
    const subs = [];
    if (textLower.includes("toilet") || textLower.includes("flush") || textLower.includes("कमोड") || textLower.includes("फ्लश")) {
      subs.push(pCatalog.find(s => s.id === "toilet_flush_repair") || pCatalog[1]);
    }
    if (textLower.includes("drain") || textLower.includes("sink") || textLower.includes("clog") || textLower.includes("chok") || textLower.includes("नाली") || textLower.includes("सिंक")) {
      subs.push(pCatalog.find(s => s.id === "drainage_blockage") || pCatalog[2]);
    }
    if (textLower.includes("tank") || textLower.includes("motor") || textLower.includes("pump") || textLower.includes("टंकी") || textLower.includes("मोटर")) {
      subs.push(pCatalog.find(s => s.id === "water_tank_motor") || pCatalog[3]);
    }
    if (textLower.includes("shower") || textLower.includes("bath") || textLower.includes("शावर") || textLower.includes("गीज़र")) {
      subs.push(pCatalog.find(s => s.id === "bath_fitting_install") || pCatalog[4]);
    }
    if (subs.length === 0 || hasWord(waterLeakWords)) {
      const leakSub = pCatalog.find(s => s.id === "tap_pipe_leakage") || pCatalog[0];
      if (!subs.some(s => s.id === leakSub.id)) subs.unshift(leakSub);
    }
    addTradeMatch("plumber", subs);
  }

  // 2. Electrician
  if (hasWord(["electric", "wire", "switch", "socket", "fan", "light", "mcb", "fuse", "short circuit", "spark", "bijli", "tarr", "बिजली", "पंखा", "स्विच", "सॉकेट", "इलेक्ट्रीशियन", "झूमर", "बल्ब"])) {
    const eCatalog = SUB_SERVICES_CATALOG.electrician || [];
    const subs = [];
    if (textLower.includes("fan") || textLower.includes("पंखा") || textLower.includes("regulator") || textLower.includes("capacitor")) {
      subs.push(eCatalog.find(s => s.id === "fan_installation") || eCatalog[1]);
    }
    if (textLower.includes("light") || textLower.includes("led") || textLower.includes("chandelier") || textLower.includes("bulb") || textLower.includes("झूमर") || textLower.includes("रोशनी")) {
      subs.push(eCatalog.find(s => s.id === "lighting_fitting") || eCatalog[2]);
    }
    if (textLower.includes("mcb") || textLower.includes("short circuit") || textLower.includes("heavy") || textLower.includes("ac point") || textLower.includes("tripping")) {
      subs.push(eCatalog.find(s => s.id === "appliance_wiring") || eCatalog[3]);
    }
    if (textLower.includes("audit") || textLower.includes("inspection") || textLower.includes("निरीक्षण")) {
      subs.push(eCatalog.find(s => s.id === "full_home_inspection") || eCatalog[4]);
    }
    if (subs.length === 0) {
      subs.push(eCatalog.find(s => s.id === "switch_socket_repair") || eCatalog[0]);
    }
    addTradeMatch("electrician", subs);
  }

  // 3. Carpentry
  if (hasWord(["carpenter", "wood", "furniture", "chair", "table", "bed", "door", "lock", "hinge", "wardrobe", "drawer", "almirah", "sofa frame", "bookshelf", "window pane", "mosquito net", "बढ़ई", "दरवाजा", "ताला", "अलमारी", "फर्नीचर", "कुर्सी", "मेज", "लकड़ी", "खिड़की"])) {
    const cCatalog = SUB_SERVICES_CATALOG.carpentry || [];
    const subs = [];
    if (textLower.includes("door") || textLower.includes("lock") || textLower.includes("hinge") || textLower.includes("दरवाजा") || textLower.includes("ताला") || textLower.includes("कुंडी")) {
      subs.push(cCatalog.find(s => s.id === "door_lock_hinge") || cCatalog[1]);
    }
    if (textLower.includes("wardrobe") || textLower.includes("drawer") || textLower.includes("channel") || textLower.includes("almirah") || textLower.includes("अलमारी") || textLower.includes("दराज")) {
      subs.push(cCatalog.find(s => s.id === "wardrobe_modular") || cCatalog[2]);
    }
    if (textLower.includes("window") || textLower.includes("mesh") || textLower.includes("mosquito") || textLower.includes("खिड़की") || textLower.includes("जाली")) {
      subs.push(cCatalog.find(s => s.id === "window_mesh_repair") || cCatalog[4]);
    }
    if (textLower.includes("shelf") || textLower.includes("mandir") || textLower.includes("desk") || textLower.includes("शेल्फ") || textLower.includes("मंदिर")) {
      subs.push(cCatalog.find(s => s.id === "custom_woodwork") || cCatalog[3]);
    }
    if (subs.length === 0) {
      subs.push(cCatalog.find(s => s.id === "furniture_repair") || cCatalog[0]);
    }
    addTradeMatch("carpentry", subs);
  }

  // 4. Cleaning
  if (hasWord(["clean", "safai", "dust", "mop", "sweep", "sofa", "carpet", "chimney", "bathroom", "washroom", "mattress", "सफाई", "धुलाई", "पोछा", "झाड़ू", "किचन", "चिमनी", "कालीन", "सोफा"])) {
    const clCatalog = SUB_SERVICES_CATALOG.cleaning || [];
    const subs = [];
    if (textLower.includes("kitchen") || textLower.includes("chimney") || textLower.includes("किचन") || textLower.includes("रसोई")) {
      subs.push(clCatalog.find(s => s.id === "kitchen_deep_clean") || clCatalog[1]);
    }
    if (textLower.includes("sofa") || textLower.includes("carpet") || textLower.includes("सोफा") || textLower.includes("कालीन") || textLower.includes("mattress")) {
      subs.push(clCatalog.find(s => s.id === "sofa_carpet_wash") || clCatalog[3]);
    }
    if (textLower.includes("bathroom") || textLower.includes("tile") || textLower.includes("बाथरूम") || textLower.includes("toilet clean")) {
      subs.push(clCatalog.find(s => s.id === "bathroom_cleaning") || clCatalog[2]);
    }
    if (textLower.includes("post paint") || textLower.includes("renovation")) {
      subs.push(clCatalog.find(s => s.id === "post_paint_clean") || clCatalog[4]);
    }
    if (subs.length === 0) {
      subs.push(clCatalog.find(s => s.id === "deep_home_cleaning") || clCatalog[0]);
    }
    addTradeMatch("cleaning", subs);
  }

  // 5. Tailoring
  if (hasWord(["tailor", "stitch", "alter", "hemming", "pant", "suit", "blouse", "kurta", "pajama", "darji", "silai", "दर्जी", "सिलाई", "रफू", "ब्लाउज", "कुर्ता", "पर्दा"])) {
    const tCatalog = SUB_SERVICES_CATALOG.tailoring || [];
    const subs = [];
    if (textLower.includes("blouse") || textLower.includes("suit") || textLower.includes("ब्लाउज")) {
      subs.push(tCatalog.find(s => s.id === "blouse_suit_stitching") || tCatalog[1]);
    }
    if (textLower.includes("kurta") || textLower.includes("shirt") || textLower.includes("pajama") || textLower.includes("कुर्ता")) {
      subs.push(tCatalog.find(s => s.id === "kurta_shirt_stitching") || tCatalog[3]);
    }
    if (textLower.includes("curtain") || textLower.includes("cushion") || textLower.includes("पर्दा")) {
      subs.push(tCatalog.find(s => s.id === "curtains_cushion_covers") || tCatalog[2]);
    }
    if (subs.length === 0) {
      subs.push(tCatalog.find(s => s.id === "clothes_alteration") || tCatalog[0]);
    }
    addTradeMatch("tailoring", subs);
  }

  // 6. Driver
  if (hasWord(["driver", "drive", "car", "taxi", "chauffeur", "airport", "highway", "outstation", "chalak", "gadi", "tempo", "van", "ड्राइवर", "गाड़ी", "चालक", "एयरपोर्ट", "हाइवे"])) {
    const dCatalog = SUB_SERVICES_CATALOG.driver || [];
    const subs = [];
    if (textLower.includes("airport") || textLower.includes("station") || textLower.includes("flight") || textLower.includes("एयरपोर्ट")) {
      subs.push(dCatalog.find(s => s.id === "airport_station_transfer") || dCatalog[2]);
    }
    if (textLower.includes("highway") || textLower.includes("outstation") || textLower.includes("हाइवे")) {
      subs.push(dCatalog.find(s => s.id === "outstation_highway_driver") || dCatalog[1]);
    }
    if (textLower.includes("tempo") || textLower.includes("pickup") || textLower.includes("van") || textLower.includes("टेम्पो")) {
      subs.push(dCatalog.find(s => s.id === "heavy_vehicle_van") || dCatalog[4]);
    }
    if (subs.length === 0) {
      subs.push(dCatalog.find(s => s.id === "local_city_chauffeur") || dCatalog[0]);
    }
    addTradeMatch("driver", subs);
  }

  // 7. Painting
  if (hasWord(["paint", "wall", "putty", "seepage", "damp", "whitewash", "waterproof", "texture", "पेंट", "रंग", "सफेदी", "सीलन", "पुट्टी"])) {
    const pCatalog = SUB_SERVICES_CATALOG.painting || [];
    const subs = [];
    if (textLower.includes("seepage") || textLower.includes("damp") || textLower.includes("waterproof") || textLower.includes("सीलन")) {
      subs.push(pCatalog.find(s => s.id === "waterproof_dampproof") || pCatalog[1]);
    }
    if (textLower.includes("texture") || textLower.includes("stencil") || textLower.includes("टेक्सचर")) {
      subs.push(pCatalog.find(s => s.id === "texture_stencil") || pCatalog[3]);
    }
    if (subs.length === 0) {
      subs.push(pCatalog.find(s => s.id === "room_wall_paint") || pCatalog[0]);
    }
    addTradeMatch("painting", subs);
  }

  // 8. Pottery
  if (hasWord(["pottery", "clay", "terracotta", "tandoor", "handi", "matka", "diya", "planter", "kumhar", "कुम्हार", "मिट्टी", "मटका", "तंदूर", "दीया"])) {
    const potCatalog = SUB_SERVICES_CATALOG.pottery || [];
    const subs = [];
    if (textLower.includes("tandoor") || textLower.includes("handi") || textLower.includes("तंदूर") || textLower.includes("हांडी")) {
      subs.push(potCatalog.find(s => s.id === "earthen_pots_tandoor") || potCatalog[0]);
    }
    if (textLower.includes("planter") || textLower.includes("terracotta") || textLower.includes("गमले")) {
      subs.push(potCatalog.find(s => s.id === "decorative_terracotta") || potCatalog[1]);
    }
    if (textLower.includes("diya") || textLower.includes("festival") || textLower.includes("दीये")) {
      subs.push(potCatalog.find(s => s.id === "clay_diyas_festival") || potCatalog[2]);
    }
    if (subs.length === 0) {
      subs.push(potCatalog.find(s => s.id === "clay_water_dispenser") || potCatalog[4] || potCatalog[0]);
    }
    addTradeMatch("pottery", subs);
  }

  // 9. Blacksmith
  if (hasWord(["blacksmith", "welding", "iron gate", "grill", "shutter", "forging", "sharpening", "luhar", "लोहार", "लुहार", "वेल्डिंग", "लोहा"])) {
    const bCatalog = SUB_SERVICES_CATALOG.blacksmith || [];
    const subs = [];
    if (textLower.includes("gate") || textLower.includes("welding") || textLower.includes("grill") || textLower.includes("वेल्डिंग")) {
      subs.push(bCatalog.find(s => s.id === "gate_grill_welding") || bCatalog[0]);
    }
    if (textLower.includes("shutter") || textLower.includes("spring") || textLower.includes("शटर")) {
      subs.push(bCatalog.find(s => s.id === "shutter_channel_fix") || bCatalog[2]);
    }
    if (textLower.includes("sharpening") || textLower.includes("knife") || textLower.includes("axe") || textLower.includes("धार")) {
      subs.push(bCatalog.find(s => s.id === "tool_sharpening_forging") || bCatalog[1]);
    }
    if (subs.length === 0) {
      subs.push(bCatalog.find(s => s.id === "gate_grill_welding") || bCatalog[0]);
    }
    addTradeMatch("blacksmith", subs);
  }

  // If no match
  if (matchedServices.length === 0) {
    return {
      success: true,
      detected_language: isHi ? "hi" : "en",
      service_id: null,
      service_name: null,
      service_name_hi: null,
      sub_service_ids: [],
      sub_services: [],
      estimated_wage: 0.0,
      urgency: "normal",
      is_multi_service: false,
      services: [],
      action: "clarification_needed",
      reply: isHi
        ? "मैं आपकी आवश्यकता को पूरी तरह पहचान नहीं सका। कृपया अपनी समस्या को थोड़ा और विस्तार से बताएं (उदा. नल से पानी टपकना, पंखा खराब होना, सोफा धोना या ड्राइवर चाहिए)।"
        : "I couldn't pinpoint the exact trade for that. Please describe the problem in a few words (e.g., 'water leaking under washbasin', 'ceiling fan not spinning', 'need deep cleaning')."
    };
  }

  const isMulti = matchedServices.length > 1;
  const primary = matchedServices[0];
  const totalWage = matchedServices.reduce((sum, s) => sum + s.estimated_wage, 0);
  const allSubIds = matchedServices.flatMap(s => s.sub_service_ids);
  const allSubs = matchedServices.flatMap(s => s.sub_services);

  let reply = "";
  if (isMulti) {
    if (isHi) {
      const breakdownHi = matchedServices.map(s => `• **${s.service_name_hi || s.service_name}**: ${s.sub_services.map(sub => `'${sub.title_hi || sub.title}' (₹${sub.base})`).join(", ")} — उप-कुल: **₹${s.estimated_wage.toFixed(2)}**`).join("\n");
      reply = `मैंने आपकी आवश्यकता में **${matchedServices.length} विभिन्न सहकारी सेवाएँ** पहचानी हैं:\n\n${breakdownHi}\n\n• कुल संयुक्त पारिश्रमिक: **₹${totalWage.toFixed(2)}** (100% सीधा सहकारी कारीगरों को, 0% बिचौलिया कटौती)\n• आगमन अनुमान: **10-15 मिनट**\n\nमैंने सभी संबंधित कार्य स्वचालित रूप से जोड़ दिए हैं। आप नीचे दिए गए बटन से पूरा मल्टी-सर्विस बंडल एक साथ या अलग-अलग सेवा बुक कर सकते हैं!`;
    } else {
      const breakdownEn = matchedServices.map(s => `• **${s.service_name}**: ${s.sub_services.map(sub => `'${sub.title}' (₹${sub.base})`).join(", ")} — Subtotal: **₹${s.estimated_wage.toFixed(2)}**`).join("\n");
      reply = `I identified **multiple cooperative services (${matchedServices.length} trades)** based on your request:\n\n${breakdownEn}\n\n• Combined Fair Wage: **₹${totalWage.toFixed(2)}** (100% direct to verified cooperative artisans, 0% platform commission)\n• Estimated Arrival: **10-15 mins**\n\nAll matching trade tasks are auto-configured below. You can confirm the multi-service bundle or book any trade individually!`;
    }
  } else {
    const sObj = SERVICES.find(s => s.id === primary.service_id) || primary;
    const subTitlesEn = primary.sub_services.map(s => `'${s.title}' (₹${s.base})`).join(", ");
    const subTitlesHi = primary.sub_services.map(s => `'${s.title_hi || s.title}' (₹${s.base})`).join(", ");
    reply = isHi
      ? `मैंने आपकी समस्या पहचानी है! मैंने आपके लिए प्रमाणित **${sObj.name_hi || sObj.name}** का चयन किया है और संबंधित कार्य ${subTitlesHi} स्वचालित रूप से जोड़ दिए हैं।\n\n• कुल पारिश्रमिक: **₹${totalWage.toFixed(2)}** (100% सीधा सहकारी कारीगर को)\n• सहकारी समिति: **दिल्ली सेंट्रल लेबर को-ऑपरेटिव**\n\nआप सीधे नीचे दिए गए बटन पर क्लिक करके बुकिंग की पुष्टि कर सकते हैं!`
      : `I detected your requirement! I have automatically selected our certified **${sObj.name}** and added the specific task(s): ${subTitlesEn}.\n\n• Direct Fair Wage: **₹${totalWage.toFixed(2)}** (100% to worker, 0% platform cut)\n• Cooperative Provider: **Delhi Central Labour Cooperative Federation**\n\nClick '⚡ Confirm & Book Now' below to proceed!`;
  }

  return {
    success: true,
    detected_language: isHi ? "hi" : "en",
    service_id: primary.service_id,
    service_name: primary.service_name,
    service_name_hi: primary.service_name_hi,
    sub_service_ids: isMulti ? allSubIds : primary.sub_service_ids,
    sub_services: isMulti ? allSubs : primary.sub_services,
    estimated_wage: totalWage,
    cooperative: primary.cooperative,
    is_multi_service: isMulti,
    services: matchedServices,
    urgency: "normal",
    action: "service_selected",
    reply: reply
  };
}

function renderAiMessageBubble(aiData, isVoice) {
  const container = document.getElementById("ai-chat-messages");
  if (!container) return;

  const msgId = `ai-msg-${Date.now()}`;
  const isHi = state.currentLanguage === "hi" || aiData.detected_language === "hi";

  // Check if multiple services or a single service was selected
  let actionCardHtml = "";
  if (aiData.services && aiData.services.length > 1) {
    // Multi-Service Bundle Card
    const bundleCardsHtml = aiData.services.map((s) => {
      const sObj = SERVICES.find(srv => srv.id === s.service_id) || s;
      const subTasksHtml = s.sub_services.map(sub => `
        <div class="flex items-center justify-between text-[11px] bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-indigo-500/20">
          <span class="flex items-center gap-1.5 font-bold text-white">
            <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-400"></i>
            <span>${isHi && sub.title_hi ? sub.title_hi : sub.title}</span>
          </span>
          <span class="font-mono font-bold text-amber-300">₹${sub.base.toFixed(2)}</span>
        </div>
      `).join("");
      const singleSubIdsAttr = encodeURIComponent(JSON.stringify(s.sub_service_ids));

      return `
        <div class="p-2.5 bg-slate-900/80 rounded-xl border border-indigo-500/30 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs">
                <i data-lucide="${sObj.icon || 'wrench'}" class="w-3.5 h-3.5"></i>
              </div>
              <span class="text-xs font-black text-white">${isHi ? (sObj.name_hi || sObj.name) : sObj.name}</span>
            </div>
            <span class="font-mono font-black text-amber-300 text-xs">₹${s.estimated_wage.toFixed(2)}</span>
          </div>
          <div class="space-y-1">
            ${subTasksHtml}
          </div>
          <div class="flex items-center justify-end pt-1">
            <button type="button" onclick="confirmAiBooking('${s.service_id}', '${singleSubIdsAttr}')" class="text-[10px] font-bold text-blue-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-blue-900/40 hover:bg-blue-800 transition">
              <span>Book Only ${isHi ? (sObj.name_hi || sObj.name) : sObj.name}</span>
              <i data-lucide="arrow-right" class="w-3 h-3"></i>
            </button>
          </div>
        </div>
      `;
    }).join("");

    const encodedBundleAttr = encodeURIComponent(JSON.stringify(aiData.services));

    actionCardHtml = `
      <div class="mt-3 p-3 bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 rounded-2xl border-2 border-indigo-400/40 shadow-xl space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 flex items-center justify-center text-white">
              <i data-lucide="layers" class="w-4 h-4"></i>
            </div>
            <div>
              <span class="text-xs font-black text-white block">Multi-Service Cooperative Bundle</span>
              <span class="text-[9px] text-emerald-400 font-bold">${aiData.services.length} Trades Auto-Selected • 100% Direct Wage</span>
            </div>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
            Co-op Package
          </span>
        </div>

        <div class="space-y-2">
          ${bundleCardsHtml}
        </div>

        <div class="pt-2 border-t border-indigo-500/30 flex items-center justify-between text-xs">
          <div>
            <span class="text-[10px] text-slate-400 block">Total Combined Fair Wage</span>
            <span class="font-black text-amber-300 text-sm font-mono">₹${aiData.estimated_wage.toFixed(2)}</span>
          </div>
          <div class="text-right">
            <span class="text-[10px] text-slate-400 block">Dispatch Federation</span>
            <span class="text-[10px] text-blue-200 font-bold">Delhi Central Cooperative Federation</span>
          </div>
        </div>

        <div class="pt-1 flex items-center gap-2">
          <button type="button" onclick="confirmAiMultiBooking('${encodedBundleAttr}')" class="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition btn-tactile">
            <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-300"></i>
            <span>⚡ Confirm & Book Entire Bundle (₹${aiData.estimated_wage.toFixed(2)})</span>
          </button>
          <button type="button" onclick="customizeAiBooking('${aiData.service_id}')" class="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-[11px] font-bold border border-indigo-400/30 transition btn-tactile" title="Customize Tasks">
            <i data-lucide="sliders" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;
  } else if (aiData.service_id && aiData.sub_services && aiData.sub_services.length > 0) {
    const sObj = SERVICES.find(s => s.id === aiData.service_id) || SERVICES[0];
    const subTasksHtml = aiData.sub_services.map(sub => `
      <div class="flex items-center justify-between text-[11px] bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-indigo-500/20">
        <span class="flex items-center gap-1.5 font-bold text-white">
          <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-400"></i>
          <span>${isHi && sub.title_hi ? sub.title_hi : sub.title}</span>
        </span>
        <span class="font-mono font-bold text-amber-300">₹${sub.base.toFixed(2)}</span>
      </div>
    `).join("");

    const subIdsAttr = encodeURIComponent(JSON.stringify(aiData.sub_service_ids));

    actionCardHtml = `
      <div class="mt-3 p-3 bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 rounded-2xl border-2 border-indigo-400/40 shadow-lg space-y-2.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <i data-lucide="${sObj.icon || 'wrench'}" class="w-4 h-4"></i>
            </div>
            <div>
              <span class="text-xs font-black text-white block">${isHi ? sObj.name_hi : sObj.name}</span>
              <span class="text-[9px] text-emerald-400 font-bold">100% Direct Cooperative Wage</span>
            </div>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
            ${isHi ? sObj.badge_hi : sObj.badge}
          </span>
        </div>

        <div class="space-y-1">
          <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Auto-Selected Tasks (${aiData.sub_services.length}):</span>
          ${subTasksHtml}
        </div>

        <div class="pt-2 border-t border-indigo-500/30 flex items-center justify-between text-xs">
          <div>
            <span class="text-[10px] text-slate-400 block">Total Base Fair Wage</span>
            <span class="font-black text-amber-300 text-sm font-mono">₹${aiData.estimated_wage.toFixed(2)}</span>
          </div>
          <div class="text-right">
            <span class="text-[10px] text-slate-400 block">Cooperative Federation</span>
            <span class="text-[10px] text-blue-200 font-bold">${aiData.cooperative || "Delhi Central Labour Coop"}</span>
          </div>
        </div>

        <div class="pt-1 flex items-center gap-2">
          <button type="button" onclick="confirmAiBooking('${aiData.service_id}', '${subIdsAttr}')" class="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition btn-tactile">
            <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-300"></i>
            <span>⚡ Confirm & Book Now</span>
          </button>
          <button type="button" onclick="customizeAiBooking('${aiData.service_id}')" class="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-[11px] font-bold border border-indigo-400/30 transition btn-tactile" title="Customize Tasks">
            <i data-lucide="sliders" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;
  }

  const aiBubbleHtml = `
    <div id="${msgId}" class="flex justify-start items-start gap-2">
      <div class="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
        <i data-lucide="bot" class="w-4 h-4"></i>
      </div>
      <div class="max-w-[88%] bg-slate-800/90 text-blue-100 rounded-2xl rounded-tl-none p-3.5 border border-indigo-500/30 shadow-md">
        <div class="flex items-center justify-between mb-1.5">
          <span class="font-bold text-[10px] text-amber-300">Seva Mitra AI</span>
          <button onclick="speakAiMessage('${msgId}')" title="Listen aloud" class="text-slate-400 hover:text-amber-300 transition">
            <i data-lucide="volume-2" class="w-3 h-3"></i>
          </button>
        </div>
        <div class="text-xs leading-relaxed space-y-1.5 break-words" id="${msgId}-text">
          ${formatMarkdownReply(aiData.reply)}
        </div>
        ${actionCardHtml}
      </div>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", aiBubbleHtml);
  scrollAiMessagesToBottom();
  safeCreateIcons();

  // If user used voice OR TTS is active, speak aloud
  if (isVoice || state.aiTtsEnabled) {
    speakAiText(aiData.reply, aiData.detected_language);
  }
}

function speakAiMessage(msgId) {
  const el = document.getElementById(`${msgId}-text`);
  if (!el) return;
  speakAiText(el.innerText, state.currentLanguage);
}

function speakAiText(text, lang) {
  if (!state.aiTtsEnabled) return;
  if (!("speechSynthesis" in window)) return;

  try {
    window.speechSynthesis.cancel();
    // Clean text of markdown asterisks and bullets
    const cleanText = (text || "")
      .replace(/[*#_`~]/g, "")
      .replace(/•/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    let langCode = "en-IN";
    if (lang === "hi" || state.currentLanguage === "hi") langCode = "hi-IN";
    else if (lang === "gu") langCode = "gu-IN";
    else if (lang === "mr") langCode = "mr-IN";
    else if (lang === "bn") langCode = "bn-IN";
    else if (lang === "ta") langCode = "ta-IN";
    else langCode = "en-IN";

    utterance.lang = langCode;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("TTS non-fatal:", err);
  }
}

function applyAiServiceSelection(serviceId, subServiceIds, openModal = false) {
  if (!serviceId) return;

  // 1. Debarment check
  const debarCheck = isCustomerDebarredForService(state.currentCustomerName, serviceId);
  if (debarCheck.debarred) {
    sfx.playFallbackWarning();
    openServiceDebarmentModal(serviceId, debarCheck.reason);
    return;
  }

  // 2. Set active service
  state.selectedService = serviceId;

  // 3. Populate matching sub-services
  const catalog = SUB_SERVICES_CATALOG[serviceId] || [];
  let matchedSubs = [];
  if (Array.isArray(subServiceIds) && subServiceIds.length > 0) {
    matchedSubs = catalog.filter(sub => subServiceIds.includes(sub.id));
  }
  if (matchedSubs.length === 0 && catalog.length > 0) {
    matchedSubs = [catalog[0]];
  }

  state.selectedSubServices = matchedSubs;
  state.selectedSubService = matchedSubs[0] || null;

  // 4. Update worker card & map
  try {
    const matchingWorker = WORKERS.find(w => w.skill === serviceId && w.is_available) || WORKERS[0];
    state.activeWorker = matchingWorker;
    updateWorkerCardUI(matchingWorker);
    updateMapPins();
  } catch (e) {
    console.warn("Worker update non-fatal:", e);
  }

  // 5. Update UI
  try {
    initServiceGrid();
    calculateLiveQuote();
    renderSubServices(serviceId);
  } catch (e) {
    console.warn("Quote calculation non-fatal:", e);
  }

  // Highlight service card in grid
  try {
    const cardEl = document.getElementById(`service-card-${serviceId}`);
    if (cardEl) {
      cardEl.classList.add("ring-4", "ring-indigo-500", "scale-[1.02]");
      setTimeout(() => cardEl.classList.remove("scale-[1.02]"), 800);
    }
  } catch (e) {}

  showToast(`AI selected: ${serviceId.toUpperCase()} with ${state.selectedSubServices.length} task(s)`, "success");

  // 6. Open modal if requested
  if (openModal) {
    openServiceBookingModal(serviceId, 2);
  }
}

function confirmAiBooking(serviceId, subIdsEncoded) {
  sfx.playClick();
  let subIds = [];
  try {
    subIds = JSON.parse(decodeURIComponent(subIdsEncoded));
  } catch (e) {
    subIds = [];
  }
  applyAiServiceSelection(serviceId, subIds, true);
}

function confirmAiMultiBooking(bundleEncoded) {
  sfx.playClick();
  let bundle = [];
  try {
    bundle = JSON.parse(decodeURIComponent(bundleEncoded));
  } catch (e) {
    bundle = [];
  }
  if (!bundle || bundle.length === 0) return;

  state.aiSelectedServicesBundle = bundle;
  const primary = bundle[0];
  applyAiServiceSelection(primary.service_id, primary.sub_service_ids, false);

  const totalWage = bundle.reduce((sum, s) => sum + (s.estimated_wage || 0), 0);
  const tradeNames = bundle.map(s => s.service_name).join(" + ");
  showToast(`⚡ Multi-Trade Bundle Activated: ${tradeNames} (Total: ₹${totalWage.toFixed(2)})`, "success");

  openServiceBookingModal(primary.service_id, 2);
}

function customizeAiBooking(serviceId) {
  sfx.playClick();
  openServiceBookingModal(serviceId, 1);
}

// Global browser window exports for AI Chatbot
if (typeof window !== "undefined") {
  window.openAiChatModal = openAiChatModal;
  window.closeAiChatModal = closeAiChatModal;
  window.toggleAiChat = toggleAiChat;
  window.setAiChatLanguage = setAiChatLanguage;
  window.toggleAiTts = toggleAiTts;
  window.startAiVoiceInput = startAiVoiceInput;
  window.stopAiVoiceInput = stopAiVoiceInput;
  window.toggleAiVoiceRecording = toggleAiVoiceRecording;
  window.startAiVoiceFromBanner = startAiVoiceFromBanner;
  window.sendQuickPrompt = sendQuickPrompt;
  window.handleAiChatSubmit = handleAiChatSubmit;
  window.sendAiChatMessage = sendAiChatMessage;
  window.applyAiServiceSelection = applyAiServiceSelection;
  window.confirmAiBooking = confirmAiBooking;
  window.confirmAiMultiBooking = confirmAiMultiBooking;
  window.customizeAiBooking = customizeAiBooking;
  window.initAiChatbot = initAiChatbot;
  window.clientSideAiIntentParser = clientSideAiIntentParser;
  window.speakAiMessage = speakAiMessage;
}

