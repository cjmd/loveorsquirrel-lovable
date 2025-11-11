// Generate PWA icon programmatically
export function createPNGFromIcon(size: number): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      ctx.fillStyle = '#C5D3DD';
      ctx.fillRect(0, 0, size, size);
      
      // Draw a simple heart + checkmark icon
      const centerX = size / 2;
      const centerY = size / 2;
      const scale = size / 100;
      
      // Heart shape
      ctx.fillStyle = '#ff6b6b';
      ctx.beginPath();
      ctx.moveTo(centerX, centerY + 10 * scale);
      ctx.bezierCurveTo(centerX, centerY - 5 * scale, centerX - 20 * scale, centerY - 15 * scale, centerX - 20 * scale, centerY);
      ctx.bezierCurveTo(centerX - 20 * scale, centerY + 10 * scale, centerX, centerY + 20 * scale, centerX, centerY + 30 * scale);
      ctx.bezierCurveTo(centerX, centerY + 20 * scale, centerX + 20 * scale, centerY + 10 * scale, centerX + 20 * scale, centerY);
      ctx.bezierCurveTo(centerX + 20 * scale, centerY - 15 * scale, centerX, centerY - 5 * scale, centerX, centerY + 10 * scale);
      ctx.fill();
      
      resolve(canvas.toDataURL('image/png'));
    } else {
      // Fallback: create a simple colored square
      ctx!.fillStyle = '#C5D3DD';
      ctx!.fillRect(0, 0, size, size);
      resolve(canvas.toDataURL('image/png'));
    }
  });
}
