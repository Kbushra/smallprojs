var stages = document.getElementsByClassName("stage");
var icons = document.getElementsByClassName("stage-icon");
var progBar = document.getElementById("prog");

for (let i = 0; i < stages.length; i++)
{
    stages[i].addEventListener("click", function()
    {
        let ind = 0;

        for (let i = 0; i < stages.length; i++)
        {
            if (stages[i] == this) { ind = i; }
            if (icons[i].style.animationPlayState == "running") { return; }
        }

        progBar.style.width = (300 * ind) + "px";

        for (let stage = 0; stage < stages.length; stage++)
        {
            if (stage <= ind && icons[stage].src != document.baseURI + "Images/tick.png")
            {
                icons[stage].style.animationPlayState = "running";
                icons[stage].src = document.baseURI + "Images/tick.png";
            }
            else if (stage > ind && icons[stage].src != document.baseURI + "Images/cross.png")
            {
                icons[stage].style.animationPlayState = "running";
                icons[stage].src = document.baseURI + "Images/cross.png";
            }
        }
    });

    icons[i].addEventListener("animationiteration", function()
    {
        this.style.animationPlayState = "paused";
    });
}