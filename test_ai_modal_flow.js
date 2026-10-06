const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

console.log("=== Testing End-to-End AI Chatbot Pop-up Modal & Talk Flow ===");

const html = fs.readFileSync('frontend/index.html', 'utf8');
const appJs = fs.readFileSync('frontend/app.js', 'utf8');

// 1. Verify index.html contains necessary modal DOM structures
assert(html.includes('id="modal-ai-chatbot"'), "Pop-up modal container must exist");
assert(html.includes('id="ai-banner-open-btn"'), "Banner open button must exist");
assert(html.includes('id="ai-hero-talk-btn"'), "Hero talk voice button must exist");
assert(html.includes('id="ai-modal-close-btn"'), "Modal close button must exist");

console.log("✓ DOM Markup Verification Passed");

// 2. Setup mock DOM environment to simulate browser execution
class MockClassList {
  constructor() {
    this.classes = new Set();
  }
  add(...names) { names.forEach(n => this.classes.add(n)); }
  remove(...names) { names.forEach(n => this.classes.delete(n)); }
  contains(name) { return this.classes.has(name); }
}

class MockElement {
  constructor(id, tag = 'div') {
    this.id = id;
    this.tagName = tag.toUpperCase();
    this.classList = new MockClassList();
    this.style = {};
    this.children = [];
    this.value = '';
    this.innerHTML = '';
    this.innerText = '';
    this._listeners = {};
  }
  addEventListener(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
  }
  dispatchEvent(event) {
    const list = this._listeners[event.type] || [];
    list.forEach(fn => fn(event));
  }
  focus() { this.focused = true; }
  appendChild(child) { this.children.push(child); child.parentElement = this; }
  insertAdjacentHTML(pos, text) { this.innerHTML += text; }
}

const mockDocument = {
  elements: {},
  body: new MockElement('body'),
  getElementById(id) {
    if (!this.elements[id]) {
      this.elements[id] = new MockElement(id);
    }
    return this.elements[id];
  },
  addEventListener(event, fn) {
    if (!this._listeners) this._listeners = {};
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
  },
  triggerKey(key) {
    const list = (this._listeners && this._listeners['keydown']) || [];
    list.forEach(fn => fn({ key }));
  }
};

// Seed modal element as hidden
const modalEl = mockDocument.getElementById("modal-ai-chatbot");
modalEl.classList.add("hidden");
modalEl.style.display = "none";

// Extract functions from app.js into sandbox
const sandbox = {
  document: mockDocument,
  window: {
    speechSynthesis: {
      cancel: () => {},
      speak: () => {}
    }
  },
  state: {
    currentLanguage: "en",
    aiChatLanguage: "auto",
    aiChatMessages: [],
    aiChatOpen: false,
    selectedService: null,
    selectedSubServices: [],
    currentCustomerName: "Aarav Mehta"
  },
  sfx: { playClick: () => {} },
  safeCreateIcons: () => {},
  showToast: (msg) => { console.log(`  [Toast] ${msg}`); },
  console: console,
  setTimeout: (fn) => fn()
};

vm.createContext(sandbox);

// Load app.js core functions
const catalogMatch = appJs.match(/const SUB_SERVICES_CATALOG = (\{[\s\S]*?\n\};)/);
assert(catalogMatch, "SUB_SERVICES_CATALOG extracted");
vm.runInContext("const SUB_SERVICES_CATALOG = " + catalogMatch[1].replace(/const SUB_SERVICES_CATALOG = /, ''), sandbox);

vm.runInContext(`
const SERVICES = [
  { id: "plumber", name: "Plumber", name_hi: "प्लम्बर", badge: "Coop Verified" },
  { id: "electrician", name: "Electrician", name_hi: "इलेक्ट्रीशियन", badge: "Coop Verified" }
];

function isCustomerDebarredForService() { return { debarred: false }; }
function updateWorkerCardUI() {}
function updateMapPins() {}
function initServiceGrid() {}
function calculateLiveQuote() {}
function renderSubServices() {}
function openServiceBookingModal(s, step) {
  state.bookingModalOpened = { service: s, step: step };
}
function scrollAiMessagesToBottom() {}
function stopAiVoiceInput() {}
function startAiVoiceInput() {}
`, sandbox);

// Extract parser, open, close, and toggle functions
const parserSnippet = appJs.substring(
  appJs.indexOf("function clientSideAiIntentParser(userText) {"),
  appJs.indexOf("function renderAiMessageBubble(")
);
vm.runInContext(parserSnippet, sandbox);

const openCloseSnippet = appJs.substring(
  appJs.indexOf("function initAiChatbot() {"),
  appJs.indexOf("function setAiChatLanguage(lang) {")
);
vm.runInContext(openCloseSnippet, sandbox);

// 3. Test openAiChatModal(false) -> opens modal
console.log("-> Testing openAiChatModal(false)...");
sandbox.openAiChatModal(false);
assert.strictEqual(modalEl.classList.contains("hidden"), false, "Modal must not have 'hidden' class after open");
assert.strictEqual(modalEl.style.display, "flex", "Modal display must be 'flex'");
assert.strictEqual(sandbox.state.aiChatOpen, true, "State aiChatOpen must be true");
console.log("✓ openAiChatModal(false) successfully displays centered pop-up modal!");

// 4. Test closeAiChatModal() -> closes modal
console.log("-> Testing closeAiChatModal()...");
sandbox.closeAiChatModal();
assert.strictEqual(modalEl.classList.contains("hidden"), true, "Modal must have 'hidden' class after close");
assert.strictEqual(modalEl.style.display, "none", "Modal display must be 'none'");
assert.strictEqual(sandbox.state.aiChatOpen, false, "State aiChatOpen must be false");
console.log("✓ closeAiChatModal() successfully hides pop-up modal!");

// 5. Test toggleAiChat() -> opens when closed
console.log("-> Testing toggleAiChat()...");
sandbox.toggleAiChat();
assert.strictEqual(modalEl.style.display, "flex", "toggleAiChat must open closed modal");
sandbox.toggleAiChat();
assert.strictEqual(modalEl.style.display, "none", "toggleAiChat must close opened modal");
console.log("✓ toggleAiChat() toggles modal state accurately!");

// 6. Test NLP auto selection for customer requirement
console.log("-> Testing auto-selection for 'I have water leaking'...");
const nlpRes = sandbox.clientSideAiIntentParser("I have water leaking");
assert.strictEqual(nlpRes.service_id, "plumber");
assert(nlpRes.sub_service_ids.includes("tap_pipe_leakage"));
console.log(`✓ AI Auto-Selected: Trade = ${nlpRes.service_id}, SubService = ${nlpRes.sub_service_ids[0]}`);

console.log("\n=======================================================");
console.log(" ALL POP-UP MODAL & VOICE FLOW TESTS PASSED (100%)!   ");
console.log("=======================================================");
