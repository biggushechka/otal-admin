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


        // выводим верстку
        var formTAG = document.createElement("div");
        formTAG.classList.add("form-wrapper");
        formTAG.innerHTML = `
        <div class="preview-image-project">
            <div class="upload-photo">
                <span class="title">Обложка проекта</span>
                <span class="desc">Вы можете загрузить обложку проекта, для визуального представления. <br>(к контенту сайта она не относится)</span>
                <button type="button" class="btn btn-outline-primary btn-upload-photo">Добавить</button>
            </div>
<!--            <img src="https://s0.rbk.ru/v6_top_pics/media/img/7/72/756570268423727.jpg">-->
        </div>
        <form class="form-container"></form>
        <div class="footer-events">
            <button type="button" class="btn btn-primary btn-icon-left btn-save-form"><i class="ph ph-check-circle"></i>Сохранить</button>
        </div>`;
        blockTAG.querySelector(".content-card").append(formTAG);

        // загрузить обложку проекта
        formTAG.querySelector(".btn-upload-photo").addEventListener("click", function () {
            getUploadFiles({
                ext: "img",
                choice: "multiple"
            }, fileProcessing);

            function fileProcessing(files) {

                if (files.length == 0) return false;

                console.log("cover__", files)

                // получаем данные
                var postCover = XMLHttpRequestAJAX({
                    url: "/api/site/general/cover",
                    method: "POST",
                    body: {
                        id_site: project.id,
                        cover: files
                    }
                });
                console.log("postCover", postCover);
            }

        });

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
                method: "UPDATE",
                body: getValuesForm.form
            });

            if (updateGeneralInfo.code === 200) {
                animationBtnSuccess(getBtnSave);
                alertNotification({status: "success", text: "Данные успешно обновлены", pos: "top-center"});
            }
        });
    }
}