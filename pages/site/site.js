export default function site() {

    var pathname = document.location.pathname,
        paths = pathname.split('/'),
        domain = paths[2];

    settingPage({
        title: domain,
        breadcrumbs: [
            {title: "Мои сайты", link: "/my-sites"},
            {title: domain, link: ""},
        ]
    });
}