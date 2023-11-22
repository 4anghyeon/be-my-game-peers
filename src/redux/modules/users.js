import {db} from '../../shared/firebase.js';
import {collection, getDocs, query} from 'firebase/firestore';

const fetchData = async () => {
  const q = query(collection(db, 'users'));
  const querySnapshot = await getDocs(q);

  const initialUsers = [];
  querySnapshot.forEach(doc => {
    initialUsers.push({id: doc.id, ...doc.data()});
  });
  return initialUsers;
};
const initialState = await fetchData();

// action values
const ADD_USER = 'users/addUser';

// action creator
export const addUser = newUser => {
  return {
    type: ADD_USER,
    userInfo: newUser,
  };
};

// reducer: 'state에 변화를 일으키는' 함수
// input: state와 action
const users = (state = initialState, action) => {
  const {type} = action;

  switch (type) {
    case ADD_USER:
      return {
        ...state,
        ...{
          email: action.userInfo.email,
          nickname: action.userInfo.nickname,
          introduction: action.userInfo.introduction,
          favoriteGame: action.userInfo.favoriteGame,
          profileImg: null,
        },
      };
    default:
      return state;
  }
};

export default users;
