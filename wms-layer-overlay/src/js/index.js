"use strict"

function xToLng(x, zoom) {
  return x / Math.pow(2, zoom) * 360 - 180
}

function yToLat(y, zoom) {
  var n = Math.PI - 2 * Math.PI * y / Math.pow(2, zoom)
  return Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))) * 180 / Math.PI
}

function bboxForTile(x, y, zoom) {
  var e = xToLng(x + 1, zoom)
  var w = xToLng(x, zoom)
  var s = yToLat(y + 1, zoom)
  var n = yToLat(y, zoom)
  return [w, s, e, n].join(",")
}

window.onload = (e) => {
  const map = new map4d.Map(document.getElementById("map"), {
    center: [106.695775, 10.775355],
    zoom: 16,
    controls: true,
  })

  const options = {
    getUrl: function (x, y, zoom) {
      const wmp = 'EPSG:4326'
      const bbox = bboxForTile(x, y, zoom)
      const size = 256
      return `https://ows.mundialis.de/services/service?&service=WMS&request=GetMap&layers=TOPO-OSM-WMS&styles=&format=image/jpeg&transparent=false&version=1.1.1&width=${size}&height=${size}&srs=${wmp}&bbox=${bbox}`
    },
    visible: true,
    zIndex: 1
  }

  const overlay = new map4d.TileOverlay(options)
  overlay.setMap(map)
}