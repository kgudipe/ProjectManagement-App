import React from "react";

type GradientTextProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * reactbits-inspired GradientText (https://reactbits.dev): an animated
 * multi-stop gradient sweeps across the text. Gradient + animation defined in
 * globals.css (.text-animated-gradient).
 */
const GradientText = ({ children, className = "" }: GradientTextProps) => {
  return <span className={`text-animated-gradient ${className}`}>{children}</span>;
};

export default GradientText;
