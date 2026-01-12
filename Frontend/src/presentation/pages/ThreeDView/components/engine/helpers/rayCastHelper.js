/* eslint-disable no-magic-numbers */
import * as THREE from 'three';

export function getClickedObject(event, canvas, camera, scene) {
  const raycaster = new THREE.Raycaster();
  const mousePointer = getMouseVector2(event, canvas);

  const object = checkRayIntersections(mousePointer, camera, raycaster, scene);

  return object;
}

export function getMouseVector2(event, canvas) {
  const mousePointer = new THREE.Vector2();
  const rect = canvas.getBoundingClientRect();

  mousePointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mousePointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  return mousePointer;
}

export function checkRayIntersections(mousePointer, camera, raycaster, scene) {
  raycaster.setFromCamera(mousePointer, camera);
  const intersections = raycaster.intersectObjects(scene.children, true);

  if (intersections.length === 0) {
    return null;
  }

  let obj = intersections[0].object;

  while (
    obj.parent &&
    !obj.userData.isRootClickable &&
    obj.parent.type !== 'Scene'
  ) {
    obj = obj.parent;
  }

  return obj;
}
