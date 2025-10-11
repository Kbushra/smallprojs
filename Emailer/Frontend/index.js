const txt = document.getElementById("txt");
const frm = document.getElementById("frm");
const subj = document.getElementById("subj");
const msg = document.getElementById("msg");
const but = document.getElementById("but");

but.addEventListener("click", async () =>
{
    if (subj.value == "" || msg.value == "") { return; }
    
    const fetched = await fetch("/send",
    {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify
        ({
            subject: subj.value,
            message: msg.value,
            from: frm.value
        })
    });

    if (fetched.status == 200) { txt.textContent = "Sent successfully!"; }
    else { txt.textContent = "Oops! Something went wrong on our side."; }
});