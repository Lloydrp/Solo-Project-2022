import { useEffect, useState } from "react";
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
  // File_types are 0 for file, 1 for links, and 2 for images. 3 is default for all files
  const [currentResource, setCurrentResource] = useState(0);

  const resourceArray = organization.orgResources.map((item, index) => {
    if (currentResource === 3 || item?.file_type === currentResource) {
      return <li key={index}>{item.file_name}</li>;
    }
  });

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
      <section className="org-container">
        <nav>
          <ul>
            {!resourceArray.includes(undefined)
              ? resourceArray
              : "No resources of that type"}
          </ul>
        </nav>
        <div className="org-sub-container">
          <nav>
            <ul className="org-nav">
              <li onClick={() => setCurrentResource(3)}>All</li>
              <li onClick={() => setCurrentResource(0)}>Files</li>
              <li onClick={() => setCurrentResource(1)}>Links</li>
              <li onClick={() => setCurrentResource(2)}>Images</li>
            </ul>
          </nav>
          <div>File Preview Section</div>
        </div>
      </section>
    </main>
  );
}

export default ResourcePage;
