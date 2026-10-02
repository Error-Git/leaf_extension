const degrees_slider_input = document.getElementById("degrees-slider");
const degrees_text_input = document.getElementById("degrees-text");
const generate_leaves_toggle = document.getElementById("generate-leaves-toggle");
const leaf_amount_input = document.getElementById("leaf-amount");

function degrees_update_value(value) {
    degrees_slider_input.value = value;
    degrees_text_input.value = value;
    chrome.storage.local.set({ leaf_container_rotation: value });
}

degrees_slider_input.oninput = function () {
    degrees_update_value(this.value);
}

degrees_text_input.oninput = function () {
    degrees_update_value(this.value);
}

leaf_amount_input.oninput = function () {
    chrome.storage.local.set({ leaf_amount: this.value });
}

generate_leaves_toggle.addEventListener("change", () => {
    chrome.storage.local.set({ leaves_enabled: generate_leaves_toggle.checked });
});


chrome.storage.local.get(["leaves_enabled", "leaf_amount", "leaf_container_rotation"], result => {
    if (result.leaves_enabled !== undefined) {
        generate_leaves_toggle.checked = result.leaves_enabled;
    }

    if (result.leaf_amount !== undefined) {
        leaf_amount_input.value = result.leaf_amount;
    }

    if (result.leaf_container_rotation !== undefined) {
        degrees_update_value(result.leaf_container_rotation);
    }
});