export default function orders() {

    var btn = document.createElement("div");
    btn.innerHTML = `<button type="button" class="btn btn-primary">Получить</button>`;
    document.querySelector("#app").append(btn);

    const token = 'uNb8f87WSiQht53OeUO3HK6WFjppmMPL';
    const urlGetProducts = 'https://musorhren.retailcrm.ru/api/api-versions';

        fetch(urlGetProducts, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Api-Key': token
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
}