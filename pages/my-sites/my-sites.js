export default function mySites() {
    settingPage({
        title: "Мои сайты"
    });

    var sitesHTML,
        tableHTML,
        siteHTML;

    sitesHTML = document.createElement("div");
    sitesHTML.classList.add("P-my-sites");
    sitesHTML.innerHTML = `
    <div class="wrapper-container">
        <div class="card-body">
            <div class="header-card-body">
                <h4 class="title-card">Всего - <span class="count-all"></span></h4>
                <button type="button" class="btn btn-primary btn-add-site">Добавить сайт</button>
            </div>
            <div class="content-card"></div>
        </div>
    </div>`;
    document.getElementById("app").append(sitesHTML);

    initTable();
    getAllSite();

    sitesHTML.querySelector(".btn-add-site").addEventListener("click", function () {
        var modalHTML = document.createElement("form");
        modalHTML.innerHTML = `
        <label class="field-container">
            <span class="title-field">Название проекта</span>
            <input type="text" name="title" class="field-input" value="">
        </label>
        <label class="field-container">
            <span class="title-field">Домен</span>
            <input type="text" name="domain" class="field-input" value="">
        </label>`;

        var modalComplaint = new Modal({
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

        function creatNewSite() {
            var dataForm = {},
                titleSite = modalHTML.querySelector("input[name='title']").value,
                domainSite = modalHTML.querySelector("input[name='domain']").value;

            dataForm.title = titleSite;
            dataForm.domain = domainSite;

            var createSite = XMLHttpRequestAJAX({
                url: "/api/my_sites",
                method: "POST",
                body: dataForm
            });

            console.log("createSite", createSite)
        }
    });

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

    function initTable() {
        tableHTML = document.createElement("table");
        tableHTML.classList.add("P-table-my-sites");
        tableHTML.classList.add("G-table");
        tableHTML.innerHTML = `
        <thead>
            <tr>
                <th>id</th>
                <th>Проект</th>
                <th>Домен</th>
                <th>Дата создания</th>
                <th>Статус</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody></tbody>`;
        sitesHTML.querySelector(".content-card").append(tableHTML);
    }

    function getItemSite(site) {
        siteHTML = document.createElement("tr");
        var siteTMPL = `
        <td class="cell-id">${site.id}</td>
        <td class="cell-title"><a href="/my-sites/${site.domain}" class="link-to-site"><i class="ph-fill ph-folder-simple"></i>${site.title}</a></td>
        <td class="cell-domain">${site.domain}</td>
        <td class="cell-dc">${DateFormat(site.date_create, "d Month, N (H:i)")}</td>
        <td class="cell-status">true</td>
        <td class="cell-events">1 2</td>`;
        siteHTML.innerHTML = siteTMPL;
        tableHTML.querySelector("tbody").append(siteHTML);
    }
}