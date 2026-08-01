import pdfParse from "pdf-parse";

/**
 * Extract plaintext from PDF buffer
 */
export async function extractTextFromPDFBuffer(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text ? data.text.trim() : "";
  } catch (error) {
    console.error("[PDF Extraction Error]:", error);
    throw new Error(`Failed to parse PDF document: ${error.message}`);
  }
}
