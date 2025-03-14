export default async function fetchTopics() {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/topics`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch topics.",
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching topics:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
