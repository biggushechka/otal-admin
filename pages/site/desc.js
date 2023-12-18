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
    blockTAG.innerHTML = `
    <div class="card-body">
        <div class="content-card">
            <form class="form-container"></form>
            <div class="footer-events">
                <button type="button" class="btn btn-primary btn-icon-left btn-save-form"><i class="ph ph-check-circle"></i>Сохранить</button>
            </div>
        </div>
    </div>`;
    document.getElementById("app").append(blockTAG);

    initForm();

    function initForm() {
        blockTAG.querySelector("form").append(
            (() => {
                const divElement = document.createElement("div");
                divElement.classList.add("group-fields");
                divElement.innerHTML = `<h4 class="title-group">Описание ЖК</h4>`;
                divElement.append(
                    formFields.inputText({label: "Заголовок", name: "title_jk", validate: "false"}),
                    formFields.textarea({label: "Описание", name: "desc_jk", validate: "false"})
                );
                return divElement;
            })(),
            (() => {
                const divElement = document.createElement("div");
                divElement.classList.add("group-fields");
                divElement.innerHTML = `<h4 class="title-group">Территория</h4>`;
                divElement.append(
                    formFields.inputText({label: "Заголовок", name: "title_territory", validate: "false"}),
                    formFields.textarea({label: "Описание", name: "desc_territory", validate: "false"})
                );
                return divElement;
            })(),
            formFields.inputHidden({name: "id_site", value: project.id})
        )
        // заполняем поля формы из БД
        formFields.setValuesForm(blockTAG.querySelector("form"), getGeneralInfo);

        // Обновляем поля формы
        blockTAG.querySelector(".footer-events .btn-save-form").addEventListener("click", function () {
            var getBtnSave = this,
                getValuesForm = formFields.getValuesForm(blockTAG.querySelector("form"));

            if (getValuesForm.status == false) return false;

            console.log("desc", getValuesForm.form);

            var updateGeneralInfo = XMLHttpRequestAJAX({
                url: "/api/site/desc",
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