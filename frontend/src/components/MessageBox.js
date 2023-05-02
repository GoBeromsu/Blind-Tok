import React, {useState} from "react";

const MessageBox = () => {
  const [message, setMessage] = useState("");

  const handleMessageChange = e => {
    setMessage(e.target.value);
  };

  const clearMessage = () => {
    setMessage("");
  };

  return (
    <div className="messagebox">
      {/* <span>
        <label htmlFor="messgaebox">소개글</label>
        <input type="text" id="message" name="message" value={message} onChange={handleMessageChange} />
      </span>
      <button onClick={clearMessage}>지우기</button> */}
      <div>
        <h3>My Introduction</h3>
        {message ? <p>{message}</p> : <p>NULL</p>}
      </div>
    </div>
  );
};

export default MessageBox;
