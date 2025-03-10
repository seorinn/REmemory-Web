// 음성 편지 작성

import "../styles/Recording.css";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";
import fileIcon from "../assets/voice_file.png";

export default function Record() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stream, setStream] = useState();
  const [media, setMedia] = useState();
  const [onRec, setOnRec] = useState(true);
  const [source, setSource] = useState("");
  const [analyser, setAnalyser] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [playAudio, setPlayAudio] = useState();
  const [nowTheme, setNowTheme] = useState("1");
  const [nowPurpose, setNowPurpose] = useState("");
  const [capsule_number, setCapsule_number] = useState("");
  const location = useLocation();
  const receivedData = location.state;
  const dear_name = receivedData.dear_name;
  const navigate = useNavigate("");
  // const userId = sessionStorage.getItem("userId");

  //테마 정보
  useEffect(() => {
    setIsLoggedIn(false);
    setNowPurpose(receivedData.purpose);
    setNowTheme(receivedData.theme);
    setCapsule_number(receivedData.capsule_number);
  }, []);

  //파일 아이콘 누를시
  const attachAudio = () => {
    const fileInput = document.getElementById("audioFileInput");
    fileInput.click();
  };

  //오디오 파일 업로드
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setAudioUrl(file);
    setPlayAudio(null);
  };

  //사용자가 음성 녹음을 시작할 때
  const onRecAudio = () => {
    // setDisabled(true); //녹음 중 재생 버튼 비활성화

    //AudioContext 객체 생성
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    //오디오 분석기 생성
    const analyser = audioCtx.createScriptProcessor(0, 1, 1);
    setAnalyser(analyser);

    function makeSound(stream) {
      //마이크를 통해 발생한 오디오 스트림
      const source = audioCtx.createMediaStreamSource(stream);
      setSource(source);
      //오디오 스트림을 오디오 분석기와 연결
      source.connect(analyser);
      //오디오 분석기와 오디오 스피커 연결
      analyser.connect(audioCtx.destination);
    }

    //마이크 사용 권한 획득
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(); //녹음 시작
        setStream(stream); //현재 마이크 스트림 저장
        setMedia(mediaRecorder); //현재 녹음기 객체 저장
        makeSound(stream); //마이크 스트림을 사용하여 오디오 처리

        //녹음 시작시 onRec 상태 변경
        analyser.onaudioprocess = function (e) {
          setOnRec(false);
        };
      })
      .catch((error) => {
        alert("녹음 권한을 허용해주세요!");
      });
  };

  //사용자가 음성 녹음을 중지할 때
  const offRecAudio = () => {
    media.ondataavailable = function (e) {
      setAudioUrl(e.data);
      setOnRec(true);
      setPlayAudio(null);
    };

    //마이크 해제
    stream.getAudioTracks().forEach(function (track) {
      track.stop();
    });

    //녹음기 중지
    media.stop();

    analyser.disconnect();
    source.disconnect();
  };

  //재생 버튼
  const play = () => {
    if (playAudio) {
      if (playAudio.paused) {
        //오디오가 일시 정지된 상태=> 멈춘 지점부터 다시 재생
        playAudio.play();
      } else {
        //오디오가 재생 중인 상태=> 멈춤
        playAudio.pause();
      }
    } else {
      if (audioUrl) {
        const newAudio = new Audio(URL.createObjectURL(audioUrl));
        newAudio.loop = false;
        newAudio.volume = 1;
        // newAudio.onended = () => setDisabled(false);
        // setDisabled(true);
        newAudio.play();
        setPlayAudio(newAudio); //현재 재생 중인 오디오 업데이트
      } else {
        alert("실행 가능한 녹음 파일이 없습니다");
        // setDisabled(false);
      }
    }
  };

  //파일 변환, 전송
  const tempRecording = () => {
    window.alert("임시저장 되었습니다.");
  };

  //작성 완료 버튼
  const decisionBtnHandler = () => {
    const formData = new FormData();
    if (audioUrl) {
      if (window.confirm("작성을 끝낼까요? 이후 수정이 불가합니다.")) {
        if (playAudio && !playAudio.pause()) {
          playAudio.pause();
        }
        if (nowPurpose === "toMe" || nowPurpose === "toSomeone") {
          formData.append("capsule_number", capsule_number);
          formData.append("voice_pcapsule", audioUrl);
          axios
            .post(
              `${process.env.REACT_APP_API_BASE_URL}/pcapsule/create/voice`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((response) => {
              console.log("서버응답:", response);
              navigate("/capsule/assign-number", {
                state: { capsule_number: capsule_number },
              });
            })
            .catch((error) => {
              window.alert("오류:", error);
            });
        } else if (nowPurpose === "rollingPaper") {
          formData.append("voice_rcapsule", audioUrl);
          axios
            .post(
              `${process.env.REACT_APP_API_BASE_URL}/rcapsule/voice/${capsule_number}`,
              formData,
              {
                params: {
                  from_name: receivedData.from_name,
                  content_type: "2",
                },
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((response) => {
              console.log("서버응답:", response);
              navigate("/");
            })
            .catch((error) => {
              console.error("오류:", error);
            });
        }
      }
    } else {
      alert("음성편지를 작성해주세요");
    }
  };

  //재생바 보여주기
  useEffect(() => {
    const bold = document.querySelector(".bold");
    if (playAudio) {
      playAudio.addEventListener("timeupdate", () => {
        const currentTime = playAudio.currentTime;
        const duration = playAudio.duration;
        const percentage = (currentTime / duration) * 100;
        const boldWidth = (percentage * 10.5) / 100;
        bold.style.width = `${boldWidth}rem`;
      });
    }
  }, [playAudio]);

  return (
    <div className={`recording_page theme${nowTheme}`}>
      {isLoggedIn && (
        <button className="temp_save_button" onClick={tempRecording}>
          임시저장
        </button>
      )}
      <div className={`recording_box theme${nowTheme}`}>
        <div className="icon_container">
          <div className={`dear_capsule theme${nowTheme}`}>
            To. {dear_name}{" "}
          </div>
          <div className="mike" onClick={onRec ? onRecAudio : offRecAudio}>
            <img
              src={require(`../assets/Recording_icon${nowTheme}.png`)}
              alt="마이크 아이콘"
              style={{
                transition: "transform 0.8s ease",
                transform: onRec ? "scale(1)" : "scale(1.1)", //녹음 중 이미지 확대
              }}
            />
          </div>
          <img
            src={require(`../assets/play_btn${nowTheme}.png`)}
            alt="재생 아이콘"
            id="play_button"
            onClick={!onRec ? null : play}
          />
          <div className="play_bar">
            <div className={`light theme${nowTheme}`}></div>
            <div className={`bold theme${nowTheme}`}></div>
          </div>

          <div className="add_file">
            <img
              className="file_icon"
              src={fileIcon}
              alt="파일 아이콘"
              onClick={attachAudio}
            />
            <input
              type="file"
              id="audioFileInput"
              accept="audio/*"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            <span className="file_name">{audioUrl.name}</span>
          </div>
        </div>
      </div>
      <div
        className={`record_submit_button theme${nowTheme}`}
        onClick={decisionBtnHandler}
      >
        다했어요!
      </div>
    </div>
  );
}
