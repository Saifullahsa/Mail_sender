import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";

export default function MyIconExample() {
  return (
    <div className="flex items-center gap-2 text-xl text-white">
      <FontAwesomeIcon icon={faHouseChimney} bounce />
      <span className="font-medium text-white animate-pulse">
        Back
      </span>
    </div>
  );
}
