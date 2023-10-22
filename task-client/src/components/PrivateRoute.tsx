import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = (props: any) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUserToken = async () => {
      const userToken = await localStorage.getItem("token");
      if (!userToken || userToken === "undefined") {
        setIsLoggedIn(false);
        return navigate("/");
      }
      setIsLoggedIn(true);
    };

    checkUserToken();
  }, [isLoggedIn]);
  return <React.Fragment>{isLoggedIn ? props.children : null}</React.Fragment>;
};
export default ProtectedRoute;
