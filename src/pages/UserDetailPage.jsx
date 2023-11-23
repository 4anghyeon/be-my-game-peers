import React, {useEffect} from 'react';
import styled from 'styled-components';
import {CenterVertical, Input} from 'components/Common/Common.styled';
import avatar from 'assets/avatar.png';
import {useState} from 'react';
import {getAuth} from 'firebase/auth';
import {updateUser, findUserByEmail} from 'shared/firebase/query';
import {useLocation} from '../../node_modules/react-router-dom/dist/index';
import userAuth from 'redux/modules/userAuth';
import PeerContainer from '../components/UserDetail/PeerContainer';
import {useNavigate} from 'react-router-dom';

const UserDetailPage = () => {
  const {pathname} = useLocation();
  const getUserInfo = getAuth().currentUser;
  console.log(getUserInfo);
  const email = pathname.replace('/user/', '');

  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    findUserByEmail(email)
      .then(user => {
        setUserInfo(user);
      })
      .catch(err => {
        navigate('/nouser');
      });
  }, [pathname]);

  const [nickname, setNickName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [favoriteGame, setFavoriteGame] = useState('');

  let [profileImg, setProfileImg] = useState(avatar);

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

  useEffect(() => {
    if (getUserInfo) {
      let photoURL = getUserInfo.photoURL;
      if (photoURL) {
        setProfileImg(photoURL);
      }
    } else {
      setProfileImg(avatar);
    }
  }, [userAuth]);
  console.log(userInfo);

  const [likeCount, setLikeCount] = useState(0);
  const [disLikeCount, setDisLikeCount] = useState(0);

  const CLICK_LIKE = () => setLikeCount(likeCount + 1);
  const CLICK_DISLIKE = () => setDisLikeCount(disLikeCount + 1);

  const [comments, setComments] = useState('');

  const SEND_COMMENT = event => setComments(event.target.value);

  return (
    <>
      <CenterVertical>
        <ScHr>
          <ScSelectImg>
            <ScProfileImg>
              <img src={profileImg} alt="프로필 이미지" />
              {isEdit ? <ScUpload>upload</ScUpload> : null}
            </ScProfileImg>
            {isEdit ? null : <PeerContainer profileUser={userInfo} />}
          </ScSelectImg>
          <ScInfoBox>
            {isEdit ? (
              <Input type="text" value={nickname} onChange={EDIT_NICKNAME} placeholder="닉네임" />
            ) : (
              <ScUserName>{userInfo.nickname ? userInfo.nickname : 'Guest'}님</ScUserName>
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
          <ScEditAndPost>
            <ScEditButton onClick={EDIT_BUTTON}>{isEdit ? 'save' : 'edit'}</ScEditButton>
            <ScButton>내 게시물</ScButton>
          </ScEditAndPost>
        </ScHr>
        <ScCommentArea>
          <h3 style={{color: 'red'}}>{disLikeCount >= 50 ? '※ 경고 : 위험 유저입니다. ※' : null}</h3>
          <CommentBox>
            <ScUserComment>
              {userInfo.nickname ? userInfo.nickname : 'Guest'}님과의 게임 후기를 남겨주세요!!
            </ScUserComment>
            <ScForm>
              <ScInput type="text" value={comments} onChange={SEND_COMMENT} />
              <ScButton>send</ScButton>
            </ScForm>
            <ul className="comment-list">
              {comments.map(comment => {
                return (
                  <>
                    <li>{comment.nickname}</li>
                  </>
                );
              })}
            </ul>
          </CommentBox>
          <ScBtnBox>
            <ScButton onClick={CLICK_LIKE}>Like {likeCount}</ScButton>
            <ScButton onClick={CLICK_DISLIKE}>Dislike {disLikeCount}</ScButton>
          </ScBtnBox>
        </ScCommentArea>
      </CenterVertical>
    </>
  );
};

const ScSelectImg = styled.div`
  width: 600px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 6px;
`;

const ScProfileImg = styled.div`
  width: 300px;
  height: 150px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  & > img {
    width: 150px;
    border-radius: 50%;
  }
`;

const ScEditAndPost = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ScEditButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: #eee;
  color: #333;
  cursor: pointer;
  border-radius: 5px;
  width: 80px;
  height: 40px;
  padding: 0;
`;

const ScInfoBox = styled.div`
  width: 600px;
  margin: 36px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  color: black;
  gap: 10px;
`;

const ScHr = styled.div`
  margin-top: 120px;
  width: 630px;
  gap: 36px;
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
  width: 630px;
  height: 40px;
`;

const ScLabel = styled.label`
  font-size: 0.9rem;
  color: #7752fe;
  font-weight: 700;
`;

const ScBtnBox = styled.div`
  width: 600px;
  display: flex;
  gap: 12px;
  align-items: flex-end;
  justify-content: center;
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

const ScUpload = styled.button`
  border: none;
  background-color: #eee;
  color: #333;
  cursor: pointer;
  border-radius: 5px;
  width: 80px;
  height: 40px;
`;

const ScCommentArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  width: 100%;
`;

const ScUserComment = styled.h2`
  font-size: 1.3rem;
`;

const ScForm = styled.form`
  width: 700px;
  margin: 20px auto;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const ScInput = styled.input`
  width: 600px;
  padding: 15px;
  border: 1px solid lightgrey;
  border-radius: 5px;
`;

const CommentBox = styled.div`
  width: 1200px;
  margin: 30px auto;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export default UserDetailPage;
