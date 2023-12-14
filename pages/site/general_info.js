export default function general_info() {
    var formFields = new FormFields();
    var getDomain = getDomainSite();

    var blockTAG = document.createElement("section");
    blockTAG.classList.add("P-general-info");
    blockTAG.innerHTML = `
    <div class="card-body">
        <div class="content-card"></div>
    </div>`;
    document.getElementById("app").append(blockTAG);

    initForm();

    function initForm() {
        var formTAG = document.createElement("div");
        formTAG.classList.add("form-wrapper");
        formTAG.innerHTML = `
        <div class="preview-image-project">
            <img src="https://s0.rbk.ru/v6_top_pics/media/img/7/72/756570268423727.jpg">
        </div>
        <form class="form-container"></form>
        <div class="footer-events">
            <button type="button" class="btn btn-primary btn-icon-left btn-save-form"><i class="ph ph-check-circle"></i>Сохранить</button>
        </div>`;
        blockTAG.querySelector(".content-card").append(formTAG);

        var getGeneralInfo = XMLHttpRequestAJAX({
            url: "/api/site/general/info",
            method: "GET",
            body: {
                domain: getDomain
            }
        });
        var getValForm = getGeneralInfo.data;
        console.log("getValForm", getValForm)

        formTAG.querySelector("form").append(
            formFields.inputText({label: "Название ЖК", name: "title_project", validate: "true"}),
            formFields.inputText({label: "Телефон (офис продаж)", name: "phone", mask: "phone", validate: "true"}),
            formFields.inputText({label: "E-mail", name: "email", mask: "email", validate: "false"}),
            formFields.inputText({label: "Telegram (номер)", name: "telegram_phone", mask: "phone", validate: "false"}),
            formFields.inputText({label: "Telegram (ссылка на группу)", name: "telegram_link", validate: "false"}),
            formFields.inputText({label: "WhatsApp (номер)", name: "whatsapp_phone", mask: "phone", validate: "false"}),
            formFields.inputText({label: "WhatsApp (ссылка на группу)", name: "whatsapp_link", validate: "false"})
        );
        formFields.setValuesForm(formTAG.querySelector("form"), getValForm);


        formTAG.querySelector(".footer-events .btn-save-form").addEventListener("click", function () {
            var getBtnSave = this;
            var getValuesForm = formFields.getValuesForm(formTAG.querySelector("form"));

            if (getValuesForm.status == false) return false;

            getValuesForm.form['domain'] = getDomain;

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