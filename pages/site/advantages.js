export default function advantages() {
    var formFields = new FormFields();

    var blockTAG = document.createElement("section");
    blockTAG.classList.add("P-advantages");
    document.getElementById("app").append(blockTAG);

    tabsAdvantages();
    advantages_index();

    function tabsAdvantages() {
        var tabsHTML = document.createElement("div");
        tabsHTML.classList.add("P-advantages-tabs");
        tabsHTML.innerHTML = `
        <button type="button" class="btn btn-tab active" data-tab="index">Основные</button>
        <button type="button" class="btn btn-tab" data-tab="numbers">В цифрах</button>`;
        blockTAG.append(tabsHTML);

        var tabs = tabsHTML.querySelectorAll(".btn-tab");

        tabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                var target = this.getAttribute("data-tab");

                // Удаление класса "active" у всех кнопок
                tabs.forEach(tab => {
                    tab.classList.remove('active');
                });
                // Добавление класса "active" к кликнутой кнопке
                tab.classList.add('active');


                const childElements = Array.from(blockTAG.children);
                childElements.forEach((element) => {
                    if (!element.classList.contains("P-advantages-tabs")) element.remove();
                });


                if (target == "index") {
                    advantages_index();
                }

                if (target == "numbers") {
                    advantages_numbers();
                }
            });
        });
    }

    function advantages_index() {
        var tableHTML;

        var advIndexHTML = document.createElement("div");
        advIndexHTML.classList.add("P-adv-index");
        advIndexHTML.innerHTML = `
        <div class="card-body">
            <div class="header-card-body">
                <h4 class="title-card">Основные</h4>
            </div>
            <div class="content-card"></div>
        </div>`;
        blockTAG.append(advIndexHTML);

        initTable();
        rowAdvTable();

        function initTable() {
            tableHTML = document.createElement("table");
            tableHTML.classList.add("P-table-adv");
            tableHTML.classList.add("G-table");
            tableHTML.innerHTML = `
            <thead>
                <tr>
                    <th width="64">id</th>
                    <th width="80">Фото</th>
                    <th width="">Название</th>
                    <th width="200">Дата</th>
                    <th width="100">Статус</th>
                    <th width="100">Действия</th>
                </tr>
            </thead>
            <tbody>
                <tr class="add-new-item">
                    <td colspan="6">
                        <button type="button" class="btn btn-add-item btn-icon-left"><i class="ph ph-plus-circle"></i>Добавить запись</button>
                    </td>
                </tr>
            </tbody>`;
            advIndexHTML.querySelector(".content-card").prepend(tableHTML);

            tableHTML.querySelector(".btn-add-item").addEventListener("click", function () {
                modalItemAdv();
            });
        }

        function rowAdvTable() {
            var rowHTML = document.createElement("tr");
            rowHTML.classList.add("row-adv");
            rowHTML.innerHTML = `
            <td class="col-id">id</td>
            <td class="col-photo">
                <img src="" class="photo-adv">
            </td>
            <td class="col-title">
                <span class="title">Особенности проекта</span>
                <span class="desc">Тут любой текст с описанием проекта и тд.</span>
            </td>
            <td class="col-date">14 Декабря, чт (13:02)</td>
            <td class="col-status"></td>
            <td class="col-events">
                <div class="row-container">
                    <button type="button" class="btn btn-outline-primary btn-square btn-edit"><i class="ph ph-pencil-simple"></i></button>
                    <button type="button" class="btn btn-outline-primary btn-square btn-delete"><i class="ph ph-trash"></i></button>
                </div>
            </td>`;
            tableHTML.querySelector("tbody .add-new-item").before(rowHTML);

            // вставляем switch активности сайта
            var switchActivity = formFields.switchRadio({name: "activity", checked: "on", callback: isActivitySite})
            rowHTML.querySelector(".col-status").append(switchActivity);

            // изменение активности сайта
            function isActivitySite(status) {
                // var isActivity = XMLHttpRequestAJAX({
                //     url: "/api/site/general/isActivity2",
                //     method: "UPDATE",
                //     body: {
                //         id_site: site.id,
                //         activity: status
                //     }
                // });
                //
                // if (isActivity.code === 200) {
                //     var status = (isActivity.data.activity == "off") ? "выключен" : "включен";
                //     alertNotification({status: "success", text: `Cайт ${site.domain} - ${status}`, pos: "top-center"});
                // }
                //
                // return isActivity.data.activity
            }
        }

        function modalItemAdv() {
            var form = document.createElement("form"),
                uploadPhotoHTML,
                previewPhotoHTML,
                photoAdv = [];

            // добавляем поля
            form.append(
                formFields.inputText({label: "Заголовок", name: "title", validate: "true"}),
                formFields.textarea({label: "Описание", name: "description", validate: "true"}),
            );

            // добавляем кнопку, для загрузки фото
            btnUploadPhoto();

            var modalNewAddress = new Modal({
                title: "Добавить запись",
                classModal: 'P-modal-add-adv',
                content: form,
                mode: 'center',
                width: '540px',
                footerEvents:{
                    cancel: {
                        active: true,
                    },
                    submit: {
                        active: true,
                        title: "Создать",
                        callback: function() {
                            sendFormAdv();
                        }
                    },
                }
            });

            // добавляем кнопку, для загрузки фото
            function btnUploadPhoto() {
                uploadPhotoHTML = document.createElement("div");
                uploadPhotoHTML.classList.add("upload-photo");
                uploadPhotoHTML.innerHTML = `<span class="title"><i class="ph ph-image"></i>Загрузить фотографию</span>`;
                form.append(uploadPhotoHTML);


                uploadPhotoHTML.addEventListener("click", function () {
                    photoAdv = [];

                    getUploadFiles({
                        ext: "img",
                        multiple: "false"
                    }, fileProcessing);

                    function fileProcessing(files) {
                        if (files.length == 0) return false;

                        previewUploadPhoto(files[0]);
                    }
                });
            }

            // добавляем кнопку, для загрузки фото
            function previewUploadPhoto(photo) {
                uploadPhotoHTML.remove();
                photoAdv.push(photo);

                previewPhotoHTML = document.createElement("div");
                previewPhotoHTML.classList.add("preview-upload-photo");
                previewPhotoHTML.innerHTML = `
                <img src="data:image/jpeg;base64,${photo.base}">
                <button type="button" class="btn btn-delete-photo"><i class="ph ph-x"></i></button>`;
                form.append(previewPhotoHTML);

                previewPhotoHTML.querySelector(".btn-delete-photo").addEventListener("click", function () {
                    btnUploadPhoto();
                    previewPhotoHTML.remove();
                });
            }

            function sendFormAdv() {
                var getValuesForm = formFields.getValuesForm(form);

                if (getValuesForm.status == false) return false;

                getValuesForm.form.photo = photoAdv;
                console.log("getValuesForm", getValuesForm)
            }
        }
    }

    function advantages_numbers() {
        console.log("numbers");
    }
}