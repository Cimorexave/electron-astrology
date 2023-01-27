const { getSunrise, getSunset } = require("sunrise-sunset-js")

const {log} = console
const mapEl = document.getElementById('map')
const cityEl = document.getElementById('location')
const isMap = document.getElementById('mapOption')
const from = document.getElementById('from')
const to = document.getElementById('to')
let cordinates
let sunrise, sunset;
let marker;
isMap.addEventListener('click', () => log(isMap.value))
const map = L.map('map').setView([
    35.4087524662718, 51.67968750000001], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '',
    referPolicy: false
}).addTo(map)
map.on('click', (e) => {
    cordinates = [e.latlng.lat, e.latlng.lng]
        if (marker){ map.removeLayer(marker); isMap.value= true}
        marker = L.marker([e.latlng.lat, e.latlng.lng], {}).addTo(map)
        .bindPopup('Your Selected Point.')
        .openPopup()

    // log(from.value, to.value)
    if (from.value && to.value) {
        sunrise = getSunrise(cordinates[0], cordinates[1], new Date(from.value) )
        sunset = getSunset(cordinates[0], cordinates[1], new Date(from.value) )
        log(sunrise, sunset)
    }

})