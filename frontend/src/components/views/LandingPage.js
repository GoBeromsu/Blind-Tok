import React from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const onClickHandler = () => {
    axios.get("/api/users/logout").then(response => {
      if (response.data.success) {
        return navigate("/login");
      } else {
        return alert("로그아웃에 실패했습니다.");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}>
      <h2>LandingPage</h2>
      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  );
}

export default LandingPage;
