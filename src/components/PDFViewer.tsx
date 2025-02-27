import React from "react";

interface PDFViewerProps {
  pdfUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => (
  <iframe
    src={`${pdfUrl}#toolbar=0`}
    className="w-full h-[500px] border rounded-lg"
    title="Answer Key PDF"
  ></iframe>
);

export default PDFViewer;
