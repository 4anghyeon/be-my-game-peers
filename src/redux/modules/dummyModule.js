const initialState = {};

// action values
const SHOW = 'customAlert/show';
const HIDE = 'customAlert/hide';

// action creator
export const showAlert = (content, styleOption, type) => {
  return {
    type: SHOW,
  };
};

export const hideAlert = (content, styleOption, type) => {
  return {
    type: HIDE,
  };
};

// reducer: 'state에 변화를 일으키는' 함수
// input: state와 action
const dummyModule = (state = initialState, action) => {
  switch (action.type) {
    case SHOW:
      return {...state, ...{visible: true}};
    case HIDE:
      return {...state, ...{visible: false}};
    default:
      return state;
  }
};

export default dummyModule;
