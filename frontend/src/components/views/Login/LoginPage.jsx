import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";

const LoginPage = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ mode: "onChange" });

return (
  // handleSubmit안에 실제로 동작할 함수를 넣음
  <form onSubmit={ (e)=> {handleSubmit(props.onSubmit)
    console.log(getValues())
    e.preventDefault()
  }}>
    <div>
      <label htmlFor="email">이메일</label>
      <input
        id="email"
        type="text"
        placeholder="test@email.com"
        // input의 기본 config를 작성
        {...register("email", {
          required: "이메일은 필수 입력입니다.",
          pattern: {
            value:
              /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
            message: "이메일 형식에 맞지 않습니다.",
          },
        })}
      />
      {errors.email && <small role="alert">{errors.email.message}</small>}
    </div>
    <div className="form-control__items">
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          placeholder="*******"
          {...register("password", {
            required: "비밀번호는 필수 입력입니다.",
            minLength: {
              value: 7,
              message: "7자리 이상 비밀번호를 입력하세요.",
            },
          })}
        />
        {errors.password && (
          <small role="alert">{errors.password.message}</small>
        )}
      </div>
      <button type= "submit">로그인</button>
  </form>
  );
};
export default LoginPage;