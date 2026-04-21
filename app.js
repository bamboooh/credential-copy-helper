document.addEventListener("DOMContentLoaded", function () {
    renderItems(Array.isArray(COPY_ITEMS) ? COPY_ITEMS : []);
});

function renderItems(items) {
    var app = document.getElementById("app");

    if (!app) {
        return;
    }

    app.innerHTML = "";

    var groupedItems = groupByCategory(items);
    var categories = Object.keys(groupedItems);

    for (var i = 0; i < categories.length; i++) {
        var category = categories[i];

        var heading = document.createElement("p");
        heading.className = "section_title";
        heading.textContent = category;
        app.appendChild(heading);

        var categoryItems = groupedItems[category];

        for (var j = 0; j < categoryItems.length; j++) {
            var item = categoryItems[j];
            var wrapper = document.createElement("div");
            wrapper.className = "copy_org";

            var title = document.createElement("span");
            title.className = "item_title";
            title.textContent = item.title;

            var button = document.createElement("button");
            button.className = "copy_btn";
            button.type = "button";
            button.textContent = item.label;
            button.setAttribute("data-copy", item.value);
            button.addEventListener("click", function (event) {
                var value = event.currentTarget.getAttribute("data-copy");
                copyToClipboard(value);
            });

            wrapper.appendChild(title);
            wrapper.appendChild(button);
            app.appendChild(wrapper);
        }
    }
}

function groupByCategory(items) {
    var grouped = {};

    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        if (!isValidItem(item)) {
            continue;
        }

        if (!grouped[item.category]) {
            grouped[item.category] = [];
        }

        grouped[item.category].push(item);
    }

    return grouped;
}

function isValidItem(item) {
    if (!item || typeof item !== "object") {
        return false;
    }

    return (
        typeof item.category === "string" && item.category.length > 0 &&
        typeof item.title === "string" && item.title.length > 0 &&
        typeof item.label === "string" &&
        typeof item.value === "string"
    );
}

function copyToClipboard(text) {
    var normalizedText = typeof text === "string" ? text : "";

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(normalizedText)
            .then(function () {
                showNotification("クリップボードに保存");
            })
            .catch(function () {
                fallbackCopy(normalizedText);
            })
            .finally(function () {
                setTimeout(function () {
                    hideNotification();
                }, 900);
            });

        return;
    }

    fallbackCopy(normalizedText);

    setTimeout(function () {
        hideNotification();
    }, 900);
}

function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
        document.execCommand("copy");
        showNotification("クリップボードに保存");
    } catch (e) {
        showNotification("コピー失敗");
    }

    document.body.removeChild(textarea);
}

function showNotification(message) {
    var notification = document.getElementById("notification");

    if (!notification) {
        return;
    }

    notification.textContent = message;
    notification.style.opacity = "1";
}

function hideNotification() {
    var notification = document.getElementById("notification");

    if (!notification) {
        return;
    }

    notification.style.opacity = "0";
}
