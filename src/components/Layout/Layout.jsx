import React from 'react';
import Header from './Header/Header';
import {Outlet} from 'react-router-dom';
import Footer from './Footer';
import styled from 'styled-components';

const Layout = () => {
  return (
    <>
      <ScNoMobile>
        <ScContent>
          <h1>모바일 환경을 지원하지 않습니다.</h1>
          <h1>데스크탑으로 접속해 주세요.</h1>
        </ScContent>
      </ScNoMobile>
      <ScMain>
        <Header />
        <ScContent>
          <Outlet />
        </ScContent>
        <Footer />
      </ScMain>
    </>
  );
};

const ScMain = styled.main`
  @media screen and (max-width: 760px) {
    width: 100%;
    height: 100vh;
    display: none;
  }
`;

const ScNoMobile = styled.main`
  @media screen and (min-width: 760px) {
    width: 100%;
    height: 100vh;
    display: none;
  }
`;

const ScContent = styled.section`
  margin-top: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: calc(100vh - 50px);
`;

export default Layout;
