import React from "react";

interface PhoneMockupProps {
  imageSrc: string;
  alt: string;
  className?: string;
}

const PhoneMockup = ({ imageSrc, alt, className = "" }: PhoneMockupProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* Phone frame */}
      <div className="relative bg-foreground/90 rounded-[2.5rem] p-2 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground/90 rounded-b-2xl z-10" />
        
        {/* Screen */}
        <div className="relative bg-background rounded-[2rem] overflow-hidden">
          <img
            src={imageSrc}
            alt={alt}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
