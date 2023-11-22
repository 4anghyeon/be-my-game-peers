import React from 'react';
import styled from 'styled-components';
import commonStyle from 'components/Common/Common.styled';
import fakeData from 'db/fakeData.json';
import avatar from 'assets/avatar.png';
import uuid from '../../node_modules/react-uuid/uuid';
import {useState, useEffect} from 'react';
import {getAuth} from 'firebase/auth';
import CenterContainer from 'components/Common/Common.styled';

const UserDetailPage = () => {
  const [userInfo, setUserInfo] = useState(fakeData);
  const [nickname, setNickName] = useState('');
  const [about, setAbout] = useState('');
  const [favoriteGame, setFavoriteGame] = useState('');

  const [isEdit, setIsEdit] = useState(false);

  const EDIT_NICKNAME = event => setNickName(event.target.value);
  const EDIT_ABOUT = event => setAbout(event.target.value);
  const EDIT_FAVORITE = event => setFavoriteGame(event.target.value);

  let NEW_USER_INFO = {};

  const EDIT_BUTTON = () => {
    setIsEdit(!isEdit);
    NEW_USER_INFO = {
      id: uuid(),
      nickname,
      about,
      favoriteGame,
    };

    console.log(NEW_USER_INFO);
    setUserInfo(userInfo => [NEW_USER_INFO, ...userInfo]);

    setNickName('');
    setAbout('');
    setFavoriteGame('');
  };

  useEffect(() => {
    console.log(getAuth().currentUser);
  }, []);

  const choosePhoto = () => {};

  return (
    <>
      <CenterContainer>
        <ScSelectImg>
          <ScProfileImg src={avatar} alt="프로필 이미지" />
          {isEdit ? <ScSelectPictureBtn>사진 선택</ScSelectPictureBtn> : null}
        </ScSelectImg>
        <ScInfoBox>
          {isEdit ? (
            <ScInput type="text" value={nickname} onChange={EDIT_NICKNAME} placeholder="닉네임" />
          ) : (
            <ScUserName>{userInfo[0].nickname}님</ScUserName>
          )}
        </ScInfoBox>
        <ScInfoBox>
          <ScLabel>About</ScLabel>
          {isEdit ? (
            <ScInput type="text" value={about} onChange={EDIT_ABOUT} placeholder="한줄 소개" />
          ) : (
            <ScAbout>{userInfo[0].about}</ScAbout>
          )}
        </ScInfoBox>
        <ScInfoBox>
          <ScLabel>Favorite Game</ScLabel>
          {isEdit ? (
            <ScInput type="text" value={favoriteGame} onChange={EDIT_FAVORITE} placeholder="좋아하는 게임" />
          ) : (
            <ScAbout>{userInfo[0].favoriteGame}</ScAbout>
          )}
        </ScInfoBox>
        <ScBtnBox>
          <ScButton onClick={EDIT_BUTTON}>{isEdit ? 'save' : 'edit'}</ScButton>
          <ScButton>내 게시물</ScButton>
        </ScBtnBox>
        <BtnBox>
          <button>Like</button>
          <button>Dislike</button>
        </BtnBox>
        <CommentBox>
          <h3>123님에게 후기를 보내주세요!</h3>
          <form>
            <input />
            <button>send</button>
          </form>
          <ul className="comment-list">
            <li></li>
          </ul>
        </CommentBox>
      </CenterContainer>
    </>
  );
};

const ScContainer = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  width: 1200px;
  align-items: center;
  margin: 20px auto;
  padding: 12px;
`;

const ScSelectImg = styled.div`
  width: 600px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 20px;
  padding: 12px 6px;
`;

const ScProfileImg = styled.img`
  width: 180px;
  height: 180px;
  border-radius: 50%;
`;

const ScSelectPictureBtn = styled.button`
  background-color: #7752fe;
  color: white;
  width: 100px;
  height: 36px;
  border-radius: 10px;
  border: none;
`;

const ScInfoBox = styled.div`
  width: 600px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  color: black;
  gap: 10px;
`;

const ScUserName = styled.h2`
  font-size: 2rem;
  font-weight: 700;
`;

const ScAbout = styled.p`
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  background-color: #eee;
  padding: 6px;
  border-radius: 10px;
  width: 600px;
  height: 36px;
`;

const ScLabel = styled.label`
  font-size: 0.9rem;
  color: #7752fe;
  font-weight: 700;
`;

const ScInput = styled.input`
  width: 600px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid #ddd;
  color: #333;
  padding: 4px;
`;

const ScBtnBox = styled.div`
  width: 600px;
  display: flex;
  margin: 0 auto;
  gap: 12px;
  margin-top: 20px;
  justify-content: flex-end;
`;

const ScButton = styled.button`
  background-color: white;
  font-weight: 600;
  color: black;
  width: 80px;
  height: 36px;
  border-radius: 10px;
  border: 2px solid #7752fe;

  &:hover {
    background-color: #7752fe;
    color: white;
  }
`;

const BtnBox = styled.div`
  width: 600px;
  display: flex;
  margin: 0 auto;
  gap: 12px;
  margin: 20px 0;
  justify-content: center;
`;

const CommentBox = styled.div`
  width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export default UserDetailPage;
