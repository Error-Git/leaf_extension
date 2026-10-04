// Constant vars:
const unique_appendix = "8ao97458ht249234ew616"; //used to make sure no duplicate names exist on the loaded page
const leaf_container_id = `leaf-container-${unique_appendix}`;
const leaf_classes = {
    "leaf": `leaf-${unique_appendix}`,
    "leaf_animation": `leaf-animation-${unique_appendix}`,
    "leaf_pixalated": `leaf-pixalated-${unique_appendix}`,
};
const leaf_animation_name = `leaf-animation-${unique_appendix}`;
const leaf_img_pathway = "https://i.postimg.cc/K8pgn0hD/leaf.png";

// Dynamic vars:
let is_generating = false;
let leaf_amount = 20;



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function initialize() {
    // || Leaf container:
    const leaf_container = document.createElement("div");
    leaf_container.id = leaf_container_id;

    const leaf_container_style = document.createElement("style");
    leaf_container_style.textContent = `
        div#${leaf_container_id} {
            position: fixed;
            overflow: hidden;
            pointer-events: none;
            z-index: 999;
        }
    `;

    document.body.appendChild(leaf_container);
    document.body.appendChild(leaf_container_style);
    rescale_and_position_leaf_container();


    // || Leaf img style:
    const leaf_style = document.createElement("style");
    leaf_style.textContent = `
        img.${leaf_classes.leaf} {
            position: absolute;
        }

        img.${leaf_classes.leaf_animation} {
            animation-name: ${leaf_animation_name};
            animation-iteration-count: infinite;
            animation-timing-function: linear;
        }

        img.${leaf_classes.leaf_pixalated} {
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
        }

        @keyframes ${leaf_animation_name} {
            from {
                top: 0;
                transform: translateY(-100%) translateX(-50%) rotate(0deg);
            }

            to {
                top: 100%;
                transform: translateX(-50%) rotate(40deg);
            }
        }
    `;

    document.head.appendChild(leaf_style);

    initialize_from_chrome_storage();
}


function initialize_from_chrome_storage() {
    chrome.storage.local.get(
        ["leaves_enabled", "leaf_amount", "leaf_container_rotation"],
        result => {

            if (result.leaf_amount !== undefined) {
                leaf_amount = Number(result.leaf_amount) || leaf_amount;
            }

            if (result.leaf_container_rotation !== undefined) {
                const leaf_container = document.getElementById(leaf_container_id);
                leaf_container.style.transform = `rotate(${result.leaf_container_rotation}deg)`;
            }

            if (result.leaves_enabled) {
                generate_leaves(leaf_amount);
            }
        });
}


function get_window_hypotenuse() {
    const height = window.innerHeight;
    const width = window.innerWidth;
    const hypotenuse = Math.hypot(height, width);
    return Math.ceil(hypotenuse);
}


function rescale_and_position_leaf_container() {
    const leaf_container = document.getElementById(leaf_container_id);

    const hypotenuse = get_window_hypotenuse();
    leaf_container.style.height = `${hypotenuse}px`;
    leaf_container.style.width = `${hypotenuse}px`;

    const top_alignment = -(Math.ceil(((hypotenuse - window.innerHeight) / 2)));
    const left_alignment = -(Math.ceil(((hypotenuse - window.innerWidth) / 2)));
    leaf_container.style.top = `${top_alignment}px`;
    leaf_container.style.left = `${left_alignment}px`;
}


function generate_leaf(leaf_count, left_alignment, animation_duration) {
    const leaf_id = `leaf-unique-${leaf_count}-${unique_appendix}`

    //HTML:
    const leaf = document.createElement("img");
    leaf.id = leaf_id;
    leaf.classList.add(...Object.values(leaf_classes));
    leaf.src = leaf_img_pathway;
    leaf.alt = "";

    leaf.style.left = `${left_alignment}%`;
    leaf.style.animationDuration = `${animation_duration}s`;
    leaf.style.transform = "translateX(-50%)";

    const leaf_container = document.getElementById(leaf_container_id);
    leaf_container.appendChild(leaf);
}

async function generate_leaves(leaf_amount_par = leaf_amount) {
    is_generating = true;

    for (let i = 1; i <= leaf_amount_par; i++) {
        if (is_generating === false) {
            break;
        }

        const left_alignment = Math.floor(Math.random() * 101);
        const animation_duration = (12 + (Math.random() * 4));
        generate_leaf(i, left_alignment, animation_duration);
        await sleep((animation_duration * 1000) / leaf_amount_par);
    }

    is_generating = false;
}

function remove_leaves() {
    is_generating = false;
    const leaf_container = document.getElementById(leaf_container_id);
    leaf_container.innerHTML = "";
}


initialize();



chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== "local") {
        return;
    }

    if (changes.leaves_enabled) {
        if (changes.leaves_enabled.newValue) {
            generate_leaves(leaf_amount);
        } else {
            remove_leaves();
        }
    }

    if (changes.leaf_amount) {
        leaf_amount = changes.leaf_amount.newValue;

        chrome.storage.local.get("leaves_enabled", result => {
            if (result.leaves_enabled) {
                remove_leaves();
                generate_leaves(leaf_amount);
            }
        });
    }

    if (changes.leaf_container_rotation) {
        const leaf_container = document.getElementById(leaf_container_id);
        leaf_container.style.transform = `rotate(${changes.leaf_container_rotation.newValue}deg)`;
    }
});

window.addEventListener("resize", rescale_and_position_leaf_container);