// TODO : Update _convertToTubeGeometryPoints function 
import * as THREE from 'three';

export class TubeOverlay {
  constructor({
    path = [],
    radius = 0.5,
    elevation = 0.0,
    color = 0xff00ff,
    opacity = 1,
    extrusionSegments = 200,
    radiusSegments = 18,
    closed = false,
    depthTest = false,
    onClick = null,
  } = {}) {
    this.path = path.map(p => map4d.LatLng.convert(p));
    this.origin = path.length > 0 ? path[0] : undefined;
    this.radius = radius;
    this.elevation = elevation;
    this.color = color;
    this.opacity = opacity;
    this.extrusionSegments = extrusionSegments,
    this.radiusSegments = radiusSegments,
    this.closed = closed,
    this.depthTest = depthTest;
    this.onClick = onClick;
    if (onClick) {
      this.mouse = new THREE.Vector2();
      this.raycaster = new THREE.Raycaster();
      window.addEventListener('click', (e) => {
        this.mouse.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
        let camInverseProjection = new THREE.Matrix4()
        camInverseProjection.copy(this.camera.projectionMatrix).invert()
        const cameraPosition = new THREE.Vector3().applyMatrix4(camInverseProjection);
        const mousePosition = new THREE.Vector3(this.mouse.x, this.mouse.y, 1).applyMatrix4(camInverseProjection);
        const viewDirection = mousePosition.clone().sub(cameraPosition).normalize();
        this.raycaster.set(cameraPosition, viewDirection);
        this.intersects = this.raycaster.intersectObjects(this.scene.children, true);
        if (this.intersects.length > 0) {
          const tubeObject = this._getTubeObjectByChild(this.intersects[0].object);
          if (tubeObject) {
            onClick({ object: this, event: e });
          }
        }
      });
    }
  }

  setMap(map) {
    if (!map) {
      this.tubeOverlay && this.tubeOverlay.setMap(null)
      return;
    }

    if (!this.path || this.path.length == 0) {
      console.error('Can not add TubeOverlay with empty path !');
      return;
    }

    this.map = map;

    this.tubeOverlay = new map4d.WebGLOverlayView({
      onAdd: (map, gl) => {
        this.camera = new THREE.PerspectiveCamera();
        this.scene = new THREE.Scene();

        /** Create lights to illuminate the model **/
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);

        this.pipesGroup = new THREE.Object3D();
        this.scene.add(this.pipesGroup);
        this._addTube(this.mesh, 0xff00ff);

        this.renderer = new THREE.WebGLRenderer({
          canvas: map.getCanvas(),
          context: gl,
          antialias: true
        });
        this.renderer.autoClear = false;
      },
      onDraw: (gl) => {
        const projectMatrix = map.calculateProjectMatrixForWebGL({
          position: [108.11933848152034, 16.127956708808583] // TODO : Edit to this.origin
        }, true);

        let m = new THREE.Matrix4().fromArray(projectMatrix);
        this.camera.projectionMatrix = m;

        /** When object position out of screen, don't render **/
        if (projectMatrix.length == 0) {
          this.renderer.resetState();
          return;
        }

        this.renderer.render(this.scene, this.camera);
        this.tubeOverlay.requestRedraw();
        this.renderer.resetState();
      }
    })
    this.tubeOverlay.setMap(map);
  }

  setOpacity(opacity) {
    this.pipesGroup.children.forEach(pipe => {
      pipe.material.opacity = opacity;
    });
  }

  _getTubeObjectByChild(obj) {
    if(obj.uuid == this.mesh.uuid) {
      return obj
    }
    else if(obj.parent != null) {
      return this._getTubeObjectByChild(obj.parent)
    }
    else {
      return null
    }
  }

  _addTube(mesh) {
    const params = {
      extrusionSegments: this.extrusionSegments,
      radiusSegments: this.radiusSegments,
      closed: this.closed,
    };
  
    const pipeTubeGeometryPoints = this._convertToTubeGeometryPoints(this.path);
    const pipeSpline = new THREE.CatmullRomCurve3(pipeTubeGeometryPoints, false, 'catmullrom', 0);
  
    if (this.mesh !== undefined) {
      this.pipesGroup.remove(mesh);
      mesh.geometry.dispose();
    }

    this.tubeGeometry = new THREE.TubeGeometry(
      pipeSpline,
      params.extrusionSegments,
      this.radius, /** radius by meter **/
      params.radiusSegments,
      params.closed);
    this._addGeometry(this.tubeGeometry);
  }

  _convertToTubeGeometryPoints(path) {
    // const originPoint = this.map.convertToMeterFromLatLng(this.origin)
    // const pipeTubeGeometryArray = path.map(p => {
    //   let vector = this.map.convertToMeterFromLatLng(p)
    //   let result = vector.subtract(originPoint)
    //   return new THREE.Vector3(result.x, this.elevation, -result.y)
    // })
    // return pipeTubeGeometryArray
    return [
      new THREE.Vector3(0, this.elevation, 0),
      new THREE.Vector3(0, this.elevation, 2000),
      new THREE.Vector3(2000, this.elevation, 2000)
    ]
  }

  _addGeometry(geometry) {
    const material = new THREE.MeshLambertMaterial({
      color: this.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: this.opacity,
      depthTest: this.depthTest
    });
    // 3D shape
    this.mesh = new THREE.Mesh(geometry, material);
    this.pipesGroup.add(this.mesh);
  }
}