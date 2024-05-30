export default function parameters(project) {

    var formFields = new FormFields();

    // получаем данные
    var getParameters = XMLHttpRequestAJAX({
        url: "/api/site/parameters/get-parameters",
        method: "GET",
        body: {
            id_site: project.id
        }
    });
    getParameters = getParameters.data;

    var blockTAG = document.createElement("section");
    blockTAG.classList.add("P-parameters");
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


        var classProject = [
            {title: "Эконом", value: "economy"},
            {title: "Бизнес", value: "business"},
            {title: "Премиум", value: "premium"},
            {title: "Элит", value: "elite"},
            {title: "Клубный комплекс", value: "club-facilities"},
            {title: "Комфорт", value: "comfort"}
        ];

        var material_house = [
            {title: "Кирпич", value: "brick"},
            {title: "Бетон", value: "concrete"},
            {title: "Металл", value: "metal"},
            {title: "Камень", value: "stone"},
            {title: "Стекло", value: "glass"},
            {title: "Керамика", value: "ceramics"},
            {title: "Пластик", value: "plastic"},
        ];

        var finishing = [
            {title: "Черновая отделка", value: "rough-finish"},
            {title: "Предчистовая", value: "pre-cleaning"},
            {title: "White box", value: "cleaning"},
            {title: "Под ключ", value: "turnkey"},
            {title: "Евроремонт", value: "renovation"},
            {title: "Дизайнерский ремонт", value: "designer-renovation"},
            {title: "Минималистический стиль", value: "minimalist-style"},
            {title: "Классический стиль", value: "classic-style"},
            {title: "Модерн", value: "modern"}
        ];

        // вставляем поля формы
        blockTAG.querySelector("form").append(
            formFields.select({label: "Класс ЖК", name: "class", option: classProject, sort: "true", search: "false", validate: "false"}),
            formFields.select({label: "Материал дома", name: "material_house", option: material_house, sort: "true", search: "false", validate: "false"}),
            formFields.inputText({label: "Кол-во квартир", name: "number_apartments", mask: 'number', validate: "false"}),
            formFields.inputText({label: "Кол-во корпусов", name: "number_buildings", mask: 'number', validate: "false"}),
            formFields.select({label: "Отделка", name: "finishing", option: finishing, sort: "true", search: "false", validate: "false"}),
            formFields.radio({label: "Закрытая территория?", name: "closed_territory", value: {"yes": "Да", "no": "Нет"}, validate: "false"}),

            (() => {
                const divElement = document.createElement("div");
                divElement.classList.add("two-fields");
                divElement.append(
                    formFields.inputText({label: "Площадь квартир ОТ", name: "area_apartments_from", mask: 'number', validate: "false"}),
                    formFields.inputText({label: "Площадь квартир ДО", name: "area_apartments_to", mask: 'number', validate: "false"})
                );
                return divElement;
            })(),

            (() => {
                const divElement = document.createElement("div");
                divElement.classList.add("two-fields");
                divElement.append(
                    formFields.inputText({label: "Этажность ОТ", name: "floors_from", mask: 'number', validate: "false"}),
                    formFields.inputText({label: "Этажность ДО", name: "floors_to", mask: 'number', validate: "false"})
                );
                return divElement;
            })(),

            (() => {
                const divElement = document.createElement("div");
                divElement.classList.add("two-fields");
                divElement.append(
                    formFields.inputText({label: "Высота потолков ОТ", name: "ceiling_height_from", mask: 'number', validate: "false"}),
                    formFields.inputText({label: "Высота потолков ДО", name: "ceiling_height_to", mask: 'number', validate: "false"})
                );
                return divElement;
            })(),

            (() => {
                const divElement = document.createElement("div");
                divElement.classList.add("two-fields");
                divElement.append(
                    formFields.inputText({label: "Начало строительства", name: "date_start_construction", mask: 'date', validate: "false"}),
                    formFields.inputText({label: "Конец строительства", name: "date_end_construction", mask: 'date', validate: "false"})
                );
                return divElement;
            })(),

            formFields.inputHidden({name: "id_site", value: project.id})
        );

        // заполняем поля формы из БД
        formFields.setValuesForm(blockTAG.querySelector("form"), getParameters);

        // Обновляем поля формы
        blockTAG.querySelector(".footer-events .btn-save-form").addEventListener("click", function () {
            var getBtnSave = this,
                getValuesForm = formFields.getValuesForm(blockTAG.querySelector("form"));

            if (getValuesForm.status == false) return false;

            console.log("getValuesForm.form", getValuesForm.form)

            var updateGeneralInfo = XMLHttpRequestAJAX({
                url: "/api/site/parameters/update-parameters",
                method: "POST",
                body: getValuesForm.form
            });

            if (updateGeneralInfo.code === 200) {
                animationBtnSuccess(getBtnSave);
                alertNotification({status: "success", text: "Данные успешно обновлены", pos: "top-center"});
            } else {
                alertNotification({status: "alert", text: "Обновите данные в форме на новые", pos: "top-center"});
                console.log(updateGeneralInfo.data);
            }
        });
    }
}