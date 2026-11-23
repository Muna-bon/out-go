import React from "react";
import runnerImg from "@/assets/outgo-runner.png";

interface LogoProps {
  variant?: "horizontal" | "stacked";
  size?: "sm" | "md" | "lg";
  lightText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "horizontal",
  size = "md",
  lightText = false,
  className = "",
}) => {
  const isStacked = variant === "stacked";

  // Size configurations
  const iconSizes = {
    sm: "h-7 w-auto",
    md: "h-8 sm:h-9 w-auto",
    lg: "h-12 sm:h-14 w-auto",
  };

  const textSizes = {
    sm: "text-lg tracking-tight font-black",
    md: "text-xl sm:text-2xl tracking-tight font-black",
    lg: "text-3xl sm:text-4xl tracking-tight font-black",
  };

  return (
    <div
      className={`inline-flex items-center select-none ${
        isStacked ? "flex-col gap-1.5 text-center" : "gap-2.5"
      } ${className}`}
    >
      <img
        src={runnerImg}
        alt="OutGo mark"
        className={`${iconSizes[size]} object-contain drop-shadow-sm transition-transform duration-200 hover:scale-105`}
      />
      <div className={`${textSizes[size]} font-sans leading-none flex items-center`}>
        <span
          className={
            lightText
              ? "text-white"
              : "text-[#0040A8] dark:text-white"
          }
        >
          Out
        </span>
        <span className="text-[#00A8FF]">Go</span>
      </div>
    </div>
  );
};

export default Logo;
