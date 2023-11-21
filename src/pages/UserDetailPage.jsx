import React from 'react';
import UserInfo from 'components/User/UserInfo';
import UserComments from 'components/User/UserComments';
import styled from 'styled-components';

const UserDetailPage = () => {
  return (
    <Container>
      <UserInfo />
      <UserComments />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export default UserDetailPage;
