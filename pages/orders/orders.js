export default function orders() {
    const accessToken = '7edeef28895a8bacd3b5ae2e21578ed23eb2a58f';

    const getTovar = XMLHttpRequestAJAX({
        url: "https://online.moysklad.ru/api/remap/1.2/entity/product",
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }
    });

    console.log("getTovar", getTovar)

    // fetch('https://online.moysklad.ru/api/remap/1.2/entity/product', {
    //     method: 'GET',
    //     headers: {
    //         'Authorization': 'Bearer ' + accessToken,
    //         'Content-Type': 'application/json'
    //     }
    // })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data);
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });
}