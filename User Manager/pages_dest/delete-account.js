fetch("/delete-account",{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`},method:"DELETE"}).then(()=>{localStorage.removeItem("token"),localStorage.removeItem("user"),location.pathname="/"});
//# sourceMappingURL=delete-account.js.map
