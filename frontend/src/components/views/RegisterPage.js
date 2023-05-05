import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {registerUser} from "../../actions/user_action";
import {useNavigate} from "react-router-dom";

function RegisterPage() {
  // redux의 dispatch
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  // handler 함수들
  const onEmailHandler = event => {
    setEmail(event.currentTarget.value);
  };

  const onNameHandler = event => {
    setName(event.currentTarget.value);
  };

  const onPasswordHandler = event => {
    setPassword(event.currentTarget.value);
  };

  const onConfirmPasswordHandler = event => {
    setConfirmPassword(event.currentTarget.value);
  };

  const onSubmitHandler = event => {
    // 태그의 기본 기능으로 리프레쉬 되는 것을 방지.
    event.preventDefault();

    if (Password !== ConfirmPassword) {
      return alert("비밀번호 확인이 일치하지 않습니다.");
    }

    let body = {
      email: Email,
      name: Name,
      password: Password,
    };

    // action을 dispatch해준다.
    dispatch(registerUser(body)).then(response => {
      if (response.payload.success) {
        navigate("/");
      } else {
        alert("회원가입에 실패했습니다.");
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
      <form style={{display: "flex", flexDirection: "column"}} onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>name</label>
        <input type="text" value={Name} onChange={onNameHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <label>Confirm Password</label>
        <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
        <br />
        <button type="submit">회원 가입</button>
      </form>
    </div>
  );
}

export default RegisterPage;
