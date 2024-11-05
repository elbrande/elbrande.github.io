const divider = document.getElementById("divider");
let isResizing = false;

// Mouse down on the divider to start resizing
divider.addEventListener("mousedown", (e) => {
    console.log("mousedown", e);
    isResizing = true;
    document.body.style.cursor = "row-resize";
});

// Mouse move to resize the panes
document.addEventListener("mousemove", (e) => {
    if (isResizing) {
        console.log("mousemove", e);
        // Get the new width of the left pane (mapPane)
        const container = document.querySelector(".container");
        const containerHeight = container.getBoundingClientRect().height;
        const newHeight = (e.clientY - 69 / containerHeight) * 100;
        console.log("newHeight", newHeight);

        document.getElementById("mapPane").style.flexBasis = `${newHeight}%`;
        document.getElementById("tablePane").style.flexBasis = `${100 - newHeight}%`;
        /*
        const topPane = document.getElementById("mapPane");
        const containerOffsetTop = container.offsetTop;
        const newLeftPaneHeight = e.clientY - containerOffsetTop;

        topPane.style.height = `${newLeftPaneHeight}px`;
        */
    }
});

// Mouse up to stop resizing
document.addEventListener("mouseup", (e) => {
    console.log("mouseup", e);
    isResizing = false;
    document.body.style.cursor = "default";
});
