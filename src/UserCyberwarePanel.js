export class UserCyberwarePanel {
    constructor(manager) {
        this.manager = manager;
        this.render();
    }

    render() {
        const container = document.createElement("div");
        container.id = "cyberware-panel";
        container.classList.add("cyberware-container");

        const loadout = this.manager.getAll();

        for (const category in loadout) {
            const section = document.createElement("div");
            section.classList.add("cyberware-section");

            const title = document.createElement("h3");
            title.innerText = category;
            section.appendChild(title);

            loadout[category].forEach((value, i) => {
                const input = document.createElement("input");
                input.type = "text";
                input.placeholder = `${category} ${i + 1}`;
                input.value = value;
                input.addEventListener("change", () => {
                    this.manager.setSlot(category, i, input.value);
                });
                section.appendChild(input);
            });

            container.appendChild(section);
        }

        // attach to SillyTavern’s tab system
        const tab = document.createElement("div");
        tab.id = "st-cyberware-tab";
        tab.classList.add("tab-content");
        tab.appendChild(container);

        document.querySelector("#extensions_tabs").appendChild(tab);

        // create tab button
        const button = document.createElement("button");
        button.innerText = "Cyberware";
        button.classList.add("tab-button");
        button.onclick = () => this.showTab();
        document.querySelector("#extensions_tabbar").appendChild(button);
    }

    showTab() {
        document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
        document.querySelector("#st-cyberware-tab").style.display = "block";
    }
}
