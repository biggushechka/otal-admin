export default function authorization() {
    createCSSLink("/pages/authorization/css/authorization.css");

    var autorizHTML = document.createElement("div");
    autorizHTML.classList.add("P-authorization-form");
    autorizHTML.innerHTML = `
    <div class="form-container">
        <div class="wrapper-container">
            <div class="logo-container">
                <img src="/assets/img/logo.svg" alt="logo" class="img-logo">
                <span class="title">OTAL Admin</span>
            </div>
            <form class="form-wrapper">
                <span class="title-form">Личный кабинет</span>
                <label>
                    <input type="text" name="username" placeholder="Email или номер телефона" autocomplete="on" class="field-input">
                </label>
                <label>
                    <input type="password" name="password" placeholder="Пароль" autocomplete="on" class="field-input">
                </label>
                <div class="error-notification">
                    <span class="text">Неверный логин или пароль, попробуйте заново</span>
                </div>
                <button type="button" class="btn btn-primary btn-submit-authorization"><span class="title">Войти</span></button>
            </form>
        </div>       
    </div>`;
    document.getElementById("app").append(autorizHTML);

    autorizHTML.querySelector(".btn-submit-authorization").addEventListener("click", function () {
        authorizationVerification();
    });

    // в форме по нажатию на Enter пройти авторизацию
    autorizHTML.querySelector('form').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Предотвращаем отправку формы методом по умолчанию
            authorizationVerification();
        }
    });
}

function authorizationVerification() {
    var form = document.querySelector(".P-authorization-form form"),
        loginField = form.querySelector('input[name="username"]'),
        passwordField = form.querySelector('input[name="password"]'),
        btnSubmit = form.querySelector('.btn-submit-authorization'),
        loginVal = loginField.value,
        passwordVal = passwordField.value;

    if (loginVal === '' || passwordVal === '') {

        if (loginVal === '') loginField.classList.add('error-valid');
        if (passwordVal === '') passwordField.classList.add('error-valid');

        // при фокусе (активном сосотоянии) убираем у input класс с ошибкой
        var inputs = form.querySelectorAll('input');
        inputs.forEach(function (input) {
            input.addEventListener('click', function () {
                this.classList.remove('error-valid');
                form.querySelector(".error-notification").classList.remove("active");
            });

            input.addEventListener('change', function () {
                this.classList.remove('error-valid');
                form.querySelector(".error-notification").classList.remove("active");
            });
        });

        return false;
    } else {
        var formData = {};
        formData.login = loginVal;
        formData.password = passwordVal;

        form.querySelector(".error-notification").classList.remove("active");
        btnSubmit.classList.add('loading'); // запускаем анимацию в кнопке submit

        setTimeout(function () {
            // отправляем форму на сервер
            var res = XMLHttpRequestAJAX({
                url: "/api/login",
                method: "POST",
                body: formData
            });

            console.log("res", res)

            if (res.code === 200) {

                setCookie({
                    name: "authorization",
                    data: res.data.id,
                    expires: "",
                    path: "/"
                });

                btnSubmit.classList.add('completed'); // при успешной авторизации, красим кнопку в зеленый цвет

                setTimeout(function () {
                    var formWrapper = form.closest(".form-container"); //
                    formWrapper.classList.add('fadeOut');
                    formWrapper.addEventListener('transitionend', function(e) {
                        location.reload();
                    });
                }, 500);

            } else {
                form.querySelector(".error-notification").classList.add("active");
            }
            btnSubmit.classList.remove('loading'); // запускаем анимацию в кнопке submit
        }, 800)
    }
}