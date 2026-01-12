/* eslint-disable no-magic-numbers */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { facilityNames } from "../../../../../../domain/Enums/meshNames";
import { warehouseMaterialLoader } from "../loaders/materialLoaders/warehouseMaterialLoader";
import { yardMaterialLoader } from "../loaders/materialLoaders/yardMaterialLoader";

export async function createStorageArea(areaData) {
  if (areaData.type === "Warehouse") {
    const geometry = new THREE.BoxGeometry(
      areaData.width,
      areaData.height,
      areaData.depth
    );

    const textureLoader = new THREE.TextureLoader();

    const materialProperties = await warehouseMaterialLoader();
    const repeatScale = 3;
    const colorMap = await textureLoader.loadAsync(materialProperties.colorMap);
    colorMap.minFilter = THREE.LinearMipmapLinearFilter;
    colorMap.magFilter = THREE.LinearFilter;
    colorMap.anisotropy = 16;
    colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
    colorMap.repeat.set(repeatScale, repeatScale);

    const additionalMaps = {};
    if (materialProperties.roughnessMap) {
      additionalMaps.roughnessMap = await textureLoader.loadAsync(
        materialProperties.roughnessMap
      );
      additionalMaps.roughnessMap.minFilter = THREE.LinearMipmapLinearFilter;
      additionalMaps.roughnessMap.magFilter = THREE.LinearFilter;
      additionalMaps.roughnessMap.anisotropy = 16;
      additionalMaps.roughnessMap.wrapS = additionalMaps.roughnessMap.wrapT =
        THREE.RepeatWrapping;
      additionalMaps.roughnessMap.repeat.set(repeatScale, repeatScale);
    }
    if (materialProperties.normalMap) {
      additionalMaps.normalMap = await textureLoader.loadAsync(
        materialProperties.normalMap
      );
      additionalMaps.normalMap.minFilter = THREE.LinearMipmapLinearFilter;
      additionalMaps.normalMap.magFilter = THREE.LinearFilter;
      additionalMaps.normalMap.anisotropy = 16;
      additionalMaps.normalMap.wrapS = additionalMaps.normalMap.wrapT =
        THREE.RepeatWrapping;
      additionalMaps.normalMap.repeat.set(repeatScale, repeatScale);
    }
    const material = new THREE.MeshStandardMaterial({
      map: colorMap,
      color: materialProperties.baseColor,
      roughness: materialProperties.roughness,
      metalness: materialProperties.metalness,
      ...additionalMaps,
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = facilityNames.warehouse;
    mesh.userData.isRootClickable = true;
    mesh.userData.kind = "storage";
    mesh.userData.code = areaData.code; // WICHTIG: muss existieren
    mesh.userData.name = areaData.name;

    mesh.position.set(
      areaData.x + areaData.width / 2,
      3,
      areaData.z + areaData.depth / 2
    );

    mesh.receiveShadow = true;
    mesh.castShadow = true;

    return mesh;
  } else {
    const gltfLoader = new GLTFLoader();

    const yardGlb = await gltfLoader.loadAsync("/models/storageYard.glb");

    const yardMesh = yardGlb.scene.children[0];

    //const textureLoader = new THREE.TextureLoader();

    //const materialProperties = await yardMaterialLoader();

    //const repeatScale = 8;

    //const colorMap = await textureLoader.loadAsync(materialProperties.colorMap);
    //colorMap.minFilter = THREE.LinearMipmapLinearFilter;
    //colorMap.magFilter = THREE.LinearFilter;
    //colorMap.anisotropy = 16;
    //colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
    //colorMap.repeat.set(repeatScale, repeatScale);

    //const additionalMaps = {};
    // if (materialProperties.roughnessMap) {
    //   additionalMaps.roughnessMap = await textureLoader.loadAsync(
    //     materialProperties.roughnessMap
    //   );
    //   additionalMaps.roughnessMap.minFilter = THREE.LinearMipmapLinearFilter;
    //   additionalMaps.roughnessMap.magFilter = THREE.LinearFilter;
    //   additionalMaps.roughnessMap.anisotropy = 16;
    //   additionalMaps.roughnessMap.wrapS = additionalMaps.roughnessMap.wrapT =
    //     THREE.RepeatWrapping;
    //   additionalMaps.roughnessMap.repeat.set(repeatScale, repeatScale);
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
    //   additionalMaps.normalMap.repeat.set(repeatScale, repeatScale);
    // }
    // const material = new THREE.MeshStandardMaterial({
    //   map: colorMap,
    //   color: materialProperties.baseColor,
    //   roughness: materialProperties.roughness,
    //   metalness: materialProperties.metalness,
    //   side: THREE.DoubleSide,
    //   ...additionalMaps,
    // });

    yardMesh.name = facilityNames.storageYard;
    yardMesh.userData.isRootClickable = true;
    yardMesh.userData.kind = "storage";
    yardMesh.userData.code = areaData.code;
    yardMesh.userData.name = areaData.name;
    //yardMesh.material = material;
    yardMesh.castShadow = true;
    yardMesh.receiveShadow = true;

    yardMesh.scale.set(areaData.width, 1, 1);

    yardMesh.position.set(areaData.x, 3, areaData.z);

    return yardMesh;
  }
}
