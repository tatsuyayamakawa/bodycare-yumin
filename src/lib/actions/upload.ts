"use server";

import { randomUUID } from "crypto";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { error: "ファイルが選択されていません" };
    }

    // ファイル形式チェック
    if (!file.type.startsWith("image/")) {
      return { error: "画像ファイルのみアップロード可能です" };
    }

    // ファイルサイズチェック (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { error: "ファイルサイズは5MB以下にしてください" };
    }

    // ファイル名生成（重複防止）
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const fileName = `${randomUUID()}.${fileExtension}`;
    const filePath = `articles/${fileName}`;

    // ファイルをArrayBufferに変換
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Supabase Storageにアップロード
    const { data, error } = await supabaseAdmin.storage
      .from("blog-images")
      .upload(filePath, uint8Array, {
        contentType: file.type,
        cacheControl: "3600",
      });

    if (error) {
      console.error("Upload error:", error);
      return { error: "アップロードに失敗しました" };
    }

    // 公開URLを取得
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("blog-images")
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "アップロードに失敗しました" };
  }
}

export async function deleteImage(imageUrl: string) {
  try {
    // URLからファイルパスを抽出
    const url = new URL(imageUrl);
    const pathSegments = url.pathname.split("/");
    const filePath = pathSegments.slice(-2).join("/"); // "articles/filename.ext"

    // Supabase Storageから削除
    const { error } = await supabaseAdmin.storage
      .from("blog-images")
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      return { error: "画像の削除に失敗しました" };
    }

    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { error: "画像の削除に失敗しました" };
  }
}
