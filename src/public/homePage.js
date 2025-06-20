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
async function login(event) {
    event.preventDefault()
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if(res.status === 200){
        if(data.usertype==='student'){
            console.log('student')
            window.location.href = '../views/main_ui_stu/main_ui_stu.html';
        }
        if(data.usertype==='engineer'){
            console.log('eng')

            window.location.href = '../views/main_ui_eng/main_ui_eng.html';
        } if(data.usertype==='employee'){
            console.log('emp')
            window.location.href = '../views/main_ui_emp/main_ui_emp.html';
        }
    }else{
        alert(data.error);
    }
}