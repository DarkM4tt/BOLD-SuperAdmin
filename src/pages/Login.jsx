import LoginImage from "../assets/LoginImage.png";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Section with Image */}
      <div className="md:w-1/2 w-full h-1/3 md:h-full relative">
        <img
          src={LoginImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 bg-black p-4 rounded-lg shadow-lg">
          <div className="bg-orange-500 text-white p-4 text-center rounded-md">
            Welcome
          </div>
        </div>
      </div>

      {/* Right Section with Login Form */}
      <div className="md:w-1/2 w-full flex justify-center items-center p-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
