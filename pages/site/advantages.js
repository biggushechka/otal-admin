export default function advantages(project) {
    var formFields = new FormFields();

    // получаем данные
    var getAdvantages = XMLHttpRequestAJAX({
        url: "/api/site/advantages",
        method: "GET",
        body: {
            id_site: project.id
        }
    });
    console.log("getAdvantages", getAdvantages)

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


                if (target == "index") {
                    advantages_index();
                }

                if (target == "numbers") {
                    advantages_numbers();
                }
            });
        });
    }

    function advantages_index() {
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
                // var isActivity = XMLHttpRequestAJAX({
                //     url: "/api/site/general/isActivity2",
                //     method: "UPDATE",
                //     body: {
                //         id_site: site.id,
                //         activity: status
                //     }
                // });
                //
                // if (isActivity.code === 200) {
                //     var status = (isActivity.data.activity == "off") ? "выключен" : "включен";
                //     alertNotification({status: "success", text: `Cайт ${site.domain} - ${status}`, pos: "top-center"});
                // }
                //
                // return isActivity.data.activity
            }

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
                        url: "/api/site/advantages",
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

        function modalItemAdv() {
            var form = document.createElement("form");

            // добавляем поля
            form.append(
                formFields.inputText({label: "Заголовок", name: "title", validate: "true"}),
                formFields.textarea({label: "Описание", name: "description", validate: "true"}),
                formFields.photos({label: "Прикрепить фотографию", name: "photos", ext: "img", multiple: "false", validate: "true"}),
                formFields.inputHidden({label: "id_site", name: "id_site", value: project.id})
            );

            var modal = new Modal({
                title: "Добавить запись",
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
                var getValuesForm = formFields.getValuesForm(form);

                if (getValuesForm.status == false) return false;

                console.log("getValuesForm.form", getValuesForm.form)

                // отправляем данные
                var sendAdvantages = XMLHttpRequestAJAX({
                    url: "/api/site/advantages",
                    method: "POST",
                    body: getValuesForm.form
                });
                console.log(sendAdvantages);

                if (sendAdvantages.code === 200) {
                    rowAdvTable(sendAdvantages.data);
                    modal.closeModal();
                    alertNotification({status: "success", text: "Запись успешно добавлена", pos: "top-center"});
                } else {
                    alertNotification({status: "error", text: "Ошибка при добавлении записи", pos: "top-center"});
                }
            }
        }
    }

    function advantages_numbers() {
        console.log("numbers");
    }
}