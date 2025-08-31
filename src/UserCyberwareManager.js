export class UserCyberwareManager {
    constructor() {
        this.loadout = this.load() || this.defaultLoadout();
    }

    defaultLoadout() {
        return {
            "Frontal Cortex": ["", "", ""],
            "Operating System": [""],
            "Eyes": [""],
            "Circulatory System": ["", "", ""],
            "Immune System": ["", ""],
            "Nervous System": ["", "", ""],
            "Integumentary System": ["", ""],
            "Skeleton": ["", ""],
            "Arms": [""],
            "Hands": [""],
            "Legs": [""]
        };
    }

    save() {
        localStorage.setItem("st-cyberware-loadout", JSON.stringify(this.loadout));
    }

    load() {
        const data = localStorage.getItem("st-cyberware-loadout");
        return data ? JSON.parse(data) : null;
    }

    setSlot(category, index, value) {
        if (this.loadout[category] && this.loadout[category][index] !== undefined) {
            this.loadout[category][index] = value;
            this.save();
        }
    }

    getSlot(category, index) {
        return this.loadout[category] ? this.loadout[category][index] : null;
    }

    getAll() {
        return this.loadout;
    }
}
