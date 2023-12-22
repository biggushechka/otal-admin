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

    var blockTAG = document.createElement("section");
    blockTAG.classList.add("P-location");
    document.getElementById("app").append(blockTAG);

    if (getLocation.address == "") {

    } else {

    }
}