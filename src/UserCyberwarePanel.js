export class UserCyberwarePanel {
    constructor(manager) {
        this.manager = manager;
        this.panelElement = null;

        // Human-friendly labels
        this.slotLabels = {
            FrontalCortex: "Frontal Cortex",
            OperatingSystem: "Operating System",
            Eyes: "Eyes",
            Arms: "Arms",
            Skeleton: "Skeleton",
            Hands: "Hands",
            NervousSystem: "Nervous System",
            CirculatorySystem: "Circulatory System",
            IntegumentarySystem: "Integumentary System",
            Legs: "Legs"
        };

        // Slots grouped logically
        this.slotGroups = {
            FrontalCortex: ["FrontalCortex1", "FrontalCortex2", "FrontalCortex3"],
            NervousSystem: ["NervousSystem1", "NervousSystem2", "NervousSystem3"],
            CirculatorySystem: ["CirculatorySystem1", "CirculatorySystem2", "CirculatorySystem3"],
            IntegumentarySystem: ["IntegumentarySystem1", "IntegumentarySystem2", "IntegumentarySystem3"],
            Skeleton: ["Skeleton1", "Skeleton2"],
            // Single-slot ones
            OperatingSystem: ["OperatingSystem"],
            Eyes: ["Eyes"],
            Arms: ["Arms"],
            Hands: ["Hands"],
            Legs: ["Legs"]
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

        // Render grouped slots
        for (const [groupName, slots] of Object.entries(this.slotGroups)) {
            const container = document.createElement("div");
            container.className = "cyberware-slot";

            const label = document.createElement("label");
            label.textContent = this.slotLabels[groupName] || groupName;
            container.appendChild(label);

            // If group has >1 slot → dropdown
            if (slots.length > 1) {
                const select = document.createElement("select");

                // Default empty option
                const noneOption = document.createElement("option");
                noneOption.value = "";
                noneOption.textContent = "None";
                select.appendChild(noneOption);

                // Load current installed values
                slots.forEach(slot => {
                    const value = this.manager.getSlot(slot);
                    if (value) {
                        const option = document.createElement("option");
                        option.value = slot;
                        option.textContent = value;
                        if (value === this.manager.getSlot(slot)) {
                            option.selected = true;
                        }
                        select.appendChild(option);
                    }
                });

                // Allow user to type new cyberware via prompt
                select.addEventListener("change", () => {
                    if (select.value === "") {
                        // Remove all slots in this group
                        slots.forEach(s => this.manager.setSlot(s, ""));
                    } else {
                        // User picked an existing slot or adds new
                        const chosenSlot = select.value;
                        const newValue = prompt(`Enter cyberware for ${this.slotLabels[groupName]}:`, this.manager.getSlot(chosenSlot));
                        if (newValue !== null) {
                            this.manager.setSlot(chosenSlot, newValue);
                        }
                    }
                    this.refresh();
                });

                container.appendChild(select);
            } else {
                // Single-slot → input text
                const slot = slots[0];
                const input = document.createElement("input");
                input.type = "text";
                input.value = this.manager.getSlot(slot);
                input.placeholder = "None";
                input.addEventListener("input", () => {
                    this.manager.setSlot(slot, input.value);
                });
                container.appendChild(input);
            }

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

    refresh() {
        if (this.panelElement) {
            this.panelElement.remove();
            this.panelElement = null;
            this.showPanel();
        }
    }

    removePanel() {
        if (this.panelElement) {
            this.panelElement.remove();
            this.panelElement = null;
        }
    }
}
