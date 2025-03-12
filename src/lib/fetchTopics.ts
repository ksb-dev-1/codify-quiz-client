export default async function fetchTopics() {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/topics`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch topics");
  }

  return res.json();
}
