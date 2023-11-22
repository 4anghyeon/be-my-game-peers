import React, {useRef, useState} from 'react';
import {Button, Container, Form, Input, Section, ValidationMessage} from '../components/Auth/Auth.styled';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import {signInWithEmailAndPassword, GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import {auth} from '../shared/firebase';
import {useDispatch} from 'react-redux';
import {changeAuth} from '../redux/modules/userAuth';
import googleIcon from '../assets/img/google-icon.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dispatch = useDispatch();

  const [emailValidationMessage, setEmailValidationMessage] = useState('');

  const onClickSignUpButton = () => {
    navigate('/signup');
  };

  const onClickLoginButton = async e => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value);
      dispatch(changeAuth(result.user));
      navigate('/');
    } catch (error) {
      let message = '';
      if (error.code === 'auth/invalid-email') {
        message = '유효하지 않은 이메일 입니다.';
        emailRef.current.focus();
      } else if (error.code === 'auth/invalid-login-credentials') {
        message = '이메일 혹은 비밀번호가 잘못되었습니다.';
      }
      setEmailValidationMessage(message);

      console.log(error.code);
    }
  };

  const onClickGoogleLoginButton = async e => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);
      dispatch(changeAuth(result.user));
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Form>
        <div>
          <h1>로그인</h1>
          <p>동료들이 당신을 기다립니다.</p>
          <div>
            <Section>
              <div>
                <Input placeholder="이메일을 입력하세요." type="email" name="email" ref={emailRef} />
              </div>
              {emailValidationMessage && (
                <ValidationMessage $isValid={false}>{emailValidationMessage}</ValidationMessage>
              )}
            </Section>
            <Section>
              <div>
                <Input placeholder="비밀번호를 입력하세요." type="password" ref={passwordRef} />
              </div>
            </Section>
          </div>
        </div>
        <LoginButton onClick={onClickLoginButton}>로그인</LoginButton>
        <SocialLoginButton onClick={onClickGoogleLoginButton}>
          <img src={googleIcon} alt="googleIcon" />
          <span>구글로 로그인</span>
        </SocialLoginButton>
        <SignUpButton onClick={onClickSignUpButton}>회원가입</SignUpButton>
      </Form>
    </Container>
  );
};

const SignUpButton = styled(Button)`
  margin-top: 10px;
  height: 40px;
  background-color: #190482;
`;

const SocialLoginButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #8e8ffa;
  margin-top: 10px;
  height: 40px;

  img {
    height: 1.1rem;
    margin-right: 10px;
  }
`;

const LoginButton = styled(Button)`
  margin-top: 10px;
  height: 40px;
`;

export default LoginPage;
