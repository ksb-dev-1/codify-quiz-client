export default async function fetchSavedQuestions() {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/saved`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json(); // Parse response JSON

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch saved questions.",
      };
    }

    return data; // Return API response directly
  } catch (error) {
    console.error("Error fetching saved questions:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
