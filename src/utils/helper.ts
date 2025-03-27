/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";

export const generateAnswerKeyPDF = (text: string): string => {
  const doc: any = new jsPDF();

  // Constants for layout and fonts
  const MARGIN = 15;
  const FOOTER_HEIGHT = 20;
  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
  const MAX_WIDTH = PAGE_WIDTH - 2 * MARGIN;

  const CONTENT_FONT_SIZE = 12;
  const HEADER_FONT_SIZE = 16;
  const LINE_HEIGHT = 8;
  const LINE_SPACING = 2;

  let yPos = MARGIN;

  // Render the header on the first page (or when a new page is added)
  const renderHeader = () => {
    if (doc.internal.getNumberOfPages() === 1) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(HEADER_FONT_SIZE);
      doc.text("Answer Key", PAGE_WIDTH / 2, MARGIN, { align: "center" });
      yPos = MARGIN + 12;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(CONTENT_FONT_SIZE);
    } else {
      yPos = MARGIN;
    }
  };

  // Render the footer on each page
  const renderFooter = (pageNumber: number, totalPages: number) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const footerText = "© 2025 Papershapers all rights reserved";
    doc.text(footerText, MARGIN, PAGE_HEIGHT - 10);
    const pageText = `Page ${pageNumber} of ${totalPages}`;
    doc.text(pageText, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 10, {
      align: "right",
    });
  };

  // Parse inline segments for bold formatting (text wrapped with **)
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
      segments.push({ text: match[1], bold: true });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) {
      segments.push({ text: line.substring(lastIndex), bold: false });
    }
    return segments;
  };

  // Process a line that may contain inline bold formatting and manually wrap words
  const processFormattedLine = (line: string) => {
    const segments = parseInlineSegments(line);
    const words: { text: string; bold: boolean }[] = [];

    segments.forEach((segment) => {
      segment.text.split(/(\s+)/).forEach((token) => {
        if (token.length > 0) {
          words.push({ text: token, bold: segment.bold });
        }
      });
    });

    let currentLineWords: { text: string; bold: boolean }[] = [];
    let currentLineWidth = 0;

    words.forEach((word) => {
      // Set font for measurement based on formatting
      doc.setFont("helvetica", word.bold ? "bold" : "normal");
      doc.setFontSize(CONTENT_FONT_SIZE);
      const wordWidth = doc.getTextWidth(word.text);
      const additionalWidth =
        currentLineWords.length > 0 ? doc.getTextWidth(" ") : 0;

      if (currentLineWidth + additionalWidth + wordWidth > MAX_WIDTH) {
        let xPos = MARGIN;
        currentLineWords.forEach((w) => {
          doc.setFont("helvetica", w.bold ? "bold" : "normal");
          doc.setFontSize(CONTENT_FONT_SIZE);
          doc.text(w.text, xPos, yPos);
          xPos += doc.getTextWidth(w.text);
        });
        yPos += LINE_HEIGHT + LINE_SPACING;
        if (yPos > PAGE_HEIGHT - MARGIN - FOOTER_HEIGHT) {
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

    // Render any remaining words on the current line
    if (currentLineWords.length > 0) {
      let xPos = MARGIN;
      currentLineWords.forEach((w) => {
        doc.setFont("helvetica", w.bold ? "bold" : "normal");
        doc.setFontSize(CONTENT_FONT_SIZE);
        doc.text(w.text, xPos, yPos);
        xPos += doc.getTextWidth(w.text);
      });
      yPos += LINE_HEIGHT + LINE_SPACING;
      if (yPos > PAGE_HEIGHT - MARGIN - FOOTER_HEIGHT) {
        doc.addPage();
        renderHeader();
      }
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(CONTENT_FONT_SIZE);
  };

  // Begin by rendering the header on the first page.
  renderHeader();

  // Clean up input text and split into individual lines.
  text = text.replace(/\uFFFD/g, "");
  const lines = text.split("\n");

  // Process each line, handling blank lines, inline formatting, or standard text wrapping.
  lines.forEach((line) => {
    const cleanedLine = line.trim().replace(/\s{2,}/g, " ");
    if (cleanedLine === "") {
      yPos += LINE_HEIGHT / 1.5; // extra spacing for blank lines
      return;
    }
    if (cleanedLine.includes("**")) {
      processFormattedLine(cleanedLine);
    } else {
      const splitText = doc.splitTextToSize(cleanedLine, MAX_WIDTH);
      if (
        yPos + splitText.length * (LINE_HEIGHT + LINE_SPACING) >
        PAGE_HEIGHT - MARGIN - FOOTER_HEIGHT
      ) {
        doc.addPage();
        renderHeader();
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(CONTENT_FONT_SIZE);
      doc.text(splitText, MARGIN, yPos);
      yPos += splitText.length * (LINE_HEIGHT + LINE_SPACING);
    }
  });

  // Render footers on all pages.
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    renderFooter(i, totalPages);
  }

  // Generate a blob URL for the PDF output.
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
    // Force a fixed desktop width (e.g., 1024px) to bypass mobile CSS media queries
    const canvas = await html2canvas(input, {
      scale: 2,
      scrollY: -window.scrollY,
      windowWidth: 1024, // force a desktop-like viewport width
      onclone: (clonedDoc) => {
        // Optionally, you can still inject your custom styles if needed
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

    const headerHeight = 50;
    const footerHeight = 30;
    const sideMargin = 20;
    const verticalMargin = 10;
    const contentTop = headerHeight + verticalMargin;
    const usablePdfWidth = pdfWidth - sideMargin * 2;
    const usablePdfHeight =
      pdfHeight - contentTop - (footerHeight + verticalMargin);

    const scaleFactor = usablePdfWidth / canvas.width;
    const rawPageSliceHeight = usablePdfHeight / scaleFactor;
    const sliceBuffer = 10;
    const pageSliceHeight = rawPageSliceHeight - sliceBuffer;
    const totalPages = Math.ceil(canvas.height / rawPageSliceHeight);

    const headerFontSize = 12;
    const footerFontSize = 8;

    for (let page = 0; page < totalPages; page++) {
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      const remainingHeight = canvas.height - page * rawPageSliceHeight;
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

        // Draw Header
        pdf.setFillColor(34, 197, 94);
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

        // Draw Content
        pdf.setTextColor(0, 0, 0);
        pdf.addImage(
          pageData,
          "PNG",
          sideMargin,
          contentTop,
          usablePdfWidth,
          currentSliceHeight * scaleFactor
        );

        // Draw Footer
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
