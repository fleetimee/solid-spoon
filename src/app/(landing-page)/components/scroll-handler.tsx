"use client";

import { useEffect } from "react";

export function ScrollHandler() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.substring(1); // Remove the '#'
      setTimeout(() => {
        // Timeout ensures the element is rendered before scrolling
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // Small delay might be needed
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return null; // This component doesn't render anything visible
}
