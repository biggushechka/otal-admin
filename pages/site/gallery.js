export default function gallery(project) {
    var formFields = new FormFields(),
        tableHTML;

    indexGallery();
    otherAllGallery();
    btnAddGroup();

    function indexGallery() {
        // получаем данные
        var getGallery = XMLHttpRequestAJAX({
            url: "/api/site/gallery/main",
            method: "GET",
            body: {
                id_site: project.id,
                name_gallery: "main"
            }
        });
        console.log("getGallery", getGallery);

        var galleryHTML = document.createElement("div");
        galleryHTML.classList.add("P-gallery");
        galleryHTML.innerHTML = `
        <div class="card-body">
            <div class="header-card-body">
                <h4 class="title-card">Основной альбом</h4>
            </div>
            <div class="content-card"></div>
        </div>`;
        document.getElementById("app").append(galleryHTML);

        var getTable = initTable();
        galleryHTML.querySelector(".content-card").append(getTable);
    }

    function otherAllGallery() {
        // получаем данные
        var getAllAlbum = XMLHttpRequestAJAX({
            url: "/api/site/gallery/other",
            method: "GET",
            body: {
                id_site: project.id,
                name_gallery: "all"
            }
        });

        if (getAllAlbum.code === 200) {
            for (var i in getAllAlbum.data) {
                otherItemGallery(getAllAlbum.data[i]);
            }
        }
    }

    function otherItemGallery(album) {
        // получаем фото из альбома
        var getImages = XMLHttpRequestAJAX({
            url: "/api/site/gallery/images",
            method: "GET",
            body: {
                id_site: project.id,
                id_gallery: album.id
            }
        });
        console.log(album.title, getImages);

        var albumItemHTML = document.createElement("div");
        albumItemHTML.classList.add("P-other-gallery");
        albumItemHTML.innerHTML = `
        <div class="card-body">
            <div class="header-card-body">
                <h4 class="title-card">${album.title}</h4>
            </div>
            <div class="content-card"></div>
        </div>`;
        document.getElementById("app").append(albumItemHTML);

        var getTable = initTable(album);
        albumItemHTML.querySelector(".content-card").append(getTable);

    }

    function btnAddGroup() {
        var btnAddGroupHTML = document.createElement("div");
        btnAddGroupHTML.classList.add("btn-add-container");
        btnAddGroupHTML.innerHTML = `<button type="button" class="btn btn-icon-left btn-add-item_full"><i class="ph ph-plus-circle"></i>Добавить альбом</button>`;
        document.getElementById("app").append(btnAddGroupHTML);

        btnAddGroupHTML.addEventListener("click", function () {
            var form = document.createElement("form");
            form.append(
                formFields.inputText({label: "Название альбома", name: "name_gallery", validate: "true"}),
                formFields.inputHidden({name: "id_site", value: project.id})
            );

            var modal = new Modal({
                title: "Добавить альбом",
                classModal: 'P-modal-add-album',
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
                            createNewAlbum();
                        }
                    },
                }
            });

            function createNewAlbum() {
                var getValuesForm = formFields.getValuesForm(form);

                if (getValuesForm.status == false) return false;

                // отправляем данные
                var createAlbum = XMLHttpRequestAJAX({
                    url: "/api/site/gallery/album",
                    method: "POST",
                    body: getValuesForm.form
                });
                console.log(createAlbum);

                if (createAlbum.code === 200) {
                    modal.closeModal();
                    otherItemGallery(createAlbum.data);
                    alertNotification({status: "success", text: "Альбом создан", pos: "top-center"});
                } else {
                    alertNotification({status: "error", text: createAlbum.data, pos: "top-center"});
                }
            }
        });
    }

    function initTable(album) {
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

        tableHTML.querySelector(".btn-add-item").addEventListener("click", function () {
            modalItem(album);
        });

        return tableHTML;
    }

    function modalItem(album) {
        console.log("album", album)

        var form = document.createElement("form");

        // добавляем поля
        form.append(
            formFields.photos({label: "Прикрепить фотографию", name: "photo", ext: "img", multiple: "true", validate: "true"}),
            formFields.inputHidden({name: "id_site", value: project.id}),
            formFields.inputHidden({name: "id_album", value: album.id})
        );

        var modal = new Modal({
            title: "Загрузка изображений в альбом",
            classModal: 'P-modal-add-image-album',
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

        function sendFormAdv() {
            var getValuesForm = formFields.getValuesForm(form);

            if (getValuesForm.status == false) return false;

            console.log("form", getValuesForm.form);

            return false;

            // отправляем данные
            var sendInfrastructure = XMLHttpRequestAJAX({
                url: "/api/site/gallery/images",
                method: "POST",
                body: getValuesForm.form
            });
            console.log(sendInfrastructure);

            if (data == undefined) {
                if (sendInfrastructure.code === 200) {
                    // rowItemTable(sendInfrastructure.data);
                    modal.closeModal();
                    alertNotification({status: "success", text: "Запись успешно добавлена", pos: "top-center"});
                } else {
                    alertNotification({status: "error", text: "Ошибка при добавлении записи", pos: "top-center"});
                }
            } else {
                if (sendInfrastructure.code === 200) {
                    // rowItemTable(sendInfrastructure.data)

                    var listContainer = tableHTML.querySelector("tbody"),
                        replaceableItem = tableHTML.querySelector(".row-item[data-id='"+data.id+"']"),
                        allItem = tableHTML.querySelectorAll(".row-item"),
                        newItem = allItem[allItem.length - 1];

                    listContainer.replaceChild(newItem, replaceableItem);
                    modal.closeModal();
                    alertNotification({status: "success", text: "Запись успешно обновлена", pos: "top-center"});
                } else {
                    alertNotification({status: "error", text: "Ошибка при обновлении записи", pos: "top-center"});
                }
            }
        }

    }
}