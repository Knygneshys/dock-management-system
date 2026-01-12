/* eslint-disable no-magic-numbers */
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

import { vesselOrResource } from "../../../../../../domain/Enums/meshNames";

export async function vesselModel(dockData, vveDto) {
  const gltfLoader = new GLTFLoader();
  const vessleGlb = await gltfLoader.loadAsync("/models/vessel.glb");
  const mesh = vessleGlb.scene;

  mesh.userData.isRootClickable = true;
  mesh.name = vesselOrResource.vessel;
  mesh.userData.kind = "vessel";
  mesh.userData.code = vveDto.code;
  mesh.userData.name = vveDto.vesselImo;
  mesh.userData.dockCode = dockData.code;
  mesh.userData.status = vveDto.status;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.name = vesselOrResource.vessel;
      child.userData.kind = mesh.userData.kind;
      child.userData.code = mesh.userData.code;
      child.userData.name = mesh.userData.name;

      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  var statusTooltipDiv = document.createElement("div");
  statusTooltipDiv.className = "label";

  statusTooltipDiv.textContent = vveDto.status;
  statusTooltipDiv.style.marginTop = "-1em";
  statusTooltipDiv.style.color = "white";
  var statusTooltip = new CSS2DObject(statusTooltipDiv);
  statusTooltip.position.set(0, 1, 0);

  mesh.add(statusTooltip);

  if (vveDto.status === "InProgress") {
    mesh.position.set(dockData.x - 5, 0, dockData.z - dockData.length / 2 + 10);
  } else if (vveDto.status === "Waiting") {
    mesh.position.set(dockData.x - 50, 0, dockData.z - dockData.length / 2 - 80);
    mesh.rotation.y = 0.4;
  } else {
    mesh.position.set(dockData.x - 100, 0, dockData.z - dockData.length / 2 + 300);
    mesh.rotation.y = -0.4;
  }

  return mesh;
}
