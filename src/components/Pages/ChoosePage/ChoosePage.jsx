import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./ChoosePage.css";

function ChoosePage() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const history = useHistory();

  function handleOrgSelect(orgid) {
    //Send GET for all info from organization or at least events
    dispatch({ type: "FETCH_ORGANIZATION", payload: { id: orgid } });
    history.push(`/resources/${orgid}`);
  }

  return (
    <main className="choose-page">
      <h2>Choose your organization</h2>
      <ul>
        {user.organization_array.map((item, index) => (
          <li
            key={index}
            onClick={() => handleOrgSelect(Number(item.organization_id))}
          >
            {item.organization_name}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default ChoosePage;
