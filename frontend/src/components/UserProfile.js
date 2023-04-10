import React, {useState, useEffect} from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  resize: vertical;
  min-height: 100px;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #aaa;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ddd;
  }
`;

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // 사용자 프로필 가져오기 (API 호출 등)
    const fetchProfile = async () => {
      // API 호출 결과를 사용하여 setProfile 업데이트
      setProfile({
        name: "홍길동",
        email: "hong.gildong@example.com",
        phone: "010-1234-5678",
        bio: "안녕하세요! 저는 홍길동입니다.",
      });
    };

    fetchProfile();
  }, []);

  const handleChange = e => {
    const {name, value} = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // 프로필 업데이트 또는 등록 API 호출
    console.log(profile);
    setIsEditing(false);
  };

  return (
    <Container>
      <Title>사용자 프로필</Title>
      <Form onSubmit={handleSubmit}>
        <Label>
          이름:
          <Input type="text" name="name" value={profile.name} onChange={handleChange} readOnly={!isEditing} />
        </Label>
        <Label>
          이메일:
          <Input type="email" name="email" value={profile.email} onChange={handleChange} readOnly={!isEditing} />
        </Label>
        <Label>
          전화번호:
          <Input type="tel" name="phone" value={profile.phone} onChange={handleChange} readOnly={!isEditing} />
        </Label>
        <Label>
          소개:
          <Textarea name="bio" value={profile.bio} onChange={handleChange} readOnly={!isEditing} />
        </Label>
        {isEditing ? (
          <Button type="submit">프로필 저장</Button>
        ) : (
          <Button type="button" onClick={() => setIsEditing(true)}>
            프로필 수정
          </Button>
        )}
      </Form>
    </Container>
  );
};

export default UserProfile;
