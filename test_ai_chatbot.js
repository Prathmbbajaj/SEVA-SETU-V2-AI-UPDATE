const fs = require('fs');
const assert = require('assert');

console.log("=== Testing Seva Setu Multilingual AI Chatbot & Voice Assistant ===");

// 1. Verify index.html UI markup
const html = fs.readFileSync('frontend/index.html', 'utf8');

// Banner
assert(html.includes('id="ai-banner-heading"'), "ai-banner-heading must exist in index.html");
assert(html.includes('startAiVoiceFromBanner()'), "startAiVoiceFromBanner must be wired");

// Launcher & Window
assert(html.includes('id="ai-chat-launcher-container"'), "ai-chat-launcher-container must exist");
assert(html.includes('id="ai-chat-toggle-btn"'), "ai-chat-toggle-btn must exist");
assert(html.includes('id="ai-chat-window"'), "ai-chat-window must exist");
assert(html.includes('id="ai-lang-select"'), "ai-lang-select must exist");
assert(html.includes('id="ai-tts-toggle-btn"'), "ai-tts-toggle-btn must exist");
assert(html.includes('id="ai-chat-messages"'), "ai-chat-messages must exist");
assert(html.includes('id="ai-voice-listening-bar"'), "ai-voice-listening-bar must exist");
assert(html.includes('id="ai-quick-prompts-bar"'), "ai-quick-prompts-bar must exist");
assert(html.includes('id="ai-chat-form"'), "ai-chat-form must exist");
assert(html.includes('id="ai-mic-btn"'), "ai-mic-btn must exist");
assert(html.includes('id="ai-chat-input"'), "ai-chat-input must exist");
assert(html.includes('id="ai-send-btn"'), "ai-send-btn must exist");

// Pop-up Modal & Hero Talk Bar
assert(html.includes('id="modal-ai-chatbot"'), "modal-ai-chatbot backdrop modal must exist");
assert(html.includes('id="ai-hero-talk-btn"'), "ai-hero-talk-btn must exist for instant voice talking");
assert(html.includes('id="ai-modal-close-btn"'), "ai-modal-close-btn must exist");
assert(html.includes('openAiChatModal(false)'), "openAiChatModal must be wired on Open AI Chatbot");

console.log("✓ Test 1: HTML DOM elements, modal pop-up, controls, and accessibility verified");

// 2. Verify style.css animations and classes
const css = fs.readFileSync('frontend/style.css', 'utf8');
assert(css.includes('@keyframes wave-bounce-1'), "wave-bounce-1 animation must exist in style.css");
assert(css.includes('.animate-wave1'), ".animate-wave1 class must exist");
assert(css.includes('#ai-chat-window.open'), "#ai-chat-window.open class must exist in style.css");
assert(css.includes('#modal-ai-chatbot:not(.hidden)'), "#modal-ai-chatbot:not(.hidden) class must exist in style.css");

console.log("✓ Test 2: Soundwave and expandable modal CSS animations verified");

// 3. Verify app.js function signatures & window exports
const appJs = fs.readFileSync('frontend/app.js', 'utf8');
assert(appJs.includes('function initAiChatbot()'), "initAiChatbot must be defined");
assert(appJs.includes('function openAiChatModal('), "openAiChatModal must be defined");
assert(appJs.includes('function closeAiChatModal()'), "closeAiChatModal must be defined");
assert(appJs.includes('function toggleAiChat('), "toggleAiChat must be defined");
assert(appJs.includes('function setAiChatLanguage('), "setAiChatLanguage must be defined");
assert(appJs.includes('function toggleAiTts()'), "toggleAiTts must be defined");
assert(appJs.includes('function startAiVoiceInput()'), "startAiVoiceInput must be defined");
assert(appJs.includes('function stopAiVoiceInput()'), "stopAiVoiceInput must be defined");
assert(appJs.includes('function sendAiChatMessage('), "sendAiChatMessage must be defined");
assert(appJs.includes('function applyAiServiceSelection('), "applyAiServiceSelection must be defined");
assert(appJs.includes('function confirmAiBooking('), "confirmAiBooking must be defined");
assert(appJs.includes('function confirmAiMultiBooking('), "confirmAiMultiBooking must be defined");
assert(appJs.includes('function clientSideAiIntentParser('), "clientSideAiIntentParser must be defined");
assert(appJs.includes('safeInit("ai chatbot", initAiChatbot)'), "initAiChatbot must be called in DOMContentLoaded");
assert(appJs.includes('window.openAiChatModal = openAiChatModal;'), "openAiChatModal must be exported on window");
assert(appJs.includes('window.closeAiChatModal = closeAiChatModal;'), "closeAiChatModal must be exported on window");
assert(appJs.includes('window.confirmAiMultiBooking = confirmAiMultiBooking;'), "confirmAiMultiBooking must be exported on window");

console.log("✓ Test 3: JavaScript function declarations and exports verified");

// 4. Test client-side NLP parser logic in simulated runtime environment
const mockState = {
  currentLanguage: "en",
  aiChatLanguage: "auto"
};

// Extract SUB_SERVICES_CATALOG and clientSideAiIntentParser for isolated testing
// Execute minimal mock
const catalogMatch = appJs.match(/const SUB_SERVICES_CATALOG = (\{[\s\S]*?\n\};)/);
assert(catalogMatch, "SUB_SERVICES_CATALOG must be parseable");

// Build test sandbox
const vm = require('vm');
const sandbox = {
  state: mockState,
  SERVICES: [
    { id: "plumber", name: "Plumber", name_hi: "प्लम्बर सेवा" },
    { id: "electrician", name: "Electrician", name_hi: "इलेक्ट्रीशियन" },
    { id: "carpentry", name: "Carpentry & Woodcraft", name_hi: "बढ़ईगीरी एवं काष्ठकला" },
    { id: "cleaning", name: "Deep Cleaning", name_hi: "गहन सफाई सेवा" },
    { id: "tailoring", name: "Tailoring & Handloom Repair", name_hi: "दर्जी एवं हथकरघा शिल्प" },
    { id: "driver", name: "Emergency Driver", name_hi: "आपातकालीन चालक" },
    { id: "painting", name: "Painting & Wall Artisan", name_hi: "रंग रोगन एवं पेंटिंग कारीगर" },
    { id: "pottery", name: "Clay Pottery & Terracotta", name_hi: "माटी कला एवं कुम्हार शिल्प" },
    { id: "blacksmith", name: "Blacksmith & Iron Craft", name_hi: "लोहार कला एवं धातु शिल्प" }
  ],
  SUB_SERVICES_CATALOG: null,
  console: console
};

vm.createContext(sandbox);
vm.runInContext("SUB_SERVICES_CATALOG = " + catalogMatch[1].replace(/const SUB_SERVICES_CATALOG = /, ''), sandbox);

// Extract clientSideAiIntentParser implementation
const parserCode = appJs.substring(
  appJs.indexOf("function clientSideAiIntentParser(userText) {"),
  appJs.indexOf("function renderAiMessageBubble(")
);
vm.runInContext(parserCode, sandbox);

// Test Case 4A: "I have water leaking" -> plumber + tap_pipe_leakage
const res1 = sandbox.clientSideAiIntentParser("I have water leaking");
assert.strictEqual(res1.service_id, "plumber", "Expected 'plumber' for water leaking");
assert(res1.sub_service_ids.includes("tap_pipe_leakage"), "Expected 'tap_pipe_leakage' sub-service");
console.log(`✓ Test 4A: 'I have water leaking' -> Service: ${res1.service_id}, SubService: ${res1.sub_service_ids[0]} (PASSED)`);

// Test Case 4B: Hindi "नल से पानी टपक रहा है" -> plumber + tap_pipe_leakage
const res2 = sandbox.clientSideAiIntentParser("नल से पानी टपक रहा है");
assert.strictEqual(res2.service_id, "plumber");
assert(res2.sub_service_ids.includes("tap_pipe_leakage"));
console.log(`✓ Test 4B: Hindi 'नल से पानी टपक रहा है' -> Service: ${res2.service_id}, SubService: ${res2.sub_service_ids[0]} (PASSED)`);

// Test Case 4C: "Ceiling fan capacitor broken" -> electrician + fan_installation
const res3 = sandbox.clientSideAiIntentParser("Ceiling fan capacitor broken");
assert.strictEqual(res3.service_id, "electrician");
assert(res3.sub_service_ids.includes("fan_installation"));
console.log(`✓ Test 4C: 'Ceiling fan capacitor broken' -> Service: ${res3.service_id}, SubService: ${res3.sub_service_ids[0]} (PASSED)`);

// Test Case 4D: "Kitchen chimney and sofa carpet wash" -> cleaning + [kitchen_deep_clean, sofa_carpet_wash]
const res4 = sandbox.clientSideAiIntentParser("Kitchen chimney and sofa carpet wash");
assert.strictEqual(res4.service_id, "cleaning");
assert(res4.sub_service_ids.includes("kitchen_deep_clean"));
assert(res4.sub_service_ids.includes("sofa_carpet_wash"));
console.log(`✓ Test 4D: Multi-subservice cleaning -> Service: ${res4.service_id}, SubServices: ${res4.sub_service_ids.join(', ')} (PASSED)`);

// Test Case 4E: "Need driver for early morning airport pickup" -> driver + airport_station_transfer
const res5 = sandbox.clientSideAiIntentParser("Need driver for early morning airport pickup");
assert.strictEqual(res5.service_id, "driver");
assert(res5.sub_service_ids.includes("airport_station_transfer"));
console.log(`✓ Test 4E: 'Need driver for airport pickup' -> Service: ${res5.service_id}, SubService: ${res5.sub_service_ids[0]} (PASSED)`);

// Test Case 4F: "Door lock jammed" -> carpentry + door_lock_hinge
const res6 = sandbox.clientSideAiIntentParser("Door lock jammed");
assert.strictEqual(res6.service_id, "carpentry");
assert(res6.sub_service_ids.includes("door_lock_hinge"));
console.log(`✓ Test 4F: 'Door lock jammed' -> Service: ${res6.service_id}, SubService: ${res6.sub_service_ids[0]} (PASSED)`);

// Test Case 4G: Multi-Service (Plumber + Electrician): "I have water leaking from the pipe and my ceiling fan is broken"
const res7 = sandbox.clientSideAiIntentParser("I have water leaking from the pipe and my ceiling fan is broken");
assert.strictEqual(res7.is_multi_service, true, "Expected is_multi_service to be true");
assert(Array.isArray(res7.services) && res7.services.length >= 2, "Expected at least 2 services bundled");
const tradeIds7 = res7.services.map(s => s.service_id);
assert(tradeIds7.includes("plumber"), "Bundle must include plumber");
assert(tradeIds7.includes("electrician"), "Bundle must include electrician");
const pTrade7 = res7.services.find(s => s.service_id === "plumber");
const eTrade7 = res7.services.find(s => s.service_id === "electrician");
assert(pTrade7.sub_service_ids.includes("tap_pipe_leakage"), "Plumber must have tap_pipe_leakage");
assert(eTrade7.sub_service_ids.includes("fan_installation"), "Electrician must have fan_installation");
console.log(`✓ Test 4G: Multi-Service Combo: Plumber (${pTrade7.sub_service_ids}) + Electrician (${eTrade7.sub_service_ids}) -> Total: ₹${res7.estimated_wage} (PASSED)`);

// Test Case 4H: Hindi Multi-Service: "नल से पानी टपक रहा है और पंखा भी खराब है"
const res8 = sandbox.clientSideAiIntentParser("नल से पानी टपक रहा है और पंखा भी खराब है");
assert.strictEqual(res8.is_multi_service, true, "Expected is_multi_service to be true for Hindi input");
const tradeIds8 = res8.services.map(s => s.service_id);
assert(tradeIds8.includes("plumber") && tradeIds8.includes("electrician"), "Expected plumber and electrician in Hindi multi-service bundle");
console.log(`✓ Test 4H: Hindi Multi-Service 'नल से पानी टपक रहा है और पंखा भी खराब है' -> Trades: ${tradeIds8.join(" + ")} (PASSED)`);

// Test Case 4I: 3-Service Bundle: "Kitchen chimney degreasing, fix wooden door lock, and water leaking tap"
const res9 = sandbox.clientSideAiIntentParser("Kitchen chimney degreasing, fix wooden door lock, and water leaking tap");
assert.strictEqual(res9.is_multi_service, true);
assert(res9.services.length >= 3, `Expected at least 3 services, got ${res9.services.length}`);
const tradeIds9 = res9.services.map(s => s.service_id);
assert(tradeIds9.includes("cleaning"), "Expected cleaning");
assert(tradeIds9.includes("carpentry"), "Expected carpentry");
assert(tradeIds9.includes("plumber"), "Expected plumber");
const clSub9 = res9.services.find(s => s.service_id === "cleaning").sub_service_ids;
const caSub9 = res9.services.find(s => s.service_id === "carpentry").sub_service_ids;
const plSub9 = res9.services.find(s => s.service_id === "plumber").sub_service_ids;
assert(clSub9.includes("kitchen_deep_clean"), "Expected kitchen_deep_clean in cleaning");
assert(caSub9.includes("door_lock_hinge"), "Expected door_lock_hinge in carpentry");
assert(plSub9.includes("tap_pipe_leakage"), "Expected tap_pipe_leakage in plumber");
console.log(`✓ Test 4I: 3-Trade Multi-Service: Cleaning (${clSub9}) + Carpentry (${caSub9}) + Plumber (${plSub9}) -> Total: ₹${res9.estimated_wage} (PASSED)`);

// Test Case 4J: Traditional Artisan Multi-Service (Pottery + Blacksmith): "Need clay diyas for diwali and iron gate welding"
const res10 = sandbox.clientSideAiIntentParser("Need clay diyas for diwali and iron gate welding");
assert.strictEqual(res10.is_multi_service, true);
const tradeIds10 = res10.services.map(s => s.service_id);
assert(tradeIds10.includes("pottery"), "Expected pottery");
assert(tradeIds10.includes("blacksmith"), "Expected blacksmith");
const potSub10 = res10.services.find(s => s.service_id === "pottery").sub_service_ids;
const blkSub10 = res10.services.find(s => s.service_id === "blacksmith").sub_service_ids;
assert(potSub10.includes("clay_diyas_festival"), "Expected clay_diyas_festival");
assert(blkSub10.includes("gate_grill_welding"), "Expected gate_grill_welding");
console.log(`✓ Test 4J: Artisan Multi-Service: Pottery (${potSub10}) + Blacksmith (${blkSub10}) -> Total: ₹${res10.estimated_wage} (PASSED)`);

console.log("\n=======================================================");
console.log(" ALL MULTILINGUAL AI CHATBOT JAVASCRIPT TESTS PASSED! ");
console.log("=======================================================");
