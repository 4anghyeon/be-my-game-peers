import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useLocation, useNavigate} from 'react-router-dom';
import {getAuth, signOut} from 'firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {changeAuth} from '../../redux/modules/userAuth';
import downArrow from '../../assets/img/down-arrow.svg';
import {Button} from '../Auth/Auth.styled';

const Header = () => {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const userAuth = useSelector(state => state.userAuth);
  const dispatch = useDispatch();
  const [showContextMenu, setShowContextMenu] = useState(false);

  useEffect(() => {
    // 현재 로그인 유저 정보 가져옴
    dispatch(changeAuth(getAuth().currentUser));
  }, []);

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
    alert('로그아웃 되었습니다.');
  };

  // 설정 버튼 클릭시
  const onClickProfileSetting = () => {
    navigate(`user/${userAuth.uid}`);
    setShowContextMenu(prev => false);
  };

  // 홈 버튼 클릭시
  const onClickHome = () => {
    navigate('/');
    setShowContextMenu(prev => false);
  };

  const onClickOpenContextMenu = () => {
    setShowContextMenu(prev => !prev);
  };

  return (
    <Container $pathname={pathname}>
      {pathname !== '/' ? <button onClick={onClickHome}>홈으로</button> : <div></div>}
      <div>
        {pathname !== '/signup' && pathname !== '/login' && (
          <>
            {userAuth ? (
              <ProfileContainer>
                <Profile onClick={onClickOpenContextMenu}></Profile>
                <img src={downArrow} alt="화살표" onClick={onClickOpenContextMenu} />
                {showContextMenu && (
                  <ProfileMenuContainer>
                    <ProfileMenuButton onClick={onClickProfileSetting}>설정</ProfileMenuButton>
                    <ProfileMenuButton onClick={onClickSignOut}>로그아웃</ProfileMenuButton>
                  </ProfileMenuContainer>
                )}
              </ProfileContainer>
            ) : (
              <>
                <button onClick={onClickSingUp}>회원가입</button>
                <button onClick={onClickLogin}>로그인</button>
              </>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 50px;
  border-bottom: ${({$pathname}) => ($pathname === '/signup' || $pathname === '/login' ? 0 : '1px solid lightgrey')};

  & button {
    cursor: pointer;
    margin-right: 10px;
    height: 40px;
    width: 80px;
    border: 0;
    background-color: #7752fe;
    color: white;
    border-radius: 5px;
    font-size: 1rem;
  }
`;

const ProfileContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  & img {
    width: 15px;
    margin-left: 5px;
  }

  & img:hover {
    transform: scale(1.2);
  }
`;

const Profile = styled.div`
  width: 40px;
  height: 40px;
  background-color: #8e8ffa;
  border-radius: 50%;
  border: 2px solid black;
`;

const ProfileMenuContainer = styled.div`
  position: absolute;
  width: 100px;
  top: 50px;
  right: 0;
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
`;

const ProfileMenuButton = styled(Button)`
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

export default Header;
