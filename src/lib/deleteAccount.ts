export default async function deleteAccount() {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/delete`;

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to delete account.",
      };
    }

    return data;
  } catch (error) {
    console.error("Error deleting account:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
