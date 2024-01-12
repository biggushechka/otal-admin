export default function banks(project) {
    var formFields = new FormFields(),
        tableHTML;

    // получаем данные
    // var getBanks = XMLHttpRequestAJAX({
    //     url: "/api/site/banks/list",
    //     method: "GET",
    //     body: {
    //         id_site: project.id
    //     }
    // });
    // getBanks = getBanks.data;
    // console.log("banks", getBanks)

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
            <td class="col-logo">${bank.logo}</td>
            <td class="col-title">${bank.title}</td>
            <td class="col-rate">${bank.rate}</td>
            <td class="col-initial_payment">${bank.initial_payment}</td>
            <td class="col-status"></td>
            <td class="col-events">
                <div class="row-container">
                    <button type="button" class="btn btn-outline-primary btn-square btn-edit"><i class="ph ph-pencil-simple"></i></button>
                    <button type="button" class="btn btn-outline-primary btn-square btn-delete"><i class="ph ph-trash"></i></button>
                </div>
            </td>`;
        tableHTML.querySelector("tbody .add-new-item").before(rowHTML);

        // вставляем switch активности сайта
        var switchActivity = formFields.switchRadio({name: "activity", checked: data.activity, callback: isActivitySite})
        rowHTML.querySelector(".col-status").append(switchActivity);

        // изменение активности сайта
        // function isActivitySite(status) {
        //     var isActivity = XMLHttpRequestAJAX({
        //         url: "/api/site/infrastructure/isActivity",
        //         method: "POST",
        //         body: {
        //             id_adv: data.id,
        //             id_site: project.id,
        //             activity: status
        //         }
        //     });
        //
        //     if (isActivity.code === 200) {
        //         var status = (isActivity.data.activity == "off") ? "выключена" : "активна";
        //         alertNotification({status: "success", text: `Запись ${status}`, pos: "top-center"});
        //     }
        //
        //     return isActivity.data.activity
        // }

        // редактирование записи
        // rowHTML.querySelector(".btn-edit").addEventListener("click", function () {
        //     modalItem(data);
        // });

        // удаление записи
        // rowHTML.querySelector(".btn-delete").addEventListener("click", function () {
        //     modalAlert({
        //         type: "delete",
        //         title: data.title,
        //         callback: deleteSite,
        //     });
        //
        //     // запрос на удаление записи
        //     function deleteSite() {
        //         var deleteItem = XMLHttpRequestAJAX({
        //             url: "/api/site/infrastructure/list",
        //             method: "DELETE",
        //             body: data
        //         });
        //
        //         if (deleteItem.code === 200) {
        //             rowHTML.remove();
        //             alertNotification({status: "success", text: "Запись успешно удалена", pos: "top-center"});
        //         } else {
        //             alertNotification({status: "error", text: "Ошибка при удалении записи", pos: "top-center"});
        //         }
        //     }
        // });
    }

    function modalItem(data) {
        var form = document.createElement("form"),
            titleModal = (data == undefined) ? "Добавить банк" : "Редактирование банк #"+data.id,
            titleBtn = (data == undefined) ? "Добавить" : "Готово",
            listAllBanks = [];

        if (data == undefined) {
            // получаем данные
            var getAllBanks = XMLHttpRequestAJAX({
                url: "/api/site/banks/all",
                method: "GET"
            });

            if (getAllBanks.code === 200) getAllBanks = getAllBanks.data;

            for (var i in getAllBanks) {
                var bank = getAllBanks[i];
                listAllBanks.push(bank.title)
            }
        }

        // добавляем поля
        form.append(
            formFields.select({label: "Банк", name: "title_bank", option: listAllBanks, sort: "true", search: "true", validate: "true"}),
            formFields.inputText({label: "Ставка (в процентах)", name: "rate", mask: 'number', validate: "true"}),
            formFields.inputText({label: "Первый взнос от (в процентах)", name: "initial_payment", mask: 'number', validate: "true"}),
            formFields.inputHidden({name: "id_site", value: project.id})
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

        function getAllAdv() {
            if (getInfrastructure.code === 200) {
                for (var i in getInfrastructure.data) {
                    rowItemTable(getInfrastructure.data[i]);
                }
            }
        }

        function sendFormAdv() {
            var getValuesForm = formFields.getValuesForm(form);

            if (getValuesForm.status == false) return false;

            console.log("getValuesForm.form", getValuesForm.form)

            // отправляем данные
            var sendInfrastructure = XMLHttpRequestAJAX({
                url: "/api/site/banks/list",
                method: "POST",
                body: getValuesForm.form
            });
            console.log(sendInfrastructure);

            if (data == undefined) {
                if (sendInfrastructure.code === 200) {
                    rowItemTable(sendInfrastructure.data);
                    modal.closeModal();
                    alertNotification({status: "success", text: "Запись успешно добавлена", pos: "top-center"});
                } else {
                    alertNotification({status: "error", text: "Ошибка при добавлении записи", pos: "top-center"});
                }
            } else {
                if (sendInfrastructure.code === 200) {
                    rowItemTable(sendInfrastructure.data);

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