import {collection, doc, query, where, getDocs, addDoc, updateDoc} from 'firebase/firestore';
import {db} from '../firebase';
import {getAuth, updateProfile} from 'firebase/auth';

const userCollectionRef = collection(db, 'users');

export const findUserByEmail = async email => {
  // firestore의 user정보에서 email이 같은 유저를 찾음
  const selectUserByEmailQuery = await query(userCollectionRef, where('email', '==', email));
  const querySnapshot = await getDocs(selectUserByEmailQuery);

  let user = null;
  await new Promise(res => {
    if (querySnapshot.docs.length > 0) {
      res();
      user = {id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data()};
    }
  });
  return user;
};

export const updateUser = async (email, updateInfo) => {
  console.log('hello');
  const find = await findUserByEmail(email);
  console.log(find);
  const userRef = doc(db, 'users', find.id);

  // auth 내용 업데이트
  // await updateProfile(getAuth().currentUser, {displayName: updateInfo.nickname, photoURL: updateInfo.profileImg});

  // firebase 내용 업데이트
  // await updateDoc(userRef, updateInfo);
};

export const createUser = async user => {
  await addDoc(userCollectionRef, user);
};
