import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

export default function RefreshIcon() {
  const [spinning, setSpinning] = useState(false);

  const handleClick = () => {
    setSpinning(false); 
    setTimeout(() => {
      setSpinning(true); 
    }, 0); 
    setTimeout(() => {
      setSpinning(false); 
    }, 14000);
  };

  return (
    <button onClick={handleClick}>
      <FontAwesomeIcon
        icon={faRotateRight}
        spin={spinning}
        className="text-sm text-white bg-gray-500 hover:bg-blue-600 p-3 rounded-full transition-all duration-300"
      />
    </button>
  );
}
