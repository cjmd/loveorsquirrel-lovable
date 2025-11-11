// Generate PWA icon from the uploaded image
export function createPNGFromIcon(size: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw the image scaled to the canvas size
        ctx.drawImage(img, 0, 0, size, size);
        resolve(canvas.toDataURL('image/png'));
      } else {
        // Fallback: create a simple colored square
        ctx!.fillStyle = '#C5D3DD';
        ctx!.fillRect(0, 0, size, size);
        resolve(canvas.toDataURL('image/png'));
      }
    };
    
    img.onerror = () => {
      // Fallback if image fails to load
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#C5D3DD';
        ctx.fillRect(0, 0, size, size);
      }
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.src = '/pwa-icon.png';
  });
}
