/* eslint-disable no-unused-vars */
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://dgibkfondkksgibgvlee.supabase.co";
const supabaseKey = "https://dgibkfondkksgibgvlee.supabase.co";
const supabase = createClient(supabaseUrl, supabaseKey);
export const uploadToSupabase = async (file) => {
  const fileName = `${Date.now()}_${file.name}`;
  // Determine the MIME type of the file
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
