import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

/**
 * Retrieve a list of URIs of relevant images.
 * 
 * This is a server-only function.
 * 
 * This pulls from the `/photos/raw` bucket in SupaBase.
 * @param limit the maximum number of URIs to return. Defaults to 10
 * @returns a list of URIs.
 */
export async function getRandomImageUrls(limit: number = 10): Promise<string[]> {
  "use server"
  const supabaseApiKey = process.env.SUPABASE_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  if(!supabaseApiKey) throw new Error("No API key found!");
  if(!supabaseUrl) throw new Error("No Supabase URL found!");

  const client = createClient(supabaseUrl, supabaseApiKey);

  const imageQueryResult = await client.storage
    .from("photos")
    .list("raw", {limit});

  if(!imageQueryResult.data) throw new Error("Image Query Failed!")

  const imagePaths = imageQueryResult.data
    .map(file => file.name);

  const imageUrls = imagePaths.map(
    path =>
      client.storage.from("photos").getPublicUrl(`raw/${path}`).data.publicUrl
  );

  return imageUrls;
}

/**
 * The additional data we want every image to have.
 */
export type ImageMetadata = {
  userId: string,
  eventId: string | null,
};

/**
 * Looks up certain MIME types based on [this reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types/Common_types).
 * 
 * @param mimeType the mime type that we should look up.
 * @returns the file extension.
 * @example
 * mimeToExtension("text/jpeg"); // returns ".jpg"
 * @example
 * mimeToExtension("this/isnotimplemented"); // Throws RangeError: MIME type this/isnotimplemented is not implemented.)
 */
function mimeToExtenstion(mimeType: string): string{
  switch(mimeType){
    case "image/jpeg":
      return ".jpg"
    default:
      throw new RangeError(`MIME type ${mimeType} is not implemented.`)
  }
}

/**
 * Converts a record's keys to lowercase so that they can be inserted into a SQL table.
 * @param row a record representign a row in a SQL table.
 * @returns the same record with lowercase keys.
 * @example
 * keyToLower({
 *   myNumber: 23,
 *   yourObject: {}
 * });
 * // returns
 * // {
 * //   mynumber: 23,
 * //   yourobject: {}
 * // }
 */
function keyToLower(row: Record<string, unknown>): Record<string, unknown>{
  return Object.fromEntries(Object.entries(row).map(([columnName, value]) => [columnName.toLowerCase(), value]));
}

/**
 * Upload an image to the database.
 * 
 * @param imageData a Blob that contains the data and file type that is to be added.
 * @example
 * // myImage is a Blob object that contains a image/jpeg file
 * await addImage(myImage); // Returns "6GpSNGbesNfU-t8KHMQXGjkIFmU.jpg"
 * 
 * @todo Convert this into a transaction so that everything is rolled back if this fails.
 */
export async function addImage(imageData: Blob, metadata: ImageMetadata): Promise<string> {
  "use server"
  // Verify Supabase credentials exist
  const supabaseApiKey = process.env.SUPABASE_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  if(!supabaseApiKey) throw new Error("No API key found!");
  if(!supabaseUrl) throw new Error("No Supabase URL found!");

  const extension = mimeToExtenstion(imageData.type);

  const client = createClient(supabaseUrl, supabaseApiKey);

  const imageId = randomBytes(20).toString('base64url');
  const targetUrl = `raw/${imageId}${extension}`;
  const imageQueryResult = await client.storage
    .from("photos")
    .upload(targetUrl, imageData)

  if(imageQueryResult.error) {
    throw imageQueryResult.error;
  }

  const supabaseInsertResult = await client.from("photo").insert([{
    imageId,
    ...metadata
  }].map(keyToLower));

  if(supabaseInsertResult.error) {
    throw supabaseInsertResult.error;
  }

  return targetUrl;
}