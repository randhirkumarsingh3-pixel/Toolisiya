import { toast } from 'sonner';

export const exportChartAsImage = (chartRef, fileName) => {
  try {
    const svgElement = chartRef.current?.querySelector('svg');
    if (!svgElement) {
      throw new Error("Chart SVG not found");
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const DOMURL = window.URL || window.webkitURL || window;
    const url = DOMURL.createObjectURL(svgBlob);

    img.onload = () => {
      // Scale for higher resolution
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
      a.href = pngUrl;
      a.click();
      
      DOMURL.revokeObjectURL(url);
      toast.success('Chart downloaded as image');
    };
    
    img.src = url;
  } catch (error) {
    console.error("Export error:", error);
    toast.error('Failed to export chart');
  }
};