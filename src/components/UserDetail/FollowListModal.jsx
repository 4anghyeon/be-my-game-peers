import React, {useEffect, useState} from 'react';
import Modal from '../Modal/Modal';
import {createPortal} from 'react-dom';
import {
  findUserByEmail,
  findUsersByEmailList,
  updateUserFollower,
  updateUserFollowing,
} from '../../shared/firebase/query';
import {getAuth} from 'firebase/auth';
import FollowListRow from './FollowListRow';
import {useLocation} from 'react-router-dom';

const FollowListModal = ({showFollowing, followerList, followingList, setFollowingNumber, setUserInfo}) => {
  const [showingList, setShowingList] = useState([]);
  const currentEmail = getAuth().currentUser?.email;
  const {pathname} = useLocation();
  const pathEmail = pathname.replace('/user/', '');
  const isMyPage = pathEmail === currentEmail;

  let list = showFollowing ? followingList : followerList;

  useEffect(() => {
    if (list && list.length > 0) {
      findUsersByEmailList(list).then(data => {
        setShowingList(data);
      });
    } else {
      setShowingList([]);
    }
  }, [list]);

  const onClickFollowing = async email => {
    // 언팔 당하는 사람 찾음
    await updateUserFollower(currentEmail, email, false);

    // 본인 목록에서도 팔로우 끊음
    await updateUserFollowing(currentEmail, email, false).then(data => {
      setShowingList(data);
    });
    if (isMyPage) {
      setFollowingNumber(prev => --prev);
    }
    const user = await findUserByEmail(pathEmail);
    setUserInfo(user);
  };

  const onClickFollow = async email => {
    // 본인 팔로잉 목록에 추가
    await updateUserFollowing(currentEmail, email, true);

    // 상대방 팔로워 목록에 추가
    await updateUserFollower(currentEmail, email, true);

    if (isMyPage) {
      setFollowingNumber(prev => ++prev);
    }
    const user = await findUserByEmail(pathEmail);
    setUserInfo(user);
  };

  return (
    <>
      {showingList &&
        createPortal(
          <Modal>
            {showingList.map(v => (
              <FollowListRow
                key={v.email}
                user={v}
                currentEmail={currentEmail}
                onClickFollowing={onClickFollowing}
                onClickFollow={onClickFollow}
                followingList={followingList}
              />
            ))}
            {showingList.length === 0 && <h1>친구가 없습니다!</h1>}
          </Modal>,
          document.getElementById('modal'),
        )}
    </>
  );
};

export default FollowListModal;
