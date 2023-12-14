import navigation from "./navigation.js";

export default function site() {
    var pathname = document.location.pathname,
        paths = pathname.split('/'),
        domain = paths[2];

    console.log("domain", getDomainSite())

    settingPage({
        title: domain,
        breadcrumbs: [
            {title: "Мои сайты", link: "/my-sites"},
            {title: domain, link: ""},
        ]
    });

    // выводим навигацию
    navigation({callback: selectTab});

    // получаем нажатый таб из навигации
    function selectTab(tab) {
        document.getElementById("app").innerHTML = "";

        import(`./${tab}.js?v=`+version).then(function(obj) {
            obj.default();
        }).catch(function(err) {
            console.log('catch', err);
        });
    }
}