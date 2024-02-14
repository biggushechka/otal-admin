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
                <h4 class="title-card">Заявки</h4>
                <div class="target-block"></div>
            </div>
            <div class="content-card"></div>
        </div>`;
        document.getElementById("app").append(sectionHTML);

        // сортировка по "Дате"
        sortSelect({
            title: "Дата",
            name: "date",
            options: [
                {title: "За все время", value: "all"},
                {title: "За сегодня", value: "today"},
                {title: "За эту неделю", value: "week"},
                {title: "За этот месяц", value: "month"},
                {title: "За прошлый месяц", value: "month"}
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

        if (getOrders.code == 200) {
            tableHTML.querySelector("tbody").innerHTML = "";

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

        console.log("order", order);

        var rowHTML = document.createElement("tr");
        rowHTML.classList.add("row-item");
        // rowHTML.setAttribute("data-id", order.id)
        rowHTML.innerHTML = `
            <td class="col-id">${order.id}</td>
            <td class="col-date">${DateFormat(order.date_create, "d Month, N (H:i)")}</td>
            <td class="col-type"><b>${order.type}</b></td>
            <td class="col-name">${order.name}</td>
            <td class="col-phone">${order.phone}</td>
            <td class="col-email">${order.email}</td>
            <td class="col-comment">${order.comment}</td>`;
        tableHTML.querySelector("tbody").append(rowHTML);
    }
}