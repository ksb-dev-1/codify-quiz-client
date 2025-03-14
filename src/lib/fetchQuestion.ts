export default async function fetchQuestion(questionId: string) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/${questionId}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json(); // Parse response JSON

    if (!res.ok) {
      // Return API error message instead of throwing a generic error
      return {
        success: false,
        message: data.message || "Failed to fetch question.",
      };
    }

    return data; // Return API response directly
  } catch (error) {
    console.error("Error fetching question:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
