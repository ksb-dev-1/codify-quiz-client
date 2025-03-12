export default async function fetchQuestions(
  currentPage: string | undefined,
  currentStatus: string | undefined,
  currentDifficulty: string | undefined,
  currentTopic: string | undefined
) {
  const queryParams = new URLSearchParams();

  if (currentTopic) queryParams.set("topic", currentTopic);
  if (currentDifficulty) queryParams.set("difficulty", currentDifficulty);
  if (currentStatus) queryParams.set("status", currentStatus);
  queryParams.set("page", currentPage?.toString() || "1");

  const url = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/questions?${queryParams.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch questions");
  }

  return res.json();
}
