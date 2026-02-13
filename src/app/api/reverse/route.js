export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
    {
      headers: {
        "User-Agent": "AQI-Route-App (your@email.com)"
      }
    }
  );

  const data = await res.json();
  return Response.json(data);
}
