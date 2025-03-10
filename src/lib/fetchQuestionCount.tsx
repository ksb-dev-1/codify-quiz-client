export default async function fetchQuestionCount(userId: string | undefined) {
  const queryParams = new URLSearchParams();
  if (userId) queryParams.set("userId", userId);

  const url = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/questions/count?${queryParams.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch question count");
  }

  return res.json();
}
