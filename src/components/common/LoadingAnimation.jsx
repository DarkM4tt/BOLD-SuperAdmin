import PropTypes from "prop-types";
import Lottie from "react-lottie";
import animationData from "../../assets/loadingAnimation.json";

const LoadingAnimation = ({ height, width }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={height} width={width} />;
};

LoadingAnimation.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

export default LoadingAnimation;
