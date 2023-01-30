const { getSunrise, getSunset } = require("sunrise-sunset-js")
const cities = require('./ir.json')

const {log} = console
const mapEl = document.getElementById('map')
const cityEl = document.getElementById('location')
const isMap = document.getElementById('mapOption')
const from = document.getElementById('from')
const to = document.getElementById('to')
const calculateBtn = document.getElementById('calculate')

let cordinates
let sunrise, sunset;
let marker;

cities.forEach(city => {
    const option = document.createElement('option')
    option.value = [city.lat, city.lng]
    option.text = city.city
    cityEl.add(option)
})
cityEl.addEventListener('change', (e) => {
    const latlng = e.target.value.split(',')
    cordinates = [parseFloat(latlng[0]), parseFloat(latlng[1])]
    log(cordinates)
})

const map = L.map('map').setView([
    35.4087524662718, 51.67968750000001], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '',
    referPolicy: false
}).addTo(map)

map.on('click', (e) => {
    cordinates = [e.latlng.lat, e.latlng.lng]
        if (marker) map.removeLayer(marker)
        marker = L.marker([e.latlng.lat, e.latlng.lng], {}).addTo(map)
})

calculateBtn.addEventListener('click', (e) => {
    if (from.value && to.value && cordinates) {
        sunrise = getSunrise(cordinates[0], cordinates[1], new Date(from.value) )
        sunset = getSunset(cordinates[0], cordinates[1], new Date(from.value) )
        log('sunrise, sunset from',sunrise, sunset)
        sunrise = getSunrise(cordinates[0], cordinates[1], new Date(to.value) )
        sunset = getSunset(cordinates[0], cordinates[1], new Date(to.value) )
    } else log('no dates or location chosen')
})