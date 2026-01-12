import * as THREE from "three";

export function createSelectionSpotlight(scene) {
  const target = new THREE.Object3D();
  scene.add(target);

  const light = new THREE.SpotLight(0xfff2dd, 0);

  light.angle = Math.PI / 9;
  light.penumbra = 1.0;
  light.distance = 700;
  light.decay = 2;

  light.castShadow = true;

  light.shadow.mapSize.set(2048, 2048);
  light.shadow.bias = -0.00015;
  light.shadow.normalBias = 0.02;

  light.shadow.camera.near = 1;
  light.shadow.camera.far = 800;
  light.shadow.camera.fov = 30;

  light.target = target;
  scene.add(light);

  return { light, target };
}

export function followCameraWithSpotlight(spotlight, camera, targetObject3D) {
  const targetPos = new THREE.Vector3();
  targetObject3D.getWorldPosition(targetPos);

  const camDir = new THREE.Vector3();
  camera.getWorldDirection(camDir);

  spotlight.position
    .copy(targetPos)
    .add(camDir.multiplyScalar(180))
    .add(new THREE.Vector3(0, 220, 0));

  spotlight.updateMatrixWorld(true);
}

export function setSpotlightTargetToObjectCenter(
  targetObject,
  spotlightTarget
) {
  const center = new THREE.Vector3();
  new THREE.Box3().setFromObject(targetObject).getCenter(center);
  spotlightTarget.position.copy(center);
  spotlightTarget.updateMatrixWorld(true);
}

export function setSpotlightEnabled(spotlight, enabled) {
  spotlight.intensity = enabled ? 90 : 0;
}
