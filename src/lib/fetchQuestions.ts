export default async function fetchQuestions(
  currentPage?: string,
  currentStatus?: string,
  currentDifficulty?: string,
  currentTopic?: string
) {
  const queryParams = new URLSearchParams();

  if (currentTopic) queryParams.set("topic", currentTopic);
  if (currentDifficulty) queryParams.set("difficulty", currentDifficulty);
  if (currentStatus) queryParams.set("status", currentStatus);
  queryParams.set("page", currentPage?.toString() || "1");

  const url = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/questions?${queryParams.toString()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json(); // Parse response JSON

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch questions.",
      };
    }

    return data; // Return API response directly
  } catch (error) {
    console.error("Error fetching questions:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
