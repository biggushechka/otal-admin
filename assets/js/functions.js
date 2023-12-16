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


function dropdownWidget(data) {
    let classWrapper = (data.classWrapper != '' && data.classWrapper != undefined) ? data.classWrapper : null,
        classList = (data.classList != '' && data.classList != undefined) ? data.classList : "",
        buttonToggle = (data.buttonToggle != '' && data.buttonToggle != undefined) ? data.buttonToggle : '<button type="button" class=""><i class="icon menu-dots"></i></button>',
        pos = (data.pos != undefined && data.pos != "") ? `pos: ${data.pos}` : "",
        btn;

    var dropdown = document.createElement("div");
    dropdown.classList.add("mr-dropdown", classWrapper);
    var html = `
    ${buttonToggle}
    <div uk-dropdown="mode: click; animation: uk-animation-slide-bottom-small; auto-update: false; offset: 5; ${pos}" class="dropdown-container uk-animation-fast ${classList}">`;
        for (var i in data.buttonsList) {
            btn = data.buttonsList[i];

            if (btn.separator != undefined && btn.separator == "true") {
                html += `<div class="separator"></div>`;
                continue;
            }

            let className = (btn.class != '' && btn.class != undefined) ? btn.class : '',
                link = (btn.link != '' && btn.link != undefined) ? `href="${btn.link}"` : '',
                target = (btn.target != '' && btn.target != undefined) ? `target=${btn.target}` : '',
                title = (btn.title != '' && btn.title != undefined) ? btn.title : 'NaN';

            html += `<a ${link} ${target} class="item-action ${className}">`;

            if (btn.icon != undefined) {
                if (btn.icon.type == 'icon') {
                    html += `<i class="icon ${btn.icon.name}"></i>`;
                } if (btn.icon.type == 'icon-ph') {
                    html += `<i class="${btn.icon.name}"></i>`;
                } else if (btn.icon.type == 'img') {
                    html += `<img src="${btn.icon.name}" alt="icon" class="icon-img">`;
                }
            }
                html += `
                <span class="title">${title}</span>
            </a>`;
        }
        html += `
    </div>`;
    dropdown.innerHTML = html;

    // закрыть dropdown по клику на любой пункт
    var allbtn = dropdown.querySelectorAll(".item-action");

    allbtn.forEach(function (btnItem) {
        btnItem.addEventListener("click", function () {
            UIkit.dropdown(this.closest('[uk-dropdown]')).hide(0);
        });
    });

    return dropdown;
}

function modalAlert(data) {
    var type = (data.type != undefined && data.type != "") ? data.type : "confirmation",
        title = (type == "delete") ? `Вы действительно хотите удалить <br>"<b>${data.title}</b>"?` : (type == "confirmation") ? data.title : "NaN";
        titleBtn = (type == "delete") ? `Удалить` : (type == "confirmation") ? `Продолжить` : "NaN";

    var modalTAG = document.createElement("div");
    modalTAG.classList.add("modal-alert-container");
    modalTAG.innerHTML = `<p>${title}</p>`;

    var modal = new Modal({
        title: 'Подтвердите действие',
        classModal: 'P-modal-alert',
        content: modalTAG,
        mode: 'center',
        width: '480px',
        footerEvents:{
            cancel: {
                active: true,
            },
            submit: {
                active: true,
                title: "Удалить",
                nameClass: type,
                callback: function(modalClass) {
                    modalClass.closeModal();
                    if(data.callback) data.callback(true);
                },
            },
        }
    });
}

function alertNotification(data) {
    var icon = (data.status == "alert") ? "ph ph-warning" : (data.status == "error") ? "ph ph-x" : (data.status == "success") ? "ph ph-check-fat" : "";

    var content = `
    <div class="G-item-notif-msg ${data.status}">
        <i class="${icon}"></i>
        <p class='text'>${data.text}</p>
    </div>`;

    UIkit.notification({message: content, pos: data.pos});
}


function XMLHttpRequestAJAX(data) {
    var sendData = {
        url: (data.url != undefined && data.url != "") ? data.url : "",
        method: (data.method != undefined && data.method != "") ? data.method : "POST",
        body: (data.body != undefined && data.body != "") ? data.body : ""
    }

    var xhr = new XMLHttpRequest();

    if (sendData.method === "GET" || sendData.method === "DELETE" || sendData.method === "UPDATE") {
        xhr.open(sendData.method, sendData.url + "?" + new URLSearchParams(data.body).toString(), false);
    }

    if (sendData.method === "POST") {
        // sendData.body = JSON.stringify(sendData.body);
        xhr.open("POST", sendData.url, false);
    }

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Content-Type', 'multipart/form-data');
    xhr.setRequestHeader('Content-Type', 'text/plain');

    xhr.send(sendData.body);

    var getData = {};
    getData.code = xhr.status;

    try {
        getData.data = JSON.parse(xhr.responseText);
    } catch (error) {
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

function getSite(domain) {
    var getSite = XMLHttpRequestAJAX({
        url: "/api/site/project",
        method: "GET",
        body: {
            domain: domain
        }
    });
    return getSite;
}

function animationBtnSuccess(btn) {
    btn.classList.add("success-animation");
    setTimeout(function () {
        btn.classList.remove("success-animation");
    }, 1500);
}

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function generateRandomNumber(numDigits) {
    const min = Math.pow(10, numDigits - 1);
    const max = Math.pow(10, numDigits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getUploadFiles(data, callback) {
    var ext = (data.ext != undefined && (data.ext != "" || data.ext.length != 0)) ? data.ext : "all",
        choice = (data.choice != undefined && data.choice != "") ? data.choice : "one",
        arrayFiles = [];

    var extGroup = {
        "img": ["png", "jpg", "jpeg", "eps", "raw", "webp", "avif", "tiff", "bmp", "heic"],
        "text": ["txt", "pdf", "doc", "docx", "rtf", "xls", "xlsx", "csv"]
    }

    if (typeof ext === "string") {
        ext = extGroup[ext];
        ext = ext.map(format => `.${format}`).join(', ');
    }

    var input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", ext);
    if (choice === "multiple") input.setAttribute("multiple", "");

    input.click();

    input.addEventListener("change", function () {
        var selectedFiles = Array.from(this.files);
        var filesRead = 0;
        var arrayFiles = [];

        selectedFiles.forEach(function(file) {
            var reader = new FileReader(),
                id_file = generateRandomNumber(10),
                fileExtension = file.name.split(".").pop().toLowerCase();

            reader.onload = function() {
                var dataFile = {
                    id: id_file,
                    name: file.name,
                    ext: fileExtension,
                    size: file.size,
                    base: reader.result
                };

                arrayFiles.push(dataFile);
                filesRead++;

                if (filesRead === selectedFiles.length) {
                    if (arrayFiles.length !== 0) {
                        callback(arrayFiles);
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    });
}

function ascaf() {
    var input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.setAttribute("multiple", "");
    input.click();


}