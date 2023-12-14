export default function parametrs() {
    var blockTAG = document.createElement("section");
    blockTAG.classList.add("P-parametrs");
    blockTAG.innerHTML = `
    <div class="card-body">
    parametrs
    </div>`;
    document.getElementById("app").append(blockTAG);
}