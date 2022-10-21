function UserOrganizationEdit({ orgid, setToggleEditOrganization }) {
  return (
    <>
      <div onClick={(event) => event.stopPropagation()}>
        <h2>Organization Edit Screen</h2>
        <button onClick={() => setToggleEditOrganization(false)}>Cancel</button>
      </div>
    </>
  );
}

export default UserOrganizationEdit;
