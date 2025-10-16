const script = document.currentScript;
let display = document.getElementById("display");
let frame = document.getElementById("frame");

display.addEventListener("click", () =>
{
    frame.src = script.dataset.link ?? "https://html-classic.itch.zone/html/13767402/index.html";
    frame.focus();
    frame.contentWindow.focus();

    display.remove();
});