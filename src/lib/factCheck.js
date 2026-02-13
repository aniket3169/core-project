export async function searchFactCheck(query) {
  const url = new URL(
    "https://factchecktools.googleapis.com/v1alpha1/claims:search"
  );

  url.searchParams.set("query", query);
  url.searchParams.set("key", process.env.GOOGLE_FACT_CHECK_API_KEY);

  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });

  const text = await res.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Invalid Google Fact Check response");
  }

  if (!res.ok) {
    throw new Error(
      data?.error?.message || "Google Fact Check request failed"
    );
  }

  return data;
}
