import React from "react";

type AuroraProps = {
  className?: string;
};

/**
 * reactbits-inspired Aurora background (https://reactbits.dev).
 * Dependency-free CSS implementation: three blurred gradient blobs drift and
 * scale on independent loops to create a soft, living aurora. Styling +
 * keyframes live in globals.css (.aurora / .aurora__blob).
 */
const Aurora = ({ className = "" }: AuroraProps) => {
  return (
    <div className={`aurora ${className}`} aria-hidden="true">
      <span className="aurora__blob aurora__blob--1" />
      <span className="aurora__blob aurora__blob--2" />
      <span className="aurora__blob aurora__blob--3" />
    </div>
  );
};

export default Aurora;
