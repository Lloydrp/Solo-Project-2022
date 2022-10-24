import { useEffect, useState } from "react";
import { PickerOverlay } from "filestack-react";
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
  // File_types are 0 for file links, 1 for images. 2 is default for all files
  const [currentResource, setCurrentResource] = useState(2);
  const [toggleModal, setToggleModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [uploadFile, setUploadFile] = useState({
    file_url: null,
    file_type: "image",
    description: "",
  });

  const resourceArray = organization.orgResources.filter(
    (item) =>
      (currentResource === 2 && item !== null) ||
      Number(item?.file_type) === Number(currentResource)
  );

  const basicOptions = {
    accept: ["image/*", "audio/*"], // support both image and audio uploads
    fromSources: ["local_file_system"],
    maxSize: 1024 * 1024,
    maxFiles: 1,
  };

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

  function onSubmit(event) {
    event.preventDefault();
    // this.props.dispatch({
    //    type: 'SEND_UPLOAD',
    //    payload: this.state // { file_type, file_url, description }
    // });
    setUploadFile({
      file_url: null,
      file_type: "image",
      description: "",
    });
  }

  function onSuccess(result) {
    console.log("Result from filestack success: ", result);
    setUploadFile({
      file_url: result.filesUploaded[0].url,
    });
  }

  function onError(error) {
    console.error("error", error);
  }

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
            <button onClick={handleAddResource}>Add File/Link</button>
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
              <li onClick={() => setCurrentResource(2)}>All</li>
              <li onClick={() => setCurrentResource(0)}>File Links</li>
              <li onClick={() => setCurrentResource(1)}>Images</li>
            </ul>
          </nav>
          <div>File Preview Section</div>
          {/* <>
            <form onSubmit={onSubmit}>
              <h2>Upload New File</h2>
              File to upload:
              <PickerOverlay
                apikey={process.env.REACT_APP_FILESTACK_API_KEY}
                buttonText="Upload Image"
                buttonClass="ui medium button gray"
                options={basicOptions}
                onSuccess={onSuccess}
                onError={onError}
              />
              <br />
              File Type:
              <select
                onChange={(e) =>
                  setUploadFile({ ...uploadFile, file_type: e.target.value })
                }
                value={uploadFile.file_type}
              >
                <option value="image">Image</option>
                <option value="audio">Audio</option>
              </select>
              {uploadFile.file_url && (
                <p>Uploaded Image URL: {uploadFile.file_url}</p>
              )}
              <br />
              Description:{" "}
              <input
                onChange={(e) =>
                  setUploadFile({ ...uploadFile, description: e.target.value })
                }
                value={uploadFile.description}
              />
              <div>
                <button type="submit">Submit Image</button>
              </div>
            </form>
          </> */}
        </div>
      </section>
    </main>
  );
}

export default ResourcePage;
