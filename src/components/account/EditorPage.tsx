"use client";
import { uploadAttachment } from "@/core/lib/api/account/upload-attachment";
import { cn } from "@/core/lib/utils";
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import { toast } from "sonner";

interface MyEditorProps {
  value?: string | null;
  onChange?: (content: string) => void;
  error?: string;
}

export default function EditorPage({ value, onChange, error }: MyEditorProps) {
  const editorRef = useRef(null);

  const handleUpload = async (file: File): Promise<string> => {
    try {
      const result = await uploadAttachment(file);

      if (result?.status === "success" && result?.data?.url) {
        toast.success(result.message || "تصویر با موفقیت آپلود شد");
        return result.data.url;
      } else {
        throw new Error("خطا در دریافت URL تصویر");
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "خطا در آپلود تصویر";
      toast.error(msg);
      throw new Error(msg);
    }
  };

  return (
    <>
      <div
        className={cn(
          "w-full bg-primary-0  rounded-md border",
          error ? "border-red-600" : "border-primary-300"
        )}
      >
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          onInit={(_evt, editor) => {
            editorRef.current = editor;
          }}
          value={value ?? ""}
          onEditorChange={onChange}
          init={{
            width: "100%",
            // @ts-expect-error - TS can’t verify dynamic field path at runtime
            license_key: "gpl",
            height: 400,
            menubar: false,
            plugins: ["code", "image", "link", "table", "lists", "wordcount"],
            toolbar:
              "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | code",
            content_style: `
          body {
            font-family: inherit;
            font-size: 14px;
          }
            
        `,
            // @ts-expect-error - TS can’t verify dynamic field path at runtime
            images_upload_handler: async (blobInfo) => {
              const file = blobInfo.blob() as File;
              const url = await handleUpload(file);
              return url;
            },
          }}
        />
      </div>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </>
  );
}
