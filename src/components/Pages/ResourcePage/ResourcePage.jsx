import { useSelector } from "react-redux";

function ResourcePage() {
  const organization = useSelector((store) => store.organization);
  const user = useSelector((store) => store.user);
  console.log("organization :>> ", organization);
  console.log("user :>> ", user);

  return (
    <main>
      <h2>Resource Page</h2>
    </main>
  );
}

export default ResourcePage;
