export const validationEmail = (email, validation) => {
  let message = '';
  let isValid = false;
  if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
  ) {
    message = '이메일이 올바른 형식이 아닙니다.';
  } else if (validation.isDuplicate) {
    message = '중복 확인을 해주세요.';
  } else {
    isValid = true;
    message = '가능한 메일 입니다.';
  }

  return {message, isValid};
};

export const validationPassword = password => {
  let message = '사용 가능한 비밀번호입니다.';
  let isValid = true;
  if (password.length < 6) {
    message = '비밀번호를 6자리 이상 적어주세요.';
    isValid = false;
  }
  return {message, isValid};
};

export const validationRePassword = (password, rePassword) => {
  let message = '비밀번호가 일치합니다.';
  let isValid = true;
  if (rePassword !== password) {
    message = '비밀번호가 일치하지 않습니다.';
    isValid = false;
  }

  return {message, isValid};
};

export const validationNickname = nickname => {
  let message = '사용 가능한 닉네임 입니다.';
  let isValid = true;
  if (nickname.trim().length < 2) {
    message = '닉네임을 2자 이상 입력해주세요.';
    isValid = false;
  }

  return {message, isValid};
};
