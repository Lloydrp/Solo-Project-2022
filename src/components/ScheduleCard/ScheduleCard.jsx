import { useState } from "react";

import CardEdit from "../CardEdit/CardEdit";
import CardNonEdit from "../CardNonEdit/CardNonEdit";

function ScheduleCard({ eventItem, orgid }) {
  // Setup local states with defaults
  const [toggleEdit, setToggleEdit] = useState(false);

  // Begin edit mode
  if (toggleEdit) {
    return (
      <CardEdit
        orgid={orgid}
        eventItem={eventItem}
        setToggleEdit={setToggleEdit}
      />
    ); // End edit return
    // Begin non-edit mode
  } else {
    return (
      <CardNonEdit
        setToggleEdit={setToggleEdit}
        orgid={orgid}
        eventItem={eventItem}
      />
    );
  } // End non-edit return
} // End ScheduleCard

export default ScheduleCard;
