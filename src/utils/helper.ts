import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";

export const generateAnswerKeyPDF = (text: string): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = new jsPDF();
  const margin = 15;
  const footerHeight = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // Define font sizes and spacing
  const contentFontSize = 12;
  const headerFontSize = 16;
  const lineHeight = 8;
  const lineSpacing = 2;

  // Render header only on page 1.
  const renderHeader = () => {
    if (doc.internal.getNumberOfPages() === 1) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(headerFontSize);
      const headerText = "Answer Key";
      // Center the header on the page.
      doc.text(headerText, pageWidth / 2, margin, { align: "center" });
      yPos = margin + 12;
      // Reset to normal font settings for content.
      doc.setFont("helvetica", "normal");
      doc.setFontSize(contentFontSize);
    } else {
      // For pages beyond the first, simply reset yPos.
      yPos = margin;
    }
  };

  // Render header on the first page.
  renderHeader();

  // Helper: Parse inline segments for bold formatting.
  // If text is enclosed in **, mark it as bold.
  const parseInlineSegments = (line: string) => {
    const segments: { text: string; bold: boolean }[] = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          text: line.substring(lastIndex, match.index),
          bold: false,
        });
      }
      segments.push({
        text: match[1],
        bold: true,
      });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) {
      segments.push({
        text: line.substring(lastIndex),
        bold: false,
      });
    }
    return segments;
  };

  // Process a line with inline bold formatting and manual word wrapping.
  const processFormattedLine = (line: string) => {
    const segments = parseInlineSegments(line);
    // Break segments into individual word tokens (preserving spaces)
    const words: { text: string; bold: boolean }[] = [];
    segments.forEach((segment) => {
      const tokens = segment.text.split(/(\s+)/);
      tokens.forEach((token) => {
        if (token.length > 0) {
          words.push({ text: token, bold: segment.bold });
        }
      });
    });

    let currentLineWords: { text: string; bold: boolean }[] = [];
    let currentLineWidth = 0;

    words.forEach((word) => {
      // Set the font style for measurement.
      doc.setFont("helvetica", word.bold ? "bold" : "normal");
      doc.setFontSize(contentFontSize);
      const wordWidth = doc.getTextWidth(word.text);
      const additionalWidth =
        currentLineWords.length > 0 ? doc.getTextWidth(" ") : 0;

      if (currentLineWidth + additionalWidth + wordWidth > maxWidth) {
        // Render the current line.
        let xPos = margin;
        currentLineWords.forEach((w) => {
          doc.setFont("helvetica", w.bold ? "bold" : "normal");
          doc.setFontSize(contentFontSize);
          doc.text(w.text, xPos, yPos);
          xPos += doc.getTextWidth(w.text);
        });
        yPos += lineHeight + lineSpacing;
        if (yPos > pageHeight - margin - footerHeight) {
          doc.addPage();
          renderHeader();
        }
        currentLineWords = [];
        currentLineWidth = 0;
      }
      if (currentLineWords.length > 0) {
        currentLineWords.push({ text: " ", bold: false });
        currentLineWidth += doc.getTextWidth(" ");
      }
      currentLineWords.push(word);
      currentLineWidth += wordWidth;
    });

    // Render any remaining words on the current line.
    if (currentLineWords.length > 0) {
      let xPos = margin;
      currentLineWords.forEach((w) => {
        doc.setFont("helvetica", w.bold ? "bold" : "normal");
        doc.setFontSize(contentFontSize);
        doc.text(w.text, xPos, yPos);
        xPos += doc.getTextWidth(w.text);
      });
      yPos += lineHeight + lineSpacing;
      if (yPos > pageHeight - margin - footerHeight) {
        doc.addPage();
        renderHeader();
      }
    }
    // Reset font settings.
    doc.setFont("helvetica", "normal");
    doc.setFontSize(contentFontSize);
  };

  // Clean and process the input text.
  text = text.replace(/\uFFFD/g, "");
  const lines = text.split("\n");

  lines.forEach((line) => {
    const cleanedLine = line.trim().replace(/\s{2,}/g, " ");
    if (cleanedLine === "") {
      yPos += lineHeight / 1.5; // extra spacing for blank lines
      return;
    }
    if (cleanedLine.includes("**")) {
      processFormattedLine(cleanedLine);
    } else {
      const splitText = doc.splitTextToSize(cleanedLine, maxWidth);
      if (
        yPos + splitText.length * (lineHeight + lineSpacing) >
        pageHeight - margin - footerHeight
      ) {
        doc.addPage();
        renderHeader();
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(contentFontSize);
      doc.text(splitText, margin, yPos);
      yPos += splitText.length * (lineHeight + lineSpacing);
    }
  });

  // Add a footer on each page with reserved bottom margin.
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const footerText = "© 2025 Papershapers all rights reserved";
    doc.text(footerText, margin, pageHeight - 10);
    const pageText = `Page ${i} of ${pageCount}`;
    doc.text(pageText, pageWidth - margin, pageHeight - 10, {
      align: "right",
    });
  }

  const pdfBlob = doc.output("blob");
  const pdfBlobUrl = URL.createObjectURL(pdfBlob);
  return pdfBlobUrl;
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
    // Capture the full content as a canvas
    const canvas = await html2canvas(input, {
      scale: 2,
      scrollY: -window.scrollY,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.overflow = "visible";
          clonedElement.style.maxHeight = "none";
        }
      },
    });

    // Initialize jsPDF for A4 dimensions (points)
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Define header and footer sizes (in points)
    const headerHeight = 50;
    const footerHeight = 30;
    const usablePageHeight = pdfHeight - headerHeight - footerHeight;

    // Calculate scaling factor from canvas pixels to PDF points
    const scaleFactor = pdfWidth / canvas.width;
    // Determine the height (in canvas pixels) of one page slice
    const pageSliceHeight = usablePageHeight / scaleFactor;
    // Calculate total number of pages required
    const totalPages = Math.ceil(canvas.height / pageSliceHeight);

    for (let page = 0; page < totalPages; page++) {
      // Create an offscreen canvas for this page slice
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      // Ensure we don't exceed the remaining canvas height on the last page
      pageCanvas.height = Math.min(
        pageSliceHeight,
        canvas.height - page * pageSliceHeight
      );
      const ctx = pageCanvas.getContext("2d");
      if (ctx) {
        // Extract the slice of the canvas for this page
        ctx.drawImage(
          canvas,
          0,
          page * pageSliceHeight,
          canvas.width,
          pageCanvas.height,
          0,
          0,
          canvas.width,
          pageCanvas.height
        );
        // Convert the page slice to an image
        const pageData = pageCanvas.toDataURL("image/png");
        // Add a new page for pages after the first one
        if (page > 0) {
          pdf.addPage();
        }

        // --- Draw Header ---
        pdf.setFillColor(34, 197, 94); // Tailwind green-500
        pdf.rect(0, 0, pdfWidth, headerHeight, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.setTextColor(255, 255, 255);
        pdf.text(
          "Papershapers: Your Personalized Mock Paper",
          pdfWidth / 2,
          headerHeight / 2 + 6,
          { align: "center" }
        );

        // --- Draw Content ---
        pdf.setTextColor(0, 0, 0);
        pdf.addImage(
          pageData,
          "PNG",
          0,
          headerHeight,
          pdfWidth,
          pageCanvas.height * scaleFactor
        );

        // --- Draw Footer ---
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
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
