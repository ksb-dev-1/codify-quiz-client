export default async function fetchQuestions(userId: string | undefined) {
  const queryParams = new URLSearchParams();

  if (userId) queryParams.set("userId", userId);

  const url = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/questions/saved?${queryParams.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch saved questions");
  }

  return res.json();
}
