var inputs = document.getElementsByTagName("input");

for (let i = 0; i < inputs.length; i++)
{
    inputs[i].addEventListener("input", function()
    {
        var ind = -1;

        for (let i = 0; i < inputs.length; i++)
        {
            if (inputs[i] == this) { ind = i; break; }
        }

        switch (ind)
        {
            case 0:
                inputs[1].value = (parseFloat(this.value) * 9/5) + 32;
                inputs[2].value = parseFloat(this.value) + 273.15;
                break;
            
            case 1:
                inputs[0].value = (parseFloat(this.value) - 32) * 5/9;
                inputs[2].value = parseFloat(inputs[0].value) + 273.15;
                break;
            
            case 2:
                inputs[0].value = parseFloat(this.value) - 273.15;
                inputs[1].value = (parseFloat(inputs[0].value) * 9/5) + 32;
                break;
        }

        for (let i = 0; i < inputs.length; i++)
        {
            inputs[i].value = Math.round(parseFloat(inputs[i].value) * 100) / 100;
        }
    });
}