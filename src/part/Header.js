import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const { authData, logout } = useContext(AuthContext);

  const LoginPage = () => {
    navigate('/login');
  };

  const JoinPage = () => {
    navigate('/join');
  };

  const handleHome = () => {
    navigate('/');
};

  return (
    <>
      <div className="header">
        {
          authData ? (
            <>
              <button>{authData.name}님</button>
              <button onClick={logout}>로그아웃</button>
            </>
          ) : (
            <>
              <button onClick={JoinPage}>회원가입</button>
              <button onClick={LoginPage}>로그인</button>
            </>
          )
        }
      </div>
      <div className="header1">
        <h1 onClick={handleHome}>SCORETOWN</h1>
      </div>
    </>
  )
}
