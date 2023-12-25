export default function infrastructure(project) {
    var formFields = new FormFields(),
        tableHTML;

    // получаем данные
    var getInfrastructure = XMLHttpRequestAJAX({
        url: "/api/site/infrastructure/list",
        method: "GET",
        body: {
            id_site: project.id
        }
    });
    console.log("getInfrastructure", getInfrastructure);

    var infrastructureHTML = document.createElement("div");
    infrastructureHTML.classList.add("P-infrastructure");
    infrastructureHTML.innerHTML = `
    <div class="card-body">
        <div class="header-card-body">
            <h4 class="title-card">Инфраструктура</h4>
        </div>
        <div class="content-card"></div>
    </div>`;
    document.getElementById("app").append(infrastructureHTML);

    initTable();
    getAllAdv();

    function initTable() {
        tableHTML = document.createElement("table");
        tableHTML.classList.add("P-table-adv");
        tableHTML.classList.add("G-table");
        tableHTML.innerHTML = `
        <thead>
            <tr>
                <th width="64">id</th>
                <th width="80">Фото</th>
                <th width="">Название</th>
                <th width="200">Дата</th>
                <th width="100">Статус</th>
                <th width="100">Действия</th>
            </tr>
        </thead>
        <tbody>
            <tr class="add-new-item">
                <td colspan="6">
                    <button type="button" class="btn btn-add-item btn-icon-left"><i class="ph ph-plus-circle"></i>Добавить запись</button>
                </td>
            </tr>
        </tbody>`;
        infrastructureHTML.querySelector(".content-card").prepend(tableHTML);

        tableHTML.querySelector(".btn-add-item").addEventListener("click", function () {
            modalItem();
        });
    }

    function getAllAdv() {
        if (getInfrastructure.code === 200) {
            for (var i in getInfrastructure.data) {
                rowItemTable(getInfrastructure.data[i]);
            }
        }
    }

    function rowItemTable(data) {
        var rowHTML = document.createElement("tr");
        rowHTML.classList.add("row-item");
        rowHTML.setAttribute("data-id", data.id)
        rowHTML.innerHTML = `
            <td class="col-id">${data.id}</td>
            <td class="col-photo">
                <img src="${data.photo}" class="photo-adv">
            </td>
            <td class="col-title">
                <span class="title">${data.title}</span>
                <span class="desc">${data.description}</span>
            </td>
            <td class="col-date">${DateFormat(data.date_create, "d Month, N (H:i)")}</td>
            <td class="col-status"></td>
            <td class="col-events">
                <div class="row-container">
                    <button type="button" class="btn btn-outline-primary btn-square btn-edit"><i class="ph ph-pencil-simple"></i></button>
                    <button type="button" class="btn btn-outline-primary btn-square btn-delete"><i class="ph ph-trash"></i></button>
                </div>
            </td>`;
        tableHTML.querySelector("tbody .add-new-item").before(rowHTML);

        // вставляем switch активности сайта
        // var switchActivity = formFields.switchRadio({name: "activity", checked: adv.activity, callback: isActivitySite})
        // rowHTML.querySelector(".col-status").append(switchActivity);

        // изменение активности сайта
        function isActivitySite(status) {
            var isActivity = XMLHttpRequestAJAX({
                url: "/api/site/advantages/isActivity",
                method: "POST",
                body: {
                    id_site: adv.id,
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
            modalItem(data);
        });

        // удаление записи
        rowHTML.querySelector(".btn-delete").addEventListener("click", function () {
            modalAlert({
                type: "delete",
                title: data.title,
                callback: deleteSite,
            });

            // запрос на удаление записи
            function deleteSite() {
                var deleteItem = XMLHttpRequestAJAX({
                    url: "/api/site/infrastructure/list",
                    method: "DELETE",
                    body: data
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

    function modalItem(data) {
        var form = document.createElement("form"),
            titleModal = (data == undefined) ? "Добавить запись" : "Редактирование записи #"+data.id;

        // добавляем поля
        form.append(
            formFields.inputText({label: "Заголовок", name: "title", validate: "true"}),
            formFields.textarea({label: "Описание", name: "description", validate: "true"}),
            formFields.photos({label: "Прикрепить фотографию", name: "photo", ext: "img", multiple: "false", validate: "true"}),
            formFields.inputHidden({label: "id_row", name: "id", value: (data != undefined) ? data.id : ""}),
            formFields.inputHidden({label: "id_site", name: "id_site", value: project.id})
        );

        // заполняем поля формы из БД
        if (data != undefined) formFields.setValuesForm(form, data);

        var modal = new Modal({
            title: titleModal,
            classModal: 'P-modal-add-infrastructure',
            content: form,
            mode: 'center',
            width: '540px',
            footerEvents:{
                cancel: {
                    active: true,
                },
                submit: {
                    active: true,
                    title: "Создать",
                    callback: function() {
                        sendFormAdv();
                    }
                },
            }
        });

        function sendFormAdv() {
            var getValuesForm = formFields.getValuesForm(form),
                method = (data == undefined) ? "POST" : "UPDATE";

            console.log("method", method)

            if (getValuesForm.status == false) return false;

            console.log("form", getValuesForm.form);

            // отправляем данные
            var sendInfrastructure = XMLHttpRequestAJAX({
                url: "/api/site/infrastructure/list",
                method: method,
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
                    rowItemTable(sendInfrastructure.data)

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