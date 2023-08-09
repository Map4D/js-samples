const markers = []
const mapContainer = document.getElementById("map")
const distanceContainer = createDistanceContainer()

function createDistanceContainer() {
  const container = document.createElement('div')
  Object.assign(container.style, {
    "position": "absolute",
    "z-index": 10,
    "text-align": "center",
  })

  container.setAttribute("id", "distance")
  mapContainer.appendChild(container)

  return container
}

window.onload = (e) => {
  const map = new map4d.Map(mapContainer, {
    center: [106.695775, 10.775355],
    controls: true,
    mapType: "map3d",
  })
  const projection = new map4d.Projection(map)

  const line = new map4d.Polyline({
    path: [],
    strokeWidth: 8,
    strokeColor: "#f60",
  })

  map.addListener("click", (args) => {
    if (markers.length >= 2) {
      return
    }

    const marker = new map4d.Marker({
      position: args.location,
      draggable: true
    })
    marker.setMap(map)
    markers.push(marker)

    if (markers.length == 2) {
      updateLineAndText(line, projection)
      line.setMap(map)
    }
  })

  map.addListener("drag", (args) => {
    if (markers.length == 2) {
      updateLineAndText(line, projection)
    }
  }, { marker: true })

  map.addListener("cameraChanging", (args) => {
    updateLineAndText(line, projection)
  })
}

function updateLineAndText(line, projection) {
  if (markers.length != 2) {
    return
  }

  const pos1 = markers[0].getPosition()
  const pos2 = markers[1].getPosition()
  const path = [pos1, pos2]
  line.setPath(path)

  const p1 = projection.fromLatLngToScreen(pos1)
  const p2 = projection.fromLatLngToScreen(pos2)
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x)
  // const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

  distanceContainer.style.top = `${(p1.y + p2.y) / 2}px`
  distanceContainer.style.left = `${(p1.x + p2.x) / 2}px`
  distanceContainer.style.rotate = `${angle}rad`

  const measure = new map4d.Measure(path)
  distanceContainer.innerHTML = `${Math.floor(measure.length)}m`
}