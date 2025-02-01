
import { createClient } from "@supabase/supabase-js";
let supabase;
async function fetchConfig() {
  const response = await fetch('/api/config/supabase');
  const config = await response.json();
  return config;
}
(async () => {
  const { supabaseUrl, supabaseKey } = await fetchConfig();
  supabase = createClient(supabaseUrl, supabaseKey);
})();
export const uploadToSupabase = async (file) => {
  if (!supabase) throw new Error("Supabase client is not initialized yet!");
  const fileName = `${Date.now()}_${file.name}`;
  const contentType = file.type || "application/octet-stream"; 
  const { data, error } = await supabase.storage
    .from("chat")
    .upload(fileName, file, {
      upsert: false,
      cacheControl: "3600",
      contentType, 
    });
  if (error) {
    throw new Error("Error uploading file: " + error.message);
  }
  const urlData = supabase.storage.from("chat").getPublicUrl(fileName);
  return urlData?.data?.publicUrl;
};
export default supabase;
