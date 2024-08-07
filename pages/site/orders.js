export default function orders(project) {
    var formFields = new FormFields(),
        sectionHTML,
        tableHTML;

    initCarcass();
    initTable();
    getOrders();

    function initCarcass() {
        sectionHTML = document.createElement("section");
        sectionHTML.classList.add("P-orders");
        sectionHTML.innerHTML = `
        <div class="card-body">
            <div class="header-card-body">
                <h4 class="title-card">Заявки <span class="count-all"></span></h4>
                <div class="target-block">
                    <button type="button" class="btn btn-send-setting">Куда отправлять заявки?</button>
<!--                    <button type="button" class="btn btn-primary btn-send-tg">Отправить в ТГ</button>-->
                </div>
            </div>
            <div class="content-card"></div>
        </div>`;
        document.getElementById("app").append(sectionHTML);

        sectionHTML.querySelector(".btn-send-setting").addEventListener("click", function () {
            modalSendSetting();
        });

        // сортировка по "Дате"
        sortSelect({
            title: "Дата",
            name: "date",
            options: [
                {title: "За все время", value: "all"},
                {title: "За сегодня", value: "today"},
                {title: "За эту неделю", value: "week"},
                {title: "За этот месяц", value: "month"},
                {title: "За прошлый месяц", value: "last-month"}
            ]
        });

        // сортировка по "Типу"
        sortSelect({
            title: "Тип",
            name: "type",
            options: [
                {title: "Все", value: "all"},
                {title: "Консультация", value: "consultation"},
                {title: "Перезвонить", value: "callback"},
                {title: "Вопрос по ипотеке", value: "mortgage"},
                {title: "Запрос презентации", value: "presentation"}
            ]
        });
    }

    function sortSelect(data) {
        var sortHTML = document.createElement("div");
        sortHTML.classList.add("sort-item");
        sortHTML.innerHTML = `
        <span class="label">${data.title}</span>
        <select name="${data.name}"></select>`;

        for (var i in data.options) {
            var option = data.options[i];
            var optionHTML = document.createElement("option");
            optionHTML.setAttribute("value", option.value)
            optionHTML.innerHTML = option.title;
            sortHTML.querySelector("select").append(optionHTML);
        }

        sortHTML.querySelector("select").addEventListener("change", function () {
            getOrders();
        });

        sectionHTML.querySelector(".target-block").append(sortHTML);
    }

    function getOrders() {
        var allSort = sectionHTML.querySelectorAll(".target-block select"),
            dataSort = {id_site: project.id};

        allSort.forEach(function (select) {
            var selectName = select.getAttribute("name"),
                valueActiveOption = select.options[select.selectedIndex].value;

            dataSort[selectName] = valueActiveOption;
        });

        var getOrders = XMLHttpRequestAJAX({
            url: "/api/site/orders/get-orders",
            method: "GET",
            body: dataSort
        });

        console.log("getOrders", getOrders);

        tableHTML.querySelector("tbody").innerHTML = "";
        sectionHTML.querySelector(".title-card .count-all").innerHTML = "- " + getOrders.data.length;

        if (getOrders.code === 200) {
            for (var i in getOrders.data) {
                rowItemTable(getOrders.data[i]);
            }
        }
    }

    function initTable() {
        tableHTML = document.createElement("table");
        tableHTML.classList.add("G-table");
        tableHTML.classList.add("P-table-orders");
        tableHTML.innerHTML = `
        <thead>
            <tr>
                <th width="">id</th>
                <th width="">Дата</th>
                <th width="">Тип</th>
                <th width="">Имя</th>
                <th width="">Телефон</th>
                <th width="">E-mail</th>
                <th width="">Комментарий</th>
            </tr>
        </thead>
        <tbody></tbody>`;
        sectionHTML.querySelector(".content-card").append(tableHTML);
    }

    function rowItemTable(order) {
        var date = (DateFormat(order.date_create, "Y-m-d") == DateFormat(new Date(), "Y-m-d")) ? "Сегодня" + " ("+DateFormat(order.date_create, "H:i")+")" : DateFormat(order.date_create, "d Month, N (H:i)"),
            typeOrder = (order.type === "consultation") ? "Консультация" :
                (order.type === "callback") ? "Перезвонить" :
                (order.type === "mortgage") ? "Вопрос по ипотеке" :
                (order.type === "presentation") ? "Запрос презентации" : "NaN";

        var rowHTML = document.createElement("tr");
        rowHTML.classList.add("row-item");
        // rowHTML.setAttribute("data-id", order.id)
        rowHTML.innerHTML = `
            <td class="col-id">${order.id}</td>
            <td class="col-date">${date}</td>
            <td class="col-type"><b>${typeOrder}</b></td>
            <td class="col-name">${order.name}</td>
            <td class="col-phone">${order.phone}</td>
            <td class="col-email">${order.email}</td>
            <td class="col-comment">${order.comment}</td>`;
        tableHTML.querySelector("tbody").append(rowHTML);
    }

    function modalSendSetting() {
        var modalTAG = document.createElement("div");
        modalTAG.classList.add("table-container");

        modalTAG.append(tmplTable("email"));
        modalTAG.append(tmplTable("telegram"));

        var modal = new Modal({
            title: 'Куда отправлять заявки?',
            classModal: 'P-modal-send-setting',
            content: modalTAG,
            mode: 'center',
            width: '800px',
            footerEvents:{
                cancel: {
                    title: 'Закрыть',
                    active: true,
                },
                submit: {
                    active: false
                },
            }
        });

        function tmplTable(type) {
            var titleCol = (type === "email") ? "Почта" : (type === "telegram") ? "Телеграм" : "NaN";
            var placeholder = (type === "email") ? "Введите почтовый адрес.." : (type === "telegram") ? "ID канала или группы.." : "NaN";

            var tableColHTML = document.createElement("div");
            tableColHTML.classList.add("col-item");
            tableColHTML.innerHTML = `
            <span class="title-col">${titleCol}</span>
            <form class="container-field">
                <button type="button" class="btn btn-primary btn-add-row"><i class="ph ph-plus"></i></button>
            </form>
            <div class="list-content"></div>`;

            const form = tableColHTML.querySelector("form");

            if (type === "email") {
                form.prepend(formFields.inputText({name: type, placeholder: placeholder, mask: "email", validate: "true"}))
            } else {
                form.prepend(formFields.inputText({name: type, placeholder: placeholder, mask: "", validate: "true"}))
            }

            var getSourceSend = XMLHttpRequestAJAX({
                url: "/api/site/orders/get-source-send",
                method: "GET",
                body: {
                    id_site: project.id,
                    source: type
                }
            });

            if (getSourceSend.code === 200) {
                for (var i in getSourceSend.data) {
                    var getTmpl = tmplRow(getSourceSend.data[i]);
                    tableColHTML.querySelector(".list-content").append(getTmpl);
                }
            }

            // добавить запись в бд
            tableColHTML.querySelector(".btn-add-row").addEventListener("click", function () {
                var contentField = tableColHTML.querySelector(".field-input"),
                    getValuesForm = formFields.getValuesForm(form),
                    sendSource = {
                        id_site: project.id,
                        source: type,
                    };

                if (getValuesForm.status === false) return false;

                if (type === "email") {
                    sendSource['email'] = getValuesForm.form['email'];
                } else {
                    sendSource['telegram'] = getValuesForm.form['telegram'];
                }

                contentField.value = "";

                var addSourceSend = XMLHttpRequestAJAX({
                    url: "/api/site/orders/add-source-send",
                    method: "POST",
                    body: sendSource
                });

                if (addSourceSend.code === 200) {
                    var getTmpl = tmplRow(addSourceSend.data);
                    tableColHTML.querySelector(".list-content").append(getTmpl);

                } else {
                    alertNotification({status: "error", text: addSourceSend.data, pos: "top-center"});
                }

            });

            function tmplRow(data) {
                var content;

                console.log(type, data);


                if (type === "email") {
                    content = data['email'];
                } else if (type === "telegram") {
                    content = data['tg_chad_id'];


                    const groupId = content;
                    const token = '6992664105:AAGlVd1qXIqcUpZEXCcfF1qFI-Z3i32vWz0';

                    var getNameTG = XMLHttpRequestAJAX({
                        url: `https://api.telegram.org/bot${token}/getChat?chat_id=${groupId}`,
                        method: "GET"
                    });

                    console.log("getNameTG:", getNameTG.data)
                }

                var rowHTML = document.createElement("div");
                rowHTML.classList.add("item");
                rowHTML.innerHTML = `
                <span class="number-count">${data.id}</span>
                <span class="content">${content}</span>
                <button type="button" class="btn btn-primary btn-delete-row"><i class="ph ph-x"></i></button>`;

                // удалить строку
                rowHTML.querySelector(".btn-delete-row").addEventListener("click", function () {
                    var deleteSourceSend = XMLHttpRequestAJAX({
                        url: "/api/site/orders/delete-source-send",
                        method: "DELETE",
                        body: {
                            id: data.id,
                            source: type,
                            id_site: project.id,
                        }
                    });

                    if (deleteSourceSend.code === 200) {
                        rowHTML.remove();
                    } else {
                        alertNotification({status: "error", text: deleteSourceSend.data, pos: "top-center"});
                    }
                });

                return rowHTML;
            }

            return tableColHTML;
        }
    }
}