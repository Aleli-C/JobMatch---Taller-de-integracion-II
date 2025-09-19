import React from "react";

type SpinnerProps = {
  size?: number; // tamaño opcional
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 24 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: "4px solid #ccc",
        borderTop: "4px solid #1d4ed8", // color azul
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
  );
};
/* para el estilo
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
*/
