import {collection, doc, query, where, getDocs, addDoc, updateDoc} from 'firebase/firestore';
import {db} from '../firebase';
import {getAuth, updateProfile} from 'firebase/auth';

const userCollectionRef = collection(db, 'users');

export const findUserByEmail = async email => {
  // firestore의 user정보에서 email이 같은 유저를 찾음
  const selectUserByEmailQuery = await query(userCollectionRef, where('email', '==', email));
  const querySnapshot = await getDocs(selectUserByEmailQuery);

  let user = null;
  await new Promise((res, rej) => {
    if (querySnapshot.docs.length > 0) {
      user = {id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data()};
      res();
    } else {
      rej(new Error('No User'));
    }
  });
  return user;
};

export const findUsersByEmailList = async list => {
  // firestore의 user정보에서 list의 email의 유저 정보를 모두 찾음
  const selectUsersByEmailQuery = await query(userCollectionRef, where('email', 'in', list));
  const querySnapshot = await getDocs(selectUsersByEmailQuery);

  let findList = [];
  await new Promise((res, rej) => {
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach(doc => {
        findList.push(doc.data());
      });
      res();
    } else {
      rej(new Error('No User'));
    }
  });
  return findList;
};

export const updateUser = async (email, updateInfo) => {
  const find = await findUserByEmail(email);
  const userRef = doc(db, 'users', find.id);

  // auth 내용 업데이트
  await updateProfile(getAuth().currentUser, {displayName: updateInfo.nickname, photoURL: updateInfo.profileImg});

  // firebase 내용 업데이트
  await updateDoc(userRef, updateInfo);
};

export const createUser = async user => {
  await addDoc(userCollectionRef, user);
};

export const updateUserFollower = async (currentUserEmail, followerEmail, isFollow) => {
  // 팔로우 당하는 사람의 팔로우 목록을 업데이트 한다.
  const followedUser = await findUserByEmail(followerEmail);
  let followerList = followedUser.follower ?? [];

  if (isFollow) {
    if (!followerList.includes(currentUserEmail)) {
      followerList.push(currentUserEmail);
    }
  } else {
    followerList = followerList.filter(email => email !== currentUserEmail);
  }

  const followedUserRef = doc(db, 'users', followedUser.id);
  await updateDoc(followedUserRef, {follower: followerList});
  return followerList;
};

export const updateUserFollowing = async (currentUserEmail, followerEmail, isFollow) => {
  // 팔로우 하는 사람의 팔로잉 목록을 업데이트 한다.
  const followingUser = await findUserByEmail(currentUserEmail);
  const followingUserRef = doc(db, 'users', followingUser.id);
  let followingList = followingUser.following || [];
  if (isFollow) {
    if (!followingList.includes(followerEmail)) followingList.push(followerEmail);
  } else {
    followingList = followingList.filter(email => email !== followerEmail);
  }
  await updateDoc(followingUserRef, {following: followingList});
  return followingList;
};
