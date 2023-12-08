var pathname = document.location.pathname,
    paths = pathname.split('/'),
    page = "",
    getAuthorization = getCookie("authorization");

console.log("authorization", getAuthorization);

// проверяем, есть ли авторизация пользователя
if (getAuthorization != null && getAuthorization == "true") {
    initCarcass();
} else {
    authorization();
}



async function authorization() {
    importComponent(`/pages/authorization/authorization.js`);
}

async function initCarcass() {
    getPage();

    console.log("page:", page);

    // Navigation
    // await import("/components/Navigation/Navigation.js?v="+version);
    // Header
    // await import("/components/Header/Header.js?v="+version).then(obj => obj.default);
    // page
    createCSSLink(`/pages/${page}/css/${page}.css`);
    await importComponent(`/pages/${page}/${page}.js`);
}

// ---------- определяем страницу ----------
function getPage() {
    if (pathname == "/") {
        page = "home";
    } else if (paths.length == 2 && paths[1] == "sites") {
        page = "sites";
    } else if (paths.length == 3 && paths[1] == "sites" && paths[2] != "") {
        page = "site";
    } else {
        page = "404";
    }
}