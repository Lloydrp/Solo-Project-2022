import { useState } from "react";
import { PickerInline } from "filestack-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function AddImageModal({ toggleImageModal, setToggleImageModal, orgid }) {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [uploadFile, setUploadFile] = useState({
    file_url: null,
    file_name: "",
    description: "",
  });

  const basicOptions = {
    accept: ["image/*", "audio/*"], // support both image and audio uploads
    fromSources: ["local_file_system"],
    maxSize: 1024 * 1024,
    maxFiles: 1,
  };

  function handleAddImage(event) {
    event.preventDefault();

    dispatch({
      type: "ADD_RESOURCE",
      payload: {
        file_name: uploadFile.file_name,
        file_url: uploadFile.file_url,
        type_id: 1,
        organization_id: orgid,
        user_id: user.id,
        file_description: uploadFile.description,
      },
    });

    setUploadFile({
      file_url: null,
      file_name: "",
      description: "",
    });

    setToggleImageModal(false);
  }

  function onSuccess(result) {
    console.log("Result from filestack success: ", result);
    setUploadFile({ ...uploadFile, file_url: result.filesUploaded[0].url });
  }

  function onError(error) {
    console.error("error", error);
  }

  return (
    <Modal show={toggleImageModal} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Add Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="addImage" onSubmit={handleAddImage}>
          <Form.Group>
            <PickerInline
              apikey={process.env.REACT_APP_FILESTACK_API_KEY}
              options={basicOptions}
              onSuccess={onSuccess}
              onError={onError}
            />
            <Form.Label>File Name:</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) =>
                setUploadFile({ ...uploadFile, file_name: e.target.value })
              }
              value={uploadFile.file_type}
              autoComplete="off"
            />
            {uploadFile.file_url && (
              <p className="mt-3">Uploaded Image URL: {uploadFile.file_url}</p>
            )}
            <Form.Label>Description:</Form.Label>
            <Form.Control
              onChange={(e) =>
                setUploadFile({ ...uploadFile, description: e.target.value })
              }
              value={uploadFile.description}
              autoComplete="off"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="addImage" variant="primary">
          Add Image
        </Button>
        <Button
          type="button"
          onClick={() => setToggleImageModal(false)}
          variant="secondary"
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddImageModal;
