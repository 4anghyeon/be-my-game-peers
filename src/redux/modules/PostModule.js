import PostFakeData from './PostFakeData.json';

// action values
const ADD_POST = 'post/ADD_POST';
const ADD_COMMENT = 'post/ADD_COMMENT';

const initialState = PostFakeData;

// action creator
export const addPost = payload => {
  return {
    type: ADD_POST,
    payload,
  };
};

export const addComment = payload => {
  return {
    type: ADD_COMMENT,
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
    case ADD_COMMENT:
      console.log(action.payload);
      console.log(action.payload.id);
      console.log(action.payload.newComment);
      console.log(state.comments);
      return state.map(item =>
        item.postId === action.payload.id ? {...item, comments: [...item.comments, action.payload.newComment]} : item,
      );

    default:
      return state;
  }
};

export default PostModule;
