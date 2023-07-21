import { Deck } from '@deck.gl/core'
import { GeoJsonLayer, ArcLayer } from '@deck.gl/layers'
import { Matrix4 } from '@math.gl/core'

const AIR_PORTS = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson'
const layers = [
  new GeoJsonLayer({
    id: 'airports',
    data: AIR_PORTS,
    // Styles
    filled: true,
    pointRadiusMinPixels: 2,
    pointRadiusScale: 2000,
    getPointRadius: f => 11 - f.properties.scalerank,
    getFillColor: [200, 0, 80, 180],
    // Interactive props
    pickable: true,
    autoHighlight: true,
    onClick: info => {
      info.object && alert(`${info.object.properties.name} (${info.object.properties.abbrev})`)
    }
  }),
  new ArcLayer({
    id: 'arcs',
    data: AIR_PORTS,
    dataTransform: d => d.features.filter(f => f.properties.scalerank < 4),
    // Styles
    getSourcePosition: f => [108.202706, 16.053144], // Da Nang
    getTargetPosition: f => f.geometry.coordinates,
    getSourceColor: [0, 128, 200],
    getTargetColor: [200, 0, 80],
    getWidth: 1
  })
]

const mapContainer = document.getElementById("map")
const deckContainer = createDeckContainer()

/** Method callback */
window.initMap = () => {
  /** Map View */
  const map = new map4d.Map(mapContainer, {
    center: [108.202706, 16.053144],
    zoom: 5,
    tilt: 30,
    controls: true,
  })

  /** DeckGL Overlay */
  const deck = new Deck({
    parent: deckContainer,
    viewState: getViewState(map),
    layers: layers
  })

  /** WebGL Overlay */
  const webGLOverlay = new map4d.WebGLOverlayView({
    onAdd: (map, gl) => {
      appendDeckContainer()
    },
    onDraw: (gl) => {
      deck.setProps({ viewState: getViewState(map) })
      if (deck.isInitialized) {
        deck.redraw()
      }
    }
  })
  webGLOverlay.setMap(map)

  /** Map Events */
  map.addListener("click", (args) => handleMouseEvent(deck, "click", args))
  map.addListener("dblClick", (args) => handleMouseEvent(deck, "dblClick", args))
}
window.addEventListener("resize", updateDeckContainerSize, false)

function handleMouseEvent(_deck, type, args) {
  const deck = _deck
  if (!deck.isInitialized) {
    return
  }

  const mockEvent = {
    type,
    offsetCenter: args.pixel,
    srcEvent: args.xa
  }

  switch (type) {
    case 'click':
      mockEvent.type = 'click'
      mockEvent.tapCount = 1
      deck._onPointerDown(mockEvent)
      deck._onEvent(mockEvent)
      break

    case 'dblClick':
      mockEvent.type = 'click'
      mockEvent.tapCount = 2
      deck._onEvent(mockEvent)
      break

    default:
      return
  }
}

function getViewState(map) {
  const camera = map.getCamera()

  const width = mapContainer.offsetWidth
  const height = mapContainer.offsetHeight

  const fovy = 30
  const near = 0.1
  const far = 1000
  const aspect = height ? width / height : 1

  const projectionMatrix = new Matrix4().perspective({
    fovy: (fovy * Math.PI) / 180,
    aspect,
    near,
    far
  })
  const focalDistance = 0.5 * projectionMatrix[5]

  const viewState = {
    longitude: ((camera.target.lng + 540) % 360) - 180,
    latitude: camera.target.lat,
    zoom: camera.getZoom() - 1,
    bearing: camera.getBearing(),
    pitch: camera.getTilt(),
    altitude: focalDistance,
    projectionMatrix
  }

  return viewState
}

function createDeckContainer() {
  const container = document.createElement('div')
  Object.assign(container.style, {
    position: 'absolute',
    left: 0,
    top: 0,
    pointerEvents: 'none'
  })

  return container
}

function appendDeckContainer() {
  const deckOverlayContainer = document.createElement('div')
  deckOverlayContainer.setAttribute("id", "deck-overlay")
  deckOverlayContainer.appendChild(deckContainer)
  mapContainer.appendChild(deckOverlayContainer)
  updateDeckContainerSize()
}

function updateDeckContainerSize() {
  if (mapContainer && deckContainer) {
    const clientWidth = mapContainer.offsetWidth
    const clientHeight = mapContainer.offsetHeight
    Object.assign(deckContainer.style, {
      width: `${clientWidth}px`,
      height: `${clientHeight}px`
    })
  }
}

