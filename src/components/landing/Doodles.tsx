import React from "react";

// Playful hand-drawn style doodles
export const DoodleHeart = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 60 60"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 52C30 52 8 38 8 22C8 14 14 8 22 8C26 8 30 11 30 11C30 11 34 8 38 8C46 8 52 14 52 22C52 38 30 52 30 52Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      style={{ strokeDasharray: "3 2" }}
    />
  </svg>
);

export const DoodleStar = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 50 50"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M25 5L30 20H45L33 30L38 45L25 35L12 45L17 30L5 20H20L25 5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const DoodleArrow = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 80 40"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 20C15 25 35 28 55 20C65 16 70 18 75 15"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M68 10L75 15L68 22"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const DoodleCircle = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 50 50"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="4 3"
      fill="none"
    />
  </svg>
);

export const DoodleSquiggle = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 30"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 15C15 5 25 25 35 15C45 5 55 25 65 15C75 5 85 25 95 15"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export const DoodleCheckmark = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 22L16 30L32 10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const DoodleSparkle = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 5V15M20 25V35M5 20H15M25 20H35M10 10L15 15M25 25L30 30M30 10L25 15M15 25L10 30"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);
