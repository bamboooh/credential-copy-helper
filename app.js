document.addEventListener("DOMContentLoaded", function () {
    renderItems(COPY_ITEMS);
});

function renderItems(items) {
    var app = document.getElementById("app");
    app.innerHTML = "";

    var currentCategory = "";

    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        if (!item.category || !item.title || !item.label || !item.value) {
            continue;
        }

        if (item.category !== currentCategory) {
            currentCategory = item.category;

            var heading = document.createElement("p");
            heading.className = "section_title";
            heading.textContent = currentCategory;
            app.appendChild(heading);
        }

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
        button.onclick = function () {
            copyToClipboard(this.getAttribute("data-copy"));
        };

        wrapper.appendChild(title);
        wrapper.appendChild(button);
        app.appendChild(wrapper);
    }
}

function copyToClipboard(text) {
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

    setTimeout(function () {
        hideNotification();
    }, 900);
}

function showNotification(message) {
    var notification = document.getElementById("notification");
    notification.textContent = message;
    notification.style.opacity = "1";
}

function hideNotification() {
    var notification = document.getElementById("notification");
    notification.style.opacity = "0";
}