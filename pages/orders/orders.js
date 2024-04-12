export default function orders() {
    const accessToken = '7edeef28895a8bacd3b5ae2e21578ed23eb2a58f';

    let username = "admin@luxuryworldluxe";
    let password = "0ef4b349bb";

    // const getTovar = XMLHttpRequestAJAX({
    //     url: "https://api.moysklad.ru/api/remap/1.2/entity/product",
    //     method: "GET",
    //     headers: {
    //         'Authorization': 'Bearer 7edeef28895a8bacd3b5ae2e21578ed23eb2a58f',
    //         'Content-Type': 'application/json'
    //     }
    // });
    //
    // console.log("getTovar", getTovar)




    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 7edeef28895a8bacd3b5ae2e21578ed23eb2a58f");

    fetch("https://api.moysklad.ru/api/remap/1.2/entity/product", {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    })
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}