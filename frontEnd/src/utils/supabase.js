
/* eslint-disable no-unused-vars */
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
export const uploadToSupabase = async (file) => {
  const fileName = `${Date.now()}_${file.name}`;
  const contentType = file.type || "application/octet-stream"; // Default to binary stream if no type is found
  const { data, error } = await supabase.storage
    .from("chat")
    .upload(fileName, file, {
      upsert: false,
      cacheControl: "3600",
      contentType, // Set content type explicitly
    });
  if (error) {
    throw new Error("Error uploading file: " + error.message);
  }
  const urlData = supabase.storage.from("chat").getPublicUrl(fileName);
  return urlData?.data?.publicUrl; // Return the public URL of the uploaded file
};
