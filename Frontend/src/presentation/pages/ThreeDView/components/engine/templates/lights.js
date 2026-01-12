import * as THREE from "three";

import { lightData } from "../config/defaultData";

const SHADOW_MAP_SIZE = 2048;
const SHADOW_CAMERA_SIZE = 50;
const SHADOW_CAMERA_NEAR = 0.5;
const SHADOW_CAMERA_FAR = 500;

export function addLights(scene) {
  const ambient = new THREE.AmbientLight(
    lightData.ambient.color,
    lightData.ambient.intensity
  );
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(
    lightData.directional.color,
    lightData.directional.intensity
  );

  directional.position.set(
    lightData.directional.position.x,
    lightData.directional.position.y,
    lightData.directional.position.z
  );

  directional.castShadow = true;
  directional.shadow.mapSize.width = SHADOW_MAP_SIZE;
  directional.shadow.mapSize.height = SHADOW_MAP_SIZE;
  directional.shadow.camera.left = -SHADOW_CAMERA_SIZE;
  directional.shadow.camera.right = SHADOW_CAMERA_SIZE;
  directional.shadow.camera.top = SHADOW_CAMERA_SIZE;
  directional.shadow.camera.bottom = -SHADOW_CAMERA_SIZE;
  directional.shadow.camera.near = SHADOW_CAMERA_NEAR;
  directional.shadow.camera.far = SHADOW_CAMERA_FAR;

  scene.add(directional);

  // 👇 DAS ist der entscheidende Teil
  return { ambient, directional };
}
