export default function orders() {

    const token = '7edeef28895a8bacd3b5ae2e21578ed23eb2a58f';
    let username = "admin@luxuryworldluxe";
    let password = "0ef4b349bb";
    let login = btoa(username + ":" + password);


    // const getTovar = XMLHttpRequestAJAX({
    //     url: "https://api.moysklad.ru/api/remap/1.2/entity/product",
    //     method: "GET",
    //     headers: {
    //         'Authorization': 'Basic ' + login,
    //         'Accept-Encoding:': 'gzip',
    //         'Lognex-Pretty-Print-JSON': 'true',
    //     }
    // });
    //
    // console.log("getTovar", getTovar)


    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 7edeef28895a8bacd3b5ae2e21578ed23eb2a58f");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "manual"
    };

    fetch("https://api.moysklad.ru/api/remap/1.2/entity/product", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}