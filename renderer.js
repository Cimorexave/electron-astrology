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
let frames = []
let rows = []

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
            records.push({
                id: i ,
                sequenceOftheDay: i + 1,
                sunriseMs: new Date(getSunrise(cordinates[0] ,cordinates[1] ,new Date(moment(sunrise).add(i, 'day')))).getTime(),
                sunsetMs: new Date(getSunset(cordinates[0] ,cordinates[1] ,new Date(moment(sunrise).add(i, 'day')))).getTime(),
                date: moment(sunrise).add(i, 'day').format('YYYY/M/D'),
                jdate: moment(sunrise).add(i, 'day').format('jYYYY/jM/jD'),
                sunirse: moment(getSunrise(cordinates[0] ,cordinates[1] ,new Date(moment(sunrise).add(i, 'day')))).format('jYYYY/jM/jD HH:mm:ss'),
                sunset: moment(getSunset(cordinates[0] ,cordinates[1] ,new Date(moment(sunrise).add(i, 'day')))).format('jYYYY/jM/jD HH:mm:ss'),
            })
        }
        for (let j = 0; j < records.length; j++) {
            frames.push({
                deltaMilliseconds: (records[j].sunsetMs - records[j].sunriseMs) ,
                type: 'day',
                date: `${records[j].jdate}`,
                start: records[j].sunrise,
                finish: records[j].sunset,
                startMilliseconds: records[j].sunriseMs,
                endMilliseconds: records[j].sunsetMs,
            })
            if (records[j+1]) {
                frames.push({
                    deltaMilliseconds: (records[j+1].sunriseMs - records[j].sunsetMs) ,
                    type: 'night',
                    date: `${records[j].jdate} - ${records[j+1].jdate}`,
                    start: records[j].sunset,
                    finish: records[j+1].sunirse,
                    startMilliseconds: records[j].sunsetMS,
                    endMilliseconds: records[j+1].sunriseMs,
                })
            }
        }
        records.forEach(record => {
            const unit = record.deltaMilliseconds / (12 * 60)
            for (let k = 0; k < 11; k++) {
                if ( k === 0) {
                    rows.push({
                        id: k,
                        start: moment(new Date(records.startMilliseconds)).format('HH:mm'),
                        end: moment(new Date(records.startMilliseconds + unit)).format('HH:mm'),
                    })
                }
                rows.push({
                    id: k,
                    start: moment(new Date(records.startMilliseconds + (k * unit))).format('HH:mm'),
                    end: moment(new Date(records.startMilliseconds + ((k+1) * unit))).format('HH:mm'),
                })
                if ( k === 11) {
                    rows.push({
                        id: k,
                        start: moment(new Date(records.endMilliseconds - unit)).format('HH:mm'),
                        end: moment(new Date(records.endMilliseconds)).format('HH:mm'),
                    })
                }
            }
        })
        log('records', records)
        log('frames', frames)
        log('rows', rows)

    } else log('no dates or location chosen')
})