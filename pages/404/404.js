export default function page404() {
    let pageHTML = document.createElement('div');
    pageHTML.classList.add("page-404");
    pageHTML.innerHTML = `
    <div class="wrapper-container">
        <img src="/pages/404/404.png" alt="">
    </div>`;
    document.querySelector("#app").append(pageHTML);
}