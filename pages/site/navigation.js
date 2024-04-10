export default function navigation(data) {
    var navTAG = document.createElement("div");
    navTAG.classList.add("P-nav-site");
    var navHTML = `
    <div class="row-container">
        <div class="splide" id="slider-nav">
            <div class="splide__track">
                <ul class="splide__list">`;
                    for (var i in navBtns) {
                        var tab = navBtns[i];
                        navHTML += `
                        <li class="splide__slide">
                            <button type="button" class="btn btn-tab" data-tab="${tab.tab}">${tab.title}</button>
                        </li>`;
                    }
                    navHTML += `
                </ul>
            </div>
        </div>
    </div>`;
    navTAG.innerHTML = navHTML;
    document.getElementById("G-header").append(navTAG);

    new Splide("#slider-nav", {
        drag: "free",
        autoWidth: true,
        wheel: true,
        arrows: false,
        pagination: false,
    }).mount();


    isParametr();

    var buttons = navTAG.querySelectorAll('.btn-tab');
    buttons.forEach(function(button) {
        button.addEventListener('click', handleButtonClick);
    });

    function handleButtonClick(event) {
        // удаляем активный класс у всех табов
        buttons.forEach(function(button) {
            button.classList.remove('active');
        });
        // добавляем активный класс нажатому табу
        event.target.classList.add('active');

        // кидаем в URL параметр выбранного таба
        const tab = event.target.getAttribute('data-tab');
        history.pushState(null, null, `?tab=${tab}`);

        // возвращаем имя выбранного таба
        var selectTab = event.target.getAttribute("data-tab");
        return data.callback(selectTab);
    }

    function isParametr() {
        // Получаем текущий URL страницы
        const url = new URL(window.location.href);
        // Получаем объект URLSearchParams для работы с параметрами URL
        const params = new URLSearchParams(url.search);

        // Проверяем наличие параметра "tab"
        var tab;
        if (!params.has('tab')) {
            tab = navBtns[0].tab;
        } else {
            tab = params.get('tab');
        }

        history.pushState(null, null, `?tab=${tab}`);
        navTAG.querySelector(".btn-tab[data-tab='"+tab+"']").classList.add("active");
        return data.callback(tab);
    }
}

var navBtns = [
    {title: "Общая информация", tab: "general_info"},
    {title: "Параметры", tab: "parameters"},
    {title: "Описание", tab: "desc"},
    {title: "Расположение", tab: "location"},
    {title: "Преимущества", tab: "advantages"},
    {title: "Инфраструктура", tab: "infrastructure"},
    {title: "Галерея", tab: "gallery"},
    // {title: "График стройки", tab: "construction"},
    // {title: "Новости", tab: "news"},
    {title: "Банки", tab: "banks"},
    // {title: "Документы", tab: "docs"},
    // {title: "Квиз", tab: "kviz"},
    {title: "Meta-теги", tab: "meta"},
    {title: "Заявки", tab: "orders"}
];