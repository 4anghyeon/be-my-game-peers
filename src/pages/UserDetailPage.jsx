import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {CenterVertical, Input} from 'components/Common/Common.styled';
import avatar from 'assets/avatar.png';
import {getAuth} from 'firebase/auth';
import {findUserByEmail, updateUser} from 'shared/firebase/query';
import {useLocation} from '../../node_modules/react-router-dom/dist/index';
import userAuth from 'redux/modules/userAuth';
import PeerContainer from '../components/UserDetail/PeerContainer';
import {useNavigate} from 'react-router-dom';
import uuid from '../../node_modules/react-uuid/uuid';
import Like from 'assets/like.png';
import DisLike from 'assets/disLike.png';
import alert from 'assets/alert(purple).png';
import {auth, storage} from 'shared/firebase/firebase';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';

const UserDetailPage = () => {
  const {pathname} = useLocation();
  const getUserInfo = getAuth().currentUser.email;
  const getUser = getAuth().currentUser;
  const email = pathname.replace('/user/', '');
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();
  // 닉네임, 한줄 소개, 좋아하는 게임 정보 변경시 사용될 state
  const [nickname, setNickName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [favoriteGame, setFavoriteGame] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  // 추천 / 비추천 버튼
  const [likeCount, setLikeCount] = useState(0);
  const [disLikeCount, setDisLikeCount] = useState(0);
  const [disableClick, setDisableClick] = useState(false);
  // 코멘트란
  const [comments, setComments] = useState([]);
  console.log(comments);
  const [content, setContent] = useState('');
  // 프로필 이미지 업로드
  const [profileImg, setProfileImg] = useState('');
  const [imgFile, setImgfile] = useState(null);
  console.log(imgFile);

  useEffect(() => {
    findUserByEmail(email).then(user => {
      if (user) {
        let photoURL = user.profileImg;
        console.log(photoURL); // <- undefined
        if (photoURL) {
          setProfileImg(photoURL);
        } else {
          setProfileImg(avatar);
        }
        setIntroduction(user.introduction);
        setFavoriteGame(user.favoriteGame);
        setNickName(user.nickname);
      } else {
        setProfileImg(avatar);
      }
    });
  }, [userAuth, pathname]);

  useEffect(() => {
    findUserByEmail(email).then(user => {
      if (user) {
        let like = likeCount;
        if (like) {
          setLikeCount(like);
        }
      }
    });
  }, [userAuth, pathname]);

  //firebase에 저장된 user 정보 가져오기
  useEffect(() => {
    if (getUserInfo === null) {
      console.log('로그인 해주세요');
    } else {
      findUserByEmail(email)
        .then(user => {
          setUserInfo(user);
        })
        .catch(err => {
          navigate('/nouser');
        });
    }
  }, [pathname]);

  const EDIT_NICKNAME = event => setNickName(event.target.value);
  const EDIT_INTRODUCTION = event => setIntroduction(event.target.value);
  const EDIT_FAVORITE = event => setFavoriteGame(event.target.value);

  // 프로필 수정 버튼
  const EDIT_BUTTON = async () => {
    setIsEdit(!isEdit);

    if (isEdit) {
      const newUserInfo = {
        nickname,
        introduction,
        favoriteGame,
        follower: userInfo.follower,
        following: userInfo.following,
        email: userInfo.email,
      };
      if (imgFile !== null) {
        const imageRef = ref(storage, `${auth.currentUser.uid}/${imgFile.name}`);
        await uploadBytes(imageRef, imgFile);

        newUserInfo.profileImg = await getDownloadURL(imageRef);
      }
      setUserInfo(newUserInfo);
      await updateUser(email, newUserInfo);
      setNickName('');
      setIntroduction('');
      setFavoriteGame('');
      setImgfile(null);
    }
  };

  const CLICK_LIKE = () => {
    if (!disableClick) {
      setDisableClick(true);
    }
  };
  const CLICK_DISLIKE = () => {
    if (!disableClick) {
      setDisLikeCount(disLikeCount + 1);
      setDisableClick(true);
    }
  };

  const writeContent = event => setContent(event.target.value);

  const sendComment = event => {
    event.preventDefault();
    const newComments = {
      id: userInfo.id,
      nickname: getUser.displayName,
      content,
    };

    setComments([...comments, newComments]);
    setContent('');
  };

  // 내 게시물 (필터)
  const checkMyPost = () => {
    navigate(`/myPost`);
  };

  // 이미지  업로드

  // 이미지 업로드 input의 onChange
  const handleChangeImage = event => {
    setImgfile(event.target.files[0]);
    const imgUrl = URL.createObjectURL(event.target.files[0]);
    setProfileImg(imgUrl);
  };

  return (
    <>
      {getUserInfo === null ? (
        <ScContainer>
          <img className="alert" src={alert} alt="경고 아이콘" />
          <h3>로그인 후 이용가능한 페이지 입니다.</h3>
        </ScContainer>
      ) : (
        <ScContainer>
          <ScHr>
            <div div className="wrapImage">
              <ScProfileImg>
                <img src={profileImg ?? `assets/avatar.png`} alt="프로필 이미지" />
                {isEdit ? (
                  <>
                    <label className="signup-profileImg-label" htmlFor="profileImg">
                      프로필 이미지 변경
                    </label>
                    <input
                      className="signup-profileImg-input"
                      type="file"
                      accept="image/*"
                      id="profileImg"
                      style={{display: 'none'}}
                      onChange={handleChangeImage}
                    />
                  </>
                ) : null}
              </ScProfileImg>
              <div>
                <div>
                  <ScNickname>{isEdit ? null : `${userInfo.nickname} 님`}</ScNickname>
                  <ScAbout>{isEdit ? null : `💜 ${userInfo.introduction}`}</ScAbout>
                  <ScAbout>{isEdit ? null : `💜 LIKE  ${userInfo.favoriteGame}`}</ScAbout>
                </div>
                <ScEditAndPost>
                  {getUserInfo === userInfo.email ? (
                    <div>
                      <ScEditButton onClick={EDIT_BUTTON}>{isEdit ? 'save' : 'edit'}</ScEditButton>
                      <ScEditButton onClick={checkMyPost}>내 게시물</ScEditButton>
                    </div>
                  ) : null}
                </ScEditAndPost>
              </div>
            </div>
            {isEdit ? null : <PeerContainer profileUser={userInfo} setUserInfo={setUserInfo} />}
            {isEdit ? (
              <>
                <div className="wrapInput">
                  <Label>Nickname</Label>
                  <Input type="text" value={nickname} onChange={EDIT_NICKNAME} placeholder="닉네임" />
                </div>
                <div className="wrapInput">
                  <Label>About</Label>
                  <Input type="text" value={introduction} onChange={EDIT_INTRODUCTION} placeholder="한줄 소개" />
                </div>
                <div className="wrapInput">
                  <Label>Favorite Game</Label>

                  <Input type="text" value={favoriteGame} onChange={EDIT_FAVORITE} placeholder="좋아하는 게임" />
                </div>
              </>
            ) : null}
          </ScHr>
          <ScCommentArea>
            <h3 style={{color: 'red'}}>{disLikeCount >= 50 ? '※ 경고 : 위험 유저입니다. ※' : null}</h3>
            <CommentBox>
              <ScUserComment>
                {userInfo.nickname ? userInfo.nickname : 'Guest'}님과의 게임 후기를 남겨주세요!!
              </ScUserComment>
              <ScForm onSubmit={sendComment}>
                <ScInput
                  type="text"
                  value={content}
                  onChange={writeContent}
                  placeholder="예쁜 언어를 사용해주세요❤️"
                  required
                />
                <ScButton type="submit">send</ScButton>
              </ScForm>
              <ScWrapList className="comment-list">
                {comments.length === 0 ? <h3>현재 작성된 후기가 없습니다.</h3> : null}
                {comments.map(comment => {
                  return (
                    <ScList key={uuid()} className="content">
                      <h3 className="ToYou">{comment.nickname}</h3>
                      <p className="comment-body">{comment.content}</p>
                    </ScList>
                  );
                })}
              </ScWrapList>
            </CommentBox>
            <ScBtnBox>
              <ScButton onClick={CLICK_LIKE}>
                <img src={Like} alt="추천" />
                <span>{likeCount}</span>
              </ScButton>
              <ScButton onClick={CLICK_DISLIKE}>
                <img src={DisLike} alt="비추천" />
                <span>{disLikeCount}</span>
              </ScButton>
            </ScBtnBox>
          </ScCommentArea>
        </ScContainer>
      )}
    </>
  );
};
const ScContainer = styled(CenterVertical)`
  height: 100%;
  margin-bottom: 50px;
  .alert {
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
  }
  h3 {
    font-size: 1.2rem;
    color: #333;
  }
`;

const ScHr = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > .wrapImage {
    width: 600px;
    height: 300px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  & > .wrapInput {
    width: 600px;
    margin: 36px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    color: black;
    gap: 10px;
  }
`;

const ScProfileImg = styled.div`
  margin: 10px;
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & > img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
  }

  .signup-profileImg-label {
    margin: 10px 0;
    font-weight: bold;
    font-size: 13px;
    color: #7752fe;
    display: inline-block;
    cursor: pointer;
  }
`;

const ScEditAndPost = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;

  div {
    display: flex;
    gap: 12px;
  }
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
  height: 25px;
  padding: 0;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #7752fe;
  font-weight: 700;
`;

const ScNickname = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 10px;
`;

const ScAbout = styled.p`
  font-size: 14px;
  color: #333;
  margin: 10px;
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
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background-color: #7752fe;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  width: 80px;
  height: 40px;
  padding: 6px;

  & > img {
    width: 25px;
    height: 25px;
  }
`;

const ScCommentArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  width: 100%;
`;

const ScUserComment = styled.h2`
  font-size: 1.2rem;
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

const ScWrapList = styled.ul`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  width: 700px;
  padding: 6px;
  gap: 12px;
`;

const ScList = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 600px;
  height: 40px;
  border-radius: 5px;
  gap: 12px;

  & > .ToYou {
    color: #333;
    font-size: 14px;
    font-weight: 500;
    width: 100px;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 4px;
  }

  & > .comment-body {
    text-align: left;
    width: 520px;
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    color: black;
    background-color: #eee;
    border-radius: 5px;
    padding: 6px;
  }

  & > button {
    border: none;
    background-color: #eee;
    color: #333;
    cursor: pointer;
    border-radius: 5px;
    width: 60px;
    height: 40px;
  }
`;

export default UserDetailPage;
