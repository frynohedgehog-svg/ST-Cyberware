export class UserCyberwarePanel {
    constructor(manager) {
        this.manager = manager;
        this.panelElement = null;

        this.slotLabels = {
            FrontalCortex1: "Frontal Cortex 1",
            FrontalCortex2: "Frontal Cortex 2",
            FrontalCortex3: "Frontal Cortex 3",
            OperatingSystem: "Operating System",
            Eyes: "Eyes",
            Arms: "Arms",
            Skeleton1: "Skeleton 1",
            Skeleton2: "Skeleton 2",
            Hands: "Hands",
            NervousSystem1: "Nervous System 1",
            NervousSystem2: "Nervous System 2",
            NervousSystem3: "Nervous System 3",
            CirculatorySystem1: "Circulatory System 1",
            CirculatorySystem2: "Circulatory System 2",
            CirculatorySystem3: "Circulatory System 3",
            IntegumentarySystem1: "Integumentary System 1",
            IntegumentarySystem2: "Integumentary System 2",
            IntegumentarySystem3: "Integumentary System 3",
            Legs: "Legs"
        };
    }

    showPanel() {
        if (this.panelElement) {
            this.panelElement.style.display = "block";
            return;
        }

        this.panelElement = document.createElement("div");
        this.panelElement.className = "cyberware-panel";

        const title = document.createElement("h2");
        title.textContent = "Cyberware Loadout (User)";
        this.panelElement.appendChild(title);

        for (const slot of this.manager.defaultSlots) {
            const container = document.createElement("div");
            container.className = "cyberware-slot";

            const label = document.createElement("label");
            label.textContent = this.slotLabels[slot] || slot;

            const input = document.createElement("input");
            input.type = "text";
            input.value = this.manager.getSlot(slot);
            input.addEventListener("input", () => {
                this.manager.setSlot(slot, input.value);
            });

            container.appendChild(label);
            container.appendChild(input);
            this.panelElement.appendChild(container);
        }

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.onclick = () => {
            this.panelElement.style.display = "none";
        };
        this.panelElement.appendChild(closeBtn);

        document.body.appendChild(this.panelElement);
    }

    removePanel() {
        if (this.panelElement) {
            this.panelElement.remove();
            this.panelElement = null;
        }
    }
}
