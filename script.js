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


//Members Data
let members = {
    0: {
        name: 'Dheeraj',
        roll: '22AE30009',
        image: 'dheeraj.jpg'
    },
    1: {
        name: 'Shivam Rathore',
        roll: '22AE10036',
        image: 'shivam.jpg'
    },
    2: {
        name: 'Sheetal Gautam',
        roll: '22AE10036',
        image: 'sheetal.jpg'
    },
    3: {
        name: 'Vijay Kumar',
        roll: '22AE10036',
        image: 'vijay.jpg'
    },
    4: {
        name: 'Katta Mohnapriya Nandini',
        roll: '22AE10036',
        image: 'profile_photo_1.jpg'
    },
    5: {
        name: 'Abhishek Lakhera',
        roll: '22AE10036',
        image: 'abhishek.jpg'
    },
    6: {
        name: 'Susmita Marandi',
        roll: '22AE10036',
        image: 'profile_photo_1.jpg'
    }
}

let memberCount = Object.keys(members).length;
const movearrow = document.getElementsByClassName('movearrow');
console.log(movearrow)
movearrow[1].style.order = `${memberCount + 1}`;

const mediaquery1 = window.matchMedia('(max-width: 320px)');
const mediaquery2 = window.matchMedia('(min-width: 320px) and (max-width: 425px)');
const mediaquery3 = window.matchMedia('(min-width: 425px) and (max-width: 576px)');
const mediaquery4 = window.matchMedia('(min-width: 576px) and (max-width: 768px)');

let numVisMemCards = 5;
const updateVisibleCards = ()=>{
    if(mediaquery1.matches){
        numVisMemCards = 1;
    }else if(mediaquery2.matches){
        numVisMemCards = 2;
    }else if(mediaquery3.matches){
        numVisMemCards = 3;
    }else if(mediaquery4.matches){
        numVisMemCards = 4;
    }else{
        numVisMemCards = 5;
    }
};
updateVisibleCards();
window.addEventListener('resize', updateVisibleCards);

for(let i = 0; i < memberCount; i++){
    let div = document.createElement('div');
    div.innerHTML = `<div>${members[i]['name']}<br>(${members[i]['roll']})</div>`;
    div.classList.add('membercard');
    div.style.display = (i < numVisMemCards) ? 'flex' : 'none';
    div.style.order = i + 1;
    div.style.backgroundImage = `url(${members[i]['image']})`;

    movearrow[1].insertAdjacentElement('beforebegin', div);
}

const membercards = document.getElementsByClassName('membercard');
let movearrowArray = Array.from(movearrow);

//utility function for updating member card visibility
const updateMemberCards = ()=>{
    for(let i = 0; i < memberCount; i++){
        const revisedOrder = Number(membercards[i].style.order);
        membercards[i].style.display = revisedOrder <= numVisMemCards ? 'flex' : 'none';
    }
};

//Event listners for navigation
movearrowArray.forEach((element, index) => {
    element.addEventListener('click', ()=>{
        let zeroIndexOrder = Number(membercards[0].style.getPropertyValue('order'));
        let revisedOrder;

        for(let i = 0; i < memberCount; i++){
            if(index){
                revisedOrder = ((zeroIndexOrder + i) % memberCount) + 1;
            }else{
                revisedOrder = ((zeroIndexOrder + i - 1 + memberCount - 1) % memberCount) + 1;
            }
            membercards[i].style.order = `${revisedOrder}`;
        }
        updateMemberCards();
    });
});