import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import "../css/Player.css";
import Header from '../part/Header';
import players from '../data/player';
import { AuthContext } from '../AuthContext';
import Footer from '../part/Footer';

export default function Player() {
  const location = useLocation();
  const player = location.state;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();
  const teamPlayers = players.filter(p => p.team === player.team);
  const [teamReviews, setTeamReviews] = useState([]);
  const playerReviews = teamReviews.filter((review) => review.playerId === player.id);

  const teamColors = {
    T1: "#e4002b",
    "Gen.G": "#aa8a00",
    HLE: "#ff6b01",
    DK: "#0ec7b5",
    KT: "#FF0A07",
    BNK: "#FFC900",
    KDF: "#e73312",
    NS: "#de2027",
    DRX: "#5a8dff",
    BRO: "#00492b",
  };

  const teamFlags = {
    T1: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/T1.svg",
    "Gen.G": "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/GenG.svg",
    HLE: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/HLE.svg",
    DK: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/DK.svg",
    KT: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/KT.png",
    BNK: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/BNK.svg",
    KDF: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/Freecs.svg",
    NS: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/RedForce.svg",
    DRX: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/DRX.svg",
    BRO: "https://st-image.s3.ap-northeast-2.amazonaws.com/Teams/BRION.svg",
  };

  const getLine = (line) => {
    try {
      return require(`../img/${line}.svg`);
    } catch (error) {
      return null;
    }
  };

  const handlePlayer = (player) => {
    navigate('/player', { state: player });
  };


  useEffect(() => {
    if (player && player.team) {
      const teamPlayerIds = teamPlayers.map((p) => p.id);
      axios.get('https://674bbcb571933a4e8855ef5f.mockapi.io/reviews')
        .then((res) => {
          const teamReviews = res.data.filter((r) => teamPlayerIds.includes(r.playerId));
          setReviews(teamReviews);
          const reviewsForTeam = res.data.filter((r) => teamPlayerIds.includes(r.playerId)); // 팀 전체 리뷰 필터링
          setTeamReviews(reviewsForTeam);
        })
        .catch((err) => console.error('리뷰 데이터 로드 실패:', err));
    }
  }, [player, teamPlayers]);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleReview = (e) => {
    setReview(e.target.value);
  };

  const handleSubmit = () => {
    if (!authData) {
      alert('로그인 후 평점을 작성할 수 있습니다.');
      return;
    }

    if (rating > 0 && review.trim()) {
      const newReview = {
        playerId: player.id,
        userName: authData.name,
        player: player.name,
        rating,
        review,
        createdAt: new Date().toISOString()
      };

      axios.post('https://674bbcb571933a4e8855ef5f.mockapi.io/reviews', newReview)
        .then((res) => {
          setReviews([...reviews, res.data]);
          setRating(0);
          setReview('');
        })
        .catch((err) => console.error('리뷰 저장 실패:', err));
    } else {
      alert('평점과 리뷰를 모두 입력해주세요.');
    }
  };

  const handleDelete = (reviewId) => {
    const review = reviews.find((r) => r.id === reviewId);

    if (review.userName !== authData.name) {
      alert('본인의 리뷰만 삭제할 수 있습니다.');
      return;
    }
    axios.delete(`https://674bbcb571933a4e8855ef5f.mockapi.io/reviews/${reviewId}`)
      .then(() => {
        setReviews(reviews.filter((r) => r.id !== reviewId));
      })
      .catch((err) => console.error('리뷰 삭제 실패:', err));
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const calculateRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  return (
    <div>
      <Header />
      <div className='div1'>
        <div style={{ borderBottom: `4px solid ${teamColors[player.team]}`, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 0", }} className='team-info'>
          <img src={teamFlags[player.team]} className='img1 h-6' />
          <h1 className='team-name'>{player.team}</h1>
        </div>
        <div className='wrap2'>
          <div>
            <div className="section2 section-info">
              <h1>정보</h1>
              <div className='player-info'>
                <img src={`https://st-image.s3.ap-northeast-2.amazonaws.com/Roaster/LCK/${player.img_path}`} className='img3' />
                <div>
                  <h1>{player.name}</h1>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={getLine(player.line)} className='img2' />
                    <h2 style={{ marginLeft: '10px', border: "none" }}>{player.line}</h2>
                    <h2 style={{ marginLeft: '10px', border: "none" }}>평점: {calculateRating(playerReviews)} ★</h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="section2 section-info">
              <h1>평점 모아보기</h1>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={require(`../img/Director.png`)} className='img2'></img>
                <h3 style={{ marginLeft: '10px', border: "none" }}>Team</h3>
                <img src={teamFlags[player.team]} className='img1' style={{ marginLeft: '100px', border: "none" }} />
                <h1 className='team-name'>{player.team}</h1>
              </div>
              {teamPlayers.map((teamPlayer) => {
                const playerReviews = reviews.filter((review) => review.playerId === teamPlayer.id);
                return(
                <div key={teamPlayer.id}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={require(`../img/${teamPlayer.line}.svg`)} className='img2'></img>
                    <h3 style={{ marginLeft: '20px', border: "none" }}>{teamPlayer.line}</h3>
                    <img onClick={() => handlePlayer(teamPlayer)} src={`https://st-image.s3.ap-northeast-2.amazonaws.com/Roaster/LCK/${teamPlayer.img_path}`} style={{ marginLeft: '100px', border: "none" }} className='img4' />
                    <h3 onClick={() => handlePlayer(teamPlayer)} style={{ marginLeft: '10px', border: "none" }}>{teamPlayer.name}</h3>
                    <h3 style={{ marginLeft: 'auto', border: "none" }}>평점: {calculateRating(playerReviews)} ★</h3>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          <div className="section2 section-info">
            <h2>평점 남기기</h2>
            <div style={{ display: 'flex', marginBottom: '10px' }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <span
                  key={value}
                  style={{ cursor: 'pointer', fontSize: '30px', color: value <= rating ? '#ffcc00' : '#ccc', }}
                  onClick={() => handleRating(value)} >
                  ★
                </span>
              ))}
            </div>
            <textarea value={review} onChange={handleReview} placeholder="한 줄 평가를 작성하세요." rows="4" style={{ width: '100%', marginBottom: '10px', background: "rgb(10 10 66)", border: "none", borderRadius: "10px", color: "white" }} />
            <button onClick={handleSubmit} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>
              제출
            </button>

            <div style={{ marginTop: '20px' }}>
              <h3>작성된 평점</h3>
              {reviews.filter((item) => item.playerId === player.id).length > 0 ? (
                reviews.filter((item) => item.playerId === player.id).map((item) => (
                  <div key={item.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <span key={value} style={{ fontSize: '20px', color: value <= item.rating ? '#ffcc00' : '#ccc' }}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p>{item.review}</p>
                    <small>작성자: {item.userName} {formatDate(item.createdAt)}</small>
                    {authData && item.userName === authData.name && (
                      <img className='img5' onClick={() => handleDelete(item.id)} src={require(`../img/images.png`)}></img>
                    )}
                  </div>
                ))
              ) : (
                <p>아직 작성된 평점이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}