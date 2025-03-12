export default async function fetchQuestion(questionId: string) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/${questionId}`;

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
