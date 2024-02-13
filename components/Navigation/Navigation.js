const navigationList = [
    {
        title: "Главная",
        link: "/",
        icon: "ph ph-house"
    },
    {
        title: "Мои сайты",
        link: "/my-sites",
        icon: "ph ph-browsers"
    },
    {
        title: "Профиль",
        link: "/profile",
        icon: "ph ph-user"
    },
    {
        title: "Разработчику",
        link: "/dev",
        icon: "ph ph-code"
    },
    {
        title: "Настройки",
        link: "/settings",
        icon: "ph ph-gear"
    }
];

let navigation = document.createElement('nav');
navigation.id = "G-navigation";
var navigationHTML = `
<div class="wrapper-container">
    <a href="/" class="header-container">
        <img src="/assets/img/logo.svg" class="logo-image">
        <span class="title">OTAL Admin</span>
    </a>
    <div class="nav-container">`;
        for (var linkItem in navigationList) {
            var link = navigationList[linkItem];

            navigationHTML += `
            <a class="link-item" href="${link.link}">
                <i class="${link.icon}"></i>
                <span class="title">${link.title}</span>
            </a>`;
        }
        navigationHTML += `
    </ul>
</div>`;
navigation.innerHTML = navigationHTML;
document.getElementById("app").before(navigation);

// Выделяем цветом ссылку в меню, исходя из того, на какой стр. мы находимся
findActivePage();

// Выделяем цветом ссылку в меню, исходя из того, на какой стр. мы находимся
function findActivePage() {
    const currentPath = window.location.pathname,
        paths = pathname.split('/'),
        domain = "/"+paths[1];

    console.log("paths", paths)

    const menuLinks = navigation.querySelectorAll('.link-item');

    // Перебираем каждую ссылку и проверяем, соответствует ли ее href текущему пути
    menuLinks.forEach(link => {
        const linkPath = link.getAttribute('href');

        // Сравниваем текущий путь с href ссылки и добавляем класс "visited", если они совпадают
        if (linkPath === domain) {
            link.classList.add('visited');
        }
    });
}