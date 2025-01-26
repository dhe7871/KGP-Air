const bgc = '#05223d';
const hbgc = '#28405e';
let menuclick = false;
let cardclick = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false
};
let scrollTop = 0;

const menudrop = document.getElementById('menudrop');
const droplinks = document.querySelectorAll('.menudrop a');
const menubtn = document.getElementById('menubtn');
const mdscs = [menubtn, ...droplinks]       //mdscs: menu drop state changers

mdscs.forEach(function (element){
    element.addEventListener('click', ()=>{
        if(menuclick){
            menudrop.style.right = '-70vw';
            menudrop.style.visibility = 'hidden';
            menuclick = false;
        }else{
            console.log('comes here')
            menudrop.style.visibility = 'visible';
            menudrop.style.right = '2vw';
            menuclick = true;
        }
    
    })
})

const cardrows = document.getElementsByClassName('row');
const cardrowsArray = Array.from(cardrows);
const mediaquery = window.matchMedia('(max-width: 576px)');

mediaquery.addEventListener('change', ()=>{
    location.reload()
})

if(mediaquery.matches){
    cardrowsArray.forEach(function(element, index){
        element.addEventListener('click',()=>{
            let maindiv = element.children[(index+1)%2];
            if(cardclick[index]){
                maindiv.classList.remove('slidein');
                maindiv.classList.add('slideout');
                setTimeout(()=>{
                    maindiv.style.display = 'none';
                },500);
                
                cardclick[index] = false;
            }else{
                for(let key in cardclick){
                    key = Number(key);
                    if(cardclick[key]){
                        let tempdiv = cardrowsArray[key].children[(key+1)%2];
                        tempdiv.classList.remove('slidein');
                        tempdiv.classList.add('slideout');
                        setTimeout(()=>{
                            tempdiv.style.display = 'none';
                        },500);
                        
                        cardclick[key] = false;
                    }
                }
                maindiv.style.display = 'block';
                if(maindiv.classList.contains('slideout')){
                    maindiv.classList.remove('slideout');
                }
                maindiv.classList.add('slidein');
                cardclick[index] = true;   
            }
        })
    });
}