// import modules
const { getSunrise, getSunset } = require("sunrise-sunset-js")
const moment = require('moment-jalaali')
const cities = require('./ir.json')

// utils and components
const {log} = console
const mapEl = document.getElementById('map')
const cityEl = document.getElementById('location')
const isMap = document.getElementById('mapOption')
const from = document.getElementById('from')
const to = document.getElementById('to')
const calculateBtn = document.getElementById('calculate')

// global vars
let cordinates
let sunrise, sunset;
let marker;
let records = []

// toggle map function
const toggleMap = () => {
    if (isMap.checked) {
        map.scrollWheelZoom.enable()
        map.dragging.enable()
        map.touchZoom.enable()
        map.doubleClickZoom.enable()
        map.boxZoom.enable()
        map.keyboard.enable()
        if (map.tap) map.tap.enable()
    } else {
        if (map) {
            map.eachLayer(layer => {
                if (layer instanceof L.Marker) map.removeLayer(marker)
            })
        }
        map.scrollWheelZoom.disable()
        map.dragging.disable()
        map.touchZoom.disable()
        map.doubleClickZoom.disable()
        map.boxZoom.disable()
        map.keyboard.disable()
        if (map.tap) map.tap.disable()
    }
}

// toggle map or select
isMap.addEventListener('change', () => {
    cityEl.toggleAttribute('disabled')
    mapEl.classList.toggle('map-is-disabled')
    toggleMap()
})
// create select options
cities.forEach(city => {
    const option = document.createElement('option')
    option.value = [city.lat, city.lng]
    option.text = city.city
    cityEl.add(option)
})
// change cordinates on selecting value option
cityEl.addEventListener('change', (e) => {
    const latlng = e.target.value.split(',')
    cordinates = [parseFloat(latlng[0]), parseFloat(latlng[1])]
})
// creating the map
const map = L.map('map').setView([
35.4087524662718, 51.67968750000001], 1);
// animtaion
map.flyTo([
35.4087524662718, 51.67968750000001], 5)

// creating the tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '',
    referPolicy: false
}).addTo(map)
// selecting marker on the map
map.on('click', (e) => {
    cordinates = [e.latlng.lat, e.latlng.lng]
        if (marker) map.removeLayer(marker)
        marker = L.marker([e.latlng.lat, e.latlng.lng], {}).addTo(map)
})
toggleMap()
calculateBtn.addEventListener('click', (e) => {
    if (from.value && to.value && cordinates) {
        sunrise = getSunrise(cordinates[0], cordinates[1], new Date(from.value) )
        sunset = getSunset(cordinates[0], cordinates[1], new Date(from.value) )
        log('sunrise, sunset starting day',sunrise, sunset)
        const until = new Date(to.value).setHours(0,0,0)
        const untilSunrise = getSunrise(cordinates[0], cordinates[1], new Date(to.value))
        const delta = (moment(new Date(untilSunrise)) - moment(new Date(from.value))) / 86400000
        log('delta in moment', untilSunrise)
        for (let i = 0; i < delta; i++) {
            // const mSunrise = moment(sunrise)
            // const mSunset = moment(sunset)
            records.push({
                id: i ,
                sequenceOftheDay: i + 1,
                date: moment(sunrise).add(i, 'day').format('YYYY/M/D'),
                jdate: moment(sunrise).add(i, 'day').format('jYYYY/jM/jD'),
                sunirse: moment(getSunrise(cordinates[0] ,cordinates[1] ,new Date(moment(sunrise).add(i, 'day')))).format('jYYYY/jM/jD HH:mm:ss'),
                sunset: moment(getSunrise(cordinates[0] ,cordinates[1] ,new Date(moment(sunrise).add(i, 'day')))).format('jYYYY/jM/jD HH:mm:ss'),
            })
        }
        log('records', records)
    } else log('no dates or location chosen')
})