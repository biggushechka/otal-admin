export default function orders() {
    var formFields = new FormFields(),
        sectionHTML,
        tableHTML;

    initCarcass();

    function initCarcass() {
        sectionHTML = document.createElement("section");
        sectionHTML.classList.add("P-orders");
        sectionHTML.innerHTML = `
        <div class="card-body">
            <div class="header-card-body">
                <h4 class="title-card">Заявки</h4>
                <div class="target-block">
                    <div class="item">
                        <span class="label">Дата</span>
                        <select name="category">
                            <option value="1">За все время</option>
                            <option value="1">За сегодня</option>
                            <option value="1">За эту неделю</option>
                            <option value="1">За этот месяц</option>
                        </select>
                    </div>
                    <div class="item">
                        <span class="label">Тип</span>
                        <select name="category">
                            <option value="1">Все</option>
                            <option value="1">Консультация</option>
                            <option value="1">Перезвонить</option>
                            <option value="1">Вопрос по ипотеке</option>
                            <option value="1">Запрос презентации</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="content-card"></div>
        </div>`;
        document.getElementById("app").append(sectionHTML);

        initTable();

        sortSelect({
            title: "Дата",
            name: "date-orders",
            options: [
                {title: "За все время", value: "all"},
                {title: "За сегодня", value: "today"},
                {title: "За эту неделю", value: "week"},
                {title: "За этот месяц", value: "month"}
            ]
        });
    }

    function sortSelect(data) {
        var sortHTML = document.createElement("div");
        sortHTML.classList.add("sort-item");
        sortHTML.innerHTML = `
        <span class="label">Тип</span>
        <select name="category"></select>`;

        for (var i in data.options) {
            var option = data.options[i];
            var optionHTML = document.createElement("option");
            optionHTML.setAttribute("value", option.value)
            optionHTML.innerHTML = option.title
        }
    }

    function getOrders() {

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

        rowItemTable();
        rowItemTable();
        rowItemTable();
        rowItemTable();
        rowItemTable();
    }

    function rowItemTable(order) {
        var rowHTML = document.createElement("tr");
        rowHTML.classList.add("row-item");
        // rowHTML.setAttribute("data-id", order.id)
        rowHTML.innerHTML = `
            <td class="col-id">1</td>
            <td class="col-date">27 Декабря, ср (12:33)</td>
            <td class="col-type"><b>Консультация</b></td>
            <td class="col-name">Алексей</td>
            <td class="col-phone">+7 (968) 512-76-12</td>
            <td class="col-email">alex-ivanov@mail.ru</td>
            <td class="col-comment">---</td>`;
        tableHTML.querySelector("tbody").append(rowHTML);
    }
}