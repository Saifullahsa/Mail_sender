import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function MyXIcon() {
  return (
    <FontAwesomeIcon
      icon={faXmark}
      bounce
      className="text-xl text-white"
    />
  );
}
