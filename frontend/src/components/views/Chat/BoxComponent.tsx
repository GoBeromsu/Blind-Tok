import React from "react";
import "../style/BoxComponent.css";

const BoxComponent = ({onClick, label}) => {
  return (
    <div className="ll">
      <div className="box">
        <label for="thirty">{label}</label>
      </div>
      <div className="box">
        <label for="thirty">{label}</label>
      </div>
      <div className="box">
        <label for="thirty">{label}</label>
      </div>
      <div className="box">
        <label for="thirty">{label}</label>
      </div>
      <div className="box">
        <label for="thirty">{label}</label>
      </div>
    </div>
  );
};

export default BoxComponent;
