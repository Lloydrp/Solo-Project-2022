import { useEffect, useState } from "react";
import { FloatingLabel, Form, ListGroup, Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import AddImageModal from "../../AddImageModal/AddImageModal";
import AddResourceModal from "../../AddResourceModal/AddResourceModal";
import NavbarComponent from "../../NavbarComponent/NavbarComponent";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

function ResourcePage() {
  // Setup redux variables
  const organization = useSelector((store) => store.organization);
  const dispatch = useDispatch();
  // Setup router variables
  const params = useParams();
  const history = useHistory();
  // Setup store variables
  const user = useSelector((store) => store.user);
  const userOrganization = user.organization_array?.find(
    (item) => item.organization_id === params.orgid
  );
  // Setup local state for toggles and inputs
  // File_types are 0 for file links, 1 for images. 2 is default for all files
  const [currentResource, setCurrentResource] = useState(2);
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleImageModal, setToggleImageModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filePreview, setFilePreview] = useState("");

  // Setup array of resource information
  const resourceArray = organization.orgResources.filter(
    (item) =>
      // Checks if "all" is selected (2) and item is not null OR
      //if the file_type (number) is the same as the selected filter
      (currentResource === 2 && item !== null) ||
      Number(item?.file_type) === Number(currentResource)
  );

  // Begin function to filter by search input
  function handleSearch(current, search) {
    // If search input has a value then return the array that matches
    if (search.length > 0) {
      return current.filter((resource) => resource.file_name.includes(search));
    } else {
      return current;
    }
  } // End handleSearch

  // Begin function to delete resource
  function handleDeleteResource(id) {
    // Dispatch to saga to delete resource based on ID
    dispatch({
      type: "DELETE_RESOURCE",
      payload: {
        organization_id: params.orgid,
        id: id,
      },
    });
  } // End handleDeleteResource

  // Begin function to handle file preview
  function handleFilePreview(event, item) {
    // Prevent movement on link click
    event.preventDefault();
    // Set current image to preview state
    setFilePreview({
      uri: item?.file_url,
      popover: (
        <Popover id="popover-description">
          <Popover.Header as="h4">Description</Popover.Header>
          <Popover.Body>{item?.file_description}</Popover.Body>
        </Popover>
      ),
    });
  }

  // Begin useEffect to verify user is a part of the current organization AND
  // fetch initial organization information
  useEffect(() => {
    if (
      !user.organization_array.some(
        (item) => item.organization_id === params.orgid
      )
    ) {
      history.replace("/choose");
    }

    dispatch({ type: "FETCH_ORGANIZATION", payload: { id: params.orgid } });
  }, []); // End useEffect

  return (
    <main className="os__resourcesizing bg-primary">
      {toggleModal && (
        <AddResourceModal
          orgid={params.orgid}
          setToggleModal={setToggleModal}
          shouldCloseOnOverlayClick={true}
          toggleModal={toggleModal}
        />
      )}
      {toggleImageModal && (
        <AddImageModal
          toggleImageModal={toggleImageModal}
          setToggleImageModal={setToggleImageModal}
          shouldCloseOnOverlayClick={true}
          orgid={params.orgid}
        />
      )}
      <NavbarComponent orgid={params.orgid} />
      <section className="bg-white w-100 d-flex justify-content-evenly">
        {userOrganization?.is_admin && (
          <>
            <button
              className="btn btn-sm btn-info col-5 m-2"
              onClick={() => setToggleModal(true)}
            >
              <i className="bi bi-card-text"></i> Add Link
            </button>
            <button
              className="btn btn-sm btn-info col-5 m-2"
              onClick={() => setToggleImageModal(true)}
            >
              <i className="bi bi-card-image"></i> Add Image
            </button>
          </>
        )}
      </section>
      <section className="d-flex flex-column">
        <div className="bg-white w-100 d-flex align-items-center justify-content-center mb-2">
          <FloatingLabel className="w-50" label="Search">
            <Form.Control
              className="my-1"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              type="text"
              placeholder="Search"
            />
          </FloatingLabel>
          <span className="mx-3">Show:</span>
          <Nav variant="pills" defaultActiveKey="all">
            <Nav.Item className="text-primary">
              <Nav.Link onClick={() => setCurrentResource(2)} eventKey="all">
                All
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => setCurrentResource(0)} eventKey="links">
                Links
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => setCurrentResource(1)} eventKey="images">
                Images
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        <div className="d-flex">
          <div className="os__filessizing col-4 ms-2">
            <ListGroup>
              {handleSearch(resourceArray, searchText).map(
                (resource, index) => (
                  <ListGroup.Item
                    className="d-flex justify-content-between"
                    key={index}
                  >
                    {resource?.file_type === 0 ? (
                      <div>
                        <i className="bi text-info bi-card-text"></i>{" "}
                        <a className="text-info" href={resource?.file_url}>
                          {resource?.file_name}
                        </a>
                      </div>
                    ) : (
                      <div>
                        <i className="bi text-info bi-card-image"></i>{" "}
                        <a
                          onClick={() => handleFilePreview(event, resource)}
                          className="text-info"
                          href=""
                        >
                          {resource?.file_name}
                        </a>
                      </div>
                    )}
                    {userOrganization?.is_admin && (
                      <i
                        onClick={() => handleDeleteResource(resource.id)}
                        className="text-danger bi bi-trash-fill"
                      ></i>
                    )}
                  </ListGroup.Item>
                )
              )}
            </ListGroup>
          </div>
          <div className="col">
            <div className="os__imagesizing d-flex align-items-center justify-content-center ms-2 me-2 border rounded bg-light">
              {filePreview ? (
                <OverlayTrigger
                  trigger="click"
                  placement="top"
                  overlay={filePreview.popover}
                >
                  <img
                    type="button"
                    className="w-100"
                    src={`${filePreview.uri}`}
                  />
                </OverlayTrigger>
              ) : (
                <p className="text-center">
                  Images will appear here when clicked
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ResourcePage;
