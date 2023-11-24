import React from 'react';
import styled from 'styled-components';
import {Button} from '../Common/Common.styled';
import {getAuth} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import {hideModal} from '../../redux/modules/modal/modalModule';
import {useDispatch} from 'react-redux';
import avatar from 'assets/avatar.png';

const FollowListRow = ({user, currentEmail, onClickFollowing, onClickFollow, followingList}) => {
  const isFollow = followingList?.includes(user.email);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickNickname = () => {
    dispatch(hideModal());
    navigate(`/user/${user.email}`);
  };

  return (
    <ScRow>
      <li>
        <ScBox>
          <ScProfileImage $img={user.profileImg}></ScProfileImage>
          <ScColumn onClick={onClickNickname}>
            <b>{user.nickname || 'unnamed'}</b>
            <span>{user.email}</span>
          </ScColumn>
        </ScBox>
        {/*본인이면 팔로잉 버튼 표시할 필요 없음*/}
        {getAuth().currentUser &&
          user.email !== currentEmail &&
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
  cursor: pointer;

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

const ScProfileImage = styled.div`
  width: 40px;
  height: 40px;
  background-image: url(${({$img}) => $img || avatar});
  background-size: cover;
  border-radius: 50%;
  border: solid 1px lightgrey;
  margin-right: 10px;
`;

const ScBox = styled.div`
  display: flex;
  align-items: center;
`;

export default FollowListRow;
