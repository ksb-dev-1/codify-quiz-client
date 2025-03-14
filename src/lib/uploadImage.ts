export default async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`;

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json(); // Get the response JSON

    if (!res.ok) {
      // Use the message from the API instead of throwing a generic error
      return { success: false, message: data.message || "Image upload failed" };
    }

    return data; // Return the successful response from API
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
