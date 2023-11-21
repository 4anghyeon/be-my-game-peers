import React from 'react';
import Header from './Header';
import {Outlet} from 'react-router-dom';
import Footer from './Footer';
import styled from 'styled-components';

const Layout = () => {
  return (
    <Main>
      <Header />
      <Content>
        <Outlet />
      </Content>
      <Footer />
    </Main>
  );
};

const Main = styled.main`
  width: 100vw;
  height: 100vh;
  background: black;
`;

const Content = styled.section`
  height: calc(100% - 100px); // 100% - (header(px) + footer(px))
`;

export default Layout;
