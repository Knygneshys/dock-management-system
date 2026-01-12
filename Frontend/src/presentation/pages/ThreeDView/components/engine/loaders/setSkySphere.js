import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { PMREMGenerator } from "three";

export const setSkySphere = (scene, renderer, imagePath) => {
  const pmremGenerator = new PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  new RGBELoader().load(imagePath, (hdrTexture) => {
    const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;

    scene.environment = envMap;
    scene.background = envMap;

    hdrTexture.dispose();
    pmremGenerator.dispose();
  });
};
