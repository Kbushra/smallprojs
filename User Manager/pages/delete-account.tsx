fetch("/delete-account",
{
    headers: { "Content-Type": "text/plain" },
    method: "POST",
    body: localStorage.getItem("token")
}).then(() =>
{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    location.pathname = "/";
});