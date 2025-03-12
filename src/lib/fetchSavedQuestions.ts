export default async function fetchQuestions() {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/saved`;

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
