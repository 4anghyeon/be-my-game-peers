import React, {useEffect} from 'react';
import styled from 'styled-components';
import {CenterVertical, Input} from 'components/Common/Common.styled';
import avatar from 'assets/avatar.png';
import uuid from '../../node_modules/react-uuid/uuid';
import {useState} from 'react';
import {getAuth} from 'firebase/auth';
import {updateUser, findUserByEmail} from 'shared/firebase/query';
import fakeData from 'db/fakeData.json';
import {useLocation} from '../../node_modules/react-router-dom/dist/index';

const UserDetailPage = () => {
  const {pathname} = useLocation();
  const getUserInfo = getAuth().currentUser;
  console.log(getUserInfo);
  const email = pathname.replace('/user/', '');

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    findUserByEmail(email).then(user => {
      setUserInfo(user);
    });
  }, []);

  const [nickname, setNickName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [favoriteGame, setFavoriteGame] = useState('');

  const [isEdit, setIsEdit] = useState(false);

  const EDIT_NICKNAME = event => setNickName(event.target.value);
  const EDIT_INTRODUCTION = event => setIntroduction(event.target.value);
  const EDIT_FAVORITE = event => setFavoriteGame(event.target.value);

  let NEW_USER_INFO = {};

  const EDIT_BUTTON = async () => {
    setIsEdit(!isEdit);
    NEW_USER_INFO = {
      nickname,
      introduction,
      favoriteGame,
    };

    if (isEdit) {
      setUserInfo(NEW_USER_INFO);
      await updateUser(email, NEW_USER_INFO);
      setNickName('');
      setIntroduction('');
      setFavoriteGame('');
    }
  };

  const choosePhoto = () => {};

  return (
    <>
      <CenterVertical>
        <ScSelectImg>
          <ScProfileImg src={avatar} alt="프로필 이미지" />
          {isEdit ? <ScButton>upload</ScButton> : null}
        </ScSelectImg>
        <ScInfoBox>
          {isEdit ? (
            <Input type="text" value={nickname} onChange={EDIT_NICKNAME} placeholder="닉네임" />
          ) : (
            <ScUserName>{getUserInfo.displayName}님</ScUserName>
          )}
        </ScInfoBox>
        <ScInfoBox>
          <ScLabel>About</ScLabel>
          {isEdit ? (
            <Input type="text" value={introduction} onChange={EDIT_INTRODUCTION} placeholder="한줄 소개" />
          ) : (
            <ScAbout>{userInfo.introduction}</ScAbout>
          )}
        </ScInfoBox>
        <ScInfoBox>
          <ScLabel>Favorite Game</ScLabel>
          {isEdit ? (
            <Input type="text" value={favoriteGame} onChange={EDIT_FAVORITE} placeholder="좋아하는 게임" />
          ) : (
            <ScAbout>{userInfo.favoriteGame}</ScAbout>
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
          <h3>{getUserInfo.displayName}님에게 후기를 보내 보세요!</h3>
          <form>
            <input />
            <button>send</button>
          </form>
          <ul className="comment-list">
            <li></li>
          </ul>
        </CommentBox>
      </CenterVertical>
    </>
  );
};

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

const ScBtnBox = styled.div`
  width: 600px;
  display: flex;
  margin: 0 auto;
  gap: 12px;
  margin-top: 20px;
  justify-content: flex-end;
`;

const ScButton = styled.button`
  border: none;
  background-color: #7752fe;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  width: 80px;
  height: 40px;
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
