const toggle = document.getElementById("toggleLeaves");

chrome.storage.local.get(["leavesEnabled"], (result) => {
    toggle.checked = result.leavesEnabled !== false;
});

toggle.addEventListener("change", () => {
    chrome.storage.local.set({ leavesEnabled: toggle.checked });
});