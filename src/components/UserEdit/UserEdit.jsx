function UserEdit({ orgid, setToggleEditUser }) {
  return (
    <>
      <div onClick={(event) => event.stopPropagation()}>
        <h2>User Edit Screen</h2>
        <button>Save</button>
        <button onClick={() => setToggleEditUser(false)}>Cancel</button>
      </div>
    </>
  );
}

export default UserEdit;
