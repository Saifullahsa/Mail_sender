import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

interface Props {
  spinning?: boolean;
}

export default function RefreshIcon({ spinning = false }: Props) {
  return (
    <FontAwesomeIcon
      icon={faRotateRight}
      spin={spinning}
      className="text-sm text-white bg-gray-500 hover:bg-blue-600 p-3 rounded-full transition-all duration-300"
    />
  );
}
