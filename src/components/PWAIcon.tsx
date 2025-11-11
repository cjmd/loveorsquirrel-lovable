// Import the actual squirrel heart icon from Figma
import iconImage from 'figma:asset/8ceae60399c0225f6a1d941767ee2ac71303fdb9.png';

// Generate PNG data URL from the imported icon at specified size
export function createPNGFromIcon(size: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Fill with background color
        ctx.fillStyle = '#C5D3DD'; // The light blue background from the icon
        ctx.fillRect(0, 0, size, size);
        
        // Draw the icon at full size (no padding)
        ctx.drawImage(img, 0, 0, size, size);
        
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load icon image'));
    };
    
    img.src = iconImage;
  });
}
