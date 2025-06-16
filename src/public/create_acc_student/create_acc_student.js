
async function  val(){
    var x=document.getElementById("password")
    var y=document.getElementById("confirm-password")
    if(x.value==y.value){
        const studentid =document.getElementById('student-id').value;
        const firstname =document.getElementById('first-name').value;
        const lastname =document.getElementById('last-name').value;
        const sec = document.getElementById('sec').value;
        const year=document.getElementById('year').value;
        const gen =document.getElementById('gender').value;
        const password = document.getElementById('password').value;

        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentid, password,sec,year,gen,fullname:`${firstname} ${lastname}`})
        });

        const data = await res.json();
        alert('hello');}
    else{
        alert("كلمة المرور غير متوافقة !!")
    }
}