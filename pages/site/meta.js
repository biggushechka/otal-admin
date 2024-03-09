export default function meta(project) {
    var formFields = new FormFields();

    var sectionHTML = document.createElement("section");
    sectionHTML.classList.add("P-meta");
    document.getElementById("app").append(sectionHTML);

    btnAddMeta();
    outputTitle();
    getAllMeta();

    function outputTitle() {
        var titleHTML = document.createElement("div");
        titleHTML.classList.add("meta-item");
        titleHTML.classList.add("card-body");
        titleHTML.setAttribute("meta-id", meta.id)
        titleHTML.innerHTML = `
        <div class="header-card-body">
            <h4 class="title-card">Title страницы</h4>
        </div>
        <div class="content-card">
            <form></form>
        </div>
        <div class="footer-events">
            <button type="button" class="btn btn-primary btn-icon-left btn-edit-title"><i class="ph ph-check-circle"></i>Сохранить</button>
        </div>`;
        sectionHTML.querySelector(".btn-add-container").before(titleHTML);

        var form = titleHTML.querySelector("form");

        // добавляем поля
        form.append(
            formFields.inputText({name: "code", validate: "true"}),
            formFields.inputHidden({name: "id", validate: "true"}),
            formFields.inputHidden({name: "title", value: "title", validate: "true"}),
            formFields.inputHidden({name: "comment", value: "", validate: "true"}),
        );

        // получаем данные
        var getTitle = XMLHttpRequestAJAX({
            url: "/api/site/meta/get-meta",
            method: "GET",
            body: {
                type: "title",
                id_site: project.id
            }
        });

        if (getTitle.code === 200) {
            getTitle = getTitle.data[0];

            // заполняем поля формы из БД
            formFields.setValuesForm(form, getTitle);
        }

        titleHTML.querySelector(".btn-edit-title").addEventListener("click", function () {
            var getValuesForm = formFields.getValuesForm(form);

            if (getValuesForm.status === false) return false;

            // отправляем данные
            var updateMeta = XMLHttpRequestAJAX({
                url: "/api/site/meta/edit-meta",
                method: "POST",
                body: getValuesForm.form
            });

            if (updateMeta.code === 200) {
                alertNotification({status: "success", text: "Запись успешно обновлена", pos: "top-center"});
            } else {
                alertNotification({status: "error", text: "Ошибка при обновлении записи", pos: "top-center"});
            }
        });
    }

    function getAllMeta() {
        // получаем данные
        var getMeta = XMLHttpRequestAJAX({
            url: "/api/site/meta/get-meta",
            method: "GET",
            body: {
                type: "meta",
                id_site: project.id
            }
        });

        if (getMeta.code === 200) {
            console.log("all-meta", getMeta.data)
            for (var i in getMeta.data) {
                outputMetaItem(getMeta.data[i]);
            }
        }
    }

    function addNewMeta() {
        var form = document.createElement("form");

        // добавляем поля
        form.append(
            formFields.inputText({label: "Название", name: "title", validate: "true"}),
            formFields.textarea({label: "Код", name: "code", validate: "true"}),
            formFields.textarea({label: "Комментарий", name: "comment", validate: "false"}),
            formFields.inputHidden({label: "id_site", name: "id_site", value: project.id})
        );

        var modal = new Modal({
            title: "Добавить Meta",
            classModal: 'P-modal-add-meta',
            content: form,
            mode: 'center',
            width: '540px',
            footerEvents:{
                cancel: {
                    active: true,
                },
                submit: {
                    active: true,
                    title: "Добавить",
                    callback: function() {
                        sendForm();
                    }
                },
            }
        });

        function sendForm() {
            var getValuesForm = formFields.getValuesForm(form);

            if (getValuesForm.status === false) return false;

            // отправляем данные
            var addNewMeta = XMLHttpRequestAJAX({
                url: "/api/site/meta/add-meta",
                method: "POST",
                body: getValuesForm.form
            });

            if (addNewMeta.code === 200) {
                outputMetaItem(addNewMeta.data);
                modal.closeModal();
                alertNotification({status: "success", text: "Запись успешно добавлена", pos: "top-center"});
            } else {
                alertNotification({status: "error", text: "Ошибка при добавлении записи", pos: "top-center"});
            }
        }
    }

    function editMeta(data) {
        var form = document.createElement("form");

        // добавляем поля
        form.append(
            formFields.inputText({label: "Название", name: "title", validate: "true"}),
            formFields.textarea({label: "Код", name: "code", validate: "true"}),
            formFields.textarea({label: "Комментарий", name: "comment", validate: "false"}),
            formFields.inputHidden({name: "id", value: data.id}),
            formFields.inputHidden({label: "id_site", name: "id_site", value: project.id})
        );

        // заполняем поля формы из БД
        formFields.setValuesForm(form, data);

        var modal = new Modal({
            title: "Редактирование",
            classModal: 'P-modal-add-meta',
            content: form,
            mode: 'center',
            width: '540px',
            footerEvents:{
                cancel: {
                    active: true,
                },
                submit: {
                    active: true,
                    title: "Готово",
                    callback: function() {
                        sendForm();
                    }
                },
            }
        });

        function sendForm() {
            var getValuesForm = formFields.getValuesForm(form);

            if (getValuesForm.status === false) return false;

            // отправляем данные
            var updateMeta = XMLHttpRequestAJAX({
                url: "/api/site/meta/edit-meta",
                method: "POST",
                body: getValuesForm.form
            });

            if (updateMeta.code === 200) {
                outputMetaItem(updateMeta.data);

                var replaceableItem = sectionHTML.querySelector(".meta-item[meta-id='"+data.id+"']"),
                    allItem = sectionHTML.querySelectorAll(".meta-item"),
                    newItem = allItem[allItem.length - 1];

                sectionHTML.replaceChild(newItem, replaceableItem);

                modal.closeModal();
                alertNotification({status: "success", text: "Запись успешно обновлена", pos: "top-center"});
            } else {
                alertNotification({status: "error", text: "Ошибка при обновлении записи", pos: "top-center"});
            }
        }
    }

    function outputMetaItem(meta) {
        var metaHTML = document.createElement("div");
        metaHTML.classList.add("meta-item");
        metaHTML.classList.add("card-body");
        metaHTML.setAttribute("meta-id", meta.id)
        metaHTML.innerHTML = `
        <div class="header-card-body">
            <h4 class="title-card">${meta.title}</h4>
        </div>
        <div class="content-card"></div>
        <div class="footer-events">
            <button type="button" class="btn btn-outline-primary btn-icon-left btn-delete-meta"><i class="ph ph-trash"></i>Удалить</button>
            <button type="button" class="btn btn-primary btn-icon-left btn-edit-meta"><i class="ph ph-pencil-simple"></i>Редактировать</button>
        </div>`;
        sectionHTML.querySelector(".btn-add-container").before(metaHTML);

        // вставляем switch активности сайта
        var switchActivity = formFields.switchRadio({name: "activity", checked: meta.activity, callback: isActivitySite})
        metaHTML.querySelector(".header-card-body").append(switchActivity);

        function isActivitySite(status) {
            var isActivity = XMLHttpRequestAJAX({
                url: "/api/site/meta/activity-meta",
                method: "POST",
                body: {
                    id_site: project.id,
                    id_meta: meta.id,
                    activity: status
                }
            });

            if (isActivity.code === 200) {
                var status = (isActivity.data.activity == "off") ? "выключена" : "активна";
                alertNotification({status: "success", text: `Запись ${status}`, pos: "top-center"});
            }

            return isActivity.data.activity
        }

        if (meta.code != undefined && meta.code != "") {
            var code = document.createElement("pre");
            code.innerHTML = `<code class="hljs">${formattingСode(meta.code)}</code>`;
            metaHTML.querySelector(".content-card").append(code);
            hljs.highlightAll();
        }

        if (meta.comment != undefined && meta.comment != "") {
            var comment = document.createElement("div");
            comment.innerHTML = `
            <div class="comment-block">
                <span class="title">Комментарий:</span>
                <span class="desc">${meta.comment}</span>
            </div>`;
            metaHTML.querySelector(".content-card").append(comment);
        }

        metaHTML.querySelector(".btn-edit-meta").addEventListener("click", function () {
            editMeta(meta);
        });

        metaHTML.querySelector(".btn-delete-meta").addEventListener("click", function () {
            modalAlert({
                type: "delete",
                title: meta.title,
                callback: deleteMeta,
            });

            // запрос на удаление записи
            function deleteMeta() {
                var deleteItem = XMLHttpRequestAJAX({
                    url: "/api/site/meta/delete-meta",
                    method: "DELETE",
                    body: {id: meta.id}
                });

                if (deleteItem.code === 200) {
                    metaHTML.remove();
                    alertNotification({status: "success", text: "Запись успешно удалена", pos: "top-center"});
                } else {
                    alertNotification({status: "error", text: "Ошибка при удалении записи", pos: "top-center"});
                }
            }
        });
    }

    function formattingСode(markup) {
        var modifiedTemplate = markup.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return modifiedTemplate;
    }

    function btnAddMeta() {
        var btnAddMetaHTML = document.createElement("div");
        btnAddMetaHTML.classList.add("btn-add-container");
        btnAddMetaHTML.innerHTML = `
        <button type="button" class="btn btn-icon-left btn-add-item_full"><i class="ph ph-plus-circle"></i>Добавить Meta</button>`;
        sectionHTML.append(btnAddMetaHTML);

        btnAddMetaHTML.addEventListener("click", function () {
            addNewMeta();
        });
    }
}