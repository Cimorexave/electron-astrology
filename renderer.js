const {log} = console
const mapEl = document.getElementById('map')
const map = L.map('map').setView([
    35.4087524662718, 51.67968750000001], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '',
    referPolicy: false
}).addTo(map)
map.on('click', (e) => {
    log(e.latlng)
})