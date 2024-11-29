import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { authData, logout } = useContext(AuthContext);

  const LoginPage = () => {
    navigate('/login');
  };

  const JoinPage = () => {
    navigate('/join');
  };

  return (
    <>
      { 
        authData ? (
          <>
            <p>환영합니다, {authData.name}님!</p>
            <p>아이디: {authData.uid}</p>
            <button onClick={logout}>로그아웃</button>
          </>
        ) : (
          <>
            <button onClick={JoinPage}>회원가입</button>
            <button onClick={LoginPage}>로그인 하기</button>
          </>
        )
      }

      <div>nii</div>
    </>
  );
}
