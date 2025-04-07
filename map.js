let currentOverlay = null;
let file_names = null;
const baseapiurl = 'https://kgpairapi-hhbaa4angfgnhwee.centralindia-01.azurewebsites.net'
// const baseapiurl = 'http://127.0.0.1:8000'

document.addEventListener('DOMContentLoaded', () => {
    fetch(`${baseapiurl}/availableFiles`)
        .then(res => res.json())
        .then(data =>{
            file_names = data;
            const fileSelector = document.getElementById('fileSelector');
            const filenames = data.processed_files.map(f => f.filename.replace('.csv', ''));

            console.log(filenames, data);

            fileSelector.innerHTML = '<option value="">Select File</option>';

            filenames.forEach(fname=>{
                const option = document.createElement('option');
                option.value = fname;
                option.textContent = fname;
                fileSelector.appendChild(option, 'beforeend');
            })
        })
})


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


//filedropdown
L.Control.FileDropdown = L.Control.extend({
    onAdd: function(map){
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        div.innerHTML = `
            <select id="fileSelector" style="padding: 4px; font-size: 14px;width: 125px;">
                <option value="">Select File</option>
            </select>
        `;
        L.DomEvent.disableClickPropagation(div);
        return div;
    }
});
L.Control.fileDropdown = function(opts){
    return new L.Control.FileDropdown(opts);
};
L.Control.fileDropdown({position: 'topright'}).addTo(map);

//gas dropdown
L.Control.GasDropdown = L.Control.extend({
    onAdd: function(map){
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

        div.innerHTML = `
            <select id="gasSelector" style="padding: 4px; font-size: 14px;width: 125px;">
                <option value="">Select Gas</option>>
            </select>
        `;
        L.DomEvent.disableClickPropagation(div);
        return div;
    }
});
L.Control.gasDropdown = function(opts){
    return new L.Control.GasDropdown(opts)
}
L.Control.gasDropdown({position: 'topright'}).addTo(map);


let selectedGas = '';
let selectedFile = '';
document.addEventListener('change', function(e){
    if(e.target && (e.target.id === 'gasSelector' || e.target.id === 'fileSelector')){
        if(e.target.id === 'gasSelector'){
            selectedGas = e.target.value;
        }else if(e.target.id === 'fileSelector'){
            selectedFile = e.target.value;
            selectedGas = '';

            if(selectedFile != ''){
                const filenames = file_names.processed_files.map(f => f.filename.replace('.csv', ''));
                let fileIndex = filenames.indexOf(selectedFile);
                let gases = file_names['processed_files'][fileIndex]['columns'];

                const gasSelector = document.getElementById('gasSelector');
                gasSelector.innerHTML = '<option value="">Select Gas</option>';
                for(let gas of gases){
                    let splts = gas.split('_');
                    if(splts.length > 1){
                        const option = document.createElement('option');
                        option.value = gas;
                        option.textContent = `${splts[0]} (in ${splts[1]})`;
                        gasSelector.appendChild(option, 'beforeend');
                    }
                }
            }else{
                const gasSelector = document.getElementById('gasSelector');
                gasSelector.innerHTML = '<option value="">Select Gas</option>';
            }
        }
        
        console.log(selectedGas, selectedFile);

        if(selectedGas != '' && selectedFile != ''){
            const filenames = file_names.processed_files.map(f => f.filename.replace('.csv', ''));
            let fileIndex = filenames.indexOf(selectedFile);
            let latminmax= file_names['processed_files'][fileIndex]['locstats']['latminmax'];
            let longminmax= file_names['processed_files'][fileIndex]['locstats']['longminmax'];
            let meanlatlong= file_names['processed_files'][fileIndex]['locstats']['meanlatlong'];

            fetch(`${baseapiurl}/overlayMap/${selectedFile}/${selectedGas}`)
            .then(res => res.blob())
            .then(blob =>{
                const imageurl = URL.createObjectURL(blob);
                
                if(currentOverlay){
                    map.removeLayer(currentOverlay);
                }
                currentOverlay = L.imageOverlay(imageurl,[
                    [latminmax[1], longminmax[0]],   //top left corner
                    [latminmax[0], longminmax[1]]    //bottom right corner
                ],{
                    opacity: 0.6,
                    interactive: false,
                }).addTo(map);
                map.flyTo(meanlatlong);
            })
        }else{
            if(currentOverlay){
                map.removeLayer(currentOverlay)
            }
        }
    }
})

