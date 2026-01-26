"use client";
import { transformImage } from "./transformImage";
import TurndownService from "turndown";
import { blobToDataURL } from "@/app/utils/blobToDataUrl";

/**
 * @file markdownFormatters.ts
 * @description Internal browser library for converting various datatypes into Markdown.
 */

/**
 * Asynchronously transform HTML data to markdown, handling image uploads as needed.
 * This function is asynchronous because image uploads may be required.
 */
export async function htmlToMarkdown(html: string): Promise<string> {
  const replacements: Record<string, Promise<string>> = {};

  const htmlToMarkdownService = new TurndownService();

  htmlToMarkdownService.addRule("img", {
    filter: "img",
    replacement(content, node) {
      if (!(node instanceof HTMLImageElement)) return content;

      const src = node.src;

      // Because image transformation happens on the server, synchronously fill use a placeholder as the link and replace the url later.
      const placeholder = crypto.randomUUID();
      replacements[placeholder] = transformImage(src);

      const alt = node.alt || "";

      return `![${alt}](${placeholder})`;
    },
  });

  let markdown = htmlToMarkdownService.turndown(html);
  for (const placeholder in replacements) {
    const imgsrc = await replacements[placeholder].catch((e) => {
      console.error("Error transforming image:", e);
      return "Failed to upload image";
    });
    markdown = markdown.replaceAll(placeholder, imgsrc);
  }

  return markdown;
}

/**
 * Convert a FileList containing images into a bunch of markdown image links.
 */
export async function fileListToMarkdown(files: FileList): Promise<string> {
  let markdown = "";
  console.log("Pasting files: ", files);
  console.log("length: ", files.length);
  console.log("Second Item: ", files.item(1));
  for (let i = 0; i < files.length; i++) {
    console.log("Processing file:", files.item(i));
    const file = files[i];
    if (file.type.startsWith("image/")) {
      const url = await transformImage(await blobToDataURL(file));
      markdown += `![${file.name}](${url})\n`;
    } else {
      markdown += `\`${file.name}\` has an unsupported file type: \`${file.type}\`\n`;
    }
  }
  return markdown;
}

/**
 * Convert a DataTransfer object into markdown text.
 *
 * This function supports the following mime types, in order of preference:
 * - `text/html`: Converted to markdown via {@link htmlToMarkdown}
 * - `Files`: Converted to markdown image links via {@link fileListToMarkdown}
 * - `text/plain`: Returned as-is.
 * - `text`: Returned as-is.
 */
export async function dataTransferToMarkdown(
  data: DataTransfer | null,
): Promise<string> {
  if (data === null) {
    return "";
  } else if (data.types.includes("text/html")) {
    return await htmlToMarkdown(data.getData("text/html"));
  } else if (data.types.includes("Files")) {
    return await fileListToMarkdown(data.files);
  } else if (data.types.includes("text/plain")) {
    return data.getData("text/plain");
  } else if (data.types.includes("text")) {
    return data.getData("text");
  } else {
    console.warn("None of the following mime types are supported:", data.types);
    return "";
  }
}
