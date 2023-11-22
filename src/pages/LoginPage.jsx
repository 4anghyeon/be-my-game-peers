import React, {useRef, useState} from 'react';
import {ScContainer, ScForm, ScSection, ValidationMessage} from '../components/Auth/Auth.styled';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import {signInWithEmailAndPassword, GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import {auth} from '../shared/firebase';
import {useDispatch} from 'react-redux';
import {changeAuth} from '../redux/modules/userAuth';
import googleIcon from '../assets/img/google-icon.png';
import {createUser, findUserByEmail} from '../shared/firebase/query';
import {addUser} from '../redux/modules/users';
import {Button, Input} from '../components/Common/Common.styled';

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

      const user = await findUserByEmail(result.user.email);
      if (!user) {
        const newUser = {email: result.user.email, introduction: '', favoriteGame: 0};
        await createUser(newUser);
        dispatch(addUser(newUser));
      }

      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScContainer>
      <ScForm>
        <div>
          <h1>로그인</h1>
          <p>동료들이 당신을 기다립니다.</p>
          <div>
            <ScSection>
              <div>
                <Input placeholder="이메일을 입력하세요." type="email" name="email" ref={emailRef} />
              </div>
              {emailValidationMessage && (
                <ValidationMessage $isValid={false}>{emailValidationMessage}</ValidationMessage>
              )}
            </ScSection>
            <ScSection>
              <div>
                <Input placeholder="비밀번호를 입력하세요." type="password" ref={passwordRef} />
              </div>
            </ScSection>
          </div>
        </div>
        <ScLoginButton onClick={onClickLoginButton}>로그인</ScLoginButton>
        <ScSocialLoginButton onClick={onClickGoogleLoginButton}>
          <img src={googleIcon} alt="googleIcon" />
          <span>구글로 로그인</span>
        </ScSocialLoginButton>
        <ScSignUpButton onClick={onClickSignUpButton}>회원가입</ScSignUpButton>
      </ScForm>
    </ScContainer>
  );
};

const ScSignUpButton = styled(Button)`
  margin-top: 10px;
  height: 40px;
  background-color: #190482;
`;

const ScSocialLoginButton = styled(Button)`
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

const ScLoginButton = styled(Button)`
  margin-top: 10px;
  height: 40px;
`;

export default LoginPage;
