export default function desc_about(data) {
    var formFields = new FormFields();

    // получаем данные
    var getDesc = XMLHttpRequestAJAX({
        url: "/api/site/desc/get-desc",
        method: "GET",
        body: {
            id_site: data.id_site,
            target: data.target
        }
    });

    if (getDesc.code === 200) {
        getDesc = getDesc.data;
    } else {
        alert("error");
        return false;
    }

    var cardTAG = document.createElement("div");
    cardTAG.classList.add("card-body");
    cardTAG.innerHTML = `
    <div class="header-card-body">
        <h4 class="title-card">${data.title}</h4>
    </div>
    <div class="content-card">
        <form class="form-container"></form>
        <div class="footer-events">
            <button type="button" class="btn btn-primary btn-icon-left btn-save-form"><i class="ph ph-check-circle"></i>Сохранить</button>
        </div>
    </div>`;
    document.querySelector(".P-desc").append(cardTAG);

    // вставляем поля формы
    cardTAG.querySelector("form").append(
        formFields.inputText({label: "Заголовок", name: "title", validate: "false"}),
        formFields.textarea({label: "Описание", name: "desc", validate: "false"}),
        formFields.photos({label: "Прикрепить фотографию", name: "photo", ext: "img", multiple: "false", validate: "true"}),
        formFields.inputHidden({name: "id", value: getDesc.id})
    );

    console.log("getDesc", getDesc)

    // заполняем поля формы из БД
    formFields.setValuesForm(cardTAG.querySelector("form"), getDesc);

    cardTAG.querySelector(".btn-save-form").addEventListener("click", function () {
        var getBtnSave = this,
            getForm = this.closest(".content-card").querySelector("form"),
            getValuesForm = formFields.getValuesForm(getForm);

        console.log("getValuesForm", getValuesForm);

        if (getValuesForm.status == false) return false;

        getValuesForm.form["target"] = data.target;

        var updateGeneralInfo = XMLHttpRequestAJAX({
            url: "/api/site/desc/update-desc",
            method: "POST",
            body: getValuesForm.form
        });

        if (updateGeneralInfo.code === 200) {
            animationBtnSuccess(getBtnSave);
            alertNotification({status: "success", text: "Данные успешно обновлены", pos: "top-center"});
        } else {
            alertNotification({status: "error", text: "Ошибка при сохранении данных", pos: "top-center"});
        }
    });
}