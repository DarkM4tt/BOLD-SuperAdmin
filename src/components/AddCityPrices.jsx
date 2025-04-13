import { useParams } from "react-router-dom";

const AddCityPrices = () => {
  const params = useParams();
  const { cityId } = params;
  return <div>AddCityPrices: {cityId}</div>;
};

export default AddCityPrices;
