import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseSecretKey);

export async function uploadFile(
  file: File,
  userId: string,
): Promise<string> {
  const fileExtension = file.name.split(".").pop();

  const storageKey = `${userId}/${crypto.randomUUID()}.${fileExtension}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("comersly-uploads")
    .upload(storageKey, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  return storageKey;
}