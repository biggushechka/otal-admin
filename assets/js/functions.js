function settingPage(data) {
    document.title = data.title+" | OTAL Admin";

    var getBreadcrumbs = ``;
    for (var i in data.breadcrumbs) {
        var item = data.breadcrumbs[i],
            link = (item.link != undefined && item.link != "") ? `href="${item.link}"` : ``,
            title = (item.title != undefined && item.title != "") ? item.title : `<span style="color: red;">NaN</span>`,
            icon = (data.breadcrumbs.length > 1) ? `<i class="ph ph-caret-right"></i>` : "";

        getBreadcrumbs += `${(i != 0) ? icon : ""}<a ${link}>${title}</a>`;
    }
    document.querySelector("#G-header .title-page").innerHTML = getBreadcrumbs;
}

function sizeBarBrowser() {
    const viewPortHeight = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${viewPortHeight}px`);
}

// создание <link> тега
function createCSSLink(path) {
    let nameFile = path.match(/\/([^\/]+)\.css$/)[1];

    let cssNavigation = document.createElement('link');
    cssNavigation.setAttribute("rel", "stylesheet");
    cssNavigation.setAttribute("href", path+"?v="+version);
    cssNavigation.id = "css_"+nameFile;

    if (!document.getElementById(cssNavigation.id)) document.head.append(cssNavigation);
}

// создание <script> тега
function createScriptLink(path) {
    let script = document.createElement('script');
    script.setAttribute("src", path+"?v="+version);

    document.body.append(script);
}

// импорт компонента js
function importComponent(path, data) {
    path = (path != "" && path != undefined) ? path : "/nan";
    data = (data != "" && data != undefined) ? data : "";

    import(`${path}?v=${version}`).then(function (obj) {
        obj.default(data);
    }).catch(function (error) {
        console.error('%c ERROR: import JS ', 'background: red; color: #fff; border-radius: 50px;', error);
    });
}

// Устанавливаем куки
function setCookie(data) {
    var value,
        name,
        expires;

    // проверка данных
    if (data.data == "" || data.data == undefined) {
        console.error('%c ERROR: set Cookie ', 'background: red; color: #fff; border-radius: 50px;', "Нет данных для сохранения");
        return false;
    } else if (typeof data.data == "object") {
        value = JSON.stringify(data.data);
    } else {
        value = data.data;
    }

    // проверка имени
    if (data.name == "" || data.name == undefined) {
        console.error('%c ERROR: set Cookie ', 'background: red; color: #fff; border-radius: 50px;', "Отсутствует название");
        return false;
    } else {
        name = data.name;
    }

    // проверка срока жизни
    if (data.expires == "" || data.expires == undefined || data.expires == "infinite") {
        var currentDate = new Date(),
            expirationDate = new Date(currentDate.getFullYear() + 10, currentDate.getMonth(), currentDate.getDate()),
            expirationDateString = expirationDate.toUTCString();

        expires = expirationDateString;
    } else {
        expires = data.expires;
    }

    document.cookie = `${name}=${value}; expires=${expires}; path=${data.path};`;
}

// Получаем куки
function getCookie(cookieName) {
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();

        if (cookie.startsWith(cookieName + '=')) {
            var cookieValue = cookie.substring(cookieName.length + 1);
            return cookieValue;
        }
    }

    // Если куки с заданным названием не найдены
    return null;
}

// Удаляем куки
function deleteCookie(nameCookie) {
    // Получите все cookie текущего документа
    var cookies = document.cookie.split(";");

    // Переберите все cookie и найдите нужное
    for (var i = 0; i < cookies.length; i++) {
        var cookieParts = cookies[i].split("="),
            cookieName = cookieParts[0].trim();

        if (cookieName === nameCookie) {
            document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            if (document.querySelector('.Pl-plugin-errors-widget')) {
                document.querySelector('.Pl-plugin-errors-widget').remove();
            }

            break;
        }
    }
}