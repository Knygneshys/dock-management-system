/* eslint-disable no-magic-numbers */
import * as THREE from "three";

import { portGroundMaterialLoader } from "../loaders/materialLoaders/portGroundMaterialLoader";

export const getPortGroundMaterial = async () => {

  const textureLoader = new THREE.TextureLoader();

  const materialProperties = await portGroundMaterialLoader();

  const colorMap = await textureLoader.loadAsync(materialProperties.colorMap);
  colorMap.minFilter = THREE.LinearMipmapLinearFilter;
  colorMap.magFilter = THREE.LinearFilter;
  colorMap.anisotropy = 16;

  colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
  colorMap.repeat.set(50, 50);

  const additionalMaps = {};
  if (materialProperties.roughnessMap) {
    additionalMaps.roughnessMap = await textureLoader.loadAsync(
      materialProperties.roughnessMap
    );
    additionalMaps.roughnessMap.minFilter = THREE.LinearMipmapLinearFilter;
    additionalMaps.roughnessMap.magFilter = THREE.LinearFilter;
    additionalMaps.roughnessMap.anisotropy = 16;
    additionalMaps.roughnessMap.wrapS = additionalMaps.roughnessMap.wrapT = THREE.RepeatWrapping;
    additionalMaps.roughnessMap.repeat.set(50, 50);
  }
  if (materialProperties.normalMap) {
    additionalMaps.normalMap = await textureLoader.loadAsync(
      materialProperties.normalMap
    );
    additionalMaps.normalMap.minFilter = THREE.LinearMipmapLinearFilter;
    additionalMaps.normalMap.magFilter = THREE.LinearFilter;
    additionalMaps.normalMap.anisotropy = 16;
    additionalMaps.normalMap.wrapS = additionalMaps.normalMap.wrapT = THREE.RepeatWrapping;
    additionalMaps.normalMap.repeat.set(50, 50);
  }
  const material = new THREE.MeshStandardMaterial({
    map: colorMap,
    color: materialProperties.baseColor,
    roughness: materialProperties.roughness,
    metalness: materialProperties.metalness,
    ...additionalMaps,
  });

  return material;
};
