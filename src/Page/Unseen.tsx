import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopesBulk } from "@fortawesome/free-solid-svg-icons";

export default function BulkMailIcon() {
  return (
    <div>
    <FontAwesomeIcon icon={faEnvelopesBulk} className="text-3xl text-blue-500" />
          <span className="text-3xl  font-medium text-white"> Unseen Email</span>
   </div>
  );
}
