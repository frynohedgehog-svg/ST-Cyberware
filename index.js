import { SillyTavern } from '/scripts/extensions.js';

let context;
let cyberwareSlots = {};

// Define your cyberware slot categories
const CYBERWARE_SLOTS = {
    "Frontal Cortex": ["Slot 1", "Slot 2", "Slot 3"],
    "Operating System": ["Slot 1"],
    "Eyes": ["Slot 1"],
    "Arms": ["Slot 1"],
    "Nervous System": ["Slot 1", "Slot 2"],
    "Integumentary System": ["Slot 1", "Slot 2", "Slot 3"],
    "Skeleton": ["Slot 1", "Slot 2"],
    "Circulatory System": ["Slot 1", "Slot 2", "Slot 3"],
    "Hands": ["Slot 1"],
    "Legs": ["Slot 1"]
};

// Load data from character card
async function loadCyberware(characterId) {
    cyberwareSlots = await SillyTavern.readExtensionField(characterId, "cyberware_loadout") || {};
    renderCyberwarePanel();
}

// Save data into character card
async function saveCyberware(characterId) {
    await SillyTavern.writeExtensionField(characterId, "cyberware_loadout", cyberwareSlots);
}

// Create the cyberware panel
function renderCyberwarePanel() {
    const container = document.getElementById("cyberware-panel");
    if (!container) return;
    container.innerHTML = "";

    for (const [category, slots] of Object.entries(CYBERWARE_SLOTS)) {
        const section = document.createElement("div");
        section.className = "cyberware-section";

        const header = document.createElement("h3");
        header.textContent = category;
        section.appendChild(header);

        slots.forEach((slot, idx) => {
            const slotDiv = document.createElement("div");
            slotDiv.className = "cyberware-slot";

            const label = document.createElement("label");
            label.textContent = slot;
            slotDiv.appendChild(label);

            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Enter cyberware";
            input.value = cyberwareSlots[`${category}-${idx}`] || "";
            input.addEventListener("change", async () => {
                cyberwareSlots[`${category}-${idx}`] = input.value;
                await saveCyberware(SillyTavern.getSelectedCharacterId());
            });

            slotDiv.appendChild(input);
            section.appendChild(slotDiv);
        });

        container.appendChild(section);
    }
}

// Macro for lorebook / templates
function registerMacro() {
    SillyTavern.registerMacro("cyberware", () => {
        return JSON.stringify(cyberwareSlots, null, 2);
    });
}

// Prompt interceptor to inject cyberware into context
globalThis.cyberwareInterceptor = async function (chat, contextSize, abort, type) {
    const characterId = SillyTavern.getSelectedCharacterId();
    const loadout = await SillyTavern.readExtensionField(characterId, "cyberware_loadout") || {};

    const systemNote = {
        is_user: false,
        name: "Cyberware System",
        send_date: Date.now(),
        mes: `User cyberware loadout:\n${JSON.stringify(loadout, null, 2)}`
    };

    // Insert system note just before the last user message
    chat.splice(chat.length - 1, 0, systemNote);
};

// Bootstrapping the extension
export async function init() {
    context = SillyTavern.getContext();

    // Add cyberware panel into extensions tab
    const tab = document.createElement("div");
    tab.className = "cyberware-container";

    const panel = document.createElement("div");
    panel.id = "cyberware-panel";
    tab.appendChild(panel);

    context.ui.extensions.addTab("Cyberware Loadout", tab);

    // Load data when character changes
    SillyTavern.onCharacterSelected(async (id) => {
        await loadCyberware(id);
    });

    registerMacro();
}
