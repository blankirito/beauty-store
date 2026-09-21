import { createClient } from "@/lib/supabase/client";
import { buildProductImagePath } from "@/lib/products/productImagePath";

type UploadProductImagesInput = {
  storeId: string;
  productId: string;
  files: File[];
  primaryImageIndex: number;
};

function getExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "webp") {
    return extension;
  }

  return "webp";
}

export async function uploadProductImages({
  storeId,
  productId,
  files,
  primaryImageIndex,
}: UploadProductImagesInput): Promise<{ error?: string }> {
  const supabase = createClient();

  for (const [index, file] of files.entries()) {
    const storagePath = buildProductImagePath({
      storeId,
      productId,
      imageId: crypto.randomUUID(),
      extension: getExtension(file),
    });

    const { error: storageError } = await supabase.storage
      .from("product-images")
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (storageError) {
      return {
        error: "The product was created, but one or more images could not be uploaded.",
      };
    }

    const { error: imageRecordError } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        storage_path: storagePath,
        sort_order: index,
        is_primary: index === primaryImageIndex,
      });

    if (imageRecordError) {
      await supabase.storage.from("product-images").remove([storagePath]);

      return {
        error: "The product was created, but one or more images could not be saved.",
      };
    }
  }

  return {};
}