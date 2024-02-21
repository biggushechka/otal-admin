export default function authorization() {
    createCSSLink("/pages/authorization/css/authorization.css");

    var formFields = new FormFields();

    var autorizHTML = document.createElement("div");
    autorizHTML.classList.add("P-authorization-form");
    autorizHTML.innerHTML = `
    <div class="form-container">
        <div class="wrapper-container">
            <div class="logo-container">
                <img src="/assets/img/logo.svg" alt="logo" class="img-logo">
                <span class="title">OTAL Admin</span>
            </div>
            <div class="form-wrapper">
                <span class="title-form">Личный кабинет</span>
                <form></form> 
                <div class="error-notification">
                    <span class="text"></span>
                </div>
                <button type="button" class="btn btn-primary btn-submit-authorization"><span class="title">Войти</span></button>
            </div>
        </div>       
    </div>`;
    document.getElementById("app").append(autorizHTML);

    var form = autorizHTML.querySelector("form");

    // добавляем поля
    form.append(
        formFields.inputText({label: "", name: "username", placeholder: "Email или номер телефона", autocomplete: "on", validate: "true"}),
        formFields.inputText({label: "", name: "password", placeholder: "Пароль", autocomplete: "on", validate: "true"})
    );

    // клик по кнопке "Войти"
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

    function authorizationVerification() {
        var btnSubmit = autorizHTML.querySelector(".btn-submit-authorization"),
            error = autorizHTML.querySelector(".error-notification"),
            getValuesForm = formFields.getValuesForm(form);

        console.log("getValuesForm", getValuesForm)
        error.classList.remove("active");

        if (getValuesForm.status == false) return false;

        btnSubmit.classList.add('loading'); // запускаем анимацию в кнопке submit

        setTimeout(function () {
            // отправляем форму на сервер
            var sendLoginData = XMLHttpRequestAJAX({
                url: "/api/authorization",
                method: "POST",
                body: getValuesForm.form
            });

            btnSubmit.classList.remove('loading'); // запускаем анимацию в кнопке submit

            // успешная авторизация
            if (sendLoginData.code === 200) {
                setCookie({
                    name: "authorization",
                    data: sendLoginData.data.id,
                    expires: 10800, // сеанс на 3 часа
                    path: "/"
                });

                // при успешной авторизации, красим кнопку в зеленый цвет
                btnSubmit.classList.add('completed');

                setTimeout(function () {
                    var formWrapper = form.closest(".form-container"); //
                    formWrapper.classList.add('fadeOut');
                    formWrapper.addEventListener('transitionend', function(e) {
                        location.reload();
                    });
                }, 500);
            } else {
                // показываем ошибку
                error.querySelector(".text").innerHTML = sendLoginData.data;
                error.classList.add("active");
            }
        }, 700)
    }
}