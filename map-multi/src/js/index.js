let mapId = 1
const rowContainer = document.getElementById("row")
const mapOptions = {
    center: [106.695775, 10.775355],
    zoom: 18,
    tilt: 60,
    controls: true,
    cooperativeGestures: true,
    mapType: "map3d",
}

window.onload = (e) => {
    createMap(document.getElementById("map"))
}

window.addMap = () => {
    console.log('addMap')
    const mapContainer = document.createElement('div')
    mapContainer.setAttribute("id", "map")

    const columnContainer = document.createElement('div')
    columnContainer.setAttribute("class", "column")
    columnContainer.appendChild(mapContainer)
    rowContainer.appendChild(columnContainer)

    createMap(mapContainer)
}

function createMap(container) {
    const map = new map4d.Map(container, mapOptions)
    return map
}