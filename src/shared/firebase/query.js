import {collection, doc, query, where, getDocs, addDoc, updateDoc, deleteDoc} from 'firebase/firestore';
import {db, realTimeDb} from './firebase';
import {getAuth, updateProfile} from 'firebase/auth';
import {ref, update, child, push} from 'firebase/database';

const userCollectionRef = collection(db, 'users');
const postCollectionRef = collection(db, 'posts');
const reviewCollectionRef = collection(db, 'reviews');

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

// 팔로우 당하는 사람의 팔로우 목록을 업데이트 한다.
export const updateUserFollower = async (currentUserEmail, followerEmail, isFollow) => {
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

// 팔로우 하는 사람의 팔로잉 목록을 업데이트 한다.
export const updateUserFollowing = async (currentUserEmail, followerEmail, isFollow) => {
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

// 댓글을 달 때 게시글 주인에게 메시지 발송
export const sendMessage = async (email, message, id, type) => {
  const path = `${email.replace(/\./g, '')}/message`;
  const newMessageKey = push(child(ref(realTimeDb), email.replace(/\./g, ''))).key;
  const updates = {};
  updates[`${path}/${newMessageKey}`] = {
    message,
    postId: id,
    type,
    check: false,
  };
  return update(ref(realTimeDb), updates);
};

// 알림 메시지를 읽으면 데이터베이스에서 삭제
export const deleteMessage = async (email, id) => {
  const path = `${email.replace(/\./g, '')}/message/${id}`;
  const updates = {};
  updates[path] = null;
  return update(ref(realTimeDb), updates);
};

// 모든 게시글, 댓글의 글쓴이 이름을 바꿈
export const updateAuthorAllPost = async (afterName, userEmail) => {
  const q = query(postCollectionRef);
  const querySnapShot = await getDocs(q);
  const updatePromiseList = [];

  querySnapShot.forEach(snapshot => {
    const data = snapshot.data();
    console.log(data);

    if (data.authorEmail === userEmail) {
      const newData = {...data, author: afterName};
      const postRef = doc(db, 'posts', snapshot.id);
      updatePromiseList.push(new Promise(updateDoc.bind(null, postRef, newData)));
    }
    if (data.comments.find(c => c.userEmail === userEmail)) {
      const newComments = data.comments?.filter(c => c.userEmail === userEmail).map(c => ({...c, userId: afterName}));
      const newData = {...data, comments: newComments};
      const postRef = doc(db, 'posts', snapshot.id);
      updatePromiseList.push(new Promise(updateDoc.bind(null, postRef, newData)));
    }
  });

  Promise.all(updatePromiseList);
};

export const findAllReviewByUserId = async userId => {
  const selectReviewByUserIdQuery = await query(reviewCollectionRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(selectReviewByUserIdQuery);
  let reviews = [];
  await new Promise((res, rej) => {
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach(doc => {
        reviews.push({id: doc.id, ...doc.data()});
      });
      res();
    } else {
      rej(new Error('No Review'));
    }
  });
  return reviews;
};

// 리뷰 생성
export const addReview = async newReview => {
  addDoc(reviewCollectionRef, newReview);
};

// 리뷰 삭제
export const deleteReview = async id => {
  const reviewRef = doc(db, 'reviews', id);
  await deleteDoc(reviewRef);
};

// 모든 사용자 리뷰의 글쓴이 이름을 바꿈
export const updateAuthorAllReview = async (afterName, userEmail) => {
  const q = query(reviewCollectionRef);
  const querySnapShot = await getDocs(q);
  const updatePromiseList = [];

  querySnapShot.forEach(snapshot => {
    const data = snapshot.data();
    if (data.authorEmail === userEmail) {
      const newReview = {...data, nickname: afterName};
      const reviewRef = doc(db, 'reviews', snapshot.id);
      updatePromiseList.push(new Promise(updateDoc.bind(null, reviewRef, newReview)));
    }
  });

  Promise.all(updatePromiseList);
};
