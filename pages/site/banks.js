export default function banks(project) {
    var formFields = new FormFields(),
        tableHTML;

    var banksHTML = document.createElement("section");
    banksHTML.classList.add("P-banks");
    banksHTML.innerHTML = `
    <div class="card-body" style="width: 1000px">
        <div class="header-card-body">
            <h4 class="title-card">Банки</h4>
        </div>
        <div class="content-card"></div>
    </div>`;
    document.getElementById("app").append(banksHTML);

    initTable();
    getAllBanks();

    function initTable() {
        tableHTML = document.createElement("table");
        tableHTML.classList.add("P-table-banks");
        tableHTML.classList.add("G-table");
        tableHTML.innerHTML = `
        <thead>
            <tr>
                <th width="64">id</th>
                <th width="80">Лого</th>
                <th width="">Название</th>
                <th width="120">Ставка</th>
                <th width="120">Первый взнос</th>
                <th width="100">Статус</th>
                <th width="100">Действия</th>
            </tr>
        </thead>
        <tbody>
            <tr class="add-new-item">
                <td colspan="7">
                    <button type="button" class="btn btn-add-item btn-icon-left"><i class="ph ph-plus-circle"></i>Добавить банк</button>
                </td>
            </tr>
        </tbody>`;
        banksHTML.querySelector(".content-card").prepend(tableHTML);

        tableHTML.querySelector(".btn-add-item").addEventListener("click", function () {
            modalItem();
        });
    }

    function rowItemTable(bank) {
        var rowHTML = document.createElement("tr");
        rowHTML.classList.add("row-item");
        rowHTML.setAttribute("data-id", bank.id)
        rowHTML.innerHTML = `
            <td class="col-id">${bank.id}</td>
            <td class="col-logo"><img src="${bank.logo}" class="logo-img"></td>
            <td class="col-title"><b>${bank.title}</b></td>
            <td class="col-rate">${bank.rate}%</td>
            <td class="col-initial_payment">${bank.initial_payment}%</td>
            <td class="col-status"></td>
            <td class="col-events">
                <div class="row-container">
                    <button type="button" class="btn btn-outline-primary btn-square btn-edit"><i class="ph ph-pencil-simple"></i></button>
                    <button type="button" class="btn btn-outline-primary btn-square btn-delete"><i class="ph ph-trash"></i></button>
                </div>
            </td>`;
        tableHTML.querySelector("tbody .add-new-item").before(rowHTML);

        // вставляем switch активности сайта
        var switchActivity = formFields.switchRadio({name: "activity", checked: bank.activity, callback: isActivitySite})
        rowHTML.querySelector(".col-status").append(switchActivity);

        // изменение активности сайта
        function isActivitySite(status) {
            var isActivity = XMLHttpRequestAJAX({
                url: "/api/site/banks/isActivity",
                method: "POST",
                body: {
                    id_bank: bank.id,
                    id_site: project.id,
                    activity: status
                }
            });

            if (isActivity.code === 200) {
                var status = (isActivity.data.activity == "off") ? "выключена" : "активна";
                alertNotification({status: "success", text: `Запись ${status}`, pos: "top-center"});
            }

            return isActivity.data.activity
        }

        // редактирование записи
        rowHTML.querySelector(".btn-edit").addEventListener("click", function () {
            modalItem(bank);
        });

        // удаление записи
        rowHTML.querySelector(".btn-delete").addEventListener("click", function () {
            modalAlert({
                type: "delete",
                title: bank.title,
                callback: deleteSite,
            });

            // запрос на удаление записи
            function deleteSite() {
                var deleteItem = XMLHttpRequestAJAX({
                    url: "/api/site/banks/delete-bank",
                    method: "DELETE",
                    body: {id: bank.id}
                });

                if (deleteItem.code === 200) {
                    rowHTML.remove();
                    alertNotification({status: "success", text: "Запись успешно удалена", pos: "top-center"});
                } else {
                    alertNotification({status: "error", text: "Ошибка при удалении записи", pos: "top-center"});
                }
            }
        });
    }

    function getAllBanks() {
        // получаем данные
        var getBanks = XMLHttpRequestAJAX({
            url: "/api/site/banks/get-banks",
            method: "GET",
            body: {
                id_site: project.id
            }
        });

        if (getBanks.code === 200) {
            for (var i in getBanks.data) {
                rowItemTable(getBanks.data[i]);
            }
        }
    }

    function modalItem(data) {
        console.log("bank", data)
        var form = document.createElement("form"),
            titleModal = (data == undefined) ? "Добавить банк" : "Редактирование",
            titleBtn = (data == undefined) ? "Добавить" : "Готово",
            listAllBanks = [];

        // получаем список банков
        var getAllBanks = XMLHttpRequestAJAX({
            url: "/api/site/banks/all-banks",
            method: "GET"
        });

        if (getAllBanks.code === 200) {
            getAllBanks = getAllBanks.data;
        }

        for (var i in getAllBanks) {
            var bank = getAllBanks[i];
            listAllBanks.push({title: bank.title, value: bank.id})
        }

        console.log("listAllBanks", listAllBanks);

        // добавляем поля
        form.append(
            formFields.select({label: "Банк", name: "id_bank", option: listAllBanks, sort: "true", search: "true", disabled: (data != undefined) ? "true" : "", validate: "true"}),
            formFields.inputText({label: "Ставка (в процентах)", name: "rate", mask: 'number', validate: "true"}),
            formFields.inputText({label: "Первый взнос от (в процентах)", name: "initial_payment", mask: 'number', validate: "true"}),
            formFields.inputHidden({name: "id_site", value: project.id}),
            formFields.inputHidden({name: "id", value: (data !== undefined) ? data.id : ""})
        );

        // заполняем поля формы из БД
        if (data != undefined) formFields.setValuesForm(form, data);

        var modal = new Modal({
            title: titleModal,
            classModal: 'P-modal-add-bank',
            content: form,
            mode: 'center',
            width: '540px',
            footerEvents:{
                cancel: {
                    active: true,
                },
                submit: {
                    active: true,
                    title: titleBtn,
                    callback: function() {
                        sendFormAdv();
                    }
                },
            }
        });

        function sendFormAdv() {
            var getValuesForm = formFields.getValuesForm(form);

            if (getValuesForm.status == false) return false;

            // добавление
            if (data == undefined) {
                // отправляем данные
                var addNewBank = XMLHttpRequestAJAX({
                    url: "/api/site/banks/add-bank",
                    method: "POST",
                    body: getValuesForm.form
                });

                if (addNewBank.code === 200) {
                    rowItemTable(addNewBank.data);
                    modal.closeModal();
                    alertNotification({status: "success", text: "Запись успешно добавлена", pos: "top-center"});
                } else {
                    alertNotification({status: "error", text: "Ошибка при добавлении записи", pos: "top-center"});
                }
            }

            // редактирование
            if (data !== undefined) {
                // отправляем данные
                var updateBank = XMLHttpRequestAJAX({
                    url: "/api/site/banks/update-bank",
                    method: "POST",
                    body: getValuesForm.form
                });
                console.log(updateBank);

                if (updateBank.code === 200) {
                    rowItemTable(updateBank.data);

                    var listContainer = tableHTML.querySelector("tbody"),
                        replaceableItem = tableHTML.querySelector(".row-item[data-id='"+data.id+"']"),
                        allItem = tableHTML.querySelectorAll(".row-item"),
                        newItem = allItem[allItem.length - 1];

                    listContainer.replaceChild(newItem, replaceableItem);
                    modal.closeModal();
                    alertNotification({status: "success", text: "Запись успешно обновлена", pos: "top-center"});
                } else {
                    alertNotification({status: "error", text: "Ошибка при обновлении записи", pos: "top-center"});
                }
            }
        }
    }
}