import React from 'react';
import styled from 'styled-components';
import githubIcon from 'assets/img/github.png';
import bg from 'assets/img/footer.svg';

const Footer = () => {
  const onClickGitHub = () => {
    window.open('https://github.com/4anghyeon/be-my-game-peers');
  };

  return (
    <ScContainer>
      <ScVerticalContainer>
        <h1>내일배움캠프</h1>
        <h2>뉴스피드 프로젝트</h2>
        <span>OZO</span>
      </ScVerticalContainer>
      <ScHorizonContainer>
        <span>이상현</span>
        <span>김미희</span>
        <span>권영준</span>
        <span>이희원</span>
      </ScHorizonContainer>
      <ScImg>
        <img src={githubIcon} alt="github" onClick={onClickGitHub} />
      </ScImg>
    </ScContainer>
  );
};

const ScContainer = styled.footer`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-image: url(${() => bg});
  -o-background-size: 100% 100%;
  -webkit-background-size: 100% 100%;
  background-size: cover;

  div {
    padding: 40px;
    color: white;
  }
`;

const ScHorizonContainer = styled.div`
  display: flex;
  font-weight: bold;
  font-size: 1.4rem;
  align-items: center;
  justify-content: space-between;

  span:not(:last-child) {
    margin-right: 160px;
  }
`;

const ScVerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: bold;

  h1 {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }
  h2 {
    font-size: 1.3rem;
    margin-bottom: 10px;
  }
  span:not(:last-child) {
    margin-bottom: 20px;
  }
`;

const ScImg = styled.div`
  img {
    width: 50px;
    height: 50px;
    cursor: pointer;
  }
`;

export default Footer;
