import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {getAuth} from 'firebase/auth';
import {updateUserFollower, updateUserFollowing} from '../../shared/firebase/query';
import {Button} from '../Common/Common.styled';

// profileUser: 유저 상세 페이지의 유저
const PeerContainer = ({profileUser}) => {
  const [followerNumber, setFollowerNumber] = useState(0);
  const [followingNumber, setFollowingNumber] = useState(0);
  const [isFollow, setIsFollow] = useState(false);

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
    let followerList = profileUser.follower ?? [];
    if (!followerList.includes(currentUserEmail)) {
      followerList.push(currentUserEmail);
      await updateUserFollower(profileUser.email, followerList);
      await updateUserFollowing(currentUserEmail, profileUser.email, true);
      setFollowerNumber(prev => ++prev);
      setIsFollow(true);
    }
  };

  const onClickUnFollow = async () => {
    let followerList = profileUser.follower ?? [];
    let newFollowerList = followerList.filter(email => email !== currentUserEmail);
    profileUser.follower = newFollowerList;
    await updateUserFollower(profileUser.email, newFollowerList);
    await updateUserFollowing(currentUserEmail, profileUser.email, false);
    setFollowerNumber(prev => --prev);
    setIsFollow(false);
  };

  return (
    <ScContainer>
      <ScFollowerContainer>
        <div>팔로워 {followerNumber}</div>
        <div>팔로잉 {followingNumber}</div>
      </ScFollowerContainer>
      {profileUser.email !== getAuth().currentUser.email && (
        <ScFollowerContainer>
          {!isFollow ? (
            <ScFollowButton onClick={onClickFollow}>팔로우</ScFollowButton>
          ) : (
            <ScFollowButton onClick={onClickUnFollow}>언팔로우</ScFollowButton>
          )}
        </ScFollowerContainer>
      )}
    </ScContainer>
  );
};

const ScContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 200px;
  height: 100px;
  border: 1px solid black;
`;

const ScFollowerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const ScFollowButton = styled(Button)`
  width: 100px;
  height: 40px;
`;

export default PeerContainer;
