// 작성 형식 선택

import "../styles/WritingFormat.css";

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";

export default function WritingFormat() {
  const location = useLocation();
  const navigate = useNavigate();
  const [format, setFormat] = useState(0); // 사용자가 선택한 작성 형식을 저장할 상태 변수
  const token = sessionStorage.getItem("token");

  // 정했어요! 버튼 누르면 실행되는 함수
  const decisionBtnHandler = () => {
    if (!format) {
      alert("작성 형식을 선택해주세요!");
      return;
    }
    if (location.state.purpose === "rollingPaper") {
      if (format === 1) {
        navigate("/capsule/write/text", {
          state: {
            dear_name: location.state.dear_name,
            theme: location.state.theme,
            purpose: location.state.purpose,
            capsule_number: location.state.capsule_number,
            from_name: location.state.sender,
          },
        }); // 글 & 편지 작성 화면으로 넘어가기
      } else if (format === 2) {
        navigate("/capsule/write/voice", {
          state: {
            dear_name: location.state.dear_name,
            theme: location.state.theme,
            purpose: location.state.purpose,
            capsule_number: location.state.capsule_number,
            from_name: location.state.sender,
          },
        }); // 음성 편지 작성 화면으로 넘어가기
      }
    } else {
      axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}/pcapsule/create`,
          {
            userId: sessionStorage.getItem("userId"),
            pcapsule_name: location.state.pcapsule_name,
            open_date: location.state.open_date,
            dear_name: location.state.dear_name,
            theme: location.state.theme,
            content_type: format,
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            if (format === 1) {
              navigate("/capsule/write/text", {
                state: {
                  dear_name: location.state.dear_name,
                  theme: location.state.theme,
                  purpose: location.state.purpose,
                  capsule_number: response.data.result.capsule_number,
                },
              }); // 글 & 편지 작성 화면으로 넘어가기
            } else if (format === 2) {
              navigate("/capsule/write/voice", {
                state: {
                  dear_name: location.state.dear_name,
                  theme: location.state.theme,
                  purpose: location.state.purpose,
                  capsule_number: response.data.result.capsule_number,
                },
              }); // 음성 편지 작성 화면으로 넘어가기
            }
          }
        })
        .catch(function (error) {
          console.log(error);
          if (error.response.status === 400) {
            alert("잘못된 요청입니다.");
          } else {
            alert("오류가 발생했습니다.");
          }
        });
    }
  };

  return (
    <div className="format-select-page">
      <div className="container">
        <div className="division-line1">
          <hr className="line1" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 35 35"
            fill="none"
            className="pencil-icon"
          >
            <g clip-path="url(#clip0_4_4008)">
              <path
                d="M8.5357 0.493492L9.1447 2.36774C9.3343 2.93742 9.65416 3.45503 10.0789 3.87942C10.5036 4.30382 11.0214 4.6233 11.5912 4.81249L13.4672 5.42149L13.5057 5.43199C13.6503 5.48288 13.7755 5.57738 13.864 5.70245C13.9526 5.82752 14.0002 5.97699 14.0002 6.13024C14.0002 6.28349 13.9526 6.43297 13.864 6.55804C13.7755 6.68311 13.6503 6.77761 13.5057 6.82849L11.6297 7.43749C11.0597 7.62669 10.5416 7.94616 10.1167 8.37053C9.69167 8.79491 9.37147 9.31251 9.18145 9.88224L8.5742 11.7547C8.52331 11.8993 8.42882 12.0245 8.30375 12.1131C8.17868 12.2016 8.0292 12.2492 7.87595 12.2492C7.7227 12.2492 7.57323 12.2016 7.44816 12.1131C7.32309 12.0245 7.22859 11.8993 7.1777 11.7547L6.5687 9.88224C6.38057 9.3103 6.06115 8.79035 5.63602 8.364C5.21089 7.93765 4.69185 7.61676 4.12045 7.42699L2.24445 6.81799C2.09989 6.76711 1.97469 6.67261 1.88613 6.54754C1.79756 6.42247 1.75 6.27299 1.75 6.11974C1.75 5.96649 1.79756 5.81702 1.88613 5.69195C1.97469 5.56688 2.09989 5.47238 2.24445 5.42149L4.12045 4.81249C4.68334 4.61822 5.1937 4.29649 5.61171 3.87241C6.02973 3.44832 6.34407 2.93337 6.5302 2.36774L7.1392 0.495242C7.18972 0.350077 7.28417 0.224238 7.40945 0.135187C7.53473 0.0461363 7.68462 -0.00170898 7.83833 -0.00170898C7.99203 -0.00170898 8.14192 0.0461363 8.2672 0.135187C8.39248 0.224238 8.48693 0.350077 8.53745 0.495242L8.5357 0.493492ZM17.1194 14.3727L15.7789 13.9387C15.372 13.8031 15.0023 13.5745 14.6991 13.271C14.3959 12.9676 14.1677 12.5976 14.0325 12.1905L13.595 10.8535C13.5587 10.7501 13.4913 10.6606 13.4019 10.5972C13.3126 10.5338 13.2057 10.4998 13.0962 10.4998C12.9867 10.4998 12.8798 10.5338 12.7905 10.5972C12.7011 10.6606 12.6337 10.7501 12.5975 10.8535L12.1635 12.1905C12.0309 12.5951 11.8065 12.9635 11.5077 13.2668C11.209 13.5701 10.844 13.8001 10.4415 13.9387L9.1027 14.3727C8.99933 14.409 8.90977 14.4764 8.84641 14.5658C8.78305 14.6551 8.74902 14.762 8.74902 14.8715C8.74902 14.981 8.78305 15.0879 8.84641 15.1772C8.90977 15.2666 8.99933 15.334 9.1027 15.3702L10.4415 15.806C10.8496 15.9417 11.2204 16.1709 11.5243 16.4753C11.8281 16.7798 12.0566 17.1511 12.1915 17.5595L12.6255 18.8965C12.6617 18.9999 12.7291 19.0894 12.8185 19.1528C12.9078 19.2161 13.0147 19.2502 13.1242 19.2502C13.2337 19.2502 13.3406 19.2161 13.4299 19.1528C13.5193 19.0894 13.5867 18.9999 13.623 18.8965L14.0587 17.5595C14.1938 17.1521 14.4223 16.7819 14.7258 16.4783C15.0293 16.1748 15.3995 15.9464 15.8069 15.8112L17.1457 15.3772C17.2491 15.341 17.3386 15.2736 17.402 15.1842C17.4653 15.0949 17.4994 14.988 17.4994 14.8785C17.4994 14.769 17.4653 14.6621 17.402 14.5728C17.3386 14.4834 17.2491 14.416 17.1457 14.3797L17.1194 14.3727ZM13.1277 21C12.662 20.9996 12.2072 20.8594 11.8222 20.5975C11.4372 20.3175 11.1572 19.9482 10.9822 19.5107L10.5272 18.1072C10.4432 17.8797 10.2838 17.6876 10.0757 17.563L6.20295 21.4322C5.62986 22.0062 5.23224 22.7316 5.0567 23.5235L3.5202 30.436C3.48806 30.5798 3.49277 30.7294 3.5339 30.871C3.57502 31.0125 3.65122 31.1413 3.75542 31.2455C3.85963 31.3497 3.98847 31.4259 4.12999 31.4671C4.27151 31.5082 4.42113 31.5129 4.56495 31.4807L11.4355 29.953C12.2535 29.7709 13.0026 29.3593 13.595 28.7665L27.5617 14.8015L28.1497 15.3877C28.4778 15.7159 28.6621 16.161 28.6621 16.625C28.6621 17.089 28.4778 17.5341 28.1497 17.8622L26.5047 19.5072C26.3406 19.6715 26.2485 19.8943 26.2487 20.1265C26.2489 20.3587 26.3413 20.5813 26.5056 20.7454C26.6699 20.9094 26.8926 21.0015 27.1248 21.0014C27.357 21.0012 27.5796 20.9088 27.7437 20.7445L29.3869 19.0995C30.0431 18.4431 30.4117 17.5531 30.4117 16.625C30.4117 15.6969 30.0431 14.8068 29.3869 14.1505L28.799 13.5625L29.9715 12.39C30.929 11.4098 31.4616 10.0917 31.4536 8.72143C31.4456 7.35117 30.8978 6.0393 29.9288 5.07037C28.9599 4.10143 27.648 3.55356 26.2778 3.54558C24.9075 3.5376 23.5894 4.07016 22.6092 5.02774L15.7667 11.8702C15.8069 11.9402 15.8577 12.005 15.9207 12.061C16.0432 12.166 16.1657 12.2535 16.3232 12.306L17.6549 12.7435C18.1624 12.9185 18.5474 13.216 18.8274 13.6027C19.0899 13.9702 19.2492 14.4252 19.2492 14.917C19.2492 15.407 19.1092 15.8462 18.8292 16.233C18.5492 16.618 18.1642 16.898 17.7267 17.0555L16.3407 17.5105C16.1931 17.5579 16.0604 17.643 15.9557 17.7572C15.8507 17.8797 15.7632 18.0022 15.7107 18.1597L15.2732 19.4932C15.0982 19.9832 14.8182 20.3507 14.4332 20.6307C14.0482 20.9107 13.5967 20.9982 13.1277 21Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_4_4008">
                <rect width="35" height="35" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <hr className="line2" />
        </div>
        <p className="person-to-send">To. {location.state.dear_name}</p>
        <p className="select-message">작성할 형식을 선택하세요!</p>
        <div className="select-format">
          <div className="text-container">
            <div
              className={`text ${format === 1 ? "selected-format" : ""}`}
              onClick={() => setFormat(1)}
            >
              글 & 사진
            </div>
          </div>
          <div className="voice-container">
            <div
              className={`voice ${format === 2 ? "selected-format" : ""}`}
              onClick={() => setFormat(2)}
            >
              음성
            </div>
          </div>
        </div>
        <hr className="division-line2" />
        <div className="decision-btn-container">
          <button className="format-decision-btn" onClick={decisionBtnHandler}>
            정했어요!
          </button>
        </div>
      </div>
    </div>
  );
}
