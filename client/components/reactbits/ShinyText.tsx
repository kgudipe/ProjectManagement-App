import React from "react";

type ShinyTextProps = {
  text: string;
  className?: string;
};

/**
 * reactbits-inspired ShinyText (https://reactbits.dev): a light highlight
 * sweeps across muted text. Animation defined in globals.css (.shiny-text).
 */
const ShinyText = ({ text, className = "" }: ShinyTextProps) => {
  return <span className={`shiny-text ${className}`}>{text}</span>;
};

export default ShinyText;
