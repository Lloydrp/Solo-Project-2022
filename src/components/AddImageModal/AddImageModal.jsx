import { useState } from "react";
import { PickerOverlay, PickerInline } from "filestack-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function AddImageModal({ setToggleImageModal, orgid }) {
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
    <div
      className="modal-background"
      onClick={() => setToggleImageModal(false)}
    >
      <div
        className="modal-wrapper"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Add Image</h2>
        </div>
        <div className="modal-body">
          <form onSubmit={handleAddImage}>
            <PickerInline
              apikey={process.env.REACT_APP_FILESTACK_API_KEY}
              buttonText="Upload Image"
              buttonClass="ui medium button gray"
              options={basicOptions}
              onSuccess={onSuccess}
              onError={onError}
            />
            <br />
            File Name:
            <input
              type="text"
              onChange={(e) =>
                setUploadFile({ ...uploadFile, file_name: e.target.value })
              }
              value={uploadFile.file_type}
            />
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
        </div>
        <div className="modal-footer"></div>
      </div>
    </div>
  );
}

export default AddImageModal;
