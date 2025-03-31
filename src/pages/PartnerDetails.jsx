import { useParams } from "react-router-dom";

const PartnerDetails = () => {
  const params = useParams();
  return <div>Partner Detials: {params.partnerId}</div>;
};

export default PartnerDetails;
