import React from "react";
import {useForm, SubmitHandler} from "react-hook-form";
import {useGoogleLogin} from "@react-oauth/google";
import Login from "@views/Login/Login";

interface FormValues {
  email: string;
  password: string;
}

interface LoginPageProps {
  onSubmit: SubmitHandler<FormValues>;
}

const LoginPage: React.FC<LoginPageProps> = props => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm<FormValues>({mode: "onChange"});

  const handleFormSubmit: SubmitHandler<FormValues> = data => {
    props.onSubmit(data);
    console.log(getValues());
  };

  return (
    <>
      <div>
        SignIn
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="text"
              placeholder="test@example.com"
              {...register("email", {
                required: "이메일은 필수 입력입니다.",
                pattern: {
                  value: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
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
            {errors.password && <small role="alert">{errors.password.message}</small>}
          </div>
          <button type="submit">로그인</button>
          <Login />
        </form>
      </div>
    </>
  );
};

export default LoginPage;
