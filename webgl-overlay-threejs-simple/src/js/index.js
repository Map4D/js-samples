import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

window.initMap = () => {
  const map = new map4d.Map(document.getElementById("map"), {
    center: [106.695775, 10.775355],
    zoom: 22,
    bearing: 60,
    tilt: 60,
    controls: true,
    mapType: "map3d",
  })

  createWebGLOverlay(map)
}

function createWebGLOverlay(map) {
  let scene, renderer, camera

  let webGLOverlay = new map4d.WebGLOverlayView({
    onAdd: (map, gl) => {
      // Set up the Three.js scene.
      camera = new THREE.PerspectiveCamera()
      scene = new THREE.Scene()

      // create two three.js lights to illuminate the model
      let directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(0, -70, 100).normalize();
      scene.add(directionalLight);

      let directionalLight2 = new THREE.DirectionalLight(0xffffff);
      directionalLight2.position.set(0, 70, 100).normalize();
      scene.add(directionalLight2);

      // Load the 3D model with GLTF Loader from Three.js.
      let loader = new GLTFLoader()
      loader.load(
        'files/Horse.gltf',
        gltf => {
          scene.add(gltf.scene)
          map.requestRender()
        }
      )

      renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true
      })
      renderer.autoClear = false
    },
    onDraw: (gl) => {
      // Update camera matrix to ensure the model is georeferenced correctly on the map.
      let projectMatrix = map.calculateProjectMatrixForWebGL({
        position: [106.695775, 10.775355],
      })
      let m = new THREE.Matrix4().fromArray(projectMatrix)
      camera.projectionMatrix = m

      renderer.render(scene, camera)

      // Request a redraw and render the scene.
      // Call this method when no need limit FPS by Map4D.
      webGLOverlay.requestRedraw()

      // Always reset the GL state.
      renderer.resetState()
    }
  })

  // Add the overlay to the map.
  webGLOverlay.setMap(map)
}
