import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {
  validationEmail,
  validationNickname,
  validationPassword,
  validationRePassword,
} from '../shared/helper/validation';
import {createUserWithEmailAndPassword, getAuth, updateProfile} from 'firebase/auth';
import {auth} from '../shared/firebase';
import {useNavigate} from 'react-router-dom';
import {hideLoading, showLoading} from '../shared/helper/common';
import {useDispatch, useSelector} from 'react-redux';
import {ERROR_EMAIL_DUPLICATED} from '../shared/helper/errorCode';
import {ScContainer, ScForm, ScSection, ValidationMessage} from '../components/Auth/Auth.styled';
import {changeAuth} from '../redux/modules/userAuth';
import {addUser} from '../redux/modules/users';
import {createUser, findUserByEmail} from '../shared/firebase/query';
import {Button, Input} from '../components/Common/Common.styled';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setRePassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [favoriteGame, setFavoriteGame] = useState(0);
  const emailRef = useRef(null);
  const categories = useSelector(state => state.categoriModule);

  // form의 전체 validation 여부를 결정하는 state
  const [validation, setValidation] = useState({
    email: {
      isValid: false,
      isDuplicate: true,
      message: '이메일이 올바른 형식이 아닙니다.',
    },
    password: {
      isValid: false,
      message: '비밀번호를 6자리 이상 적어주세요.',
    },
    rePassword: {
      isValid: false,
      message: '비밀번호가 일치하지 않습니다.',
    },
    nickname: {
      isValid: false,
      message: '닉네임을 2자 이상 입력해주세요.',
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // 로그인되어 있으면 다시 메인으로..
    if (getAuth().currentUser) navigate('/');
  }, []);

  // input 변화시 항목마다 validation!
  const handleInputChange = e => {
    const {name, value} = e.target;

    switch (name) {
      case 'email':
        {
          const {isValid, message} = validationEmail(value, {...validation.email, isDuplicate: true});
          setValidation(prev => {
            return {...prev, email: {isValid, message, isDuplicate: true}};
          });
          setEmail(value);
        }
        break;
      case 'password':
        {
          const {isValid, message} = validationPassword(value);
          setValidation(prev => {
            return {...prev, password: {isValid, message}};
          });
          setPassword(value);
        }

        break;
      case 'rePassword':
        {
          const {isValid, message} = validationRePassword(password, value);
          setValidation(prev => {
            return {...prev, rePassword: {isValid, message}};
          });
          setRePassword(value);
        }
        break;
      case 'nickname':
        {
          const {isValid, message} = validationNickname(value);
          setValidation(prev => {
            return {...prev, nickname: {isValid, message}};
          });
          setNickname(value);
        }
        break;
      case 'introduction':
        setIntroduction(value);
        break;
      case 'favoriteGame':
        setFavoriteGame(value);
        break;
    }
  };

  // 이메일 중복확인 체크
  const handleCheckDuplicate = async e => {
    e.preventDefault();
    if (email.trim() === '') {
      alert('이메일을 입력해주세요.');
      return;
    }

    let {isValid, message} = validationEmail(email, {...validation.email, isDuplicate: false});
    let isDuplicate = true;

    // firestore의 user정보에서 email이 같은 유저를 찾음
    const find = await findUserByEmail(email);
    if (find) {
      message = '이미 사용중인 이메일입니다.';
      isValid = false;
      isDuplicate = false;
    }

    setValidation(prev => {
      return {...prev, email: {isValid: isValid, message: message, isDuplicate: isDuplicate}};
    });
  };

  // 회원 가입 버튼 클릭
  const handleSignUp = async e => {
    e.preventDefault();

    let notAvailableItem = Object.values(validation).find(item => !item.isValid);
    if (notAvailableItem) {
      // validation을 통과 못한 항목이 있다면..
      alert(notAvailableItem.message);
    } else {
      try {
        showLoading(document.getElementById('form'));

        // authentication에 user 생성
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // user displayname을 nickname으로 업데이트
        await updateProfile(userCredential.user, {displayName: nickname});

        // authentication이 아닌 firestore에도 저장
        const newUser = {email, introduction, favoriteGame};
        await createUser(newUser);
        dispatch(addUser(newUser));

        // 성공하면 로그인까지 됨.. (막을 수 없음)
        alert('성공적으로 가입 되었습니다!');
        dispatch(changeAuth(getAuth().currentUser));
        navigate('/');
      } catch (error) {
        const errorCode = error.code;

        if (errorCode === ERROR_EMAIL_DUPLICATED) {
          let message = '이미 사용 중인 이메일입니다.';
          setValidation(prev => {
            return {...prev, email: {isValid: false, message, isDuplicate: true}};
          });
          emailRef.current.focus();
        }
        hideLoading(document.getElementById('form'));
      }
    }
  };

  return (
    <ScContainer>
      <ScForm id="form">
        <div>
          <h1>회원가입</h1>
          <p>가입을 통해 여러분의 게임 동료를 모아보세요!</p>
        </div>
        <div>
          <ScSection>
            <div>
              <Input type="email" name="email" placeholder="이메일 입력" onChange={handleInputChange} ref={emailRef} />
              <ScCheckDuplicateButton onClick={handleCheckDuplicate}>중복 확인</ScCheckDuplicateButton>
            </div>
            {email && validation.email.message && (
              <ValidationMessage $isValid={validation.email.isValid}>{validation.email.message}</ValidationMessage>
            )}
          </ScSection>
          <ScSection>
            <div>
              <Input
                type="password"
                name="password"
                placeholder="비밀번호 입력 (6자 이상)"
                onChange={handleInputChange}
              />
            </div>
            {password && (
              <ValidationMessage $isValid={validation.password.isValid}>
                {validation.password.message}
              </ValidationMessage>
            )}
          </ScSection>
          <ScSection>
            <div>
              <Input type="password" name="rePassword" placeholder="비밀번호 재입력" onChange={handleInputChange} />
            </div>
            <ValidationMessage $isValid={validation.rePassword.isValid}>
              {validation.rePassword.message}
            </ValidationMessage>
          </ScSection>
          <ScSection>
            <div>
              <Input type="text" placeholder="화면에 표시될 닉네임" name="nickname" onChange={handleInputChange} />
            </div>
            {nickname && (
              <ValidationMessage $isValid={validation.nickname.isValid}>
                {validation.nickname.message}
              </ValidationMessage>
            )}
          </ScSection>
          <ScSection>
            <div>
              <ScIntroTextArea
                placeholder="한 줄 소개"
                name="introduction"
                maxLength={100}
                onChange={handleInputChange}
              />
            </div>
          </ScSection>
          <ScSection>
            <div>
              <label>자주 하는 게임</label>
              <ScGameSelect
                placeholder="자주 하는 게임"
                name="favoriteGame"
                defaultValue="0"
                onChange={handleInputChange}
              >
                {categories.map(category => {
                  return (
                    <option key={category.id} value={category.id}>
                      {category.game}
                    </option>
                  );
                })}
              </ScGameSelect>
            </div>
          </ScSection>
        </div>

        <ScSignUpButton type="button" onClick={handleSignUp}>
          가입 하기
        </ScSignUpButton>
      </ScForm>
    </ScContainer>
  );
};

const ScIntroTextArea = styled.textarea`
  resize: none;
  width: 100%;
  border: 1px solid lightgrey;
  border-radius: 5px;
  padding: 15px;
`;

const ScGameSelect = styled.select`
  --arrow-bg: #8e8ffa;
  --arrow-icon: url(https://upload.wikimedia.org/wikipedia/commons/9/9d/Caret_down_font_awesome_whitevariation.svg);
  --option-bg: #c2d9ff;
  --select-bg: transparent;

  margin-left: 10px;
  /* Reset */
  appearance: none;
  outline: 0;
  border: 1px solid lightgrey;
  font: inherit;
  /* Personalize */
  width: 20rem;
  padding: 0.7rem 4rem 0.7rem 1rem;
  background:
    var(--arrow-icon) no-repeat right 0.8em center / 1.4em,
    linear-gradient(to left, var(--arrow-bg) 3em, var(--select-bg) 3em);
  color: black;
  border-radius: 0.25em;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  option {
    color: inherit;
    background-color: var(--option-bg);
  }
`;

const ScCheckDuplicateButton = styled(Button)`
  border-radius: 5px;
  margin-left: 10px;
  width: 20%;
  padding: 15px;
`;

const ScSignUpButton = styled(Button)`
  width: 50%;
  padding: 20px;
  border-radius: 10px;
  border: none;
  margin: 0 auto;
  font-size: 1.1rem;
`;

export default SignUpPage;
