import { useParams } from "react-router-dom";

const PartnerInfo = () => {
  const params = useParams();
  return <div>PartnerInfo: {params.partnerId}</div>;
};

export default PartnerInfo;
