import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { cameraData } from "../config/defaultData";

const LOOK_AT_X = 0;
const LOOK_AT_Y = 0;
const LOOK_AT_Z = 0;

const ROTATE_SPEED = 1.0;
const ZOOM_SPEED = 1.0;
const MIN_DISTANCE = 5;
const MAX_DISTANCE = 500;
const DAMPING_FACTOR = 0.05;
const CENTER_COORDINATES = 0;

export function createCamera(container) {
  const camera = new THREE.PerspectiveCamera(
    cameraData.fov,
    container.clientWidth / container.clientHeight,
    cameraData.near,
    cameraData.far
  );
  camera.position.copy(cameraData.startPosition);
  camera.lookAt(LOOK_AT_X, LOOK_AT_Y, LOOK_AT_Z);
  return camera;
}

export function createCameraControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);

  controls.target.set(CENTER_COORDINATES, CENTER_COORDINATES, CENTER_COORDINATES);

  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI;

  controls.enableRotate = true;
  controls.rotateSpeed = ROTATE_SPEED;
  controls.mouseButtons = {
    RIGHT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    LEFT: THREE.MOUSE.PAN
  };

  controls.enableZoom = true;
  controls.zoomSpeed = ZOOM_SPEED;
  controls.minDistance = MIN_DISTANCE;
  controls.maxDistance = MAX_DISTANCE;

  controls.enableDamping = true;
  controls.dampingFactor = DAMPING_FACTOR;

  controls.update();

  return controls;
}