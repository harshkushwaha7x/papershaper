import { jsPDF } from "jspdf";

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

// export const markdownToHtml = (markdown: string): string => {
//   let html = markdown;
//   // Convert headers
//   html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>");
//   html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>");
//   html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>");
//   // Convert bold text
//   html = html.replace(/\*\*(.*?)\*\*/gm, "<strong>$1</strong>");
//   // Convert newlines to line breaks
//   html = html.replace(/\n/g, "<br/>");
//   return html;
// };
