/* eslint-disable no-magic-numbers */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { vesselOrResource } from "../../../../../../domain/Enums/meshNames";

export async function stsCraneModel(dockData, craneDto, i) {
  const gltfLoader = new GLTFLoader();
  const textureLoader = new THREE.TextureLoader();
  const craneGlb = await gltfLoader.loadAsync("/models/stsCrane.glb");
  const texture = await textureLoader.loadAsync("/textures/stsCraneTexture.jpg");
  const mesh = craneGlb.scene;

  mesh.userData.isRootClickable = true;
  mesh.name = vesselOrResource.stsCrane;
  mesh.userData.kind = "resource";
  mesh.userData.code = craneDto.AlphanumericCode ?? craneDto.alphanumericCode;
  mesh.userData.name = craneDto.Description ?? craneDto.description;

  // const material = new THREE.MeshStandardMaterial({
  //   map: texture
  // });

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.name = vesselOrResource.stsCrane;
      child.userData.kind = mesh.userData.kind;
      child.userData.code = mesh.userData.code;
      child.userData.name = mesh.userData.name;
      
      //child.material = material;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  const spacing = 20;

  mesh.position.set(dockData.x, 0, dockData.z - dockData.length / 2 + 10 + i * spacing);

  return mesh;
}
