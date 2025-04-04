var map = L.map('map',{
    center: [22.315, 87.309],
    zoom: (window.innerWidth < 576) ? 14:15,
    zoomControl: false,
    fullscreenControl: true
});

window.addEventListener('resize',()=>{
    if(window.innerWidth < 576){
        map.setZoom(14);
    }else{
        map.setZoom(15);
    }
})

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var tempOverlay = L.imageOverlay("your_heatmap.png",[
    [23.5, 86.0],
    [21.5, 89.1]
],{
    opacity: 0.6,
    interactive: false,
}).addTo(map);