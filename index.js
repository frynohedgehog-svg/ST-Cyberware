import { getContext, extension_settings } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";

console.log("[CyberwareManager] Starting extension loading...");

async function initializeExtension() {
    const MODULE_NAME = 'cyberware_manager';

    // Cyberpunk 2077 cyberware slots
    const CYBERWARE_SLOTS = [
        'FrontalCortex1',
        'FrontalCortex2',
        'FrontalCortex3',
        'OperatingSystem',
        'Eyes',
        'Arms',
        'Skeleton1',
        'Skeleton2',
        'Hands',
        'NervousSystem1',
        'NervousSystem2',
        'NervousSystem3',
        'CirculatorySystem1',
        'CirculatorySystem2',
        'CirculatorySystem3',
        'IntegumentarySystem1',
        'IntegumentarySystem2',
        'IntegumentarySystem3',
        'Legs'
    ];

    // Load bot + user managers/panels
    const { BotCyberwareManager } = await import("./src/BotCyberwareManager.js");
    const { BotCyberwarePanel } = await import("./src/BotCyberwarePanel.js");
    const { UserCyberwareManager } = await import("./src/UserCyberwareManager.js");
    const { UserCyberwarePanel } = await import("./src/UserCyberwarePanel.js");
    
    const botManager = new BotCyberwareManager(CYBERWARE_SLOTS);
    const userManager = new UserCyberwareManager(CYBERWARE_SLOTS);

    const botPanel = new BotCyberwarePanel(botManager, CYBERWARE_SLOTS, saveSettingsDebounced);
    const userPanel = new UserCyberwarePanel(userManager, CYBERWARE_SLOTS, saveSettingsDebounced);

    // Make accessible globally
    window.botCyberwarePanel = botPanel;
    window.userCyberwarePanel = userPanel;

    // Slash commands
    function registerCyberwareCommands() {
        const { registerSlashCommand } = SillyTavern.getContext();

        registerSlashCommand('cyberware-bot', (...args) => {
            console.log("Bot Cyberware command triggered");
            botPanel.toggle();
        }, [], 'Toggle character cyberware tracker', true, true);
        
        registerSlashCommand('cyberware-user', (...args) => {
            console.log("User Cyberware command triggered");
            userPanel.toggle();
        }, [], 'Toggle user cyberware tracker', true, true);
    }

    // Refresh when chat/character changes
    function updateForCurrentCharacter() {
        const context = getContext();
        const charName = context.characters[context.characterId]?.name || 'Unknown';
        botManager.setCharacter(charName);
        botPanel.updateCharacter(charName);
    }

    function setupEventListeners() {
        const context = getContext();
        const { eventSource, event_types } = context;
        eventSource.on(event_types.CHAT_CHANGED, updateForCurrentCharacter);
        eventSource.on(event_types.CHARACTER_CHANGED, updateForCurrentCharacter);
    }

    // Settings
    function initSettings() {
        if (!extension_settings[MODULE_NAME]) {
            extension_settings[MODULE_NAME] = {
                autoOpenBot: true,
                autoOpenUser: false,
                enableSysMessages: true,
                presets: {
                    bot: {},
                    user: {}
                }
            };
        }
    }

    function createSettingsUI() {
        const settingsHtml = `
        <div class="cyberware-extension-settings">
            <div class="inline-drawer">
                <div class="inline-drawer-toggle inline-drawer-header">
                    <b>Cyberware Manager Settings</b>
                    <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                </div>
                <div class="inline-drawer-content">
                    <div class="flex-container">
                        <label for="cyberware-sys-toggle">Enable system messages</label>
                        <input type="checkbox" id="cyberware-sys-toggle"
                            ${extension_settings[MODULE_NAME].enableSysMessages ? 'checked' : ''}>
                    </div>
                    <div class="flex-container">
                        <label for="cyberware-auto-bot">Auto-open character panel</label>
                        <input type="checkbox" id="cyberware-auto-bot"
                            ${extension_settings[MODULE_NAME].autoOpenBot ? 'checked' : ''}>
                    </div>
                    <div class="flex-container">
                        <label for="cyberware-auto-user">Auto-open user panel</label>
                        <input type="checkbox" id="cyberware-auto-user"
                            ${extension_settings[MODULE_NAME].autoOpenUser ? 'checked' : ''}>
                    </div>
                </div>
            </div>
        </div>
        `;

        $("#extensions_settings").append(settingsHtml);

        $("#cyberware-sys-toggle").on("input", function() {
            extension_settings[MODULE_NAME].enableSysMessages = $(this).prop('checked');
            saveSettingsDebounced();
        });
        
        $("#cyberware-auto-bot").on("input", function() {
            extension_settings[MODULE_NAME].autoOpenBot = $(this).prop('checked');
            saveSettingsDebounced();
        });
        
        $("#cyberware-auto-user").on("input", function() {
            extension_settings[MODULE_NAME].autoOpenUser = $(this).prop('checked');
            saveSettingsDebounced();
        });
    }

    // Init
    initSettings();
    registerCyberwareCommands();
    setupEventListeners();
    updateForCurrentCharacter();
    createSettingsUI();

    if (extension_settings[MODULE_NAME].autoOpenBot) {
        setTimeout(() => botPanel.show(), 1000);
    }
    if (extension_settings[MODULE_NAME].autoOpenUser) {
        setTimeout(() => userPanel.show(), 1000);
    }
}

$(async () => {
    try {
        await initializeExtension();
        console.log("[CyberwareManager] Extension loaded successfully");
    } catch (error) {
        console.error("[CyberwareManager] Initialization failed", error);
    }
});
