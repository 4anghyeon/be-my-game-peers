const initialState = {};

// action values
const CHANGE_AUTH = 'userAuth/change';

// action creator
export const changeAuth = userAuth => {
  return {
    type: CHANGE_AUTH,
    userAuth,
  };
};

// reducer: 'state에 변화를 일으키는' 함수
const userAuth = (state = initialState, action) => {
  const {type} = action;

  switch (type) {
    case CHANGE_AUTH:
      return action.userAuth;
    default:
      return state;
  }
};

export default userAuth;
