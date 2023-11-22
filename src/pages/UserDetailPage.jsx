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
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: white;
  align-items: center;
`;

export default UserDetailPage;
