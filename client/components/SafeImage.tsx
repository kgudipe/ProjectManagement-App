"use client";

import Image, { type ImageProps } from "next/image";
import { ImageIcon, User } from "lucide-react";
import React, { useState } from "react";

type SafeImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  fallbackLabel?: string;
  variant?: "avatar" | "media";
};

const SafeImage = ({
  src,
  alt,
  fallbackLabel,
  variant = "media",
  className = "",
  ...props
}: SafeImageProps) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    const fallbackClassName = `${className} flex items-center justify-center bg-gray-100 text-gray-500 dark:bg-dark-tertiary dark:text-gray-300`;

    return (
      <div className={fallbackClassName} aria-label={alt} role="img">
        {variant === "avatar" ? (
          fallbackLabel ? (
            <span className="text-xs font-bold uppercase">
              {fallbackLabel.slice(0, 2)}
            </span>
          ) : (
            <User className="h-4 w-4" />
          )
        ) : (
          <ImageIcon className="h-8 w-8" />
        )}
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

export default SafeImage;
