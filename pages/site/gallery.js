export default function gallery(project) {
    var formFields = new FormFields();

    addAlbum();
    allAlbums();

    function allAlbums() {
        // получаем данные
        var getAllAlbum = XMLHttpRequestAJAX({
            url: "/api/site/gallery/album",
            method: "GET",
            body: {
                id_site: project.id,
                album: "all"
            }
        });

        if (getAllAlbum.code === 200) {
            for (var i in getAllAlbum.data) {
                ItemAlbum(getAllAlbum.data[i]);
            }
        }
    }

    function ItemAlbum(album) {
        // получаем фото из альбома
        var getImages = XMLHttpRequestAJAX({
            url: "/api/site/gallery/images",
            method: "GET",
            body: {
                id_site: project.id,
                id_album: album.id
            }
        });

        var albumItemHTML = document.createElement("div");
        albumItemHTML.classList.add("P-item-album");
        albumItemHTML.setAttribute("id-album", album.id);
        var html = `
        <div class="card-body">
            <div class="header-card-body">
                <h4 class="title-card">${album.title}</h4>`;
                if (album.title != "Основной альбом") {
                    html += `
                    <div class="events-album">
                        <button type="button" class="btn btn-rename-album">переименовать альбом</button>
                        <button type="button" class="btn btn-delete-album">удалить альбом</button>
                    </div>`;
                }
                html += `
                </div>
            <div class="content-card"></div>
        </div>`;
        albumItemHTML.innerHTML = html;
        document.querySelector(".btn-add-container").before(albumItemHTML);

        // вставляем таблицу
        var getTable = initTable(album);
        albumItemHTML.querySelector(".content-card").append(getTable);

        // вставляем изображения
        if (getImages.code === 200) {
            for (var i in getImages.data) {
                var dataImage = getImages.data[i];

                var getImage = itemImage(dataImage);
                getTable.querySelector("tbody .add-new-item").before(getImage);
            }
        }

        if (album.title != "Основной альбом") {
            albumItemHTML.querySelector(".events-album .btn-rename-album").addEventListener("click", function () {
                var form = document.createElement("form"),
                    nameAlbum = albumItemHTML.querySelector(".title-card");

                album.title = nameAlbum.innerHTML;

                form.append(
                    formFields.inputText({label: "Название альбома", name: "title", validate: "true"}),
                    formFields.inputHidden({name: "id"}),
                    formFields.inputHidden({name: "id_site", value: project.id})
                );

                // заполняем поля формы из БД
                formFields.setValuesForm(form, album);

                var modal = new Modal({
                    title: "Переименовать альбом",
                    classModal: 'P-modal-add-album',
                    content: form,
                    mode: 'center',
                    width: '540px',
                    footerEvents: {
                        cancel: {
                            active: true,
                        },
                        submit: {
                            active: true,
                            title: "Переименовать",
                            callback: function () {
                                renameAlbum();
                            }
                        },
                    }
                });

                function renameAlbum() {
                    var getValuesForm = formFields.getValuesForm(form);

                    if (getValuesForm.status == false) return false;

                    var renameAlbum = XMLHttpRequestAJAX({
                        url: "/api/site/gallery/album",
                        method: "UPDATE",
                        body: getValuesForm.form
                    });

                    if (renameAlbum.code === 200) {
                        nameAlbum.innerHTML = renameAlbum.data;
                        modal.closeModal();
                        alertNotification({status: "success", text: "Название изменено", pos: "top-center"});
                    } else {
                        alertNotification({status: "error", text: renameAlbum.data, pos: "top-center"});
                        console.log(renameAlbum.data);
                    }
                }
            });
        }

        if (album.title != "Основной альбом") {
            albumItemHTML.querySelector(".events-album .btn-delete-album").addEventListener("click", function () {
                modalAlert({
                    type: "delete",
                    title: album.title,
                    callback: deleteAlbum,
                });

                // запрос на удаление записи
                function deleteAlbum() {

                    var resDelete = XMLHttpRequestAJAX({
                        url: "/api/site/gallery/album",
                        method: "DELETE",
                        body: {
                            id_album: album.id,
                            id_site: project.id
                        }
                    });

                    if (resDelete.code === 200) {
                        albumItemHTML.remove();
                        alertNotification({status: "success", text: "Запись успешно удалена", pos: "top-center"});
                    } else {
                        alertNotification({status: "error", text: "Ошибка при удалении записи", pos: "top-center"});
                    }
                }
            });
        }
    }

    function addAlbum() {
        var btnAddGroupHTML = document.createElement("div");
        btnAddGroupHTML.classList.add("btn-add-container");
        btnAddGroupHTML.innerHTML = `
        <button type="button" class="btn btn-icon-left btn-add-item_full"><i class="ph ph-plus-circle"></i>Создать новый альбом</button>`;
        document.getElementById("app").append(btnAddGroupHTML);

        btnAddGroupHTML.addEventListener("click", function () {
            var form = document.createElement("form");
            form.append(
                formFields.inputText({label: "Название альбома", name: "name_album", validate: "true"}),
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

                if (getValuesForm.status === false) return false;

                // отправляем данные
                var createAlbum = XMLHttpRequestAJAX({
                    url: "/api/site/gallery/album",
                    method: "POST",
                    body: getValuesForm.form
                });
                console.log(createAlbum);

                if (createAlbum.code === 200) {
                    modal.closeModal();
                    ItemAlbum(createAlbum.data);
                    alertNotification({status: "success", text: "Альбом создан", pos: "top-center"});
                } else {
                    alertNotification({status: "error", text: createAlbum.data, pos: "top-center"});
                }
            }
        });
    }

    function initTable(album) {
        var tableHTML = document.createElement("table");
        tableHTML.classList.add("P-table-album");
        tableHTML.classList.add("G-table");
        tableHTML.innerHTML = `
        <thead>
            <tr>
                <th width="64">id</th>
                <th width="80">Фото</th>
                <th width="">Название</th>
                <th width="">Расширение</th>
                <th width="90">Вес</th>
                <th width="200">Дата</th>
                <th width="100">Статус</th>
                <th width="100">Действия</th>
            </tr>
        </thead>
        <tbody>
            <tr class="add-new-item">
                <td colspan="8">
                    <button type="button" class="btn btn-add-item btn-icon-left"><i class="ph ph-plus-circle"></i>Загрузить изображение</button>
                </td>
            </tr>
        </tbody>`;

        tableHTML.querySelector(".btn-add-item").addEventListener("click", function () {
            addImageToAlbum(album);
        });

        return tableHTML;
    }

    function itemImage(image) {
        var rowHTML = document.createElement("tr");
        rowHTML.classList.add("row-image");
        rowHTML.setAttribute("data-id", image.id)
        rowHTML.innerHTML = `
        <td class="col-id">${image.id}</td>
        <td class="col-photo"><img src="${image.image}" class="photo-adv"></td>
        <td class="col-title"><span class="title">${image.title}</span></td>
        <td class="col-ext">${image.extension}</td>
        <td class="col-weight">${convertFileSize(image.weight)}</td>
        <td class="col-date">${DateFormat(image.date_create, "d Month, N (H:i)")}</td>
        <td class="col-status"></td>
        <td class="col-events">
            <div class="row-container">
                <button type="button" class="btn btn-outline-primary btn-square btn-edit" uk-tooltip="Заменить фото"><i class="ph ph-pencil-simple"></i></button>
                <button type="button" class="btn btn-outline-primary btn-square btn-delete"><i class="ph ph-trash"></i></button>
            </div>
        </td>`;

        // вставляем switch активности сайта
        var switchActivity = formFields.switchRadio({name: "activity", checked: image.activity, callback: isActivitySite})
        rowHTML.querySelector(".col-status").append(switchActivity);

        // изменение активности сайта
        function isActivitySite(status) {
            var isActivity = XMLHttpRequestAJAX({
                url: "/api/site/gallery/image_is_activity",
                method: "POST",
                body: {
                    id_image: image.id,
                    activity: status
                }
            });

            if (isActivity.code === 200) {
                var status = (isActivity.data.activity == "off") ? "выключена" : "активна";
                alertNotification({status: "success", text: `Запись ${status}`, pos: "top-center"});
            }

            return isActivity.data.activity
        }

        // редактирование записи
        rowHTML.querySelector(".btn-edit").addEventListener("click", function () {
            getUploadFiles({
                ext: "img",
                multiple: "false"
            }, fileProcessing);

            function fileProcessing(files) {

                if (files.length == 0) return false;

                // получаем данные
                var resReplacement = XMLHttpRequestAJAX({
                    url: "/api/site/gallery/images",
                    method: "POST",
                    body: {
                        id_site: project.id,
                        id_image: image.id,
                        photos: files,
                        replacement: "true"
                    }
                });
                console.log("resReplacement", resReplacement);

                if (resReplacement.code === 200) {
                    var listContainer = document.querySelector(".P-item-album[id-album='"+image.id_album+"'] table tbody"),
                        pastUpdateRow = listContainer.append(itemImage(resReplacement.data)),
                        replaceableItem = rowHTML,
                        allItem = listContainer.querySelectorAll(".row-image"),
                        newItem = allItem[allItem.length - 1];

                    console.log("pastUpdateRow", pastUpdateRow)

                    listContainer.replaceChild(newItem, replaceableItem);

                    alertNotification({status: "success", text: "Обложка успешно обновлена", pos: "top-center"});
                } else {
                    alertNotification({status: "error", text: "Ошибка при обновлении обложки", pos: "top-center"});
                }
            }
        });

        // удаление записи
        rowHTML.querySelector(".btn-delete").addEventListener("click", function () {
            modalAlert({
                type: "delete",
                title: image.title,
                callback: deleteImage,
            });

            // запрос на удаление записи
            function deleteImage() {
                console.log("image", image)
                var deleteImage = XMLHttpRequestAJAX({
                    url: "/api/site/gallery/images",
                    method: "DELETE",
                    body: {id_image: image.id}
                });

                console.log("deleteImage", deleteImage)

                if (deleteImage.code === 200) {
                    rowHTML.remove();
                    alertNotification({status: "success", text: "Запись успешно удалена", pos: "top-center"});
                } else {
                    alertNotification({status: "error", text: "Ошибка при удалении записи", pos: "top-center"});
                }
            }
        });

        return rowHTML;
    }
    
    function addImageToAlbum(album) {
        var form = document.createElement("form");

        // добавляем поля
        form.append(
            formFields.photos({label: "Прикрепить фотографию", name: "photos", ext: "img", multiple: "true", validate: "true"}),
            formFields.inputHidden({name: "id_site", value: project.id}),
            formFields.inputHidden({name: "id_album", value: album.id}),
            formFields.inputHidden({name: "name_album", value: album.title})
        );

        var modal = new Modal({
            title: 'Загрузка изображений в альбом \n"' + album.title + '"',
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
                    title: "Загрузить",
                    callback: function() {
                        sendFormAdv();
                    }
                },
            }
        });

        function sendFormAdv() {
            var getValuesForm = formFields.getValuesForm(form);

            if (getValuesForm.status == false || getValuesForm.form.photos == "") {
                alertNotification({status: "alert", text: "Выберите изображения для загрузки", pos: "top-center"});
                return false;
            }

            // отправляем данные
            var sendImagesToAlbum = XMLHttpRequestAJAX({
                url: "/api/site/gallery/images",
                method: "POST",
                body: getValuesForm.form
            });
            console.log(sendImagesToAlbum);

            if (sendImagesToAlbum.code === 200) {
                var getAlbum = document.querySelector(".P-item-album[id-album='"+album.id+"'] .P-table-album");

                for (var i in sendImagesToAlbum.data) {
                    var dataImage = sendImagesToAlbum.data[i];
                    var getImage = itemImage(dataImage);
                    getAlbum.querySelector("tbody .add-new-item").before(getImage);
                }
                modal.closeModal();
                alertNotification({status: "success", text: "Изображения успешно добавлены", pos: "top-center"});
            } else {
                alertNotification({status: "error", text: "Ошибка при добавлении", pos: "top-center"});
            }
        }
    }
}