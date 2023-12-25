class FormFields {

    inputText(data) {
        var label = (data.label != undefined && data.label != "") ? `<span class="title-field">${data.label}</span>` : "",
            name = (data.name != undefined && data.name != "") ? data.name : "",
            placeholder = (data.placeholder != undefined && data.placeholder != "") ? `placeholder="${data.placeholder}"` : "",
            validate = (data.validate != undefined && data.validate == "true") ? `validate="true"` : "";

        var fieldTAG = document.createElement("div");
        fieldTAG.classList.add("field-container");
        fieldTAG.setAttribute("type", "input-text");
        if (data.field_class != undefined && data.field_class != "") fieldTAG.classList.add(data.field_class);
        var fieldHTML = `
        ${label}
        <input type="text" name="${name}" value="" ${placeholder} class="field-input" ${validate}>`;
        fieldTAG.innerHTML = fieldHTML;

        if (data.mask != undefined) {
            var input = fieldTAG.querySelector("input");
            if (data.mask == "phone") {
                IMask(input, {mask: '+{7} (000) 000-00-00', min: 16, lazy: true});
                input.onblur = function() {
                    if (input.value.length != 18) input.value = "";
                };
            }
            if (data.mask == "email") {
                var pattern = /^([a-z0-9_\.-])+[@][a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;

                input.onblur = function() {
                    if (!pattern.test(input.value)) {
                        input.value = "";
                    }
                };
            }
            if (data.mask == "number") {
                IMask(input, {mask: Number, radix: '.', thousandsSeparator: ' ', lazy: false});
            }

            if (data.mask == "date") {
                IMask(input, {mask: Date, lazy: false});
            }
        }

        return fieldTAG;
    }

    inputHidden(data) {
        var label = (data.label != undefined && data.label != "") ? `<span class="title-field">${data.label}</span>` : "",
            name = (data.name != undefined && data.name != "") ? data.name : "",
            value = (data.value != undefined && data.value != "") ? data.value : "";

        var fieldTAG = document.createElement("div");
        fieldTAG.classList.add("field-container");
        fieldTAG.setAttribute("type", "input-hidden");
        var fieldHTML = `
        ${label}
        <input type="text" name="${name}" value="${value}" class="field-input">`;
        fieldTAG.innerHTML = fieldHTML;

        return fieldTAG;
    }


    textarea(data) {
        var label = (data.label != undefined && data.label != "") ? `<span class="title-field">${data.label}</span>` : "",
            name = (data.name != undefined && data.name != "") ? data.name : "",
            placeholder = (data.placeholder != undefined && data.placeholder != "") ? `placeholder="${data.placeholder}"` : "",
            validate = (data.validate != undefined && data.validate == "true") ? `validate="true"` : "";

        var fieldTAG = document.createElement("div");
        fieldTAG.classList.add("field-container");
        fieldTAG.setAttribute("type", "textarea");
        if (data.field_class != undefined && data.field_class != "") fieldTAG.classList.add(data.field_class);
        var fieldHTML = `
        ${label}
        <textarea name="${name}" ${placeholder} ${validate}></textarea>`;
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
        var id_checkbox = Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000;
        var switchTAG = document.createElement("div");
        switchTAG.classList.add("G-switch-radio");
        switchTAG.innerHTML = `
        <div class="row-container">
            <input type="checkbox" name="${data.name}" id="${id_checkbox}">
            <label for="${id_checkbox}"></label>
        </div>`;

        var label = switchTAG.querySelector("label"),
            input = switchTAG.querySelector("input");

        if (data.checked == "on") {
            input.checked = true;
        } else {
            input.checked = false;
        }

        label.addEventListener("click", function (e) {
            if (data.callback) {
                var changeActivity = (input.checked == true) ? false : true;
                data.callback(changeActivity);
            }
        });

        return switchTAG;
    }

    select(data) {
        var label = (data.label != undefined && data.label != "") ? `<span class="title-field">${data.label}</span>` : "",
            name = (data.name != undefined && data.name != "") ? data.name : "",
            options = (data.option != undefined && data.option.length != 0) ? data.option : [],
            sort = (data.sort != undefined && data.sort != "" && data.sort == "true") ? true : false,
            search = (data.search != undefined && data.search != "") ? true : false,
            validate = (data.validate != undefined && data.validate == "true") ? `validate="true"` : "";

        var selectTAG = document.createElement("div");
        selectTAG.classList.add("field-container");
        selectTAG.setAttribute("type", "select");
        if (data.field_class != undefined && data.field_class != "") selectTAG.classList.add(data.field_class);
        var selectHTML = `
        ${label}
        <select name="${name}"></select>`;
        selectTAG.innerHTML = selectHTML;

        var select = selectTAG.querySelector("select");

        if (options.length != 0) {
            var arrayOptios = [];
            for (var i in options) {
                arrayOptios.push({value: i, label: options[i]})
            }
            options = arrayOptios;
        }

        var choices = new Choices(select, {
            choices: options,
            itemSelectText: 'Выбрать',
            noResultsText: 'Результатов нет',
            noChoicesText: 'Нет выбора, из которого можно было бы выбирать',
            searchEnabled: search,
            shouldSortItems: sort,
            classNames: {
                containerOuter: "choices choices-select"
            }
        });

        choices.removeActiveItems();
        choices.containerOuter.element.querySelector("select").innerHTML = "";
        choices.containerOuter.element.querySelector(".choices__list.choices__list--single").innerHTML = "Выбрать...";

        return selectTAG;
    }

    photos(data) {
        var label = (data.label != undefined && data.label != "") ? `<span class="title-field">${data.label}</span>` : "",
            name = (data.name != undefined && data.name != "") ? data.name : "",
            ext = (data.ext != undefined && data.ext != "") ? data.ext : "ext",
            multiple = (data.multiple != undefined && data.multiple != "") ? data.multiple : "false",
            validate = (data.validate != undefined && data.validate == "true") ? `validate="true"` : "";

        var fieldTAG = document.createElement("div");
        fieldTAG.classList.add("field-container");
        fieldTAG.setAttribute("type", "photos");
        if (data.field_class != undefined && data.field_class != "") fieldTAG.classList.add(data.field_class);
        var fieldHTML = `
        ${label}
        <div class="upload-photo">
            <span class="title"><i class="ph ph-image"></i>Загрузить фотографию</span>
            <input name="${name}" ext="${ext}" multiple="${multiple}" ${validate} hidden>
        </div>`;
        fieldTAG.innerHTML = fieldHTML;

        fieldTAG.querySelector(".upload-photo").addEventListener("click", function () {
            getUploadFiles({
                ext: ext,
                multiple: multiple
            }, previewPhotos);
        });

        var previewPhotos = (data) => {
            this.photos_preview(data, fieldTAG);
        }

        return fieldTAG;
    }

    photos_preview(photos, fieldTAG) {
        var blockUploadPhoto = fieldTAG.querySelector(".upload-photo"),
            input = fieldTAG.querySelector(".upload-photo input"),
            ext = input.getAttribute("ext"),
            multiple = input.getAttribute("multiple"),
            photoAdv = [];

        if (multiple == "false") blockUploadPhoto.classList.add("hidden");

        previewUploadPhoto();

        if (typeof photos == "string") {
            if (photos == "") return false;
            photoItem(photos);
        } else {
            if (photos.length == 0) return false;
            for (var i in photos) {
                var photo = photos[i];
                photoAdv.push(photo);
                photoItem(photo);
                input.value = JSON.stringify(photoAdv);
            }
        }

        function previewUploadPhoto() {
            var resultList = fieldTAG.querySelector(".preview-photo");
            if (resultList) return false;

            var previewPhoto = document.createElement("div");
            previewPhoto.classList.add("preview-photo");
            fieldTAG.append(previewPhoto);
        }

        function photoItem(photo) {

            photo = (typeof photo == "object") ? "data:image/png;base64,"+photo.base : photo;

            var photoHTML = document.createElement("div");
            photoHTML.classList.add("photo-item");
            photoHTML.innerHTML = `
            <img src="${photo}" alt="photo">
            <button type="button" class="btn btn-square btn-delete-photo"><i class="ph ph-x"></i></button>`;
            fieldTAG.querySelector(".preview-photo").append(photoHTML);

            photoHTML.querySelector(".btn-delete-photo").addEventListener("click", function () {
                var deletePhoto = photoAdv.findIndex(function(photoItem) {
                    return photoItem.id === photo.id;
                });

                // удаляем фото из массива
                if (deletePhoto !== -1) {
                    photoAdv.splice(deletePhoto, 1);
                }

                photoHTML.remove();
                input.value = JSON.stringify(photoAdv);

                // если все фото удалены, то показываем кнопку "загрузить фото"
                if (photoAdv.length == 0) blockUploadPhoto.classList.remove("hidden");
            })
        }
    }


    // -------------------------------------------------------

    // заполнение полей
    setValuesForm(form, values) {
        // Получение всех тегов "field-container"
        var fieldContainers = form.querySelectorAll(".field-container");

        fieldContainers.forEach((field) => {
            var typeField = field.getAttribute("type");

            if (typeField === "input-text" || typeField === "input-hidden") {
                var input = field.querySelector("input"),
                    name = input.getAttribute("name");

                input.value = values[name];
            }

            if (typeField === "input-radio") {
                var radio = field.querySelector("input"),
                    name = radio.getAttribute("name"),
                    radioArray = field.querySelectorAll(".grid-fields-array input[type='radio']");

                radioArray.forEach(function(radioItem) {
                    var value = radioItem.getAttribute("value");
                    if (value == values[name]) radioItem.checked = true;
                });
            }

            if (typeField === "textarea") {
                var textarea = field.querySelector("textarea"),
                    name = textarea.getAttribute("name");

                textarea.innerHTML = values[name];
            }

            if (typeField === "select") {
                var select = field.querySelector("select"),
                    name = select.getAttribute("name"),
                    value = field.querySelector(".choices__list.choices__list--single"),
                    list = field.querySelectorAll(".choices__list--dropdown > .choices__list .choices__item");

                select.innerHTML = "";

                if (values[name] == "") return false;

                select.innerHTML = `<option value="">${values[name]}</option>`;
                value.innerHTML = values[name];

                list.forEach(function (option) {
                    var nameOption = option.innerHTML;

                    option.removeAttribute("aria-selected");
                    option.classList.remove("is-highlighted");
                    option.classList.remove("choices__item--selectable");

                    if (nameOption == values[name]) {
                        option.setAttribute("aria-selected", "true");
                    };

                });
            }

            if (typeField === "photos") {
                var input = field.querySelector(".upload-photo input"),
                    name = input.getAttribute("name"),
                    photos = values[name];

                this.photos_preview(photos, field);
            }

        });
    }


    // получаем значение полей
    getValuesForm(form) {
        var formData = {},
            fieldsValid = [];

        // Получение всех тегов "field-container"
        var fieldContainers = form.querySelectorAll(".field-container");

        // Перебор всех найденных элементов
        fieldContainers.forEach(function(container) {
            var typeField = container.getAttribute("type");

            if (typeField === "input-text" || typeField === "input-hidden") {
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

            if (typeField === "textarea") {
                var textarea = container.querySelector("textarea"),
                    name = textarea.getAttribute("name"),
                    value = textarea.value,
                    validate = textarea.getAttribute("validate");

                if (validate != null && validate === "true") fieldsValid.push(name);

                formData[name] = value;
            }

            if (typeField === "select") {
                var select = container.querySelector("select"),
                    name = select.getAttribute("name"),
                    value = select.options[0].text;

                formData[name] = value;
            }

            if (typeField === "photos") {
                console.log("input.value", container)
                var input = container.querySelector(".upload-photo input"),
                    name = input.getAttribute("name"),
                    value = (input.value == "") ? "" : JSON.parse(input.value);

                formData[name] = value;
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
                form.querySelector("*[name='"+field+"']").closest(".field-container").classList.add("error");
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