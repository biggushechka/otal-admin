import descTmpl from "./descTmpl.js";

export default function desc(project) {
    var blockTAG = document.createElement("section");
    blockTAG.classList.add("P-desc");
    document.getElementById("app").append(blockTAG);

    descTmpl({
        id_site: project.id,
        title: "О проекте",
        target: "about"
    });

    descTmpl({
        id_site: project.id,
        title: "Территория",
        target: "territory"
    });
}