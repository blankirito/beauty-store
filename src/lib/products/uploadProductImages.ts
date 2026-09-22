import { createClient } from "@/lib/supabase/client";
import { buildProductImagePath } from "@/lib/products/productImagePath";
import { getProductImageSortOrder } from "@/lib/products/productImageOrder";

type UploadProductImagesInput = {
  storeId: string;
  productId: string;
  files: File[];
  primaryImageIndex: number;
  existingImageCount?: number;
};

function getExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (
    extension === "jpg" ||
    extension === "jpeg" ||
    extension === "png" ||
    extension === "webp"
  ) {
    return extension;
  }

  return "webp";
}

export async function uploadProductImages({
  storeId,
  productId,
  files,
  primaryImageIndex,
  existingImageCount = 0,
}: UploadProductImagesInput): Promise<{
  error?: string;
  storagePaths?: string[];
}> {
  const supabase = createClient();
  const storagePaths: string[] = [];

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
        error:
          "The product was created, but one or more images could not be uploaded.",
      };
    }

    const { error: imageRecordError } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        storage_path: storagePath,
        sort_order: getProductImageSortOrder(
          existingImageCount,
          index,
        ),
        is_primary:
          existingImageCount === 0 &&
          index === primaryImageIndex,
      });

    if (imageRecordError) {
      await supabase.storage
        .from("product-images")
        .remove([storagePath]);

      return {
        error:
          "The product was created, but one or more images could not be saved.",
      };
    }

    storagePaths.push(storagePath);
  }

  return {
    storagePaths,
  };
}