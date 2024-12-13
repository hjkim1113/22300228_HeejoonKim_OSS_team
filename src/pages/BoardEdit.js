import React, { useState, useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../part/Header';
import Footer from '../part/Footer';
import { AuthContext } from '../AuthContext';
import "../css/BoardEdit.css";

export default function BoardEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);
  const boardInfo = location.state;
  
  // 초기값을 boardInfo.title, boardInfo.detail로 설정
  const [title, setTitle] = useState(boardInfo?.title || '');
  const [datail, setDetail] = useState(boardInfo?.detail || '');

  // 페이지 로드 시 로그인 여부 확인 및 boardInfo 확인
  useEffect(() => {
    if (!authData?.name) {
      alert('로그인 후 접근 가능합니다.');
      navigate('/board');
    }

    if (!boardInfo) {
      alert('데이터 선택 후 접근 가능합니다.');
      navigate('/board');
    } else {
      setTitle(boardInfo.title || '');
      setDetail(boardInfo.detail || '');
    }
  }, [authData, boardInfo, navigate]);

  const handleDatail = (e) => {
    setDetail(e.target.value);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = () => {
    if (!authData) {
      alert('로그인 후 댓글을 작성할 수 있습니다.');
      return;
    }

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!datail.trim()) {
      alert('상세 내용을 입력해주세요.');
      return;
    }

    const newBoard = {
      userName: authData.name,
      make_uid: authData.uid,
      title: title,
      detail: datail,
      createdAt: new Date().toISOString()
    };

    axios.put(`https://674734f838c8741641d5d9a2.mockapi.io/board/${boardInfo.id}`, newBoard)
      .then((res) => {
        navigate('/board');
      })
      .catch((err) => console.error('저장 실패:', err));
  };

  return (
    <div>
      <Header />
      <div className='div12'>
        <h2>게시글 편집</h2>

        <input
          className="title_input"
          type="text"
          value={title}
          onChange={handleTitle}
          placeholder="제목을 작성하세요."
          style={{ padding: '17px', width: 'calc(100% - 30px)', marginBottom: '10px', background: "rgb(10 10 66)", border: "none", borderRadius: "10px", color: "white", fontSize: '15px' }}
        />

        <textarea 
          value={datail} 
          onChange={handleDatail}
          placeholder="상세 내용을 작성하세요." 
          rows="25" 
          style={{ padding: '17px', width: 'calc(100% - 30px)', marginBottom: '10px', background: "rgb(10 10 66)", border: "none", borderRadius: "10px", color: "white" }} 
        />
        <button 
          onClick={handleSubmit}
          style={{ padding: '10px 20px', backgroundColor: 'rgb(0, 0, 177)', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          게시물 편집
        </button>
        
      </div>
      <Footer />
    </div>
  );
}