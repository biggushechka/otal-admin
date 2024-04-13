export default function orders() {

    var btn = document.createElement("div");
    btn.innerHTML = `<button type="button" class="btn btn-primary">Получить</button>`;
    document.querySelector("#app").append(btn);

    const token = '7edeef28895a8bacd3b5ae2e21578ed23eb2a58f';
    const urlProducts = "https://api.moysklad.ru/api/remap/1.2/entity/product";
    let username = "admin@luxuryworldluxe";
    let password = "0ef4b349bb";
    let login = btoa(username + ":" + password);


    btn.addEventListener("click", function () {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+token);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "manual"
        };

        fetch("https://api.moysklad.ru/api/remap/1.2/entity/product", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    });
}