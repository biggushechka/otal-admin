export default function general_info(project) {
    var formFields = new FormFields();

    console.log(project.title, project)

    var blockTAG = document.createElement("section");
    blockTAG.classList.add("P-general-info");
    blockTAG.innerHTML = `
    <div class="card-body">
        <div class="content-card"></div>
    </div>`;
    document.getElementById("app").append(blockTAG);

    initForm();

    function initForm() {
        // получаем данные
        var getGeneralInfo = XMLHttpRequestAJAX({
            url: "/api/site/general/info",
            method: "GET",
            body: {
                id_site: project.id
            }
        });
        var getValForm = getGeneralInfo.data;
        console.log("getValForm", getValForm)


        // выводим верстку
        var formTAG = document.createElement("div");
        formTAG.classList.add("form-wrapper");
        var formHTML = `
        <div class="preview-image-project"></div>
        <form class="form-container"></form>
        <div class="footer-events">
            <button type="button" class="btn btn-primary btn-icon-left btn-save-form"><i class="ph ph-check-circle"></i>Сохранить</button>
        </div>`;
        formTAG.innerHTML = formHTML;
        blockTAG.querySelector(".content-card").append(formTAG);

        coverProject();

        // Обложка проекта
        function coverProject() {
            formTAG.querySelector(".preview-image-project").innerHTML = "";

            if (getValForm.preview_photo == "") {
                var coverTAG = document.createElement("div");
                coverTAG.classList.add("upload-photo");
                coverTAG.innerHTML = `
                <span class="title">Обложка проекта</span>
                <span class="desc">Вы можете загрузить обложку проекта, для визуального представления. <br>(к контенту сайта она не относится)</span>
                <button type="button" class="btn btn-outline-primary btn-upload-photo">Добавить</button>`;
                formTAG.querySelector(".preview-image-project").append(coverTAG);
            } else {
                var coverTAG = document.createElement("div");
                coverTAG.classList.add("cover-photo");
                coverTAG.innerHTML = `
                <img src="${getValForm.preview_photo}" alt="cover_project">
                <button type="button" class="btn btn-upload-photo">Изменить</button>`;
                formTAG.querySelector(".preview-image-project").append(coverTAG);
            }

            coverTAG.querySelector(".btn-upload-photo").addEventListener("click", function () {
                getUploadFiles({
                    ext: "img",
                    multiple: "false"
                }, fileProcessing);

                function fileProcessing(files) {

                    if (files.length == 0) return false;

                    // получаем данные
                    var postCover = XMLHttpRequestAJAX({
                        url: "/api/site/general/cover",
                        method: "POST",
                        body: {
                            id_site: project.id,
                            cover: files
                        }
                    });

                    if (postCover.code === 200) {
                        getValForm.preview_photo = postCover.data;
                        coverProject();
                    }
                }

            });
        }

        // вставляем поля формы
        formTAG.querySelector("form").append(
            formFields.inputText({label: "Название ЖК", name: "title_project", validate: "true"}),
            formFields.inputText({label: "Телефон (офис продаж)", name: "phone", mask: "phone", validate: "true"}),
            formFields.inputText({label: "E-mail", name: "email", mask: "email", validate: "false"}),
            formFields.inputText({label: "Telegram (номер)", name: "telegram_phone", mask: "phone", validate: "false"}),
            formFields.inputText({label: "Telegram (ссылка на группу)", name: "telegram_link", validate: "false"}),
            formFields.inputText({label: "WhatsApp (номер)", name: "whatsapp_phone", mask: "phone", validate: "false"}),
            formFields.inputText({label: "WhatsApp (ссылка на группу)", name: "whatsapp_link", validate: "false"}),
            formFields.inputHidden({name: "id_site", value: project.id})
        );
        // заполняем поля формы из БД
        formFields.setValuesForm(formTAG.querySelector("form"), getValForm);

        // Обновляем поля формы
        formTAG.querySelector(".footer-events .btn-save-form").addEventListener("click", function () {
            var getBtnSave = this;
            var getValuesForm = formFields.getValuesForm(formTAG.querySelector("form"));

            if (getValuesForm.status == false) return false;

            var updateGeneralInfo = XMLHttpRequestAJAX({
                url: "/api/site/general/info",
                method: "POST",
                body: getValuesForm.form
            });

            if (updateGeneralInfo.code === 200) {
                animationBtnSuccess(getBtnSave);
                alertNotification({status: "success", text: "Данные успешно обновлены", pos: "top-center"});
            }
        });
    }
}