import React from 'react';
import styled from 'styled-components';
import {Button} from '../Common/Common.styled';

const FollowListRow = ({user, currentEmail, onClickFollowing, onClickFollow, followingList}) => {
  const isFollow = followingList?.includes(user.email);

  return (
    <ScRow>
      <li>
        <ScColumn>
          <b>{user.nickname || 'unnamed'}</b>
          <span>{user.email}</span>
        </ScColumn>
        {/*본인이면 팔로잉 버튼 표시할 필요 없음*/}
        {user.email !== currentEmail &&
          (isFollow ? (
            <ScFollowingButton onClick={onClickFollowing.bind(null, user.email)}>팔로잉</ScFollowingButton>
          ) : (
            <ScFollowButton onClick={onClickFollow.bind(null, user.email)}>팔로우</ScFollowButton>
          ))}
      </li>
    </ScRow>
  );
};

const ScRow = styled.ul`
  width: 100%;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  span {
    margin-right: 20px;
  }
`;

const ScColumn = styled.div`
  display: flex;
  flex-direction: column;

  & span:last-child {
    color: grey;
  }
`;

const ScFollowButton = styled(Button)`
  width: 70px;
  height: 30px;

  &:hover {
    color: #c2d9ff;
  }
`;

const ScFollowingButton = styled(ScFollowButton)`
  background-color: #c2d9ff;
  &:hover {
    color: #7752fe;
  }
`;

export default FollowListRow;
