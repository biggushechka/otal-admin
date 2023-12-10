let header = document.createElement('header');
header.id = "G-header";
var headerHTML = `
<div class="wrapper-container">
    <div class="left-col">
        <h2 class="title-page"></h2>
    </div>
    <div class="right-col"></div>
</div>`;

header.innerHTML = headerHTML;
document.getElementById("app").before(header);