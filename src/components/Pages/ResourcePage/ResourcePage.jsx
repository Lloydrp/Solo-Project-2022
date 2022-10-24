import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import AddResourceModal from "../../AddResourceModal/AddResourceModal";
import Nav from "../../Nav/Nav";

function ResourcePage() {
  const organization = useSelector((store) => store.organization);
  const params = useParams();
  const user = useSelector((store) => store.user);
  const userOrganization = user.organization_array?.find(
    (item) => item.organization_id === params.orgid
  );
  const history = useHistory();
  const dispatch = useDispatch();
  // File_types are 0 for file, 1 for links, and 2 for images. 3 is default for all files
  const [currentResource, setCurrentResource] = useState(3);
  const [toggleModal, setToggleModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const resourceArray = organization.orgResources.filter(
    (item) =>
      (currentResource === 3 && item !== null) ||
      Number(item?.file_type) === Number(currentResource)
  );

  function handleAddResource() {
    setToggleModal(true);
  }

  function handleSearch(current, search) {
    if (search.length > 0) {
      return current.filter((resource) => resource.file_name.includes(search));
    } else {
      return current;
    }
  }

  function handleDeleteResource(id) {
    dispatch({
      type: "DELETE_RESOURCE",
      payload: {
        organization_id: params.orgid,
        id: id,
      },
    });
  }

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
      {toggleModal && (
        <AddResourceModal
          orgid={params.orgid}
          setToggleModal={setToggleModal}
          shouldCloseOnOverlayClick={true}
        />
      )}
      <Nav orgid={params.orgid} />
      <section className="org-container">
        <nav>
          {userOrganization.is_admin && (
            <button onClick={handleAddResource}>Add Resource</button>
          )}

          <br />
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            type="text"
            placeholder="Search"
          />
          <button onClick={handleSearch}>Search</button>
          <ul>
            {handleSearch(resourceArray, searchText).map((item, index) => (
              <li key={index}>
                {item?.file_name}{" "}
                <button onClick={() => handleDeleteResource(item.id)}>
                  Delete
                </button>
              </li>
            ))}
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
