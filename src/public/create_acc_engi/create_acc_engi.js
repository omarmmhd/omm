var x=document.getElementById("password")
var y=document.getElementById("confirm-password")
async function  val(){
    if(x.value==y.value){
        const engnumber =document.getElementById('eng-number').value;
        const engemail=document.getElementById('eng-email').value;
        const firstname =document.getElementById('first-name').value;
        const lastname =document.getElementById('last-name').value;
        const spec = document.getElementById('spec').value;
        const startdate =document.getElementById('start-date').value;
        const gen =document.getElementById('gender').value;
        const password = document.getElementById('password').value;

        const res = await fetch('/registerEngineer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ engnumber,engemail ,password,spec,startdate,gen,fullname:`${firstname} ${lastname}`})
        });

        const data = await res.json();
        alert('hello');}
    else{
        alert("كلمة المرور غير متوافقة !!")
    }
}