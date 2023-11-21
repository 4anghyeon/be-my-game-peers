import PostFakeData from './PostFakeData.json';

// action values
const ADD_POST = 'post/ADD_POST';

const initialState = PostFakeData;

// action creator
export const addPost = payload => {
  return {
    type: ADD_POST,
    payload,
  };
};

// reducer: 'state에 변화를 일으키는' 함수
// input: state와 action
const PostModule = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      console.log(action.payload);
      console.log(state);
      return [...state, action.payload];

    default:
      return state;
  }
};

export default PostModule;
