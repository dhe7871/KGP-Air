let file_names = null;
let filenames  = null;
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://127.0.0.1:8000/availableFiles')
        .then(res => res.json())
        .then(data =>{
            file_names = data;
            filenames = data.processed_files.map(f => f.filename.replace('.csv', ''));
            console.log(filenames)
            // const epochTime = 1743884474;
            // const date = new Date(epochTime*1000)
            // console.log(date.toString());

            const ulist = document.getElementById('ulist');
            filenames.forEach(filename =>{
                const li = document.createElement('li');
                li.innerHTML = `<div id="${filename}">Download ${filename}.csv</div>`;
                ulist.appendChild(li, 'afterbegin');
            })

            filenames.forEach(filename =>{
                let div = document.getElementById(filename);
                div.addEventListener('click',()=>{
                    fetch(`http://127.0.0.1:8000/getCSV/${filename}`)
                    .then(res => res.blob())
                    .then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${filename}.csv`
                        document.body.appendChild(a);
                        a.click()
                        a.remove()
                        window.URL.revokeObjectURL(url);
                    })
                })
            })
        })
})

