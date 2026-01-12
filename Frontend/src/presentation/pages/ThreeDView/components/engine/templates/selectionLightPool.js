import * as THREE from "three";

export function createSelectionLightPool(scene) {
  const geometry = new THREE.CircleGeometry(1, 64);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.1,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.visible = false;

  scene.add(mesh);

  return mesh;
}
const _box = new THREE.Box3();
const _size = new THREE.Vector3();
const _center = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _down = new THREE.Vector3(0, -1, 0);
const _from = new THREE.Vector3();

export function updateLightPool(pool, targetObject, scene) {
  _box.setFromObject(targetObject);
  _box.getSize(_size);
  _box.getCenter(_center);

  const radius = Math.max(_size.x, _size.z) * 0.75;

  let groundY = _box.min.y;

  const groundMesh = scene?.userData?.groundMesh ?? null;
  const waterMesh = scene?.userData?.waterMesh ?? null;

  let hitY = null;

  _from.set(_center.x, _box.max.y + 50, _center.z);
  _raycaster.set(_from, _down);
  _raycaster.far = 2000;

  if (groundMesh) {
    const hits = _raycaster.intersectObject(groundMesh, true);
    if (hits.length > 0) hitY = hits[0].point.y;
  }

  if (hitY === null && waterMesh) {
    const hits = _raycaster.intersectObject(waterMesh, true);
    if (hits.length > 0) hitY = hits[0].point.y;
  }

  const baseY = hitY !== null ? hitY : _box.min.y;
  pool.position.set(_center.x, baseY + 0.03, _center.z);

  pool.scale.set(radius, radius, 1);
  pool.rotation.x = -Math.PI / 2;
  pool.visible = true;
}

export function setLightPoolEnabled(pool, enabled) {
  pool.visible = enabled;
}
