import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function MyBarsIcon() {
  return (
    <FontAwesomeIcon
      icon={faBars}
      beat
      className="text-xl text-white"
    />
  );
}
