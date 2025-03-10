export default async function fetchQuestion(
  userId: string | undefined,
  questionId: string
) {
  const queryParams = new URLSearchParams();

  if (userId) queryParams.set("userId", userId);

  const url = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/questions/${questionId}?${queryParams.toString()}`;

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
