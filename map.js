let currentOverlay = null;
let file_names = null;

const baseapiurl = 'https://kgpairapi-hhbaa4angfgnhwee.centralindia-01.azurewebsites.net'
// const baseapiurl='http://127.0.0.1:8000';

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
                <option value="">Select Gas</option>
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

//legend control
L.Control.LegendControl = L.Control.extend({
    onAdd: function(map){
        const div = L.DomUtil.create('div', 'legend-control');
        // div.innerHTML = `
        //     <div>
        // `
        div.id = 'legendcontainer';
        // img.src = '';
        // img.style.width = 'auto';
        // img.style.height = '50vh';
       
        return div;
    }
});
L.control.LegendControl = function(opts){
    return new L.Control.LegendControl(opts);
}
L.control.LegendControl({position: 'bottomleft'}).addTo(map);



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
                        option.textContent = `${(splts[0] == "PM")?"PM2.5 (in µg/m³)":splts[0] + " (in " + splts[1]+")"}`;
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
            .then(res =>{
                if(!res.ok) throw new Error("Failed to fetch ZIP!")
                return res.blob()
            }).then(zipBlob =>{
                const zipReader = new zip.ZipReader(new zip.BlobReader(zipBlob));
                return zipReader.getEntries().then(entries => {
                    const imagePromises = entries.map(entry =>{
                        if(!entry.directory && (entry.filename === "map.png" || entry.filename === "legend.png")){
                            return entry.getData(new zip.BlobWriter("image/png")).then(blob => {
                                const imageUrl = URL.createObjectURL(blob);
                                if(entry.filename === "map.png"){
                                    if(currentOverlay){
                                        map.removeLayer(currentOverlay);
                                    }
                                    currentOverlay = L.imageOverlay(imageUrl,[
                                        [latminmax[1], longminmax[0]],   //top left corner
                                        [latminmax[0], longminmax[1]]    //bottom right corner
                                    ],{
                                        opacity: 0.6,
                                        interactive: false,
                                    }).addTo(map);
                                    map.flyTo(meanlatlong);
                                }else if(entry.filename === "legend.png"){
                                    const legendcontainer = document.getElementById('legendcontainer');
                                    if(legendcontainer){
                                        let splts = selectedGas.split('_');
                                        if(splts.length > 1){
                                            legendcontainer.innerHTML = `
                                            <div style="color: black;font-weight: bold;font-size: 0.8rem;width: auto;">${(splts[0] == "PM")?"PM2.5 (in µg/m³)":splts[0] + " (in " + splts[1]+")"}</div>
                                            <img src="${imageUrl}" width="auto" height="300vh" alt="legend_image">
                                            `
                                            legendcontainer.width = "auto";
                                        }

                                        
                                    }
                                }  
                            })
                        }
                    })
                    return Promise.all(imagePromises);
                });
            })
        }else{
            if(currentOverlay){
                map.removeLayer(currentOverlay)
                currentOverlay = null;
            }
        }
    }
})

