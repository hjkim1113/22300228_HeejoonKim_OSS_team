import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({ uid: '', psword: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const change = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const check = (e) => {
    e.preventDefault();

    if(formData.uid === ''){
      alert('아이디를 입력해 주세요.');
      return;
    }

    if(formData.psword === ''){
      alert('비밀번호를 입력해 주세요.');
      return;
    }

    axios.get('https://672818a4270bd0b975544ed3.mockapi.io/users')
    .then((res) => {
      console.log(res.data);
      let checkInt = 0;
      for(let udata of res.data){
        if(udata.uid === formData.uid){
          if(udata.psword === formData.psword){
            login(udata);
            checkInt = 1;
            break;
          } else {
            checkInt = 2;
            break;
          }
        }
      }
      if(checkInt === 1){
        navigate('/');
      } else if(checkInt === 0) {
        alert('존재하지 않는 아이디 입니다.');
      } else {
        alert('틀린 비밀번호 입니다.');
      }
    })
    .catch((e) => {
      console.log(`데이터를 가져오는 중 에러가 발생했습니다 : ${e}`);
    });
  };

  return (
    <>
      <div className="container">
        <form>
          <div className="mb-3">
            <label className="form-label" htmlFor="uid">아이디</label>
            <input className="form-control" type="text" name="uid" id="uid" value={formData.uid} onChange={change} />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="psword">비밀번호</label>
            <input className="form-control" type="password" name="psword" id="psword" value={formData.psword} onChange={change} />
          </div>
          <button className="btn btn-outline-primary btn-sm" onClick={check}>
            로그인
          </button>
        </form>
      </div>
    </>
  );
}
