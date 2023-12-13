class FormFields {

    /*

    modalHTML.append(formFields.inputText({label: "Домен", placeholder: "example.ru", name: "domain", validate: "true"}));
    modalHTML.append(formFields.radio({label: "Закрыто?", name: "close", value: {"yes": "Да", "no": "Нет", "unknow": "Не знаю"}, validate: "true"}));
    modalHTML.append(formFields.checkbox({label: "Закрыто?", name: "check", value: {"yes": "Да", "no": "Нет", "unknow": "Не знаю"}, validate: "true"}));

     */

    inputText(data) {

        var label = (data.label != undefined && data.label != "") ? `<span class="title-field">${data.label}</span>` : "",
            name = (data.name != undefined && data.name != "") ? data.name : "",
            value = (data.value != undefined && data.value != "") ? data.value : "",
            placeholder = (data.placeholder != undefined && data.placeholder != "") ? `placeholder="${data.placeholder}"` : "",
            validate = (data.validate != undefined && data.validate == "true") ? `validate="true"` : "";

        var fieldTAG = document.createElement("div");
        fieldTAG.classList.add("field-container");
        fieldTAG.setAttribute("type", "input-text");
        if (data.field_class != undefined && data.field_class != "") fieldTAG.classList.add(data.field_class);
        var fieldHTML = `
        ${label}
        <input type="text" name="${name}" value="${value}" ${placeholder} class="field-input" ${validate}>`;
        fieldTAG.innerHTML = fieldHTML;

        return fieldTAG;
    }

    radio(data) {
        var label = (data.label != undefined && data.label != "") ? `<span class="title-field">${data.label}</span>` : "",
            name = (data.name != undefined && data.name != "") ? data.name : "",
            validate = (data.validate != undefined && data.validate == "true") ? `validate="true"` : "";

        var fieldTAG = document.createElement("div");
        fieldTAG.classList.add("field-container");
        fieldTAG.setAttribute("type", "input-radio");
        if (data.field_class != undefined && data.field_class != "") fieldTAG.classList.add(data.field_class);
        var fieldHTML = ``;
        fieldHTML = `${label}
        <div class="grid-fields-array">`;

        if (data.value != undefined && Object.keys(data.value).length != 0) {
            for (var val in data.value) {
                var radioItem = data.value[val];

                fieldHTML += `
                <label>
                    <input type="radio" name="${name}" value="${val}" ${validate}>
                    <span class="title">${radioItem}</span>
                </label>`;
            }
        }
        fieldHTML += `</div>`;
        fieldTAG.innerHTML = fieldHTML;

        return fieldTAG;
    }

    checkbox(data) {
        var label = (data.label != undefined && data.label != "") ? `<span class="title-field">${data.label}</span>` : "",
            name = (data.name != undefined && data.name != "") ? data.name : "",
            validate = (data.validate != undefined && data.validate == "true") ? `validate="true"` : "";

        var fieldTAG = document.createElement("div");
        fieldTAG.classList.add("field-container");
        fieldTAG.setAttribute("type", "input-checkbox");
        if (data.field_class != undefined && data.field_class != "") fieldTAG.classList.add(data.field_class);
        var fieldHTML = ``;
        fieldHTML = `${label}
        <div class="grid-fields-array">`;

        if (data.value != undefined && Object.keys(data.value).length != 0) {
            for (var val in data.value) {
                var radioItem = data.value[val];

                fieldHTML += `
                <label>
                    <input type="checkbox" name="${name}" value="${val}" ${validate}>
                    <span class="title">${radioItem}</span>
                </label>`;
            }
        }
        fieldHTML += `</div>`;
        fieldTAG.innerHTML = fieldHTML;

        return fieldTAG;
    }


    switchRadio(data) {
        var id_checkbox = Date.now();
        var switchTAG = document.createElement("div");
        switchTAG.classList.add("G-switch-radio");
        switchTAG.innerHTML = `
        <div class="row-container">
            <input type="checkbox" name="${data.name}" id="${id_checkbox}">
            <label for="${id_checkbox}"></label>
        </div>`;

        console.log(data.checked)

        if (data.checked == "on") {
            var maxmax = switchTAG.querySelector("input");
            maxmax.checked
        }

        return switchTAG;
    }


    // -------------------------------------------------------

    getValuesForm(form) {
        var formData = {},
            fieldsValid = [];

        // Получение всех тегов "field-container"
        var fieldContainers = form.querySelectorAll(".field-container");

        // Перебор всех найденных элементов
        fieldContainers.forEach(function(container) {
            var typeField = container.getAttribute("type");

            if (typeField === "input-text") {
                var field = container.querySelector("input"),
                    name = field.getAttribute("name"),
                    value = field.value,
                    validate = field.getAttribute("validate");

                if (validate != null && validate === "true") fieldsValid.push(name);

                formData[name] = value;
            }

            if (typeField === "input-radio") {
                var field = container.querySelector("input"),
                    name = field.getAttribute("name"),
                    validate = field.getAttribute("validate"),
                    radioArray = container.querySelectorAll(".grid-fields-array input[type='radio']");

                if (validate != null && validate === "true") fieldsValid.push(name);

                formData[name] = "";

                radioArray.forEach(function(radio) {
                    if (radio.checked) {
                        formData[name] = radio.value;
                    }
                });
            }

            if (typeField === "input-checkbox") {
                var field = container.querySelector("input"),
                    name = field.getAttribute("name"),
                    validate = field.getAttribute("validate"),
                    radioArray = container.querySelectorAll(".grid-fields-array input[type='checkbox']");

                if (validate != null && validate === "true") fieldsValid.push(name);

                formData[name] = [];

                radioArray.forEach(function(checkbox) {
                    if (checkbox.checked) {
                        formData[name].push(checkbox.value);
                    }
                });
            }
        });

        var isValid = this.validate(form, fieldsValid, formData);

        if (isValid == true) {
            var form = formData;
            return {status: true, form};
        } else {
            return {status: false, error: isValid};
        }
    }

    validate(form, fieldsValid, formData) {
        var isValid = 0;
        fieldsValid.forEach(function (field) {
            if (formData[field] == "" || formData[field].length == 0) {
                isValid = 1;
                form.querySelector("input[name='"+field+"']").closest(".field-container").classList.add("error");
            }
        });

        var fieldsForm = form.querySelectorAll(".field-container.error");
        fieldsForm.forEach(function (field) {
            field.addEventListener("click", function () {
                if (field.classList.contains("error")) {
                    this.classList.remove("error");
                }
            })
        });

        if (isValid == 0) {
            return true;
        } else {
            return "Есть не заполненные поля";
        }
    }

}