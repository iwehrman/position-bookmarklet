/*jslint devel: true*/

(function () {
    "use strict";

    var showRects = true;

    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

    function addClientRectsOverlay(elt) {
        // Absolutely position a div over each client rect so that its border width
        // is the same as the rectangle's width.
        // Note: the overlays will be out of place if the user resizes or zooms.
        var rects = elt.getClientRects(),
            rect;
        for (var i = 0; i != rects.length; i++) {
            rect = rects[i];
            var tableRectDiv = document.createElement('div');
            tableRectDiv.style.position = 'absolute';
            tableRectDiv.style.border = '1px solid red';
            tableRectDiv.style.margin = tableRectDiv.style.padding = '0';
            tableRectDiv.style.top = (rect.top + scrollTop) + 'px';
            tableRectDiv.style.left = (rect.left + scrollLeft) + 'px';
            // we want rect.width to be the border width, so content width is 2px less.
            tableRectDiv.style.width = (rect.width - 2) + 'px';
            tableRectDiv.style.height = (rect.height - 2) + 'px';
            document.body.appendChild(tableRectDiv);
        }
    }

    var printPositions = function (elt, list) {
        var tag = elt.tagName,
            id = (elt.id ? "#" + elt.id : ""),
            classList = elt.className.split(" ").filter(function (c) { return !!c; }),
            classes = classList.length > 0 ? "." + classList.join(".") : "",
            name = tag + id + classes;

        var item = document.createElement("li"),
            container = document.createElement("ul"),
            itemName = document.createElement("li"),
            itemRectsCount = document.createElement("li"),
            itemRectsContainer = document.createElement("li"),
            itemRectsList = document.createElement("ol"),
            itemChildrenCount = document.createElement("li"),
            itemChildrenContainer = document.createElement("li"),
            itemChildrenList = document.createElement("ol");

        itemName.innerText = "Name: " + name;
        container.appendChild(itemName);
        item.appendChild(container);
        list.appendChild(item);

        var rects = elt.getClientRects(),
            rectElt;

        if (rects.length > 0) {
            for (var j = 0; j < rects.length; j++) {
                rectElt = document.createElement("li");
                rectElt.innerText = JSON.stringify(rects[j]);
                itemRectsList.appendChild(rectElt);
            }

            itemRectsCount.innerText = "Rects: " + rects.length;
            itemRectsContainer.appendChild(itemRectsList);

            container.appendChild(itemRectsCount);
            container.appendChild(itemRectsContainer);

            if (showRects) {
                setTimeout(function () {
                    addClientRectsOverlay(elt);
                }, 0);
            }
        }

        var children = elt.children || [],
            child;

        if (children.length > 0) {
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                printPositions(child, itemChildrenList);
            }

            itemChildrenCount.innerText = "Children: " + elt.children.length;
            itemChildrenContainer.appendChild(itemChildrenList);            

            container.appendChild(itemChildrenCount);
            container.appendChild(itemChildrenContainer);
        }
    };

    var listElt = document.createElement("ol");
    printPositions(document.children[0], listElt);

    var tableRectDiv = document.createElement("div");
    tableRectDiv.style.position = "absolute";
    tableRectDiv.style.left = (scrollLeft + 50) + "px";
    tableRectDiv.style.top = (scrollTop + 50) + "px";
    tableRectDiv.style.right = "50px";
    tableRectDiv.style.height = (document.body.clientHeight - 100) + "px";
    tableRectDiv.style.border = "1px solid grey";
    tableRectDiv.style.background = "rgba(255,255,255,0.9)";
    tableRectDiv.style.overflow = "scroll";
    tableRectDiv.style["font-size"] = "12px";
    tableRectDiv.style["z-index"] = 1000;
    tableRectDiv.appendChild(listElt);
    document.body.appendChild(tableRectDiv);
}());
