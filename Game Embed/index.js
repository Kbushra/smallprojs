display = document.getElementById("display");
frame = document.getElementById("frame");

display.addEventListener("click", () =>
{
    frame.src = "https://html-classic.itch.zone/html/13767402/index.html";
    frame.focus();
    frame.contentWindow.focus();
    
    display.remove();
});