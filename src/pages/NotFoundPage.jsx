import React from 'react';
import styled from 'styled-components';
import image from 'assets/img/notFound.jpeg';
import {Button} from '../components/Auth/Auth.styled';
import {Link, useNavigate} from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const onClickHomeButton = () => {
    navigate('/')
  }

  return (
    <Container>
      <Content />
      <p>페이지를 찾을 수 없습니다.</p>
      <HomeButton onClick={onClickHomeButton}>홈으로</HomeButton>
    </Container>
  );
};


const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: #FCF7DA;
  
  p {
    margin-top: 25px;
  }
`

const Content = styled.section`
  width: 50vw;
  height: 80vh;
  background-image: url(${() => image});
  background-size: cover;
`

const HomeButton = styled(Button)`
  margin-top: 10px;
  width: 80px;
  height: 40px;
`

export default NotFoundPage;
