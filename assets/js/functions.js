function settingPage(data) {
    document.title = data.title+" | OTAL Admin";

    var getBreadcrumbs = ``;
    if (data.breadcrumbs != undefined && data.breadcrumbs.length != 0) {
        for (var i in data.breadcrumbs) {
            var item = data.breadcrumbs[i],
                link = (item.link != undefined && item.link != "") ? `href="${item.link}"` : ``,
                title = (item.title != undefined && item.title != "") ? item.title : `<span style="color: red;">NaN</span>`,
                icon = (data.breadcrumbs.length > 1) ? `<i class="ph ph-caret-right"></i>` : "";

            getBreadcrumbs += `${(i != 0) ? icon : ""}<a ${link}>${title}</a>`;
        }
    } else {
        getBreadcrumbs += data.title;
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


function XMLHttpRequestAJAX(data) {

    var sendData = {
        url: (data.url != undefined && data.url != "") ? data.url : "",
        method: (data.method != undefined && data.method != "") ? data.method : "POST",
        body: (data.body != undefined && data.body != "") ? new URLSearchParams(data.body).toString() : ""
    }

    var xhr = new XMLHttpRequest();

    if (sendData.method === "GET") {
        xhr.open("GET", sendData.url + "?" + sendData.body, false);
    } else {
        xhr.open(sendData.method, sendData.url, false);
    }

    xhr.onload = function() {
        if (xhr.status !== 200) console.error('%c ERROR: Request ', 'background: red; color: #fff; border-radius: 50px;', xhr);
    };

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    xhr.send(sendData.body);

    var getData = {};
    getData.code = xhr.status;

    if (typeof xhr.responseText === "string") {
        getData.data = JSON.parse(xhr.responseText);
    } else {
        getData.data = xhr.responseText;
    }

    return getData;
}

function logOutAdmin() {
    var bodyTag = document.body;

    getAuthorization = "";
    deleteCookie("authorization");
    bodyTag.classList.add("exit");

    bodyTag.addEventListener('animationend', function(e) {
        location.reload();
    });
}


function DateFormat(date, format) {
    if(date == "") date = "0000-00-00";
    if(date == '0000-00-00 00:00:00' || date == '0000-00-00'){
        if(format == 'd.m.Y'){
            return '00.00.0000';
        }else{
            return date;
        }
    }
    if (date instanceof Date){
    }else{
        if(typeof date != 'number') {
            var dateReg = /^\d{2}([.])\d{2}\1\d{4}$/
            var matches = date.match(dateReg); // matches
            if (matches) {
                date = date.replace(/^(\d{2})[.](\d{2})[.](\d{4})$/, '$3-$2-$1');
            }
            date = date.replaceAll('-','/');
        }
        date = new Date(date);
    }
    var arr_months_wd = {'01':'Января', '02':'Февраля', '03':'Марта','04':'Апреля', '05':'Мая', '06':'Июня', '07':'Июля', '08':'Августа', '09':'Сентября', '10':'Октября', '11':'Ноября', '12':'Декабря'}
    var arr_months = {'01':'Январь', '02':'Февраль', '03':'Март','04':'Апрель', '05':'Май', '06':'Июнь', '07':'Июль', '08':'Август', '09':'Сентябрь', '10':'Октябрь', '11':'Ноябрь', '12':'Декабрь'}
    var week_days = ['вс', 'пн', 'вт','ср','чт','пт','сб']
    if(format == undefined){
        format = "Y-m-d";
    }
    var month = date.getMonth()+1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        quarter = Math.ceil(month/3);


    hour = (hour<10)?"0"+hour:hour;
    minute = (minute<10)?"0"+minute:minute;
    second = (second<10)?"0"+second:second;
    var t = new Date(date.getFullYear(), date.getMonth()+1, 0);
    t = t.getDate()+1;
    month = month.toString().length > 1 ? month : '0' + month;
    day = day.toString().length > 1 ? day : '0' + day;
    var fullYear = date.getFullYear();
    if(format == "Y"){
        return fullYear;
    }
    if(format == "d"){
        return day;
    }
    if(format == "Y-m-01"){
        return fullYear+"-"+month+"-01";
    }
    if(format == "d Month, N (H:i)") {
        return day + " " + arr_months_wd[month] + ", " + week_days[date.getDay()]+" ("+hour+":"+minute+")";
    }
    if(format.indexOf("Y-m-w")>-1){ // week - число , это номер дня недели
        var num_week = format.replace("Y-m-w", "");
        var week_n = date.getDay();
        date.setDate(date.getDate() - week_n+parseInt(num_week));

        return dt_format(date, 'Y-m-d');
    }
    if(format == "d Month, N"){
        return day+" "+arr_months_wd[month]+", "+week_days[date.getDay()];
    }
    if(format == "d Month, N (Y)"){
        return day+" "+arr_months_wd[month]+", "+week_days[date.getDay()] + " ("+fullYear+")";
    }
    if(format == "d Month Y"){
        return day+" "+arr_months_wd[month]+" "+fullYear;
    }
    if(format == "d Month Y (H:i)"){
        return day+" "+arr_months_wd[month]+" "+fullYear+" ("+hour+":"+minute+")";
    }
    if(format == "d.m.Y"){
        return day+"."+month+"."+fullYear;
    }
    if(format == "Q Y"){
        return quarter+" кв. "+fullYear;
    }
    if(format == "Y-m-d"){
        return fullYear+"-"+month+"-"+day;
    }
    if(format == "d Month"){
        return day+" "+arr_months_wd[month];
    }
    if(format == "H:i"){
        return hour+":"+minute;
    }
    if(format == "d.m H:i"){
        return day+"."+month+" "+hour+":"+minute;
    }
    if(format == "d.m.Y H:i:s"){
        return day+"."+month+"."+fullYear+" "+hour+":"+minute+":"+second;
    }
    if(format == "d.m.Y H:i"){
        return day+"."+month+"."+fullYear+" "+hour+":"+minute;
    }
    if(format == "Y-m-d H:i:s"){
        return fullYear+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
    }
    if(format == "Y-m-dTH:i:s"){
        return fullYear+"-"+month+"-"+day+"T"+hour+":"+minute+":"+second;
    }
    if(format == "Month Y"){
        return arr_months[month] + " " + fullYear;
    }
    if(format == "Month"){
        return arr_months[month];
    }
    if(format == "Y"){
        return fullYear;
    }
    if(format == "NearFriday.m.Y"){
        var delta = 5-date.getDay();
        var result = new Date(date);
        if (delta >= 0){
            result.setDate(result.getDate()+delta);
        }else{
            result.setDate(result.getDate()+7+delta);
        }
        day = result.getDate();
        day = day.toString().length > 1 ? day : '0' + day;
        month = result.getMonth()+1;
        month = month.toString().length > 1 ? month : '0' + month;
        return "до "+day+"."+month+"."+fullYear;
    }
    if(format == "Y-m-t"){
        var lastDayOfMonth = new Date(fullYear, date.getMonth()+1, 0);
        lastDayOfMonth = lastDayOfMonth.getDate();
        lastDayOfMonth = lastDayOfMonth.toString().length > 1 ? lastDayOfMonth : '0' + lastDayOfMonth;
        return fullYear+"-"+month+"-"+lastDayOfMonth;
    }
}