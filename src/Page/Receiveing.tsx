import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
 
 
export default function LoadingGear() {
  return (
  <div className="flex items-center justify-center gap-4">

    <FontAwesomeIcon icon={faGear} spin size="2x" className="text-blue-600" />
      <span className="text-3xl font-medium text-white animate-pulse text-blue-600">Receiveing...</span>
  
    </div>
    
  );
}