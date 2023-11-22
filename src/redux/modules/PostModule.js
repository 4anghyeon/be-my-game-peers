import PostFakeData from './PostFakeData.json';

// action values
const ADD_POST = 'post/ADD_POST';
const EDIT_POST = 'post/EDIT_POST';
const DELETE_POST = 'post/DELETE_POST';
const ADD_COMMENT = 'post/ADD_COMMENT';

const initialState = PostFakeData;

// action creator
export const addPost = payload => {
  return {
    type: ADD_POST,
    payload,
  };
};

export const editPost = payload => {
  return {
    type: EDIT_POST,
    payload,
  };
};
export const deletePost = payload => {
  return {
    type: DELETE_POST,
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
      return [...state, action.payload];

    case EDIT_POST:
      return state.map(item =>
        item.postId === action.payload.id ? {...item, postContent: action.payload.editedText} : item,
      );

    case DELETE_POST:
      return state.filter(item => item.postId !== action.payload);

    case ADD_COMMENT:
      return state.map(item =>
        item.postId === action.payload.id ? {...item, comments: [action.payload.newComment, ...item.comments]} : item,
      );

    default:
      return state;
  }
};

export default PostModule;
