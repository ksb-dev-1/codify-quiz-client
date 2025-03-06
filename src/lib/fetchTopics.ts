export default async function fetchTopics(userId: string) {
  const queryParams = new URLSearchParams();
  queryParams.set("userId", userId);

  const url = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/topics?${queryParams.toString()}`;
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
