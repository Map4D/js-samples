import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

window.initMap = () => {
  const map = new map4d.Map(document.getElementById("map"), {
    center: [106.704497, 10.769589],
    zoom: 20,
    bearing: 120,
    tilt: 40,
    controls: true,
  })

  createWebGLOverlay(map)
}

function createWebGLOverlay(map) {
  let scene, renderer, camera, clock, mixer

  // let webGLOverlay = new map4d.WebGLOverlayView({
  //   onAdd: (map, gl) => {
  //     // Set up the Three.js scene.
  //     camera = new THREE.PerspectiveCamera()
  //     scene = new THREE.Scene()

  //     // create two three.js lights to illuminate the model
  //     let directionalLight = new THREE.DirectionalLight(0xffffff);
  //     directionalLight.position.set(0, -70, 100).normalize();
  //     scene.add(directionalLight);

  //     let directionalLight2 = new THREE.DirectionalLight(0xffffff);
  //     directionalLight2.position.set(0, 70, 100).normalize();
  //     scene.add(directionalLight2);

  //     // Load the 3D model with GLTF Loader from Three.js.
  //     let loader = new GLTFLoader()
  //     loader.load(
  //       'files/LittlestTokyo.glb',
  //       gltf => {
  //         scene.add(gltf.scene)
  //         map.requestRender()
  //       }
  //     )

  //     renderer = new THREE.WebGLRenderer({
  //       canvas: map.getCanvas(),
  //       context: gl,
  //       antialias: true
  //     })
  //     renderer.autoClear = false
  //   },
  //   onDraw: (gl) => {
  //     // Update camera matrix to ensure the model is georeferenced correctly on the map.
  //     let projectMatrix = map.calculateProjectMatrixForWebGL({
  //       position: [106.695775, 10.775355],
  //     })
  //     let m = new THREE.Matrix4().fromArray(projectMatrix)
  //     camera.projectionMatrix = m

  //     renderer.render(scene, camera)

  //     // Request a redraw and render the scene.
  //     // Call this method when no need limit FPS by Map4D.
  //     webGLOverlay.requestRedraw()

  //     // Always reset the GL state.
  //     renderer.resetState()
  //   }
  // })

  // // Add the overlay to the map.
  // webGLOverlay.setMap(map)

  let webGLOverlay = new map4d.WebGLOverlayView({
    onAdd: (map, gl) => {
      camera = new THREE.PerspectiveCamera()
      scene = new THREE.Scene()
      clock = new THREE.Clock()

      // create three three.js lights to illuminate the model
      var directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(0, -70, 100).normalize();
      scene.add(directionalLight);

      var directionalLight2 = new THREE.DirectionalLight(0xffffff);
      directionalLight2.position.set(0, 70, 100).normalize();
      scene.add(directionalLight2);

      var directionalLight3 = new THREE.DirectionalLight(0xffffff);
      directionalLight3.position.set(0, 0, -5).normalize();
      scene.add(directionalLight3);

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('files/libs/draco/gltf/');

      let loader = new GLTFLoader()
      loader.setDRACOLoader(dracoLoader)

      let onLoad = (gltf) => {
        const model = gltf.scene
        scene.add(model)
        mixer = new THREE.AnimationMixer(model)
        mixer.clipAction(gltf.animations[0]).play()
        map.requestRender()
      }

      loader.load(
        'files/models/LittlestTokyo.glb',
        function (gltf) {
          onLoad(gltf)
        }.bind(this)
      )

      renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true
      })
      renderer.autoClear = false
    },
    onDraw: (gl) => {
      const enableMapTypes = [map4d.MapType.map3d, map4d.MapType.roadmap, map4d.MapType.satellite]
      if (enableMapTypes.includes(map.getMapType())) {
        let projectMatrix = map.calculateProjectMatrixForWebGL({
          position: [106.704497, 10.769589],
          elevation: 20,
          scale: 0.1,
          bearing: 22
        })

        /** When object position out of screen, don't render **/
        if (projectMatrix.length == 0) {
          renderer.resetState()
          return
        }

        let m = new THREE.Matrix4().fromArray(projectMatrix)
        camera.projectionMatrix = m
        let delta = clock.getDelta()
        mixer && mixer.update(delta)
        renderer.render(scene, camera)
        webGLOverlay.requestRedraw() // call this method when no need limit FPS by Map4D.
      }
      renderer.resetState()
    }
  })
  webGLOverlay.setMap(map)
}
