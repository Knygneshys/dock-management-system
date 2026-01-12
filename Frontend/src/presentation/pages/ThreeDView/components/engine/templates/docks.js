/* eslint-disable no-magic-numbers */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { facilityNames } from "../../../../../../domain/Enums/meshNames";
import { dockMaterialLoader } from "../loaders/materialLoaders/dockMaterialLoader";

export async function createDock(dockData) {
  const gltfLoader = new GLTFLoader();
  // const textureLoader = new THREE.TextureLoader();

  // const materialProperties = await dockMaterialLoader();

  const dockGlb = await gltfLoader.loadAsync("/models/dock.glb");

  const dockMesh = dockGlb.scene.children[0];

  // const colorMap = await textureLoader.loadAsync(materialProperties.colorMap);
  // colorMap.minFilter = THREE.LinearMipmapLinearFilter;
  // colorMap.magFilter = THREE.LinearFilter;
  // colorMap.anisotropy = 16;
  // colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
  // colorMap.repeat.set(20, 20);

  // const additionalMaps = {};
  // if (materialProperties.roughnessMap) {
  //   additionalMaps.roughnessMap = await textureLoader.loadAsync(
  //     materialProperties.roughnessMap
  //   );
  //   additionalMaps.roughnessMap.minFilter = THREE.LinearMipmapLinearFilter;
  //   additionalMaps.roughnessMap.magFilter = THREE.LinearFilter;
  //   additionalMaps.roughnessMap.anisotropy = 16;
  //   additionalMaps.roughnessMap.wrapS = additionalMaps.roughnessMap.wrapT =
  //     THREE.RepeatWrapping;
  //   additionalMaps.roughnessMap.repeat.set(20, 20);
  // }
  // if (materialProperties.normalMap) {
  //   additionalMaps.normalMap = await textureLoader.loadAsync(
  //     materialProperties.normalMap
  //   );
  //   additionalMaps.normalMap.minFilter = THREE.LinearMipmapLinearFilter;
  //   additionalMaps.normalMap.magFilter = THREE.LinearFilter;
  //   additionalMaps.normalMap.anisotropy = 16;
  //   additionalMaps.normalMap.wrapS = additionalMaps.normalMap.wrapT =
  //     THREE.RepeatWrapping;
  //   additionalMaps.normalMap.repeat.set(20, 20);
  // }

  // const material = new THREE.MeshStandardMaterial({
  //   map: colorMap,
  //   color: materialProperties.baseColor,
  //   roughness: materialProperties.roughness,
  //   metalness: materialProperties.metalness,
  //   side: THREE.DoubleSide,
  //   ...additionalMaps,
  // });

  dockMesh.name = facilityNames.dock;
  dockMesh.userData.isRootClickable = true;
  dockMesh.userData.code = dockData.code;
  dockMesh.userData.kind = "dock";
  //dockMesh.material = material;
  dockMesh.castShadow = false;
  dockMesh.receiveShadow = true;

  dockMesh.scale.set(1, 1, dockData.length / 20); //dock model is 20m depth

  dockMesh.position.set(dockData.x, 0, dockData.z);

  return dockMesh;
}
