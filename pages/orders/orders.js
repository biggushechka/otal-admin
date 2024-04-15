export default function orders() {

    var btn = document.createElement("div");
    btn.innerHTML = `<button type="button" class="btn btn-primary">Получить</button>`;
    document.querySelector("#app").append(btn);

    const token = 'uNb8f87WSiQht53OeUO3HK6WFjppmMPL';
    const urlGetProducts = 'https://musorhren.retailcrm.ru/api/api-versions';

    const myHeaders = new Headers();
    myHeaders.append("X-Api-Key", "uNb8f87WSiQht53OeUO3HK6WFjppmMPL");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "manual"
    };

    fetch("https://musorhren.retailcrm.ru/api/api-versions", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}