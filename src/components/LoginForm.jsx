import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../store/authApi";
import { useAuth } from "../context/AuthProvider";
import LoadingAnimation from "./common/LoadingAnimation";
import { useSnackbar } from "../context/SnackbarProvider";

function LoginForm() {
  const [loginId, setLoginId] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const [dataError, setDataError] = useState("");
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const showSnackbar = useSnackbar();

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!loginId || !accessCode) {
      setDataError("Please enter login id and access code!");
      return;
    }
    try {
      const response = await login({
        email: loginId,
        password: accessCode,
      }).unwrap();
      if (response?.success) {
        setIsAuthenticated(true);
        navigate("/");
        showSnackbar(response?.message, "success");
      } else {
        throw new Error(response?.message);
      }
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[650px]">
      <div className="flex flex-col gap-2">
        <p className="font-redhat font-bold text-4xl">Login</p>
        <p className="font-sans font-normal text-xl text-[#5C5C5C]">
          Please login to continue
        </p>
      </div>
      <p className="text-fontBlack text-mxl font-semibold font-redhat">
        Please provide your details
      </p>
      <div className="flex flex-col gap-4">
        <TextField
          placeholder="Enter your login ID"
          variant="outlined"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
        />
        <TextField
          placeholder="Enter your access code"
          variant="outlined"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
        />
        {dataError && <p className="text-red-500 text-xs">{dataError}</p>}
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "black",
          fontWeight: 700,
          fontFamily: "Red Hat Display, sans-serif",
          textTransform: "none",
          color: "white",
          "&:hover": {
            backgroundColor: "black",
          },
          borderRadius: "10px",
          padding: "12px 0px",
        }}
        fullWidth
        onClick={handleContinue}
      >
        {isLoading ? (
          <LoadingAnimation height={30} width={30} />
        ) : (
          "Login to owner access"
        )}
      </Button>
      <p className="text-gray text-lg font-normal font-sans mt-2">
        This is the owner access login and hence it is having all the BOLD data.
        Any wrong scripted login is strictly prohibited.
      </p>
      <div className="flex gap-4">
        <button
          className="border-[2px] border-red-400 rounded text-lg text-red-400 w-fit px-4 py-1"
          onClick={() => {
            setLoginId("superadmin@gmail.com");
            setAccessCode("SuperAdmin@123");
          }}
        >
          Testing ? get demo email and password
        </button>
        <button
          className="border-[2px] border-green-400 rounded text-lg text-green-400 w-fit px-4 py-1"
          onClick={() => {
            setLoginId("");
            setAccessCode("");
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
