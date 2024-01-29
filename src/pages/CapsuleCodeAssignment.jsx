import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import "../styles/CapsuleCodeAssignment.css";
import Copy from "../assets/Copy.png";

const CapsuleCodeAssignment = ({ initialNickname }) => {
  const [capsuleNumber, setCapsuleNumber] = useState("");
  const [copied, setCopied] = useState(false);
  const [nickname, setNickname] = useState(initialNickname || "");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    generateCapsuleNumber();
  }, [nickname]);

  const generateCapsuleNumber = () => {
    const randomNum = Math.floor(Math.random() * 1000);
    const paddedRandomNum = randomNum.toString().padStart(4, "0");
    const newCapsuleNumber = `${paddedRandomNum}|${nickname}`;
    setCapsuleNumber(newCapsuleNumber);
    setCopied(false);
  };

  const handleCopyClick = () => {
    console.log("카피 완료!");
    setCopied(true);
  };

  const handlePasswordChange = (e) => {
    console.log("비밀번호 입력:", e.target.value);
    setPassword(e.target.value);
  };

  const handleSavePassword = () => {
    // 비밀번호를 어디에 어떻게 저장할지 상의 후 추가
    console.log("비밀번호 저장 완료!");
    navigate("/");
    window.alert("타입캡슐이 성공적으로 생성되었습니다!");
  };

  return (
    <div>
      <div className="text">캡슐번호를 기억하세요!</div>
      <div className="box1"></div>
      <div className="copy">
        캡슐번호 |
        <CopyToClipboard text={capsuleNumber} onCopy={handleCopyClick}>
          <span style={{ cursor: "pointer" }}>{capsuleNumber}</span>
        </CopyToClipboard>
      </div>
      <div className="Copy">
        <img src={Copy} alt="복사하기" />
      </div>
      <div className="CopyText" onClick={() => handleCopyClick()}>
        복사
      </div>
      <div className="box2"></div>
      <div className="password-input">
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="비밀번호 (숫자 6자)"
        />
      </div>
      <div className="reading-box"></div>
      <div className="reading-text1">꼭 읽어보세요!</div>
      <div className="reading-text2">
        <ul>
          <li>
            비회원이실 경우 <b>캡슐번호 분실 시 찾으실 수 없습니다.</b>
          </li>
          <li>
            카카오톡으로 로그인 하셨을 경우 RE:memory 카카오톡 플러스친구를 통해
            캡슐번호를 전송해 드립니다!
          </li>
          <li>
            카카오톡으로 로그인 하셨을 경우 로그인 후 만든 타임캡슐 확인이
            가능합니다!
          </li>
          <li>
            비밀번호 추가 사용 설명멘트 (찾을 때 사용된다 이런식으로 어떻게
            쓰이는지)
          </li>
        </ul>
      </div>
      <button className="checked" onClick={handleSavePassword}>
        확인했어요!
      </button>
    </div>
  );
};

export default CapsuleCodeAssignment;
