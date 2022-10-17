import { useSelector } from "react-redux";
import "./ChoosePage.css";

function ChoosePage() {
  const user = useSelector((store) => store.user);

  function handleOrgSelect(orgid) {
    //Send GET for all info from organization or at least events
  }

  return (
    <main className="choose-page">
      <h2>Choose your organization</h2>
      <ul>
        {user.organization_array.map((item) => (
          <li onClick={() => handleOrgSelect(Number(item.organization_id))}>
            {item.organization_name}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default ChoosePage;
