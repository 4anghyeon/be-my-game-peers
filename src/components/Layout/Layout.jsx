import React from 'react';
import Header from './Header';
import {Outlet} from 'react-router-dom';
import Footer from './Footer';
import styled from 'styled-components';

const Layout = () => {
  return (
    <ScMain>
      <Header />
      <ScContent>
        <Outlet />
      </ScContent>
      <Footer />
    </ScMain>
  );
};

const ScMain = styled.main`
  width: 100%;
  height: 100vh;
`;

const ScContent = styled.section``;

export default Layout;
