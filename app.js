// 初期化: DOMの読み込み完了後にデータを描画する。
document.addEventListener("DOMContentLoaded", function () {
    // data.js の COPY_ITEMS が壊れているケースを考慮し、安全に空配列へフォールバックする。
    renderItems(Array.isArray(COPY_ITEMS) ? COPY_ITEMS : []);
});

// 画面全体の一覧を描画する。
function renderItems(items) {
    var app = document.getElementById("app");

    // 描画先がない場合は何もしない。
    if (!app) {
        return;
    }

    // 再描画に備えて既存内容をクリアする。
    app.innerHTML = "";

    // カテゴリ単位にまとめて、見出し + アイテムの順で表示する。
    var groupedItems = groupByCategory(items);
    var categories = Object.keys(groupedItems);

    for (var i = 0; i < categories.length; i++) {
        var category = categories[i];

        // カテゴリ見出しを作成。
        var heading = document.createElement("p");
        heading.className = "section_title";
        heading.textContent = category;
        app.appendChild(heading);

        var categoryItems = groupedItems[category];

        for (var j = 0; j < categoryItems.length; j++) {
            var item = categoryItems[j];
            var wrapper = document.createElement("div");
            wrapper.className = "copy_org";

            // 項目名（例: ログインID）
            var title = document.createElement("span");
            title.className = "item_title";
            title.textContent = item.title;

            // 値表示兼コピー用ボタン。
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

// 入力配列をカテゴリ名ごとにグルーピングする。
function groupByCategory(items) {
    var grouped = {};

    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        // データ形式が不正な要素は読み飛ばす。
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

// 描画に必要な最小プロパティを持つか判定する。
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

// クリップボードへ文字列をコピーする。
function copyToClipboard(text) {
    var normalizedText = typeof text === "string" ? text : "";

    // HTTPSなどのセキュアコンテキストでは Clipboard API を優先利用する。
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(normalizedText)
            .then(function () {
                showNotification("クリップボードに保存");
            })
            .catch(function () {
                // 権限エラー等では従来方式へフォールバックする。
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

// 古いブラウザ向けのコピー処理（textarea + execCommand）。
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

// 通知メッセージを表示する。
function showNotification(message) {
    var notification = document.getElementById("notification");

    if (!notification) {
        return;
    }

    notification.textContent = message;
    notification.style.opacity = "1";
}

// 通知メッセージを非表示にする。
function hideNotification() {
    var notification = document.getElementById("notification");

    if (!notification) {
        return;
    }

    notification.style.opacity = "0";
}
