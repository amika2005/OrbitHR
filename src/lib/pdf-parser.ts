import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
// Note: This needs to be configured before using the library
// For server-side rendering, we'll set the worker path dynamically
if (typeof window === 'undefined') {
  // Server-side: Point to the worker file
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export interface PDFParseResult {
  success: boolean;
  text?: string;
  pageCount?: number;
  error?: string;
}

/**
 * Extract text content from a PDF file
 * @param source - Either a URL string or File object
 * @returns Extracted text content or error
 */
export async function extractTextFromPDF(
  source: string | File
): Promise<PDFParseResult> {
  try {
    let data: ArrayBuffer;

    // Handle File object
    if (source instanceof File) {
      data = await source.arrayBuffer();
    }
    // Handle URL string
    else {
      const response = await fetch(source);
      if (!response.ok) {
        return {
          success: false,
          error: `Failed to fetch PDF: ${response.statusText}`,
        };
      }
      data = await response.arrayBuffer();
    }

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;

    const pageCount = pdf.numPages;
    let fullText = '';

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine text items with spaces
      const pageText = textContent.items
        .map((item: any) => {
          if ('str' in item) {
            return item.str;
          }
          return '';
        })
        .join(' ');

      fullText += pageText + '\n\n';
    }

    // Clean up the text
    const cleanedText = fullText
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim();

    return {
      success: true,
      text: cleanedText,
      pageCount,
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse PDF',
    };
  }
}

/**
 * Extract text from PDF URL (convenience function)
 * @param url - Public URL of the PDF file
 * @returns Extracted text content
 */
export async function extractTextFromPDFUrl(url: string): Promise<string> {
  const result = await extractTextFromPDF(url);
  if (!result.success || !result.text) {
    throw new Error(result.error || 'Failed to extract text from PDF');
  }
  return result.text;
}

/**
 * Validate if a file is a valid PDF
 * @param file - File to validate
 * @returns True if valid PDF
 */
export async function isValidPDF(file: File): Promise<boolean> {
  try {
    const data = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data });
    await loadingTask.promise;
    return true;
  } catch {
    return false;
  }
}
