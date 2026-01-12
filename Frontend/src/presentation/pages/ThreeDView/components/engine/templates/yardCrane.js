/* eslint-disable no-magic-numbers */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { vesselOrResource } from "../../../../../../domain/Enums/meshNames";

export async function yardCraneModel(yardData, craneDto, i) {
  const gltfLoader = new GLTFLoader();
  const craneGlb = await gltfLoader.loadAsync("/models/yardCrane.glb");
  const mesh = craneGlb.scene;

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  mesh.userData.isRootClickable = true;
  mesh.name = vesselOrResource.yardCrane;
  mesh.userData.kind = "resource";
  mesh.userData.code = craneDto?.AlphanumericCode ?? craneDto?.alphanumericCode;
  mesh.userData.name = craneDto?.Description ?? craneDto?.description;

  if (!mesh.userData.code) {
    console.warn("No YardCrane code provided -> not clickable");
  }

  // const material = new THREE.MeshStandardMaterial({
  //   color: "yellow"
  // });

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.name = vesselOrResource.yardCrane;

      child.userData.kind = mesh.userData.kind;
      child.userData.code = mesh.userData.code;
      child.userData.name = mesh.userData.name;

      child.castShadow = true;
      child.receiveShadow = true;

      // child.material = material;

      // if (child.material) {
      //   child.material.needsUpdate = true;
      // }
    }
  });

  const spacing = 50;

  mesh.position.set(yardData.x + i * spacing, 3, yardData.z);

  return mesh;
}
