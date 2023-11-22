import React, {useState} from 'react';
import styled from 'styled-components';
import fakeData from 'db/fakeData.json';
import avatar from 'assets/avatar.png';
import uuid from '../../../node_modules/react-uuid/uuid';

export default function UserInfo() {
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

  const choosePhoto = () => {};

  return (
    <>
      <Container>
        <SelectImg>
          <ProfileImg src={avatar} alt="프로필 이미지" />
          {isEdit ? <SelectPictureBtn>사진 선택</SelectPictureBtn> : null}
        </SelectImg>
        <InfoBox>
          {isEdit ? (
            <Input type="text" value={nickname} onChange={EDIT_NICKNAME} placeholder="닉네임" />
          ) : (
            <UserName>{userInfo[0].nickname}님</UserName>
          )}
        </InfoBox>
        <InfoBox>
          <Label>About</Label>
          {isEdit ? (
            <Input type="text" value={about} onChange={EDIT_ABOUT} placeholder="한줄 소개" />
          ) : (
            <About>{userInfo[0].about}</About>
          )}
        </InfoBox>
        <InfoBox>
          <Label>Favorite Game</Label>
          {isEdit ? (
            <Input type="text" value={favoriteGame} onChange={EDIT_FAVORITE} placeholder="좋아하는 게임" />
          ) : (
            <About>{userInfo[0].favoriteGame}</About>
          )}
        </InfoBox>
        <BtnBox>
          <Button onClick={EDIT_BUTTON}>{isEdit ? 'save' : 'edit'}</Button>
          <Button>내 게시물</Button>
        </BtnBox>
      </Container>
    </>
  );
}

const Container = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  width: 1200px;
  align-items: center;
  margin: 20px auto;
  padding: 12px;
`;

const SelectImg = styled.div`
  width: 600px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 20px;
  padding: 12px 6px;
`;

const ProfileImg = styled.img`
  width: 180px;
  height: 180px;
  border-radius: 50%;
`;

const SelectPictureBtn = styled.button`
  background-color: #7752fe;
  color: white;
  width: 100px;
  height: 36px;
  border-radius: 10px;
  border: none;
`;

const InfoBox = styled.div`
  width: 600px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  color: black;
  gap: 10px;
`;

const UserName = styled.h2`
  font-size: 2rem;
  font-weight: 700;
`;

const About = styled.p`
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

const Label = styled.label`
  font-size: 0.9rem;
  color: #7752fe;
  font-weight: 700;
`;

const Info = styled.p`
  color: black;
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  border: 1px solid #eee;
  background-color: white;
`;

const Input = styled.input`
  width: 600px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid #ddd;
  color: #333;
  padding: 4px;
`;

const BtnBox = styled.div`
  width: 600px;
  display: flex;
  margin: 0 auto;
  gap: 12px;
  margin-top: 20px;
  justify-content: flex-end;
`;

const Button = styled.button`
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
