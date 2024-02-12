export default function meta(project) {
    var formFields = new FormFields();

    var sectionHTML = document.createElement("section");
    sectionHTML.classList.add("P-meta");
    document.getElementById("app").append(sectionHTML);

    btnAddMeta();
    getAllMeta();

    function getAllMeta() {
        // получаем данные
        var getMeta = XMLHttpRequestAJAX({
            url: "/api/site/meta/get-meta",
            method: "GET",
            body: {
                id_site: project.id
            }
        });

        console.log("getMeta", getMeta);

        if (getMeta.code === 200) {
            for (var i in getMeta.data) {
                metaItem(getMeta.data[i]);
            }
        }
    }

    function metaNewEditModal(data) {
        var form = document.createElement("form"),
            titleModal = (data === undefined) ? "Добавить Meta" : "Редактирование",
            titleBtn = (data === undefined) ? "Добавить" : "Готово";

        // добавляем поля
        form.append(
            formFields.inputHidden({name: "id", value: (data !== undefined) ? data.id : ""}),
            formFields.inputText({label: "Название", name: "title", validate: "true"}),
            formFields.textarea({label: "Код", name: "code", validate: "true"}),
            formFields.textarea({label: "Комментарий", name: "comment", validate: "false"}),
            formFields.inputHidden({label: "id_site", name: "id_site", value: project.id})
        );

        // заполняем поля формы из БД
        if (data != undefined) formFields.setValuesForm(form, data);

        var modal = new Modal({
            title: titleModal,
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
                    title: titleBtn,
                    callback: function() {
                        sendForm();
                    }
                },
            }
        });

        function sendForm() {
            var getValuesForm = formFields.getValuesForm(form);

            if (getValuesForm.status === false) return false;

            // добавление
            if (data === undefined) {
                // отправляем данные
                var addNewMeta = XMLHttpRequestAJAX({
                    url: "/api/site/meta/add-meta",
                    method: "POST",
                    body: getValuesForm.form
                });

                if (addNewMeta.code === 200) {
                    metaItem(addNewMeta.data);
                    modal.closeModal();
                    alertNotification({status: "success", text: "Запись успешно добавлена", pos: "top-center"});
                } else {
                    alertNotification({status: "error", text: "Ошибка при добавлении записи", pos: "top-center"});
                }
            }

            // редактирование
            if (data !== undefined) {
                // отправляем данные
                var updateMeta = XMLHttpRequestAJAX({
                    url: "/api/site/meta/edit-meta",
                    method: "POST",
                    body: getValuesForm.form
                });
                console.log(updateMeta);

                if (updateMeta.code === 200) {
                    // metaItem(updateMeta.data);
                    //
                    // var listContainer = tableHTML.querySelector("tbody"),
                    //     replaceableItem = tableHTML.querySelector(".row-item[data-id='"+data.id+"']"),
                    //     allItem = tableHTML.querySelectorAll(".row-item"),
                    //     newItem = allItem[allItem.length - 1];
                    //
                    // listContainer.replaceChild(newItem, replaceableItem);
                    modal.closeModal();
                    alertNotification({status: "success", text: "Запись успешно обновлена", pos: "top-center"});
                } else {
                    alertNotification({status: "error", text: "Ошибка при обновлении записи", pos: "top-center"});
                }
            }
        }
    }
    
    function metaItem(meta) {
        var metaHTML = document.createElement("div");
        metaHTML.classList.add("meta-item");
        metaHTML.classList.add("card-body");
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
            metaNewEditModal(meta);
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
            metaNewEditModal()
        });
    }
}