export default function desc(project) {
    var formFields = new FormFields();

    // получаем данные
    var getGeneralInfo = XMLHttpRequestAJAX({
        url: "/api/site/desc",
        method: "GET",
        body: {
            id_site: project.id
        }
    });
    getGeneralInfo = getGeneralInfo.data;
    console.log("desc", getGeneralInfo)

    var blockTAG = document.createElement("section");
    blockTAG.classList.add("P-desc");
    document.getElementById("app").append(blockTAG);

    desc_about();
    desc_territory();


    // Обновляем поля формы

    var allBtnSave = blockTAG.querySelectorAll(".btn-save-form");

    allBtnSave.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var getBtnSave = this,
                getTarget = this.getAttribute("target"),
                getForm = this.closest(".content-card").querySelector("form"),
                getValuesForm = formFields.getValuesForm(getForm);

            if (getValuesForm.status == false) return false;

            getValuesForm.form.id_site = project.id;
            getValuesForm.form.target = getTarget;

            console.log("form", getValuesForm.form)

            var updateGeneralInfo = XMLHttpRequestAJAX({
                url: "/api/site/desc",
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
    });


    function desc_about() {
        var cardTAG = document.createElement("div");
        cardTAG.classList.add("card-body");
        cardTAG.innerHTML = `
        <div class="header-card-body">
            <h4 class="title-card">О проекте</h4>
        </div>
        <div class="content-card">
            <form class="form-container"></form>
            <div class="footer-events">
                <button type="button" class="btn btn-primary btn-icon-left btn-save-form" target="about"><i class="ph ph-check-circle"></i>Сохранить</button>
            </div>
        </div>`;
        blockTAG.append(cardTAG);

        // вставляем поля формы
        cardTAG.querySelector("form").append(
            formFields.inputText({label: "Заголовок", name: "title_jk", validate: "false"}),
            formFields.textarea({label: "Описание", name: "desc_jk", validate: "false"})
        );

        // заполняем поля формы из БД
        formFields.setValuesForm(cardTAG.querySelector("form"), getGeneralInfo);
    }


    function desc_territory() {
        var cardTAG = document.createElement("div");
        cardTAG.classList.add("card-body");
        cardTAG.innerHTML = `
        <div class="header-card-body">
            <h4 class="title-card">Территория</h4>
        </div>
        <div class="content-card">
            <form class="form-container"></form>
            <div class="footer-events">
                <button type="button" class="btn btn-primary btn-icon-left btn-save-form" target="territory"><i class="ph ph-check-circle"></i>Сохранить</button>
            </div>
        </div>`;
        blockTAG.append(cardTAG);

        // вставляем поля формы
        cardTAG.querySelector("form").append(
            formFields.inputText({label: "Заголовок", name: "title_territory", validate: "false"}),
            formFields.textarea({label: "Описание", name: "desc_territory", validate: "false"})
        );

        // заполняем поля формы из БД
        formFields.setValuesForm(cardTAG.querySelector("form"), getGeneralInfo);
    }
}