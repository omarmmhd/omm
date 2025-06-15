function togglepasswordvisibility(){
    x=document.getElementById("password");
    y=document.getElementById("showpass");
    if(y.checked){
        x.type="text"
    }
    else{
        x.type="password"
    }
}
/******/
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if(res.status === 200){
        window.location.href = '../views/Page1/page1.html';
    }else{
        alert(data.error);
    }
}