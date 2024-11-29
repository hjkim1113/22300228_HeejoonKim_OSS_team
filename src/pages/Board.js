import React, { useState, useEffect } from "react";
import Header from '../part/Header';
import Footer from '../part/Footer';
import axios from 'axios';

export default function Board() {
  const [borders, setBorders] = useState([]);

  useEffect(() => {
    const fetchBorders = async () => {
      try {
        const response = await axios.get('https://674734f838c8741641d5d9a2.mockapi.io/board');
        const data = response.data;
        console.log(data);
        setBorders(data);
      } catch (error) {
        console.error(`데이터를 가져오는 중 에러가 발생했습니다: ${error}`);
      }
    };

    fetchBorders();
  }, []);

  // 글자수 제한 함수
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div>
      <Header />
      <button>게시글 작성</button>
      <div style={{ margin: '50px' }}>
        {borders.map((item, index) => (
          <div key={index} className="mb-3" style={{ border: '1px solid #ccc', padding: '4px', borderRadius: '8px', color: 'black', backgroundColor: 'rgb(175, 175, 175)' }}>
            <h5>{item.title}</h5>
            <p>{truncateText(item.detail, 30)}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
