//import dayjs from "dayjs";
var timer = document.getElementById("timer");
var zone = [ document.getElementById("zone-"), document.getElementById("zone+") ];
var offset = 0;

function time()
{
    var djs = dayjs().add(offset, "hour");
    timer.innerText = `${djs.hour()}:${djs.minute()}:${djs.second()}.${djs.millisecond()}`;
    console.log(timer.innerText);
}

time();
setInterval(time);

zone[0].addEventListener("click", () => { offset--; });
zone[1].addEventListener("click", () => { offset++; });