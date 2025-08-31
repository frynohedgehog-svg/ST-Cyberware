import { UserCyberwareManager } from "./src/UserCyberwareManager.js";
import { UserCyberwarePanel } from "./src/UserCyberwarePanel.js";

let userCyberwareManager;
let userCyberwarePanel;

export function loadExtension() {
    console.log("[ST-Cyberware] Loading Cyberware Manager Extension...");

    userCyberwareManager = new UserCyberwareManager();
    userCyberwarePanel = new UserCyberwarePanel(userCyberwareManager);

    window.registerExtensionCommand("cyberware-user", () => {
        userCyberwarePanel.showPanel();
    });

    console.log("[ST-Cyberware] Commands registered: /cyberware-user");
}

export function unloadExtension() {
    console.log("[ST-Cyberware] Unloading Cyberware Manager Extension...");
    userCyberwarePanel?.removePanel();
}
