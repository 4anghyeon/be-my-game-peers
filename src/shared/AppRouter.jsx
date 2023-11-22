import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import HomePage from '../pages/HomePage';
import SignUpPage from '../pages/SignUpPage';
import LoginPage from '../pages/LoginPage';
import UserDetailPage from '../pages/UserDetailPage';
import WritePage from '../pages/WritePage';
import DetailPage from '../pages/DetailPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFoundPage />}></Route>
        <Route path="/" element={<Layout />}>
          {/* 메인 */}
          <Route path="/" element={<HomePage />}></Route>
          {/* 회원 가입 */}
          <Route path="signup" element={<SignUpPage />}></Route>
          {/* 로그인 */}
          <Route path="login" element={<LoginPage />}></Route>
          {/* 사용자 정보 */}
          <Route path="user/:userid" element={<UserDetailPage />}></Route>
          {/* 게시글 */}
          <Route path="detail/:id" element={<DetailPage />}></Route>
          {/* 글쓰기 */}
          <Route path="write" element={<WritePage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
