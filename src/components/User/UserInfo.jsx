import React from 'react';
import styled from 'styled-components';

export default function UserInfo() {
  return (
    <Profile>
      <div className="select-img">
        <img />
        <SelectPictureBtn>사진 선택</SelectPictureBtn>
      </div>
      <div className="nickname">
        <input type="text" placeholder="닉네임" />
      </div>
      <div className="introduce">
        <input type="text" placeholder="한 줄 소개" />
      </div>
      <div className="favorite-game">
        <input type="text" placeholder="좋아하는 게임" />
      </div>
    </Profile>
  );
}

const Profile = styled.div`
  width: 100%;
  background-color: #190482;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const SelectPictureBtn = styled.button`
  background-color: #7752fe;
  color: white;
`;
