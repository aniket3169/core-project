export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${q}`,
    {
      headers: {
        "User-Agent": "AQI-Route-App (your@email.com)"
      }
    }
  );

  const data = await res.json();
  return Response.json(data);
}
