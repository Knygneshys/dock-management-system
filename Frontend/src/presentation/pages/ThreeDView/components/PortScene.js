/* eslint-disable no-magic-numbers */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import Cookies from "universal-cookie";

import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";

import { facilityNames, vesselOrResource } from "../../../../domain/Enums/meshNames";
import { getPortGroundMaterial } from "./engine/constructors/portGroundMaterialConstructor";
import { getWaterMaterial } from "./engine/constructors/waterMaterialConstructor";
import { centerCameraOnObject, resetCameraToDefault } from "./engine/helpers/cameraCenterHelper";
import { getClickedObject } from "./engine/helpers/rayCastHelper";
import { loadPortLayout } from "./engine/loaders/layoutLoader";
import { setSkySphere } from "./engine/loaders/setSkySphere";
import { createCamera, createCameraControls } from "./engine/templates/camera";
import { createDock } from "./engine/templates/docks";
import { addLights } from "./engine/templates/lights";
import { createStorageArea } from "./engine/templates/storageAreas";
import { stsCraneModel } from "./engine/templates/stsCrane";
import { yardCraneModel } from "./engine/templates/yardCrane";
import {
  createSelectionSpotlight,
  followCameraWithSpotlight,
  setSpotlightEnabled,
  setSpotlightTargetToObjectCenter
} from "./engine/templates/selectionSpotlight";
import { createSelectionLightPool, updateLightPool, setLightPoolEnabled } from "./engine/templates/selectionLightPool";
import { cameraData } from "./engine/config/defaultData";
import { fetchVves } from "./engine/other/fetchVves";

const BACKGROUND_COLOR = 0xd0d8e8;

export function createPortScene(container) {
  function emitSelectionChange(payload) {
    window.dispatchEvent(new CustomEvent("port-selection-changed", { detail: payload }));
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BACKGROUND_COLOR);

  const camera = createCamera(container);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  renderer.toneMappingExposure = 1.0;

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(container.clientWidth, container.clientHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  labelRenderer.domElement.style.left = "0px";
  labelRenderer.domElement.style.pointerEvents = "none";
  container.appendChild(labelRenderer.domElement);

  const controls = createCameraControls(camera, renderer.domElement);

  const { ambient, directional } = addLights(scene);
  const BASE_AMBIENT_INTENSITY = ambient.intensity;
  const BASE_DIRECTIONAL_INTENSITY = directional.intensity;

  const selectionSpot = createSelectionSpotlight(scene);
  setSpotlightEnabled(selectionSpot.light, false);
  const lightPool = createSelectionLightPool(scene);
  setLightPoolEnabled(lightPool, false);

  const skySphere = setSkySphere(scene, renderer, "/Environment/qwantani_moonrise_puresky_4k.hdr");

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const outlinePass = new OutlinePass(new THREE.Vector2(container.clientWidth, container.clientHeight), scene, camera);

  outlinePass.edgeStrength = 3;
  outlinePass.edgeGlow = 0;
  outlinePass.edgeThickness = 1;
  outlinePass.pulsePeriod = 0;
  outlinePass.visibleEdgeColor.set("#ffffff");
  outlinePass.hiddenEdgeColor.set("#ffffff");

  composer.addPass(outlinePass);
  composer.addPass(new OutputPass());

  (async () => {
    await loadPortContents(scene);
  })();

  scene.userData.docksByCode = new Map();
  scene.userData.vvesByCode = new Map();
  const periodicFetch = setInterval(() => fetchVves(scene), 5000);

  const enableSpotlightMode = () => {
    ambient.intensity = BASE_AMBIENT_INTENSITY * 0.4;
    directional.intensity = BASE_DIRECTIONAL_INTENSITY * 0.4;
  };

  const disableSpotlightMode = () => {
    ambient.intensity = BASE_AMBIENT_INTENSITY;
    directional.intensity = BASE_DIRECTIONAL_INTENSITY;
  };

  function clearSelection() {
    outlinePass.selectedObjects = [];
    setSpotlightEnabled(selectionSpot.light, false);
    disableSpotlightMode();
    setLightPoolEnabled(lightPool, false);
  }

  const onKeyDown = (event) => {
    console.log("KEYDOWN:", event.key);

    if (event.key === "r" || event.key === "R") {
      console.log("RESET CAMERA TRIGGERED");

      try {
        resetCameraToDefault(camera, controls, 1000);
      } catch (e) {
        console.error("resetCameraToDefault failed, using fallback", e);

        camera.position.copy(cameraData.startPosition);
        controls.target.set(0, 0, 0);
        controls.update();
      }

      clearSelection();
      emitSelectionChange(null);
    }
  };

  window.addEventListener("keydown", onKeyDown);

  const onClick = (event) => {
    const clickedObject = getClickedObject(event, renderer.domElement, camera, scene);

    if (!clickedObject) {
      clearSelection();
      emitSelectionChange(null);
      return;
    }

    const isFacilityObject = Object.values(facilityNames).some((facility) => clickedObject.name === facility);
    const isVesselOrResourceObject = Object.values(vesselOrResource).some((obj) => clickedObject.name === obj);

    if (isFacilityObject || isVesselOrResourceObject) {
      outlinePass.selectedObjects = [clickedObject];
      centerCameraOnObject(clickedObject, camera, controls, 100);

      setSpotlightEnabled(selectionSpot.light, true);
      enableSpotlightMode();
      setSpotlightTargetToObjectCenter(clickedObject, selectionSpot.target);
      selectionSpot.light.target.updateMatrixWorld(true);

      setLightPoolEnabled(lightPool, true);
      updateLightPool(lightPool, clickedObject, scene);

      const type = isFacilityObject ? "facility" : "vesselOrResource";

      emitSelectionChange({
        name: clickedObject.userData?.name ?? clickedObject.name,
        type,
        kind: clickedObject.userData?.kind ?? null,
        code: clickedObject.userData?.code ?? null,
        dockCode: clickedObject.userData?.dockCode ?? null,
        status: clickedObject.userData?.status ?? null,
        basic: clickedObject.userData?.basic ?? null
      });
    } else {
      clearSelection();
      emitSelectionChange(null);
    }
  };

  renderer.domElement.addEventListener("click", onClick);

  function animate() {
    requestAnimationFrame(animate);

    controls.update();

    if (skySphere) {
      skySphere.position.copy(camera.position);
    }

    followCameraWithSpotlight(selectionSpot.light, camera, selectionSpot.target);

    if (outlinePass.selectedObjects.length > 0 && selectionSpot.light.intensity > 0) {
      setSpotlightTargetToObjectCenter(outlinePass.selectedObjects[0], selectionSpot.target);
      selectionSpot.light.target.updateMatrixWorld(true);

      updateLightPool(lightPool, outlinePass.selectedObjects[0], scene);
    }

    labelRenderer.render(scene, camera);
    composer.render();
  }

  animate();

  return () => {
    clearInterval(periodicFetch);
    renderer.domElement.removeEventListener("click", onClick);
    window.removeEventListener("keydown", onKeyDown);
    controls.dispose();
    renderer.dispose();
    container.removeChild(renderer.domElement);
  };
}

async function safeJsonFetch(url, token, fallback) {
  try {
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (res.status === 401 || res.status === 403) return fallback;
    if (!res.ok) return fallback;

    return await res.json();
  } catch {
    return fallback;
  }
}

async function loadPortContents(scene) {
  const layout = await loadPortLayout();

  const baseUrl = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const token = cookies.get("access_token");

  const yardCranes = await safeJsonFetch(`${baseUrl}/api/Resources?type=YardCrane`, token, []);
  const stsCranes = await safeJsonFetch(`${baseUrl}/api/Resources?type=STSCrane`, token, []);

  const gltfLoader = new GLTFLoader();
  const portGlb = await gltfLoader.loadAsync("/models/portScene.glb");
  const portMesh = portGlb.scene;

  portMesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = false;
      child.receiveShadow = true;
    }
  });

  // const portGroundChild = portMesh.getObjectByName("portGround");
  // if (portGroundChild) {
  //   const material = await getPortGroundMaterial();
  //   portGroundChild.material = material;
  //   scene.userData.groundMesh = portGroundChild;
  // }

  const waterChild = portMesh.getObjectByName("water");
  if (waterChild) {
    const material = await getWaterMaterial();
    waterChild.material = material;
    scene.userData.waterMesh = waterChild;
  }

  portMesh.scale.set(10, 1, 10);
  scene.add(portMesh);

  layout.docks.forEach(async (dock) => {
    const dockMesh = await createDock(dock);
    scene.add(dockMesh);
    scene.userData.docksByCode.set(dock.code, dock);

    for (let i = 0; i < dock.numberOfCranes; i++) {
      const craneDto = stsCranes[i] ?? {
        alphanumericCode: `STS-${dock.code ?? "DOCK"}-${i + 1}`,
        description: `STS Crane ${i + 1}`,
        status: "Unknown",
        setupTimeMinutes: 0
      };

      const stsCrane = await stsCraneModel(dock, craneDto, i);
      scene.add(stsCrane);
    }
  });

  layout.storageAreas.forEach(async (area) => {
    const areaMesh = await createStorageArea(area);
    scene.add(areaMesh);

    if (area.type === "ContainerYard") {
      for (let i = 0; i < area.numberOfCranes; i++) {
        const craneDto = yardCranes[i] ?? {
          alphanumericCode: `YC-${area.code ?? "AREA"}-${i + 1}`,
          description: `Yard Crane ${i + 1}`,
          status: "Unknown",
          setupTimeMinutes: 0
        };

        const yardCrane = await yardCraneModel(area, craneDto, i);
        scene.add(yardCrane);
      }
    }
  });
}
