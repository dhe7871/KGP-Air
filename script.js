const bgc = '#05223d';
const hbgc = '#28405e';
let menuclick = false;
let cardclick = {};

const menudrop = document.getElementById('menudrop');
const droplinks = document.querySelectorAll('.menudrop a');
const menubtn = document.getElementById('menubtn');
const mdscs = [...droplinks, menubtn]       //mdscs: menu drop state changers

mdscs.forEach(function (element){
    element.addEventListener('click', ()=>{
        if(menuclick){
            menudrop.style.right = '-70vw';
            menudrop.style.visibility = 'hidden';
            menuclick = false;
        }else{
            menudrop.style.visibility = 'visible';
            menudrop.style.right = '0';
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
                maindiv.classList.remove('show');
                maindiv.addEventListener('transitioned', ()=>{
                    maindiv.style.display = 'none';
                }, {once: true})

                cardclick[index] = false;
            }else{
                for(let key in cardclick){
                    console.log('comes here')
                    if(cardclick[key] === true){
                        let tempdiv = cardrowsArray[key].children[(Number(key)+1)%2];
                        tempdiv.classList.remove('show');
                        tempdiv.addEventListener('transitioned', ()=>{
                            tempdiv.style.display = 'none';
                        }, {once: true})

                        cardclick[key] = false;
                    }
                }
                maindiv.style.display = 'block';
                requestAnimationFrame(()=>{
                    maindiv.classList.add('show');
                });
                cardclick[index] = true;   
            }
        })
    });
}
