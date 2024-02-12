var pathname = document.location.pathname,
    paths = pathname.split('/'),
    page = "",
    getAuthorization = getCookie("authorization");

// проверяем, есть ли авторизация пользователя
if (getAuthorization != null && getAuthorization != "") {
    initCarcass();
} else {
    authorization();
}

async function authorization() {
    importComponent(`/pages/authorization/authorization.js`);
}

async function initCarcass() {
    getPage();

    // Navigation
    await import("/components/Navigation/Navigation.js?v="+version);
    // Header
    await import("/components/Header/Header.js?v="+version).then(obj => obj.default);
    // page
    createCSSLink(`/pages/${page}/css/${page}.css`);
    await importComponent(`/pages/${page}/${page}.js`);
}

// ---------- определяем страницу ----------
function getPage() {
    if (pathname == "/") {
        page = "home";
    } else if (paths.length == 2 && paths[1] == "my-sites") {
        page = "my-sites";
    } else if (paths.length == 3 && paths[1] == "my-sites" && paths[2] != "") {
        page = "site";
    } else {
        page = "404";
    }
}