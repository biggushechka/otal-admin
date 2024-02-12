export default function meta(project) {
    var sectionHTML = document.createElement("section");
    sectionHTML.classList.add("P-meta");
    document.getElementById("app").append(sectionHTML);

    getAllMeta();

    function getAllMeta() {
        // получаем данные
        var getMeta = XMLHttpRequestAJAX({
            url: "/api/site/meta/get-meta",
            method: "GET",
            body: {
                id_site: project.id
            }
        });

        console.log("getMeta", getMeta);

        if (getMeta.code === 200) {
            for (var i in getMeta.data) {
                metaItem(getMeta.data[i]);
            }
        }
    }

    function metaItem(meta) {
        var metaHTML = document.createElement("div");
        metaHTML.classList.add("meta-item");
        metaHTML.classList.add("card-body");
        metaHTML.style.width = "800px";
        metaHTML.innerHTML = `
        <div class="header-card-body">
            <h4 class="title-card">${meta.title}</h4>
        </div>
        <div class="content-card"></div>
        <div class="footer-events">
            <button type="button" class="btn btn-outline-primary btn-square btn-delete"><i class="ph ph-trash"></i></button>
            <button type="button" class="btn btn-outline-primary btn-square btn-delete"><i class="ph ph-pencil-simple"></i></button>
            <button type="button" class="btn btn-primary btn-icon-left btn-save-form"><i class="ph ph-check-circle"></i>Сохранить</button>
        </div>`;
        sectionHTML.append(metaHTML);

        var codeTagHTML = document.createElement("pre");
        codeTagHTML.innerHTML = `
        <code class="hljs language-pf">
            <div>
                <h1>Пример HTML кода</h1>
            </div>
        </code>`;

        metaHTML.querySelector(".content-card").append(codeTagHTML);

        hljs.highlightAll();
    }

    function btnAddMeta() {

    }
}