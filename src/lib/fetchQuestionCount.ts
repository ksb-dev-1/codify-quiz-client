export default async function fetchQuestionCount() {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/count`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json(); // Parse response JSON

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch question count.",
      };
    }

    return data; // Return API response directly
  } catch (error) {
    console.error("Error fetching question count:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
