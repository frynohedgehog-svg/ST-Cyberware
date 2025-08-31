export class UserCyberwareManager {
    constructor() {
        this.defaultSlots = [
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

        this.cyberware = {};
        this.load();
    }

    load() {
        for (const slot of this.defaultSlots) {
            const value = localStorage.getItem(`User_${slot}`) || "";
            this.cyberware[slot] = value;
        }
    }

    save() {
        for (const slot of this.defaultSlots) {
            localStorage.setItem(`User_${slot}`, this.cyberware[slot]);
        }
    }

    setSlot(slot, value) {
        this.cyberware[slot] = value;
        this.save();
    }

    getSlot(slot) {
        return this.cyberware[slot];
    }
}
