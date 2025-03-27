/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";

export const generateAnswerKeyPDF = (text: string, query: string): string => {
  const doc: any = new jsPDF();

  // Layout and font constants
  const MARGIN = 15;
  const HEADER_HEIGHT = 30; // space allocated for header
  const FOOTER_HEIGHT = 20; // space allocated for footer
  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
  const MAX_WIDTH = PAGE_WIDTH - 2 * MARGIN;
  const CONTENT_FONT_SIZE = 12;
  const LINE_SPACING = 4; // extra spacing between lines

  // We'll reserve an extra bottom margin so that text isn't cut off.
  const CONTENT_BOTTOM_MARGIN = 15;

  // Starting y-position: below the header.
  let yPos = MARGIN + HEADER_HEIGHT;

  // Render header on current page.
  const renderHeader = (): void => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    // Center header text at the top of the page.
    doc.text("Answer Key", PAGE_WIDTH / 2, MARGIN, { align: "center" });
    // Reset font for content.
    doc.setFont("helvetica", "normal");
    doc.setFontSize(CONTENT_FONT_SIZE);
  };

  // Render footer on current page.
  const renderFooter = (pageNumber: number, totalPages: number): void => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const footerText = "© 2025 Papershapers all rights reserved";
    doc.text(footerText, MARGIN, PAGE_HEIGHT - 10);
    const pageText = `Page ${pageNumber} of ${totalPages}`;
    doc.text(pageText, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 10, {
      align: "right",
    });
  };

  // Render header on the first page.
  renderHeader();

  // Set content font.
  doc.setFont("helvetica", "normal");
  doc.setFontSize(CONTENT_FONT_SIZE);

  // Clean and split the input text by newline.
  text = text.replace(/\uFFFD/g, "");
  const paragraphs = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  // Process each paragraph using jsPDF's built-in splitting.
  paragraphs.forEach((para) => {
    // Use splitTextToSize to wrap text to the available width.
    const wrappedText = doc.splitTextToSize(para, MAX_WIDTH);

    // Before printing this paragraph, check if there is enough space.
    // Calculate required height: number of lines * (font size + line spacing)
    const requiredHeight =
      wrappedText.length * (CONTENT_FONT_SIZE + LINE_SPACING);

    // If adding the paragraph would overflow the available space (including bottom margin),
    // then add a new page.
    if (
      yPos + requiredHeight >
      PAGE_HEIGHT - FOOTER_HEIGHT - CONTENT_BOTTOM_MARGIN
    ) {
      doc.addPage();
      yPos = MARGIN + HEADER_HEIGHT; // reset to top of new page (after header)
      renderHeader();
    }

    // Print the wrapped text at the current yPos.
    doc.text(wrappedText, MARGIN, yPos);
    yPos += requiredHeight;
  });

  // Render footer on each page.
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    renderFooter(i, totalPages);
  }

  // Generate a semantic file name from the query.
  const pdfName = query.replace(/[^a-zA-Z0-9]/g, "_") + "_Answer_Key.pdf";
  doc.save(pdfName);
  return pdfName;
};

export const downloadPdf = async (
  elementId: string,
  semanticName = "research-report.pdf"
) => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with id '${elementId}' not found.`);
    toast.error("PDF download error: Element not found");
    return;
  }
  try {
    // Force a fixed desktop width to bypass mobile CSS media queries
    const canvas = await html2canvas(input, {
      scale: 2,
      scrollY: -window.scrollY,
      windowWidth: 1024, // force a desktop-like viewport width
      onclone: (clonedDoc) => {
        // Inject custom style to enforce consistent font size and line height
        const style = clonedDoc.createElement("style");
        style.textContent = `
          html, body, #${elementId} {
            font-size: 16px !important;
            line-height: 1.5 !important;
          }
          p, h1, h2, h3, h4, h5, h6, li, span {
            font-size: 16px !important;
          }
        `;
        clonedDoc.head.appendChild(style);

        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.overflow = "visible";
          clonedElement.style.maxHeight = "none";
          clonedElement.style.border = "none";
          clonedElement.style.borderRadius = "0";

          const ulElements = clonedElement.querySelectorAll("ul");
          ulElements.forEach((ul) => {
            ul.style.listStylePosition = "inside";
          });
          const liElements = clonedElement.querySelectorAll("li");
          liElements.forEach((li) => {
            li.style.verticalAlign = "middle";
          });
        }
      },
    });

    // Initialize jsPDF with A4 dimensions (points)
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Define header, footer, and margins (in points)
    const headerHeight = 50;
    const footerHeight = 30;
    const sideMargin = 20;
    const verticalMargin = 10;
    const contentBottomMargin = 15; // extra space at bottom to avoid cutting text

    // Compute content top and usable height
    const contentTop = headerHeight + verticalMargin;
    const usablePdfHeight =
      pdfHeight -
      contentTop -
      (footerHeight + verticalMargin + contentBottomMargin);

    const usablePdfWidth = pdfWidth - sideMargin * 2;

    // Calculate scale factor: canvas pixels to PDF points
    const scaleFactor = usablePdfWidth / canvas.width;
    // rawPageSliceHeight in canvas pixels based on usable height in PDF points
    const rawPageSliceHeight = usablePdfHeight / scaleFactor;
    // sliceBuffer to avoid cutting through content
    const sliceBuffer = 10;
    const pageSliceHeight = rawPageSliceHeight - sliceBuffer;

    const totalPages = Math.ceil(canvas.height / rawPageSliceHeight);

    const headerFontSize = 12;
    const footerFontSize = 8;

    for (let page = 0; page < totalPages; page++) {
      // Create an offscreen canvas for the current page slice
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      const remainingHeight = canvas.height - page * rawPageSliceHeight;
      // On the last page, use the remaining height; otherwise, use the sliced height
      const currentSliceHeight =
        page < totalPages - 1 ? pageSliceHeight : remainingHeight;
      pageCanvas.height = currentSliceHeight;

      const ctx = pageCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          canvas,
          0,
          page * rawPageSliceHeight,
          canvas.width,
          currentSliceHeight,
          0,
          0,
          canvas.width,
          currentSliceHeight
        );
        const pageData = pageCanvas.toDataURL("image/png");

        if (page > 0) {
          pdf.addPage();
        }

        // --- Draw Header ---
        pdf.setFillColor(34, 197, 94); // Tailwind green-500
        pdf.rect(0, 0, pdfWidth, headerHeight, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(headerFontSize);
        pdf.setTextColor(255, 255, 255);
        pdf.text(
          "Papershapers: Your Personalized Mock Paper",
          pdfWidth / 2,
          headerHeight / 2 + headerFontSize / 2,
          { align: "center" }
        );

        // --- Draw Content ---
        pdf.setTextColor(0, 0, 0);
        pdf.addImage(
          pageData,
          "PNG",
          sideMargin,
          contentTop,
          usablePdfWidth,
          currentSliceHeight * scaleFactor
        );

        // --- Draw Footer ---
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(footerFontSize);
        pdf.setTextColor(100, 100, 100);
        const pageNumber = page + 1;
        pdf.text(
          `© 2025 Papershapers. All rights reserved. | Page ${pageNumber} of ${totalPages}`,
          pdfWidth / 2,
          pdfHeight - 10,
          { align: "center" }
        );
      }
    }

    pdf.save(semanticName);
    toast.success("PDF saved successfully.");
  } catch (err) {
    console.error("Error generating PDF:", err);
    toast.error("Failed to generate PDF");
  }
};
