import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

function ResourcePage() {
  const organization = useSelector((store) => store.organization);
  const user = useSelector((store) => store.user);
  const params = useParams();
  const history = useHistory();

  console.log("organization :>> ", organization);
  console.log("user :>> ", user);
  console.log("params :>> ", params);

  useEffect(() => {
    if (
      !user.organization_array.some(
        (item) => item.organization_id === params.orgid
      )
    ) {
      history.replace("/choose");
    }
  }, []);

  return (
    <main>
      <h2>Resource Page</h2>
    </main>
  );
}

export default ResourcePage;
