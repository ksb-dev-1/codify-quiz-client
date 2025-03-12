export default async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`;

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload image");
  }

  return res.json();
}
