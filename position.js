/*jslint devel: true*/

(function () {
    "use strict";

    var showRects = true;

    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

    function addClientRectsOverlay(elt) {
        // Absolutely position a div over each client rect so that its border width
        // is the same as the rectangle"s width.
        // Note: the overlays will be out of place if the user resizes or zooms.
        var rects = elt.getClientRects(),
            rect;
        for (var i = 0; i != rects.length; i++) {
            rect = rects[i];
            var tableRectDiv = document.createElement("div");
            tableRectDiv.style.position = "absolute";
            tableRectDiv.style.border = "1px solid red";
            tableRectDiv.style.margin = tableRectDiv.style.padding = "0";
            tableRectDiv.style.top = (rect.top + scrollTop) + "px";
            tableRectDiv.style.left = (rect.left + scrollLeft) + "px";
            // we want rect.width to be the border width, so content width is 2px less.
            tableRectDiv.style.width = (rect.width - 2) + "px";
            tableRectDiv.style.height = (rect.height - 2) + "px";
            document.body.appendChild(tableRectDiv);
        }
    }

    var rectToString = function (rect) {
        return [
            "width: " + rect.width,
            "height: " + rect.height,
            "top: " + rect.top,
            "right: " + rect.right,
            "bottom: " + rect.bottom,
            "left: " + rect.left
        ].join(", ");
    };

    var traverseElements = function (elt, list) {
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

        itemName.insertAdjacentHTML("beforeend", "Name: " + name);
        container.appendChild(itemName);
        item.appendChild(container);
        list.appendChild(item);

        var rects = elt.getClientRects(),
            rect,
            rectElt;

        if (showRects && rects.length > 0) {
            for (var j = 0; j < rects.length; j++) {
                rect = rects[j];
                rectElt = document.createElement("li");
                rectElt.insertAdjacentHTML("beforeend", rectToString(rect));
                itemRectsList.appendChild(rectElt);
            }

            itemRectsCount.insertAdjacentHTML("beforeend", "Rects: " + rects.length);
            itemRectsContainer.appendChild(itemRectsList);

            container.appendChild(itemRectsCount);
            container.appendChild(itemRectsContainer);

            setTimeout(function () {
                // wait until the next tick of the event loop to avoid 
                // traversing the overlay elements
                addClientRectsOverlay(elt);
            }, 0);
        }

        var children = elt.children || [];
        if (children.length > 0) {
            itemChildrenCount.insertAdjacentHTML("beforeend", "Children: " + elt.children.length);
            itemChildrenContainer.appendChild(itemChildrenList);            

            container.appendChild(itemChildrenCount);
            container.appendChild(itemChildrenContainer);

            for (var i = 0; i < children.length; i++) {
                traverseElements(children[i], itemChildrenList);
            }
        }
    };

    var listElt = document.createElement("ol");
    traverseElements(document.children[0], listElt);

    var tableRectDiv = document.createElement("div");
    tableRectDiv.style.position = "absolute";
    tableRectDiv.style.left = (scrollLeft + 50) + "px";
    tableRectDiv.style.top = (scrollTop + 50) + "px";
    tableRectDiv.style.right = "50px";
    tableRectDiv.style.height = (document.body.clientHeight - 100) + "px";
    tableRectDiv.style.border = "1px solid grey";
    tableRectDiv.style.background = "rgba(255,255,255,0.9)";
    tableRectDiv.style.overflow = "scroll";
    tableRectDiv.style.fontSize = "12px";
    tableRectDiv.style.zIndex = 1000;
    tableRectDiv.appendChild(listElt);
    document.body.appendChild(tableRectDiv);
}());
