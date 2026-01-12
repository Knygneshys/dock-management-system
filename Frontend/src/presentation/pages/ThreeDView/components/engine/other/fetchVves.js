import Cookies from "universal-cookie";
import * as THREE from "three";
import { vesselModel } from "../templates/vessel";

let isFetching = false;

export async function fetchVves(scene) {
  if (isFetching) return;
  isFetching = true;
  try {
    const baseUrl = import.meta.env.VITE_API_URL;
    const cookies = new Cookies();
    const token = cookies.get("access_token");

    const inProgressVVEs = await safeJsonFetch(`${baseUrl}/api/VVE/search?status=InProgress`, token, []);

    const waitingVVEs = await safeJsonFetch(`${baseUrl}/api/VVE/search?status=Waiting`, token, []);

    const departingVVEs = await safeJsonFetch(`${baseUrl}/api/VVE/search?status=Departing`, token, []);

    const allVves = [...inProgressVVEs, ...waitingVVEs, ...departingVVEs];

    for (var vve of allVves) {
      syncVveWithScene(scene, vve);
    }
  } finally {
    isFetching = false;
  }
}

async function syncVveWithScene(scene, vveData) {
  const { code, status, dockCode } = vveData;

  const docksByCode = scene.userData.docksByCode;
  const vvesByCode = scene.userData.vvesByCode;

  const dockDto = docksByCode.get(dockCode);
  if (!dockDto) {
    console.warn(`Dock ${dockCode} não encontrada`);
    return;
  }

  if (vvesByCode.has(code)) {
    const vveMesh = vvesByCode.get(code);
    updateVveMesh(scene, vvesByCode, vveMesh, vveData, dockDto);
    return;
  }

  const vveMesh = await vesselModel(dockDto, vveData);

  scene.add(vveMesh);
  vvesByCode.set(code, vveMesh);
}

function updateVveMesh(scene, vvesByCode, vveMesh, vveDto, dockDto) {
  if (vveDto.status === "InProgress") {
    vveMesh.position.set(dockDto.x - 5, 0, dockDto.z - dockDto.length / 2 + 10);
    vveMesh.rotation.y = 0;
  } else if (vveDto.status === "Waiting") {
    vveMesh.position.set(dockDto.x - 50, 0, dockDto.z - dockDto.length / 2 - 80);
    vveMesh.rotation.y = 0.4;
  } else if (vveDto.status === "Departing") {
    vveMesh.position.set(dockDto.x - 100, 0, dockDto.z - dockDto.length / 2 + 300);
    vveMesh.rotation.y = -0.4;
  } else {
    scene.remove(vveMesh);

    vveMesh.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    vvesByCode.delete(vveMesh.userData.code);
  }
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
