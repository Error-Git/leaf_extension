const animation_Duration = 10;
const leaf_Amount = 15;



function initialize_Leaf_Style_CSS(seed) {

    const original_Leaf_Image_Size = {
        width: 96,
        height: 96
    }
    const leaf_Image_Size_Random_Modifier = Math.floor(Math.random() * 32) - 16
    const leaf_Image_Size = {
        width: original_Leaf_Image_Size.width + leaf_Image_Size_Random_Modifier,
        height: original_Leaf_Image_Size.height + leaf_Image_Size_Random_Modifier
    }

    const dyFrom = -(Math.floor(Math.random() * 50) + 50);
    const dyTo = 100;
    const dxFrom = Math.floor(Math.random() * 140) - 100;
    const dxTo = dxFrom + Math.floor(Math.random() * 30) + 100;

    const randomRotation = Math.floor(Math.random() * 300) - 150

    const animation_Timing_Function_List = [
        "linear",
        "ease",
        "ease-in",
        "ease-out",
        "ease-in-out",
    ]
    // ${animation_timing_function_List[Math.random() * animation_timing_function_List.length | 0]}

    var created_Style_Tag = document.createElement("style");
    created_Style_Tag.textContent = `
    @keyframes falling_Leaf${seed} {
        from {
            top: ${dyFrom}vh;
            left: ${dxFrom}vw;
            transform: rotate(0deg);
        }

        to {
            top: ${dyTo}vh;
            left: ${dxTo}vw;
            transform: rotate(${randomRotation}deg);
        }
    }

    .leaf-img-${seed} {
    transform: rotate(${randomRotation / 2}deg);
        width: ${leaf_Image_Size.width}px;
        height: ${leaf_Image_Size.height}px;
        position: absolute;
        animation-name: falling_Leaf${seed};
        animation-duration: ${animation_Duration + (Math.floor(Math.random() * 2) - 1)}s;
        animation-iteration-count: infinite;
        animation-timing-function: ${animation_Timing_Function_List[0]};
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
    }

    .leaf-container-${seed} {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        pointer-events: none;
        z-index: 999;
    }
    `;

    document.body.appendChild(created_Style_Tag);
}







/*
function create_Random_Leaf(leaf_Number) {



    initialize_Leaf_Style_CSS(leaf_Number);

    const leafHTML = `
            <div class="leaf-container-${leaf_Number}">
                <img class="leaf-img-${leaf_Number}" src="assets/leaf.png" alt="">
            </div>
        `;

    document.body.innerHTML += leafHTML;

}
    */




function create_Random_Leaf(leaf_Number) {
    initialize_Leaf_Style_CSS(leaf_Number);

    const container = document.createElement("div");
    container.className = `leaf-container-${leaf_Number}`;

    const img = document.createElement("img");
    img.className = `leaf-img-${leaf_Number}`;
    img.src = "https://i.postimg.cc/K8pgn0hD/leaf.png";
    img.alt = "";

    container.appendChild(img);
    document.body.appendChild(container);
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function generate_Leaves(leaf_count) {

    for (let i = 0; i < leaf_count; i++) {
        create_Random_Leaf(i);
        await sleep((animation_Duration * 1000) / leaf_count);
    }
}

generate_Leaves(leaf_Amount);