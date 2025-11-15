var personList = ["./People/guy1.jpg", "./People/guy2.jpg", "./People/donald.jpg"];
var descList = ["I'm smiling because of how great this product is! Would definitely recommend.", "This product cured my eye dementia, heavily recommend.", "I'm Donald Trump don't listen to me."];
var nameList = ["Guy Fawkes", "Guy IBalls", "Donald Trump"];

var div = document.getElementById("box");

var img = document.getElementsByClassName("person")[0];
var desc = document.getElementsByClassName("desc")[0];
var nm = document.getElementsByClassName("name")[0];

var ind = 0;

img.setAttribute("src", personList[ind]);
desc.innerText = descList[ind];
nm.innerText = nameList[ind];

function useComputedStyles(element)
{
    let computed = getComputedStyle(element);
    let defaultElement = document.createElement(element.tagName);

    for (let styleType of computed)
    {
        if (element.style[styleType] === defaultElement.style[styleType]) { return; }
        element.style[styleType] = computed[styleType];
        console.log(element.style);
    };

    defaultElement.remove();
}

function changePerson()
{
    let prevImg = img.cloneNode(true);
    let prevDesc = desc.cloneNode(true);
    let prevName = nm.cloneNode(true);
    img.parentNode.appendChild(prevImg);
    desc.parentNode.appendChild(prevDesc);
    nm.parentNode.appendChild(prevName);

    useComputedStyles(prevImg);
    useComputedStyles(prevDesc);
    useComputedStyles(prevName);

    //Acknowledge frame before changing vars for the transition
    requestAnimationFrame(function()
    {
        prevImg.style.top = "26%";
        prevDesc.style.top = "36%";
        prevName.style.top = "66%";
        prevImg.style.opacity = 0;
        prevDesc.style.opacity = 0;
        prevName.style.opacity = 0;

        setTimeout(function(nd1, nd2, nd3)
        {
            nd1.remove();
            nd2.remove();
            nd3.remove();
        }
        , 500, prevImg, prevDesc, prevName);
    });

    ind = (ind + 1) % 3;

    img.src = personList[ind];
    desc.innerText = descList[ind];
    nm.innerText = nameList[ind];

    clearInterval(intervalID);
    intervalID = setInterval(changePerson, 5000);
}

div.addEventListener("click", changePerson);

var intervalID = setInterval(changePerson, 5000);