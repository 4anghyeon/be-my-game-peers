import React from 'react';
import styled from 'styled-components';
import image from 'assets/img/404.png';
import {useNavigate} from 'react-router-dom';
import CenterContainer, {Button} from '../components/Common/Common.styled';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const onClickHomeButton = () => {
    navigate('/');
  };

  return (
    <Container>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <Content />
      <HomeButton onClick={onClickHomeButton}>홈으로</HomeButton>
    </Container>
  );
};

const Container = styled(CenterContainer)`
  flex-direction: column;

  h1 {
    font-size: 2rem;
    font-weight: bold;
  }
`;

const Content = styled.section`
  width: 50vw;
  height: 80vh;
  background-image: url(${() => image});
  background-size: cover;
`;

const HomeButton = styled(Button)`
  margin-top: 20px;
  width: 80px;
  height: 40px;
`;

export default NotFoundPage;
