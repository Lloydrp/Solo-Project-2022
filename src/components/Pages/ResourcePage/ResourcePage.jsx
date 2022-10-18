import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Nav from "../../Nav/Nav";

function ResourcePage() {
  const organization = useSelector((store) => store.organization);
  const user = useSelector((store) => store.user);
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  console.log("organization :>> ", organization);

  useEffect(() => {
    if (
      !user.organization_array.some(
        (item) => item.organization_id === params.orgid
      )
    ) {
      history.replace("/choose");
    }

    dispatch({ type: "FETCH_ORGANIZATION", payload: { id: params.orgid } });
  }, []);

  return (
    <main>
      <Nav orgid={params.orgid} />
    </main>
  );
}

export default ResourcePage;
