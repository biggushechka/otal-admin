// отправляем форму на сервер
var getUser = XMLHttpRequestAJAX({
    url: "/api/user",
    method: "GET",
    body: {
        id: getAuthorization
    }
});
getUser = getUser.data;

let header = document.createElement('header');
header.id = "G-header";
var headerHTML = `
<div class="wrapper-container">
    <div class="left-col">
        <h2 class="title-page"></h2>
    </div>
    <div class="right-col">
        <div class="user-container">
            <img src="https://otal-estate.ru/api/media/admin.jpg" class="photo">
            <span class="name">${getUser.name}</span>
        </div>
        <div class="event-buttons-container">
            <button type="button" class="btn btn-item btn-logout"><i class="ph ph-sign-out"></i>Выход</button>
        </div>
    </div>
</div>`;

header.innerHTML = headerHTML;
document.getElementById("app").before(header);

document.querySelector(".btn-logout").addEventListener("click", function () {
    logOutAdmin();
});