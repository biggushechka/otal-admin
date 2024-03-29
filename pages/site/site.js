import navigation from "./navigation.js";

export default function site() {
    var pathname = document.location.pathname,
        paths = pathname.split('/'),
        domain = paths[2];

    var get_site = getSite(domain);

    console.log("get_site", get_site)

    if (get_site.code !== 200) {
        alert(get_site.data);
        return false;
    }

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
            obj.default(get_site.data);
        }).catch(function(error) {
            console.error(error);
        });
    }
}