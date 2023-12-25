export default function advantages(project) {
    var formFields = new FormFields();

    var blockTAG = document.createElement("section");
    blockTAG.classList.add("P-advantages");
    document.getElementById("app").append(blockTAG);

    tabsAdvantages();
    advantages_index();

    function tabsAdvantages() {
        var tabsHTML = document.createElement("div");
        tabsHTML.classList.add("P-advantages-tabs");
        tabsHTML.innerHTML = `
        <button type="button" class="btn btn-tab active" data-tab="index">Основные</button>
        <button type="button" class="btn btn-tab" data-tab="numbers">В цифрах</button>`;
        blockTAG.append(tabsHTML);

        var tabs = tabsHTML.querySelectorAll(".btn-tab");

        tabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                var target = this.getAttribute("data-tab");

                // Удаление класса "active" у всех кнопок
                tabs.forEach(tab => {
                    tab.classList.remove('active');
                });
                // Добавление класса "active" к кликнутой кнопке
                tab.classList.add('active');


                const childElements = Array.from(blockTAG.children);
                childElements.forEach((element) => {
                    if (!element.classList.contains("P-advantages-tabs")) element.remove();
                });

                if (target == "index") advantages_index();
                if (target == "numbers") advantages_numbers();
            });
        });
    }

    function advantages_index() {
        // получаем данные
        var getAdvantages = XMLHttpRequestAJAX({
            url: "/api/site/advantages/list",
            method: "GET",
            body: {
                id_site: project.id
            }
        });
        console.log("getAdvantages", getAdvantages);

        var tableHTML;

        var advIndexHTML = document.createElement("div");
        advIndexHTML.classList.add("P-adv-index");
        advIndexHTML.innerHTML = `
        <div class="card-body">
            <div class="header-card-body">
                <h4 class="title-card">Основные</h4>
            </div>
            <div class="content-card"></div>
        </div>`;
        blockTAG.append(advIndexHTML);

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
            advIndexHTML.querySelector(".content-card").prepend(tableHTML);

            tableHTML.querySelector(".btn-add-item").addEventListener("click", function () {
                modalItemAdv();
            });
        }

        function getAllAdv() {
            if (getAdvantages.code === 200) {
                for (var i in getAdvantages.data) {
                    rowAdvTable(getAdvantages.data[i]);
                }
            }
        }

        function rowAdvTable(adv) {
            var rowHTML = document.createElement("tr");
            rowHTML.classList.add("row-adv");
            rowHTML.setAttribute("data-id", adv.id)
            rowHTML.innerHTML = `
            <td class="col-id">${adv.id}</td>
            <td class="col-photo">
                <img src="${adv.photo}" class="photo-adv">
            </td>
            <td class="col-title">
                <span class="title">${adv.title}</span>
                <span class="desc">${adv.description}</span>
            </td>
            <td class="col-date">${DateFormat(adv.date_create, "d Month, N (H:i)")}</td>
            <td class="col-status"></td>
            <td class="col-events">
                <div class="row-container">
                    <button type="button" class="btn btn-outline-primary btn-square btn-edit"><i class="ph ph-pencil-simple"></i></button>
                    <button type="button" class="btn btn-outline-primary btn-square btn-delete"><i class="ph ph-trash"></i></button>
                </div>
            </td>`;
            tableHTML.querySelector("tbody .add-new-item").before(rowHTML);

            // вставляем switch активности сайта
            var switchActivity = formFields.switchRadio({name: "activity", checked: adv.activity, callback: isActivitySite})
            rowHTML.querySelector(".col-status").append(switchActivity);

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
                modalItemAdv(adv);
            });

            // удаление записи
            rowHTML.querySelector(".btn-delete").addEventListener("click", function () {
                modalAlert({
                    type: "delete",
                    title: adv.title,
                    callback: deleteSite,
                });

                // запрос на удаление записи
                function deleteSite() {
                    var deleteAdv = XMLHttpRequestAJAX({
                        url: "/api/site/advantages/list",
                        method: "DELETE",
                        body: adv
                    });

                    if (deleteAdv.code === 200) {
                        rowHTML.remove();
                        alertNotification({status: "success", text: "Запись успешно удалена", pos: "top-center"});
                    } else {
                        alertNotification({status: "error", text: "Ошибка при удалении записи", pos: "top-center"});
                    }
                }
            });
        }

        function modalItemAdv(data) {
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
                classModal: 'P-modal-add-adv',
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
                var sendAdvantages = XMLHttpRequestAJAX({
                    url: "/api/site/advantages/list",
                    method: method,
                    body: getValuesForm.form
                });
                console.log(sendAdvantages);

                if (data == undefined) {
                    if (sendAdvantages.code === 200) {
                        rowAdvTable(sendAdvantages.data);
                        modal.closeModal();
                        alertNotification({status: "success", text: "Запись успешно добавлена", pos: "top-center"});
                    } else {
                        alertNotification({status: "error", text: "Ошибка при добавлении записи", pos: "top-center"});
                    }
                } else {
                    if (sendAdvantages.code === 200) {
                        rowAdvTable(sendAdvantages.data)

                        var listContainer = tableHTML.querySelector("tbody"),
                            replaceableItem = tableHTML.querySelector(".row-adv[data-id='"+data.id+"']"),
                            allItem = tableHTML.querySelectorAll(".row-adv"),
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

    function advantages_numbers() {
        // получаем данные
        var getAdv_num = XMLHttpRequestAJAX({
            url: "/api/site/advantages/numbers",
            method: "GET",
            body: {id_site: project.id}
        });
        console.log("getAdv_num", getAdv_num)

        var advNumbersHTML = document.createElement("div");
        advNumbersHTML.classList.add("P-adv-index");
        advNumbersHTML.innerHTML = `
        <div class="card-body">
            <div class="header-card-body">
                <h4 class="title-card">В цифрах</h4>
            </div>
            <div class="content-card">
                <div class="footer-events">
                    <button type="button" class="btn btn-primary btn-icon-left btn-save-form" target="about"><i class="ph ph-check-circle"></i>Сохранить</button>
                </div>
            </div>
        </div>`;
        blockTAG.append(advNumbersHTML);

        initForm();

        function initForm() {
            var form = document.createElement("form");
            advNumbersHTML.querySelector(".content-card").prepend(form);

            form.append(
                (() => {
                    const divElement = document.createElement("div");
                    divElement.classList.add("two-fields");
                    divElement.append(
                        formFields.inputText({label: "Число", name: "number_1", mask: 'number', validate: "true"}),
                        formFields.inputText({label: "Значение", name: "value_1", validate: "true"}),
                        formFields.inputText({label: "Описание", name: "description_1", validate: "true"})
                    );
                    return divElement;
                })(),
                (() => {
                    const divElement = document.createElement("div");
                    divElement.classList.add("two-fields");
                    divElement.append(
                        formFields.inputText({label: "Число", name: "number_2", mask: 'number', validate: "true"}),
                        formFields.inputText({label: "Значение", name: "value_2", validate: "true"}),
                        formFields.inputText({label: "Описание", name: "description_2", validate: "true"})
                    );
                    return divElement;
                })(),
                (() => {
                    const divElement = document.createElement("div");
                    divElement.classList.add("two-fields");
                    divElement.append(
                        formFields.inputText({label: "Число", name: "number_3", mask: 'number', validate: "true"}),
                        formFields.inputText({label: "Значение", name: "value_3", validate: "true"}),
                        formFields.inputText({label: "Описание", name: "description_3", validate: "true"})
                    );
                    return divElement;
                })(),
                (() => {
                    const divElement = document.createElement("div");
                    divElement.classList.add("two-fields");
                    divElement.append(
                        formFields.inputText({label: "Число", name: "number_4", mask: 'number', validate: "true"}),
                        formFields.inputText({label: "Значение", name: "value_4", validate: "true"}),
                        formFields.inputText({label: "Описание", name: "description_4", validate: "true"})
                    );
                    return divElement;
                })()
            );
            // заполняем поля формы из БД
            if (getAdv_num.code === 200) {
                formFields.setValuesForm(form, getAdv_num.data);
            }

            advNumbersHTML.querySelector(".btn-save-form").addEventListener("click", function () {
                var getBtnSave = this,
                    getValuesForm = formFields.getValuesForm(form);

                if (getValuesForm.status == false) return false;

                getValuesForm.form.id_site = project.id;

                var updateGeneralInfo = XMLHttpRequestAJAX({
                    url: "/api/site/advantages/numbers",
                    method: "POST",
                    body: getValuesForm.form
                });

                if (updateGeneralInfo.code === 200) {
                    animationBtnSuccess(getBtnSave);
                    alertNotification({status: "success", text: "Данные успешно обновлены", pos: "top-center"});
                } else {
                    alertNotification({status: "error", text: "Ошибка при сохранении данных", pos: "top-center"});
                    console.log(updateGeneralInfo.data);
                }
            });
        }
    }
}