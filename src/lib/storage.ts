import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn("⚠️ Missing Supabase environment variables. Storage features will not work.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadFile(
  file: File,
  bucket: string = "resumes",
  folder: string = "uploads"
) {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      success: true,
      path: filePath,
      url: publicUrl,
      fileName,
    };
  } catch (error) {
    console.error("File upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown upload error",
    };
  }
}

export async function deleteFile(
  path: string,
  bucket: string = "resumes"
) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("File delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown delete error",
    };
  }
}

export async function getFileUrl(
  path: string,
  bucket: string = "resumes"
) {
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return {
      success: true,
      url: data.publicUrl,
    };
  } catch (error) {
    console.error("Get file URL error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function listFiles(
  bucket: string = "resumes",
  folder?: string
) {
  try {
    let path = folder || "";
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder ? { prefix: folder } : {} as any);

    if (error) {
      throw new Error(`List files failed: ${error.message}`);
    }

    return {
      success: true,
      files: data || [],
    };
  } catch (error) {
    console.error("List files error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Helper function to validate file type
export function validateFileType(file: File, allowedTypes: string[] = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']) {
  return allowedTypes.includes(file.type);
}

// Helper function to validate file size (max 10MB)
export function validateFileSize(file: File, maxSizeInMB: number = 10) {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

// Helper function to get file extension
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

// Helper function to generate file preview URL
export function generatePreviewUrl(path: string, bucket: string = "resumes"): string {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}