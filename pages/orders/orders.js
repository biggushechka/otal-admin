export default function orders() {

    var btn = document.createElement("div");
    btn.innerHTML = `<button type="button" class="btn btn-primary">Получить</button>`;
    document.querySelector("#app").append(btn);

    const token = 'uNb8f87WSiQht53OeUO3HK6WFjppmMPL';
    const urlGetProducts = 'https://musorhren.retailcrm.ru/api/v5/store/products';

    btn.addEventListener("click", function () {
        var maxmax = XMLHttpRequestAJAX({
            url: urlGetProducts,
            method: "GET",
            headers: {
                "X-Api-Key": token
            }
        });

        console.log("maxmax", maxmax)
    });
}