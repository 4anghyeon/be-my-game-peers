import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useLocation, useNavigate} from 'react-router-dom';
import {getAuth, signOut} from 'firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {changeAuth} from '../../../redux/modules/userAuth';
import downArrow from 'assets/img/down-arrow.svg';
import {Button} from '../../Common/Common.styled';
import {useAlert} from '../../../redux/modules/alert/alertHook';
import avatar from 'assets/avatar.png';
import logo from 'assets/img/logo.png';
import {getDatabase, ref, onValue, set} from 'firebase/database';
import {realTimeDb} from '../../../shared/firebase/firebase';
import bell from 'assets/img/bell.png';
import newBell from 'assets/img/new-bell.png';
import Message from './Message';

const Header = () => {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const userAuth = useSelector(state => state.userAuth);
  const dispatch = useDispatch();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showMessageList, setShowMessageList] = useState(false);
  const currentUser = getAuth().currentUser;
  let [profileImg, setProfileImg] = useState(avatar);

  const alert = useAlert();

  useEffect(() => {
    // 현재 로그인 유저 정보 가져옴
    dispatch(changeAuth(currentUser));

    if (currentUser) {
      let photoURL = currentUser.photoURL;
      if (photoURL) {
        setProfileImg(photoURL);
      }
    } else {
      setProfileImg(avatar);
    }
  }, [userAuth]);

  const onClickLogin = () => {
    navigate('/login');
  };

  // 회원 가입 버튼 클릭시
  const onClickSingUp = () => {
    navigate('/signup');
  };

  // 로그아웃 버튼 클릭시
  const onClickSignOut = async () => {
    await signOut(getAuth());
    dispatch(changeAuth(null));
    setShowContextMenu(prev => false);
    alert.twinkle('로그아웃 되었습니다.');
    navigate('/');
  };

  // 설정 버튼 클릭시
  const onClickProfileSetting = () => {
    navigate(`user/${userAuth.email}`);
    setShowContextMenu(prev => false);
  };

  // 홈 버튼 클릭시
  const onClickHome = () => {
    navigate('/');
    setShowContextMenu(false);
    setShowMessageList(false);
  };

  const onClickOpenContextMenu = () => {
    setShowContextMenu(prev => !prev);
    setShowMessageList(false);
  };

  const onClickOpenMessageList = () => {
    setShowMessageList(prev => !prev);
    setShowContextMenu(false);
  };

  return (
    <ScContainer $pathname={pathname}>
      <ScLogoContainer onClick={onClickHome}>
        <img src={logo} /> <h1>너 내 동료가 돼라</h1>
      </ScLogoContainer>
      <div>
        {pathname !== '/signup' && pathname !== '/login' && (
          <>
            {userAuth ? (
              <ScProfileContainer>
                <ScWelcomeMessage>
                  반갑습니다. <strong>{userAuth.displayName ? userAuth.displayName : 'Guest'}</strong> 님
                </ScWelcomeMessage>
                <Message
                  onClickOpenMessageList={onClickOpenMessageList}
                  setShowMessageList={setShowMessageList}
                  showMessageList={showMessageList}
                  currentUser={currentUser}
                />
                <ScProfile onClick={onClickOpenContextMenu} $img={profileImg}></ScProfile>
                <img src={downArrow} alt="화살표" onClick={onClickOpenContextMenu} />
                {showContextMenu && (
                  <ScProfileMenuContainer>
                    <ScProfileMenuButton onClick={onClickProfileSetting}>설정</ScProfileMenuButton>
                    <ScProfileMenuButton onClick={onClickSignOut}>로그아웃</ScProfileMenuButton>
                  </ScProfileMenuContainer>
                )}
              </ScProfileContainer>
            ) : (
              <>
                <button onClick={onClickSingUp}>회원가입</button>
                <button onClick={onClickLogin}>로그인</button>
              </>
            )}
          </>
        )}
      </div>
    </ScContainer>
  );
};

const ScContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 50px;
  border-bottom: ${({$pathname}) => ($pathname === '/signup' || $pathname === '/login' ? 0 : '1px solid lightgrey')};

  & button {
    cursor: pointer;
    margin-right: 10px;
    padding: 8px;
    width: fit-content;
    border: 0;
    background-color: #7752fe;
    color: white;
    border-radius: 5px;
    font-size: 0.9rem;
  }
`;

const ScProfileContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  & img {
    cursor: pointer;
    width: 15px;
    margin-left: 5px;
  }

  & img:hover {
    transform: scale(1.2);
  }
`;

const ScProfile = styled.div`
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 50%;
  border: 1px solid black;
  background-image: url(${({$img}) => $img});
  background-size: contain;
`;

const ScProfileMenuContainer = styled.div`
  position: absolute;
  width: 100px;
  top: 50px;
  right: 0;
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
`;

const ScProfileMenuButton = styled(Button)`
  width: 100% !important;
  background: transparent !important;
  color: black !important;
  &:hover {
    background: #c2d9ff !important;
  }
  &:not(:first-child) {
    margin-top: 10px;
  }
`;

const ScWelcomeMessage = styled.span`
  margin-right: 20px;
`;

const ScLogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  img {
    height: 40px;
    margin-left: 10px;
  }

  h1 {
    font-size: 1.3rem;
    margin-left: 10px;
  }

  transition: all 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

export default Header;
