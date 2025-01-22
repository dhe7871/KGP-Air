const bgc = '#05223d';
const hbgc = '#28405e';
let menuclick = false;

const menudrop = document.getElementById('menudrop')
const menubtn = document.getElementById('menubtn');


menubtn.addEventListener('click', ()=>{
    if(menuclick){
        menudrop.style.right = '-70vw';
        menudrop.style.visibility = 'hidden';
        menuclick = false;
        console.log('here')
    }else{
        menudrop.style.visibility = 'visible';
        menudrop.style.right = '0';
        menuclick = true;
        console.log('there')
    }

})