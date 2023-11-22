const initialState = {
  show: false,
  message: '',
  type: null,
};

// action values
const SHOW_ALERT = 'alert/show';
const HIDE_ALERT = 'alert/hide';

// action creator
export const showAlert = (message, type, yesCb, noCb) => {
  return {
    type: SHOW_ALERT,
    alertOption: {
      message,
      type,
      yesCb,
      noCb,
    },
  };
};

export const hideAlert = () => {
  return {
    type: HIDE_ALERT,
  };
};

// reducer: 'state에 변화를 일으키는' 함수
// input: state와 action
const alertModule = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_ALERT:
      return {
        ...state,
        show: true,
        type: action.alertOption.type,
        message: action.alertOption.message,
        yesCb: action.alertOption.yesCb,
        noCb: action.alertOption.noCb,
      };
    case HIDE_ALERT:
      return {...state, show: false};
    default:
      return state;
  }
};

export default alertModule;
