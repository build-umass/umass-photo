/**
 * Convert a File object into a data URL string.
 */
export async function blobToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Source - https://stackoverflow.com/a/49093626
    // Posted by user993683, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-01-09, License - CC BY-SA 4.0
    const reader = new FileReader();
    reader.onload = () => {
      const readerResult = reader.result;
      if (typeof readerResult === "object")
        reject("Reader result is not a string when reading as data URL");
      else resolve(readerResult);
    };
    reader.readAsDataURL(file);
  });
}