export default function general_info(project) {
    var formFields = new FormFields();

    // получаем данные
    var getGeneralInfo = XMLHttpRequestAJAX({
        url: "/api/site/general/info",
        method: "GET",
        body: {
            id_site: project.id
        }
    });
    var getValForm = getGeneralInfo.data;

    var blockTAG = document.createElement("section");
    blockTAG.classList.add("P-general-info");
    blockTAG.innerHTML = `
    <div class="card-body">
        <div class="content-card">
            <div class="preview-image-project"></div>
            <form class="form-container"></form>
            <div class="footer-events">
                <button type="button" class="btn btn-primary btn-icon-left btn-save-form"><i class="ph ph-check-circle"></i>Сохранить</button>
            </div>
        </div>
    </div>`;
    document.getElementById("app").append(blockTAG);

    coverProject();
    initForm();

    // Обложка проекта
    function coverProject() {
        blockTAG.querySelector(".preview-image-project").innerHTML = "";

        if (getValForm.preview_photo == "") {
            var coverTAG = document.createElement("div");
            coverTAG.classList.add("upload-photo");
            coverTAG.innerHTML = `
                <span class="title">Обложка проекта</span>
                <span class="desc">Вы можете загрузить обложку проекта, для визуального представления. <br>(к контенту сайта она не относится)</span>
                <button type="button" class="btn btn-outline-primary btn-upload-photo">Добавить</button>`;
            blockTAG.querySelector(".preview-image-project").append(coverTAG);
        } else {
            var coverTAG = document.createElement("div");
            coverTAG.classList.add("cover-photo");
            coverTAG.innerHTML = `
                <img src="${getValForm.preview_photo}" alt="cover_project">
                <button type="button" class="btn btn-upload-photo">Изменить</button>`;
            blockTAG.querySelector(".preview-image-project").append(coverTAG);
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
                    alertNotification({status: "success", text: "Обложка успешно обновлена", pos: "top-center"});
                } else {
                    alertNotification({status: "error", text: "Ошибка при обновлении обложки", pos: "top-center"});
                }
            }

        });
    }

    function initForm() {
        // вставляем поля формы
        blockTAG.querySelector("form").append(
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
        formFields.setValuesForm(blockTAG.querySelector("form"), getValForm);

        // Обновляем поля формы
        blockTAG.querySelector(".footer-events .btn-save-form").addEventListener("click", function () {
            var getBtnSave = this,
                getValuesForm = formFields.getValuesForm(blockTAG.querySelector("form"));

            if (getValuesForm.status == false) return false;

            var updateGeneralInfo = XMLHttpRequestAJAX({
                url: "/api/site/general/info",
                method: "POST",
                body: getValuesForm.form
            });

            if (updateGeneralInfo.code === 200) {
                animationBtnSuccess(getBtnSave);
                alertNotification({status: "success", text: "Данные успешно обновлены", pos: "top-center"});
            } else {
                alertNotification({status: "success", text: "Ошибка при сохранении данных", pos: "top-center"});
                console.log(updateGeneralInfo.data);
            }
        });
    }
}