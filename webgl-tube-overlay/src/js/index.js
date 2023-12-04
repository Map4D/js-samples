import { TubeOverlay } from './tube_overlay.js'

/** Method callback */
window.initMap = () => {
  /** Map View */
  const map = new map4d.Map(document.getElementById("map"), {
    center: [108.11933848152034, 16.127956708808583],
    zoom: 13,
    tilt: 30,
    controls: true,
    mapType: map4d.MapType.map3d
  })

  const tube = new TubeOverlay({
    path: [
      {lat: 16, lng: 108},
      [108, 10],
    ],
    radius: 10,
    opacity: 0.5,
    elevation: 20,
    onClick: (e) => { console.log(e) }
  });
  tube.setMap(map)
}