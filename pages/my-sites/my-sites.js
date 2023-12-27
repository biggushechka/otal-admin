export default function mySites() {
    settingPage({
        title: "Мои сайты"
    });

    const sliderGallery = XMLHttpRequestAJAX({
        url: "/api/site/content/gallery",
        method: "POST",
        body: {
            id_site: "54",
            album: "main"
        }
    });
    console.log("sliderGallery", sliderGallery);


    var sitesHTML,
        tableHTML,
        siteHTML,
        formFields = new FormFields();

    sitesHTML = document.createElement("div");
    sitesHTML.classList.add("P-my-sites");
    sitesHTML.innerHTML = `
    <div class="wrapper-container">
        <div class="card-body">
            <div class="header-card-body">
                <h4 class="title-card">Всего - <span class="count-all"></span></h4>
                <button type="button" class="btn btn-primary btn-icon-left btn-add-site"><i class="ph ph-plus-circle"></i>Добавить сайт</button>
            </div>
            <div class="content-card"></div>
        </div>
    </div>`;
    document.getElementById("app").append(sitesHTML);

    initTable();
    getAllSite();

    // создание нового сайта
    sitesHTML.querySelector(".btn-add-site").addEventListener("click", function () {
        var modalHTML = document.createElement("form");

        modalHTML.append(formFields.inputText({label: "Название", placeholder: "Alba Del Mare", name: "title", validate: "true"}));
        modalHTML.append(formFields.inputText({label: "Домен", placeholder: "example.ru", name: "domain", validate: "true"}));

        var modal = new Modal({
            title: 'Создать новый сайт',
            classModal: 'P-modal-create-site',
            content: modalHTML,
            mode: 'center',
            width: '480px',
            footerEvents:{
                cancel: {
                    active: true,
                },
                submit: {
                    active: true,
                    title: "Создать",
                    callback: function() {
                        creatNewSite();
                    },
                },
            }
        });

        // выполняем запрос на создание нового сайта
        function creatNewSite() {
            var getValuesForm = formFields.getValuesForm(modalHTML);

            if (getValuesForm.status == false) return false;

            var createSite = XMLHttpRequestAJAX({
                url: "/api/my_sites",
                method: "POST",
                body: getValuesForm.form
            });
            console.log("createSite", createSite);

            if (createSite.code === 201) {
                getItemSite(createSite.data)
                modal.closeModal();
            } else {
                var errorTAG = document.createElement("div");
                errorTAG.classList.add("error-notification");
                errorTAG.innerHTML = `<span>${createSite.data.error}</span>`;
                modalHTML.append(errorTAG);
            }
        }
    });

    // получаем все сайты
    function getAllSite() {
        var getSite = XMLHttpRequestAJAX({
            url: "/api/my_sites",
            method: "GET"
        });
        getSite = getSite.data;

        sitesHTML.querySelector(".count-all").innerHTML = getSite.length;

        for (var i in getSite) {
            var site = getSite[i];
            getItemSite(site);
        }
    }

    // выводим таблицу для сайтов
    function initTable() {
        tableHTML = document.createElement("table");
        tableHTML.classList.add("P-table-my-sites");
        tableHTML.classList.add("G-table");
        tableHTML.innerHTML = `
        <thead>
            <tr>
                <th width="64">id</th>
                <th width="300">Проект</th>
                <th width="200">Домен</th>
                <th width="200">Дата создания</th>
                <th>Статус</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody></tbody>`;
        sitesHTML.querySelector(".content-card").append(tableHTML);
    }

    // выводим один сайт
    function getItemSite(site) {
        var domain = site.domain.replace(/^https?:\/\//, ""),
            linkEDIT = `/my-sites/${domain}`,
            linkTOSITE = `${site.domain}/`;

        siteHTML = document.createElement("tr");

        var siteTMPL = `
        <td class="cell-id">${site.id}</td>
        <td class="cell-title"><a href="${linkEDIT}" class="link-to-site"><i class="ph-fill ph-folder-simple"></i>${site.title}</a></td>
        <td class="cell-domain"><a href="${linkTOSITE}" target="_blank" uk-tooltip="Перейти на сайт">${domain}</a></td>
        <td class="cell-dc">${DateFormat(site.date_create, "d Month, N (H:i)")}</td>
        <td class="cell-activity"></td>
        <td class="cell-events">
            <div class="row-container">
                <a href="${linkEDIT}" class="btn btn-outline-primary btn-square"><i class="ph ph-pencil-simple"></i></a>
            </div>
        </td>`;
        siteHTML.innerHTML = siteTMPL;
        tableHTML.querySelector("tbody").append(siteHTML);

        // вставляем switch активности сайта
        var switchActivity = formFields.switchRadio({name: "activity", checked: site.activity, callback: isActivitySite})
        siteHTML.querySelector(".cell-activity").append(switchActivity);


        // изменение активности сайта
        function isActivitySite(status) {
            var isActivity = XMLHttpRequestAJAX({
                url: "/api/site/general/isActivity",
                method: "POST",
                body: {
                    id_site: site.id,
                    activity: status
                }
            });

            if (isActivity.code === 200) {
                var status = (isActivity.data.activity == "off") ? "выключен" : "включен";
                alertNotification({status: "success", text: `Cайт ${site.domain} - ${status}`, pos: "top-center"});
            }

            return isActivity.data.activity
        }

        // вставляем dropdown с действиями над сайтом
        var btnsEvents = dropdownWidget({
            classWrapper: "dropdown-tels",
            classList: "",
            pos: "bottom-center",
            buttonToggle: `<button type="button" class="btn btn-outline-primary btn-square"><i class="ph-bold ph-dots-three"></i></button>`,
            buttonsList: [
                {class: 'dp-btn-edit', title: `Редактировать`, link: linkEDIT, icon: {type: "icon-ph", name: "ph ph-pencil-simple"}, callback: modalAlert},
                {class: 'dp-btn-link', title: `Перейти на сайт`, link: linkTOSITE, target: "_blank", icon: {type: "icon-ph", name: "ph ph-link-simple"}},
                {separator: 'true'},
                {class: 'dp-btn-delete_project', title: `Удалить`, icon: {type: "icon-ph", name: "ph ph-trash"}}
            ]
        })
        siteHTML.querySelector(".cell-events .row-container").append(btnsEvents);

        // удаление сайта
        btnsEvents.querySelector(".dp-btn-delete_project").addEventListener("click", function () {
            modalAlert({
                type: "delete",
                title: site.title,
                callback: deleteSite,
            });

            // запрос на удаление сайта
            function deleteSite() {
                var deleteSiteReq = XMLHttpRequestAJAX({
                    url: "/api/my_sites",
                    method: "DELETE",
                    body: {
                        domain: site.domain
                    }
                });

                if (deleteSiteReq.code = 200) {
                    siteHTML.remove();
                }
            }
        });
    }
}