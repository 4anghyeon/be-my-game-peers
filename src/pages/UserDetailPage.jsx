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
import uuid from '../../node_modules/react-uuid/uuid';
import Like from 'assets/like.png';
import DisLike from 'assets/disLike.png';
import alert from 'assets/alert(purple).png';

const UserDetailPage = () => {
  const {pathname} = useLocation();
  const getUserInfo = getAuth().currentUser.email;
  console.log(getUserInfo);
  const email = pathname.replace('/user/', '');
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();

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

  // 닉네임, 한줄 소개, 좋아하는 게임 정보 변경시 사용될 state
  const [nickname, setNickName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [favoriteGame, setFavoriteGame] = useState('');

  let [profileImg, setProfileImg] = useState(avatar);

  const [isEdit, setIsEdit] = useState(false);

  const EDIT_NICKNAME = event => setNickName(event.target.value);
  const EDIT_INTRODUCTION = event => setIntroduction(event.target.value);
  const EDIT_FAVORITE = event => setFavoriteGame(event.target.value);

  let newUserInfo = {};

  // 프로필 수정 버튼
  const EDIT_BUTTON = async () => {
    setIsEdit(!isEdit);
    newUserInfo = {
      nickname,
      introduction,
      favoriteGame,
    };

    if (isEdit) {
      setUserInfo(prevInfo => {
        if (
          prevInfo.nickname === newUserInfo.nickname &&
          prevInfo.introduction === newUserInfo.introduction &&
          prevInfo.favoriteGame === newUserInfo.favoriteGame
        ) {
          console.log('값이 변경되지 않았습니다.');
        }
        console.log('값이 변경되었습니다.');
      });
      await updateUser(email, newUserInfo);
      setNickName('');
      setIntroduction('');
      setFavoriteGame('');
    }
  };

  useEffect(() => {
    findUserByEmail(email).then(user => {
      if (user) {
        let photoURL = user.profileImg;
        if (photoURL) {
          setProfileImg(photoURL);
        }
      } else {
        setProfileImg(avatar);
      }
    });
  }, [userAuth, pathname]);

  // 추천 / 비추천 버튼
  const [likeCount, setLikeCount] = useState(0);
  const [disLikeCount, setDisLikeCount] = useState(0);
  const [disableClick, setDisableClick] = useState(false);

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

  // 코멘트란
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');

  const writeContent = event => setContent(event.target.value);

  const sendComment = event => {
    event.preventDefault();
    const newComments = {
      id: userInfo.id,
      nickname: userInfo.nickname,
      content,
    };

    setComments([...comments, newComments]);
    setContent('');
  };

  // 내 게시물 (필터)
  const checkMyPost = () => {
    navigate(`/myPost`);
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
            <div className="wrapImage">
              <ScProfileImg>
                <img src={profileImg} alt="프로필 이미지" />
                {isEdit ? <ScUpload>upload</ScUpload> : null}
              </ScProfileImg>
              {isEdit ? null : <PeerContainer profileUser={userInfo} setUserInfo={setUserInfo} />}
            </div>
            <div className="wrapInput">
              {isEdit ? (
                <Input type="text" value={nickname} onChange={EDIT_NICKNAME} placeholder="닉네임" />
              ) : (
                <ScUserName>도대체 뭘까</ScUserName>
              )}
            </div>
            <div className="wrapInput">
              <Label>About</Label>
              {isEdit ? (
                <Input type="text" value={introduction} onChange={EDIT_INTRODUCTION} placeholder="한줄 소개" />
              ) : (
                <ScAbout>{userInfo.introduction}</ScAbout>
              )}
            </div>
            <div className="wrapInput">
              <Label>Favorite Game</Label>
              {isEdit ? (
                <Input type="text" value={favoriteGame} onChange={EDIT_FAVORITE} placeholder="좋아하는 게임" />
              ) : (
                <ScAbout>{userInfo.favoriteGame}</ScAbout>
              )}
            </div>
            <ScEditAndPost>
              {getUserInfo === userInfo.email ? (
                <div>
                  <ScEditButton onClick={EDIT_BUTTON}>{isEdit ? 'save' : 'edit'}</ScEditButton>
                  <ScButton onClick={checkMyPost}>내 게시물</ScButton>
                </div>
              ) : null}
            </ScEditAndPost>
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
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 0 6px;
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
  height: 40px;
  padding: 0;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #7752fe;
  font-weight: 700;
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
