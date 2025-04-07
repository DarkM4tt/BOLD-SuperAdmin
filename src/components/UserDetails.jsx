import { useParams } from "react-router-dom";

const UserDetails = () => {
  const params = useParams();
  return <div>UserDetails: {params.userId}</div>;
};

export default UserDetails;
