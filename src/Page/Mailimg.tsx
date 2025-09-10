import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const byPrefixAndName = {
  fas: {
    envelope: faEnvelope
  }
};

export default function Mailimg() {
  return <FontAwesomeIcon icon={byPrefixAndName.fas["envelope"]} beat />;
}
