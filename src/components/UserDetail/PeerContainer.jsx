import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {getAuth} from 'firebase/auth';
import {findUserByEmail, updateUserFollower, updateUserFollowing} from '../../shared/firebase/query';
import {Button} from '../Common/Common.styled';
import FollowListModal from './FollowListModal';
import {useDispatch} from 'react-redux';
import {showModal} from '../../redux/modules/modal/modalModule';

// profileUser: 유저 상세 페이지의 유저
const PeerContainer = ({profileUser, setUserInfo}) => {
  const [followerNumber, setFollowerNumber] = useState(0);
  const [followingNumber, setFollowingNumber] = useState(0);
  const [isFollow, setIsFollow] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const dispatch = useDispatch();

  // 로그인한 유저의 이메일
  const currentUserEmail = getAuth().currentUser.email;

  // 유저 상세 페이지의 유저가 달라질때마다 다시 계산
  useEffect(() => {
    setFollowerNumber(profileUser.follower?.length || 0);
    setFollowingNumber(profileUser.following?.length || 0);

    if (profileUser.follower) {
      if (profileUser.follower.includes(currentUserEmail)) setIsFollow(true);
      else setIsFollow(false);
    }
  }, [profileUser]);

  const onClickFollow = async () => {
    setFollowerNumber(prev => ++prev);
    setIsFollow(true);

    await updateUserFollower(currentUserEmail, profileUser.email, true);
    await updateUserFollowing(currentUserEmail, profileUser.email, true);

    const userInfo = await findUserByEmail(profileUser.email);
    setUserInfo(userInfo);
  };

  const onClickUnFollow = async () => {
    setFollowerNumber(prev => --prev);
    setIsFollow(false);

    await updateUserFollower(currentUserEmail, profileUser.email, false);
    await updateUserFollowing(currentUserEmail, profileUser.email, false);
    setUserInfo(await findUserByEmail(profileUser.email));
  };

  const onClickOpenFollowerModal = () => {
    setShowFollowing(false);
    setTimeout(() => {
      dispatch(showModal());
    }, 10);
  };

  const onClickOpenFollowingModal = () => {
    setShowFollowing(true);
    setTimeout(() => {
      dispatch(showModal());
    }, 10);
  };

  return (
    <ScContainer>
      <ScFollowerContainer>
        <div onClick={onClickOpenFollowerModal}>
          <span>팔로워 {followerNumber}</span>
        </div>
        <div onClick={onClickOpenFollowingModal}>
          <span>팔로잉 {followingNumber}</span>
        </div>
      </ScFollowerContainer>
      {profileUser.email !== getAuth().currentUser.email && (
        <ScFollowerContainer>
          {!isFollow ? (
            <ScFollowButton onClick={onClickFollow}>팔로우</ScFollowButton>
          ) : (
            <ScUnFollowButton onClick={onClickUnFollow}>언팔로우</ScUnFollowButton>
          )}
        </ScFollowerContainer>
      )}
      <FollowListModal
        showFollowing={showFollowing}
        followerList={profileUser.follower}
        followingList={profileUser.following}
        setFollowingNumber={setFollowingNumber}
        setUserInfo={setUserInfo}
      />
    </ScContainer>
  );
};

const ScContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 200px;
  height: 100px;
`;

const ScFollowerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 10px 0 10px 0;
  font-size: 1rem;

  span {
    cursor: pointer;
  }

  span:hover {
    border-bottom: 1px solid lightgrey;
  }
`;

const ScFollowButton = styled(Button)`
  width: 100px;
  height: 40px;
  &:hover {
    color: black;
  }
`;

const ScUnFollowButton = styled(ScFollowButton)`
  background-color: #8e8ffa;
`;

export default PeerContainer;
