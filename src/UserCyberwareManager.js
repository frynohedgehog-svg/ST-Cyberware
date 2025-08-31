import { extension_settings } from "../../../../extensions.js";

export class UserCyberwareManager {
    constructor(slots) {
        this.slots = slots || [
            "FrontalCortex1",
            "FrontalCortex2",
            "FrontalCortex3",
            "OperatingSystem",
            "Eyes",
            "Arms",
            "Skeleton1",
            "Skeleton2",
            "Hands",
            "NervousSystem1",
            "NervousSystem2",
            "NervousSystem3",
            "CirculatorySystem1",
            "CirculatorySystem2",
            "CirculatorySystem3",
            "IntegumentarySystem1",
            "IntegumentarySystem2",
            "IntegumentarySystem3",
            "Legs"
        ];

        this.currentValues = {};
        this.slots.forEach(slot => this.currentValues[slot] = "None");
        this.loadCyberware();
    }

    getVarName(slot) {
        return `User_${slot}`;
    }

    loadCyberware() {
        this.slots.forEach(slot => {
            const varName = this.getVarName(slot);
            this.currentValues[slot] = this.getGlobalVariable(varName) || "None";
        });
    }

    initializeCyberware() {
        this.slots.forEach(slot => {
            const varName = this.getVarName(slot);
            if (this.getGlobalVariable(varName) === "None") {
                this.setGlobalVariable(varName, "None");
            }
        });
        this.loadCyberware();
    }

    getGlobalVariable(name) {
        const globalVars = extension_settings.variables?.global || {};
        return globalVars[name] || window[name] || "None";
    }

    setGlobalVariable(name, value) {
        window[name] = value;
        if (!extension_settings.variables) extension_settings.variables = { global: {} };
        extension_settings.variables.global[name] = value;
    }

    async setCyberware(slot, value) {
        const previousValue = this.currentValues[slot];
        const varName = this.getVarName(slot);
        this.setGlobalVariable(varName, value);
        this.currentValues[slot] = value;

        if (previousValue === "None" && value !== "None") {
            return `[Cyberware System] {{user}} installed ${value} in ${slot}.`;
        } else if (value === "None") {
            return `[Cyberware System] {{user}} removed ${previousValue} from ${slot}.`;
        } else {
            return `[Cyberware System] {{user}} replaced ${previousValue} with ${value} in ${slot}.`;
        }
    }

    async changeCyberware(slot) {
        const currentValue = this.currentValues[slot];
        let newValue = currentValue;

        if (currentValue === "None") {
            newValue = prompt(`What cyberware do you want to install in ${slot}?`, "");
            if (!newValue) return null;
        } else {
            const choice = prompt(
                `${slot}: ${currentValue}\n\nEnter 'remove' to uninstall, or type new cyberware:`,
                ""
            );

            if (!choice) return null;
            newValue = choice.toLowerCase() === "remove" ? "None" : choice;
        }

        if (newValue !== currentValue) {
            return this.setCyberware(slot, newValue);
        }
        return null;
    }

    getCyberwareData(slots) {
        return slots.map(slot => ({
            name: slot,
            value: this.currentValues[slot],
            varName: this.getVarName(slot)
        }));
    }

    savePreset(presetName) {
        if (!extension_settings.cyberware_tracker) {
            extension_settings.cyberware_tracker = { presets: { user: {} } };
        }

        const presetData = {};
        this.slots.forEach(slot => {
            presetData[slot] = this.currentValues[slot];
        });

        extension_settings.cyberware_tracker.presets.user[presetName] = presetData;

        return `[Cyberware System] Saved your "${presetName}" cyberware loadout.`;
    }

    async loadPreset(presetName) {
        if (!extension_settings.cyberware_tracker?.presets?.user?.[presetName]) {
            return `[Cyberware System] Loadout "${presetName}" not found.`;
        }

        const preset = extension_settings.cyberware_tracker.presets.user[presetName];
        let changed = false;

        for (const [slot, value] of Object.entries(preset)) {
            if (this.slots.includes(slot) && this.currentValues[slot] !== value) {
                const varName = this.getVarName(slot);
                this.setGlobalVariable(varName, value);
                this.currentValues[slot] = value;
                changed = true;
            }
        }

        if (changed) {
            return `[Cyberware System] You equipped the "${presetName}" loadout.`;
        }

        return `[Cyberware System] You were already using the "${presetName}" loadout.`;
    }

    deletePreset(presetName) {
        if (!extension_settings.cyberware_tracker?.presets?.user?.[presetName]) {
            return `[Cyberware System] Loadout "${presetName}" not found.`;
        }

        delete extension_settings.cyberware_tracker.presets.user[presetName];
        return `[Cyberware System] Deleted your "${presetName}" loadout.`;
    }

    getPresets() {
        if (!extension_settings.cyberware_tracker?.presets?.user) {
            return [];
        }
        return Object.keys(extension_settings.cyberware_tracker.presets.user);
    }
}
