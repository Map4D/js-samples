var timeEffect
var map

var tileOverlay
var lineUnderGround
var lineOnGround

/** slider */
const slider = document.getElementById("slider");
slider.oninput = function() {
  const opacity = this.value / 100
  const easeOpacity = 1 - Math.pow(1 - opacity, 5)

  map && updateTimeEffect(this.value)
  map && map.setBuildingsOpacity(1 - opacity)
  tileOverlay && tileOverlay.setOpacity(opacity)
  lineUnderGround && lineUnderGround.setStrokeOpacity(easeOpacity)
  objectUnderGround && objectUnderGround.setOpacity(easeOpacity)
}

/** checkbox */
const checkbox = document.getElementById("buildings-checkbox")
checkbox.addEventListener('change', function() {
  map && map.setBuildingsEnabled(this.checked)
});

/** init */
window.initMap = (e) => {
  /** mapview */
  map = new map4d.Map(document.getElementById("map"), {
    center: [106.695775, 10.775355],
    zoom: 20,
    tilt: 70,
    controls: true,
    mapType: "map3d",
    enabledNegativeElevation: true
  })

  /** tile overlay */
  const href = window.location.href
  const baseUrl = href.substring(0, href.lastIndexOf("/"))
  const groundImage = `${baseUrl}/images/g1.jpg`
  tileOverlay = new map4d.TileOverlay({
    getUrl: (x, y, z, _3dMode) => {
      return groundImage
    },
    opacity: 0,
  })
  tileOverlay.setMap(map)

  /** polyline */
  const linePath = [
    [ 106.69303570000001, 10.777474900000001 ],
    [ 106.6941008, 10.7765476 ],
    [ 106.6944292, 10.7762559 ],
    [ 106.69458320000001, 10.776126900000001 ],
    [ 106.69579590000001, 10.775028200000001 ],
    [ 106.6959305, 10.7749085 ],
    [ 106.6961134, 10.7747411 ],

    [ 106.69620400000001, 10.774843200000001 ],
    [ 106.69648480000001, 10.7745856 ],
    [ 106.697117, 10.7740042 ],
    [ 106.6973648, 10.773625200000001 ],
    [ 106.6974402, 10.773477100000001 ],
    [ 106.69747170000001, 10.7734191 ],
    [ 106.6975331, 10.773341400000001 ],
    [ 106.6976393, 10.7731565 ]
  ]

  lineUnderGround = new map4d.Polyline({
    path: linePath,
    strokeColor: "red",
    strokeOpacity: 0,
    strokeWidth: 20,
    elevation: -20,
    zIndex: -1
  })
  lineUnderGround.setMap(map)

  lineOnGround = new map4d.Polyline({
    path: linePath,
    strokeColor: "#fff",
    strokeOpacity: 1,
    strokeWidth: 10,
    strokePattern: new map4d.DashPattern({ length: 20, gap: 20 }),
    zIndex: 0,
  })
  lineOnGround.setMap(map)
}

function updateTimeEffect(opacity) {
  const newTimeEffect = opacity > 0 ? map4d.TimeEffect.Evening : map4d.TimeEffect.None
  if (timeEffect != newTimeEffect) {
    timeEffect = newTimeEffect
    map.setTimeEffect(timeEffect)
  }
}
