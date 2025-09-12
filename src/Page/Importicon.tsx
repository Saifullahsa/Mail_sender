import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImport } from "@fortawesome/free-solid-svg-icons";

export default function ImportIcon() {
  return (
    <div>
    <FontAwesomeIcon
      icon={faFileImport}
      beatFade    
      className="text-xl text-green-500"
    />
      <span className="text-xl pl-2 font-medium text-white animate-pulse">Import Excel File</span>
    </div>
  );
}
