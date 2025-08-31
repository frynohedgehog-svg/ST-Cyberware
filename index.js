import { registerExtension } from "../../../extensions.js";
import { UserCyberwarePanel } from "./src/UserCyberwarePanel.js";
import { UserCyberwareManager } from "./src/UserCyberwareManager.js";

let manager;

registerExtension({
    id: "st-cyberware",
    name: "Cyberware Manager",
    description: "Track your cyberware loadout.",
    setup() {
        manager = new UserCyberwareManager();
        new UserCyberwarePanel(manager);
    }
});
