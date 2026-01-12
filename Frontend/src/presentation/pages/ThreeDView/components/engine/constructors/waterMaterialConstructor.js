/* eslint-disable no-magic-numbers */
import * as THREE from 'three';

import { waterMaterialLoader } from '../loaders/materialLoaders/waterMaterialLoader';

export const getWaterMaterial = async () => {
  const textureLoader = new THREE.TextureLoader();

  const materialProperties = await waterMaterialLoader();

  const colorMap = await textureLoader.loadAsync(materialProperties.colorMap);
  colorMap.minFilter = THREE.LinearMipmapLinearFilter;
  colorMap.magFilter = THREE.LinearFilter;
  colorMap.anisotropy = 16;

  colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
  colorMap.repeat.set(50, 50);

  const additionalMaps = {};
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
