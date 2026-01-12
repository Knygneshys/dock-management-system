export async function loadPortLayout() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/portlayout`);

  if (!res.ok) {
    throw new Error("Failed to fetch port layout");
  }

  return res.json();
}

