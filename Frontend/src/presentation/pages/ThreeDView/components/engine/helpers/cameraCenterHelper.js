/* eslint-disable no-magic-numbers */
import * as THREE from "three";
import { cameraData } from "../config/defaultData";

export function centerCameraOnObject(
  targetObject,
  camera,
  controls,
  zoomDistance = null,
  duration = 1000
) {
  const targetPosition = new THREE.Vector3();

  const box = new THREE.Box3().setFromObject(targetObject);
  box.getCenter(targetPosition);

  const currentDistance = camera.position.distanceTo(controls.target);
  const finalDistance = zoomDistance !== null ? zoomDistance : currentDistance;

  const direction = new THREE.Vector3()
    .subVectors(camera.position, controls.target)
    .setY(0)
    .normalize();

  if (direction.length() === 0) {
    direction.set(1, 0, 0);
  }

  const currentHeight = camera.position.y;
  const newCameraPosition = new THREE.Vector3()
    .copy(targetPosition)
    .add(direction.multiplyScalar(finalDistance))
    .setY(currentHeight);

  animateCamera(camera, controls, newCameraPosition, targetPosition, duration);
}

export function resetCameraToDefault(camera, controls, duration = 1000) {
  const newPosition = cameraData.startPosition.clone();
  const newTarget = new THREE.Vector3(0, 0, 0);

  animateCamera(camera, controls, newPosition, newTarget, duration);
}

function animateCamera(camera, controls, newPosition, newTarget, duration) {
  const startPosition = camera.position.clone();
  const startTarget = controls.target.clone();

  const startTime = performance.now();

  function animate() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const eased = easeInOutCubic(progress);

    camera.position.lerpVectors(startPosition, newPosition, eased);

    controls.target.lerpVectors(startTarget, newTarget, eased);

    controls.update();

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
