import * as THREE from "three";

const CAMERA_START_X = 350;
const CAMERA_START_Y = 200;
const CAMERA_START_Z = 200;

export const cameraData = {
  fov: 60,
  near: 0.1,
  far: 2000,
  startPosition: new THREE.Vector3(
    CAMERA_START_X,
    CAMERA_START_Y,
    CAMERA_START_Z
  ),
};

export const lightData = {
  ambient: {
    color: 0xffffff,
    intensity: 0.5,
  },
  directional: {
    color: 0xffffff,
    intensity: 0.8,
    position: { x: 10, y: 20, z: 10 },
  },
};
