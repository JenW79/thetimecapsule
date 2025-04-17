import { useEffect } from "react";
import "./MouseSprinkles.css";

export default function MouseSprinkles() {
  useEffect(() => {
    const sparkleCount = 30;
    const sparkles = [];

    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "mouse-sparkle";
      sparkle.style.left = "0px";
      sparkle.style.top = "0px";
      sparkle.style.opacity = 0;
      document.body.appendChild(sparkle);
      sparkles.push(sparkle);
    }

    let current = 0;

    const moveHandler = (e) => {
      const sparkle = sparkles[current];
      sparkle.style.left = `${e.clientX + Math.random() * 10 - 5}px`;
      sparkle.style.top = `${e.clientY + Math.random() * 10 - 5}px`;
      sparkle.style.opacity = 1;
      sparkle.style.transform = `scale(${0.5 + Math.random()})`;

      // Force a reflow to retrigger animation
      sparkle.classList.remove("animate");
      void sparkle.offsetWidth; // trigger reflow
      sparkle.classList.add("animate");

      current = (current + 1) % sparkleCount;
    };

    window.addEventListener("mousemove", moveHandler);

    const timer = setTimeout(() => {
      window.removeEventListener("mousemove", moveHandler);
      sparkles.forEach((el) => el.remove());
    }, 6000); // sparkle trail lasts 6 seconds

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", moveHandler);
      sparkles.forEach((el) => el.remove());
    };
  }, []);

  return null;
}




