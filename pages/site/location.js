export default function location(project) {
    var formFields = new FormFields();

    // получаем данные
    var getLocation = XMLHttpRequestAJAX({
        url: "/api/site/location",
        method: "GET",
        body: {
            id_site: project.id
        }
    });
    getLocation = getLocation.data;
    // console.log("getLocation", getLocation)

    if (getLocation.address == "") {
        // если нет адреса, то отображаем пустой блок с возможностью добавить адрес
        noLocation();
    } else {
        // выводим блок с адресом и картой
        viewLocation();
    }

    // если нет адреса, то отображаем пустой блок с возможностью добавить адрес
    function noLocation() {
        var noLocationHTML = document.createElement("section");
        noLocationHTML.classList.add("P-no-location");
        noLocationHTML.innerHTML = `
        <div class="card-body">
            <div class="content-card">
                <div class="add-new-address">
                    <i class="ph ph-map-pin-line"></i>
                    <span class="text">Добавьте адрес, чтобы пользователь мог видеть местонахождение проекта</span>
                    <button type="button" class="btn btn-primary btn-add-location">Добавить адрес</button>
                </div>
            </div>
        </div>`;
        document.getElementById("app").append(noLocationHTML);

        noLocationHTML.querySelector(".btn-add-location").addEventListener("click", function () {
            addLocation();
        });
    }

    // модальное окно, где можно добавить адрес
    function addLocation() {
        var modalHTML = document.createElement("div");
        modalHTML.classList.add("add-address-container");
        modalHTML.innerHTML = `
        <div class="tab-select-add-address">
            <button type="button" class="btn btn-tab active" data-tab="address">По адресу</button>
            <button type="button" class="btn btn-tab" data-tab="coordinates">По координатам</button>
            <button type="button" class="btn btn-tab" data-tab="map">На карте</button>
        </div>
        <div class="tab-container"></div>`;

        var tabs = modalHTML.querySelectorAll(".tab-select-add-address .btn-tab"),
            tabСontainer = modalHTML.querySelector(".tab-container");

        tabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                var target = this.getAttribute("data-tab");

                modalHTML.querySelector(".tab-container").innerHTML = "";

                // Удаление класса "active" у всех кнопок
                tabs.forEach(tab => {
                    tab.classList.remove('active');
                });

                // Добавление класса "active" к кликнутой кнопке
                tab.classList.add('active');

                if (target == "address") {
                    searchTo_address(); // поиск по адресу
                } else if (target == "coordinates") {
                    searchTo_coordinates(); // поиск по координатам
                } else if (target == "map") {
                    searchTo_map(); // поиск на карте
                }
            });
        })

        var modalNewAddress = new Modal({
            title: 'Добавить новый адрес',
            classModal: 'P-modal-add-address',
            content: modalHTML,
            mode: 'center',
            width: '540px',
            footerEvents:{
                cancel: {
                    active: true,
                },
                submit: {
                    active: false,
                    title: "Создать",
                    callback: function() {

                    }
                },
            }
        });

        // выводим по деволту первый таб "поиск по адресу"
        searchTo_address();

        // поиск по адресу
        function searchTo_address() {
            var filedContainer = filedInputDadata({
                placeholder: "Введите город, улицу, дом",
                dadata_type: "address",
                callback: getSelectedAddress
            });
            tabСontainer.append(filedContainer);

            function getSelectedAddress(address) {
                var result = dataOutput(address);
            }
        }

        // поиск по координатам
        function searchTo_coordinates() {
            var filedContainer = filedInputDadata({
                placeholder: "Введите широту, долготу",
                dadata_type: "geolocate",
                callback: getSelectedAddress
            });
            tabСontainer.append(filedContainer);

            function getSelectedAddress(address) {
                var result = dataOutput(address);
            }
        }

        // поиск на карте
        function searchTo_map() {
            var mapHTML = document.createElement("div");
            mapHTML.classList.add("map-container");
            mapHTML.id = "map-container";
            modalHTML.querySelector(".tab-container").append(mapHTML);


            ymaps.ready(initMap);
            var myMap;

            function initMap() {
                // Создание карты.
                myMap = new ymaps.Map("map-container", {
                    center: [43.585472, 39.723098],
                    zoom: 7,
                    controls: ['zoomControl']
                }, {
                    suppressMapOpenBlock: true
                });

                myMap.events.add('click', function(event) {
                    // Получение координат точки клика.
                    var coords = event.get('coords');

                    // Геокодирование координат для получения адреса.
                    ymaps.geocode(coords).then(function(res) {
                        var firstGeoObject = res.geoObjects.get(0), // Получение первого найденного объекта геокодирования.
                            coords = event.get('coords'), // Получение координат
                            address = firstGeoObject.getAddressLine(), // Получение адреса из объекта геокодирования.
                            resDadata = requestDadata({query: address}, "address"),
                            address = resDadata.suggestions[0];


                        if (address != undefined) {
                            var result = dataOutput(address);
                        } else {
                            var resDadata_coords = requestDadata({lat: coords[0], lon: coords[1]}, "geolocate"),
                                resultList = modalHTML.querySelector('.hint-preview-address'),
                                resultCard = modalHTML.querySelector('.result-list-address');

                            var previewContainer = document.createElement("div");
                            previewContainer.classList.add("hint-preview-address");
                            modalHTML.querySelector(".tab-container").append(previewContainer);

                            if (resultList) resultList.remove();
                            if (resultCard) resultCard.remove();

                            // выводим адрес в подсказки
                            resDadata_coords.suggestions.forEach(function (address) {
                                var itemHint = rowAddress(address.value, address);
                                previewContainer.append(itemHint);

                                // выбираем по клику адрес
                                itemHint.addEventListener("click", function () {
                                    previewContainer.innerHTML = "";
                                    var result = dataOutput(address);
                                });
                            });
                        }
                    });
                });
            }
        }

        // инпут, куда вводим адрес или координаты
        function filedInputDadata(data) {
            var filedInput = document.createElement("div");
            filedInput.classList.add("field-container");
            let html = ``;
            if (data.dadata_type == "address") {
                html += `
                <input type="text" placeholder="${data.placeholder}" class="field-address">
                <div class="hint-container"></div>`;
            } else if (data.dadata_type == "geolocate") {
                html += `
                <div class="geolocate-container">
                    <input type="text" placeholder="Широта" name="lat">
                    <input type="text" placeholder="Долгота" name="lon">
                    <button type="button" class="btn btn-primary btn-find-geo">Найти</button>
                </div>
                <div class="hint-preview-address"></div>`;
            }
            filedInput.innerHTML = html;


            if (data.dadata_type == "address") {
                var input = filedInput.querySelector("input"),
                    resultHint = filedInput.querySelector(".hint-container");

                input.addEventListener("keyup", function () {
                    var valueQuery = this.value,
                        searchWords = valueQuery.split(" "),
                        resDadata = requestDadata({query: valueQuery}, data.dadata_type),
                        hintsRows = resDadata.suggestions;

                    // чистим dropdown перед каждым нажатием на клавишу
                    resultHint.innerHTML = "";

                    // выводим строку в dropdown
                    hintsRows.forEach(function (address) {
                        var regex = new RegExp(`(${searchWords.join("|")})`, "gi"),
                            row = address.value.replace(regex, "<span class='highlight'>$1</span>");

                        // выводим строку в dropdown
                        var itemHint = rowAddress(row, address);
                        resultHint.append(itemHint);

                        // выбираем по клику строку в dropdown
                        itemHint.addEventListener("click", function () {
                            input.value = address.value;
                            resultHint.innerHTML = "";
                            data.callback(address);
                        });
                    });

                });
            }

            if (data.dadata_type == "geolocate") {
                filedInput.querySelector(".geolocate-container .btn-find-geo").addEventListener("click", function () {
                    var lat = filedInput.querySelector("input[name='lat']").value,
                        lon = filedInput.querySelector("input[name='lon']").value,
                        previewContainer = filedInput.querySelector(".hint-preview-address"),
                        resultAddressElement = modalHTML.querySelector('.result-list-address'),
                        dataGeo = {lat: lat, lon: lon},
                        resDadata = requestDadata(dataGeo, data.dadata_type),
                        hintsRows = resDadata.suggestions;

                    previewContainer.innerHTML = "";

                    if (resultAddressElement) resultAddressElement.remove();

                    // выводим адрес в подсказки
                    hintsRows.forEach(function (address) {
                        var itemHint = rowAddress(address.value, address);
                        previewContainer.append(itemHint);

                        // выбираем по клику адрес
                        itemHint.addEventListener("click", function () {
                            previewContainer.innerHTML = "";
                            var result = dataOutput(address);
                        });
                    });
                });
            }

            return filedInput;
        }

        function rowAddress(row, address) {
            var addressHTML = document.createElement("div");
            addressHTML.classList.add("item");
            addressHTML.innerHTML = row;

            return addressHTML;
        }

        // карточка с конкретным адресом
        function dataOutput(address) {
            const resultAddressElement = modalHTML.querySelector('.result-list-address');
            if (resultAddressElement) resultAddressElement.remove();

            var resultHTML = document.createElement("div");
            resultHTML.classList.add("result-list-address");

            var addressData = {
                address: {
                    title: "Адерс",
                    value: address.value,
                },
                country: {
                    title: "Страна",
                    value: address.data.country,
                },
                federal_district: {
                    title: "Федеральный округ",
                    value: address.data.federal_district,
                },
                region_with_type: {
                    title: "Тип региона",
                    value: address.data.region_with_type,
                },
                settlement_type_full: {
                    title: "Тип населенного пункта",
                    value: address.data.settlement_type_full,
                },
                settlement_with_type: {
                    title: "Населенный пункт с типом",
                    value: address.data.settlement_with_type,
                },
                city_with_type: {
                    title: "Город с типом",
                    value: address.data.city_with_type,
                },
                street_with_type: {
                    title: "Улица",
                    value: address.data.street_with_type,
                },
                house_type_full: {
                    title: "Тип дома",
                    value: address.data.house_type_full,
                },
                house: {
                    title: "Номер",
                    value: address.data.house,
                },
                block: {
                    title: "Корпус/строение",
                    value: address.data.block,
                }
            }


            for (var i in addressData) {
                var addressItem = addressData[i];

                if (addressItem.value == "" || addressItem.value == null) continue;

                var itemRow = document.createElement("div");
                itemRow.classList.add("item");
                itemRow.innerHTML = `
                <span class="title">${addressItem.title}:</span>
                <span class="value">${addressItem.value}</span>`;
                resultHTML.append(itemRow);
            }

            resultHTML.innerHTML += `<button type="button" class="btn btn-primary select-this-address">Выбрать этот адрес</button>`;

            resultHTML.querySelector(".select-this-address").addEventListener("click", function () {
                saveSelectedAddress(address);
            });

            modalHTML.querySelector(".tab-container").append(resultHTML);

        }

        // запрос адреса по API в сервисе "DADATA"
        function requestDadata(value, type) {

            if (type == "address") {
                type = "suggest/address";
            } else if (type == "geolocate") {
                type = "geolocate/address";
            }

            var url = "http://suggestions.dadata.ru/suggestions/api/4_1/rs/"+type,
                token = "bd4cc3685fa3829cd8f6e378447ca4d316cce6f9",
                body = value;

            var xhr = new XMLHttpRequest();

            xhr.open("POST", url, false);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('Authorization', "Token " + token);

            xhr.send(JSON.stringify(body));

            var getData;

            try {
                getData = JSON.parse(xhr.responseText);
            } catch (error) {
                getData = xhr.responseText;
            }

            return getData;
        }

        // сохраняем выбранный адрес
        function saveSelectedAddress(address) {
            var dataAddress = {
                id_site: project.id,
                address: address.value,
                country: address.data.country,
                federal_district: address.data.federal_district,
                region: address.data.region,
                region_type: address.data.region_type,
                region_with_type: address.data.region_with_type,
                region_type_full: address.data.region_type_full,
                settlement_type_full: address.data.settlement_type_full,
                settlement_with_type: address.data.settlement_with_type,
                city: address.data.city,
                city_type: address.data.city_type,
                city_with_type: address.data.city_with_type,
                city_type_full: address.data.city_type_full,
                street: address.data.street,
                street_type: address.data.street_type,
                street_type_full: address.data.street_type_full,
                street_with_type: address.data.street_with_type,
                house: address.data.house,
                house_type: address.data.house_type,
                house_type_full: address.data.house_type_full,
                block: address.data.block,
                block_type: address.data.block_type,
                block_type_full: address.data.block_type_full,
                latitude: address.data.geo_lat,
                longitude: address.data.geo_lon
            }


            // получаем данные
            var sendAddress = XMLHttpRequestAJAX({
                url: "/api/site/location",
                method: "POST",
                body: dataAddress
            });

            if (sendAddress.code === 200) {
                getLocation = dataAddress;

                document.getElementById("app").innerHTML = "";
                modalNewAddress.closeModal();
                viewLocation(); // выводим блок с адресом и картой

                alertNotification({status: "success", text: "Данные успешно обновлены", pos: "top-center"});
            } else {
                alertNotification({status: "error", text: "Ошибка при сохранении данных", pos: "top-center"});
            }
        }
    }


    // выводим блок с адресом и картой
    function viewLocation() {
        var viewLocationHTML = document.createElement("section");
        viewLocationHTML.classList.add("P-view-location");
        viewLocationHTML.innerHTML = `
        <div class="card-body">
            <div class="content-card"></div>
        </div>`;
        document.getElementById("app").append(viewLocationHTML);

        viewOnMap();
        listParametersAddress();
        editAddress();

        function viewOnMap() {
            var mapHTML = document.createElement("div");
            mapHTML.classList.add("map-view-project");
            mapHTML.id = "map-view-project";
            viewLocationHTML.querySelector(".content-card").append(mapHTML);

            ymaps.ready(initMap);
            var myMap;

            function initMap() {
                // Создание карты.
                myMap = new ymaps.Map("map-view-project", {
                    center: [getLocation.latitude, getLocation.longitude],
                    zoom: 15,
                    controls: ['zoomControl']
                }, {
                    suppressMapOpenBlock: true
                });

                // Создание объекта метки.
                var placemark = new ymaps.Placemark([getLocation.latitude, getLocation.longitude], {
                    hintContent: getLocation.address
                });

                // Добавление метки на карту.
                myMap.geoObjects.add(placemark);
            }
        }

        function listParametersAddress() {
            var listHTML = document.createElement("div");
            listHTML.classList.add("list-parameters");
            viewLocationHTML.querySelector(".content-card").append(listHTML);

            var dataAddress = {
                address: {
                    title: "Адрес",
                    value: getLocation.address,
                },
                country: {
                    title: "Страна",
                    value: getLocation.country,
                },
                federal_district: {
                    title: "Федеральный округ",
                    value: getLocation.federal_district,
                },
                region_with_type: {
                    title: "Тип региона",
                    value: getLocation.region_with_type,
                },
                settlement_type_full: {
                    title: "Тип населенного пункта",
                    value: getLocation.settlement_type_full,
                },
                settlement_with_type: {
                    title: "Населенный пункт с типом",
                    value: getLocation.settlement_with_type,
                },
                city_with_type: {
                    title: "Город с типом",
                    value: getLocation.city_with_type,
                },
                street_with_type: {
                    title: "Улица",
                    value: getLocation.street_with_type,
                },
                house_type_full: {
                    title: "Тип дома",
                    value: getLocation.house_type_full,
                },
                house: {
                    title: "Номер",
                    value: getLocation.house,
                },
                block: {
                    title: "Корпус/строение",
                    value: getLocation.block,
                },
                coords: {
                    title: "Широта, долгота",
                    value: getLocation.latitude + ", " +getLocation.longitude,
                }
            }


            for (var i in dataAddress) {
                var param = dataAddress[i];

                if (param.value == "" || param.value == "null" || param.value == null) continue;

                var rowHTML = document.createElement("div");
                rowHTML.classList.add("item");
                rowHTML.innerHTML = `
                <span class="title">${param.title}</span>
                <span class="value">${param.value}</span>`;
                listHTML.append(rowHTML);
            }
        }

        function editAddress() {
            var footerHTML = document.createElement("div");
            footerHTML.classList.add("footer-events");
            footerHTML.innerHTML = `<button type="button" class="btn btn-primary btn-icon-left btn-edit-address"><i class="ph ph-pencil-simple"></i>Изменить адрес</button>`;
            viewLocationHTML.querySelector(".content-card").append(footerHTML);

            footerHTML.querySelector(".btn-edit-address").addEventListener("click", function () {
                addLocation();
            });
        }
    }
}