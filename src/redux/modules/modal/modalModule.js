const initialState = {
  show: false,
  content: null,
};

// action values
const SHOW_MODAL = 'modal/show';
const HIDE_MODAL = 'modal/hide';

// action creator
export const showModal = content => {
  return {
    type: SHOW_MODAL,
    modalOption: {
      content,
    },
  };
};

export const hideModal = () => {
  return {
    type: HIDE_MODAL,
  };
};

// reducer: 'state에 변화를 일으키는' 함수
// input: state와 action
const modalModule = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL:
      return {
        ...state,
        show: true,
        content: action.content,
      };
    case HIDE_MODAL:
      return {...state, show: false};
    default:
      return state;
  }
};

export default modalModule;
