import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useLocation, useNavigate} from 'react-router-dom';
import {getAuth, signOut} from 'firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {changeAuth} from '../../redux/modules/userAuth';

const Header = () => {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const userAuth = useSelector(state => state.userAuth);
  const dispatch = useDispatch();

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
    alert('로그아웃 되었습니다.');
  };

  useEffect(() => {
    // 현재 로그인 유저 정보 가져옴
    dispatch(changeAuth(getAuth().currentUser));
  }, []);

  return (
    <Container $pathname={pathname}>
      {pathname !== '/signup' && pathname !== '/login' && (
        <>
          {userAuth ? (
            <button onClick={onClickSignOut}>로그아웃</button>
          ) : (
            <>
              <button onClick={onClickSingUp}>회원가입</button>
              <button onClick={onClickLogin}>로그인</button>
            </>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
  height: 50px;
  border-bottom: ${({$pathname}) => ($pathname === '/signup' || $pathname === '/login' ? 0 : '1px solid lightgrey')};

  button {
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

export default Header;
