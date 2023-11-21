import React from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

const TeamMateList = () => {
  const categories = useSelector(state => state.categoriModule);

  return (
    <>
      <TeammateSearchBox>
        <GameParty />
        <GameParty />
        <GameParty />
        <GameParty />
        <GameParty />
      </TeammateSearchBox>
    </>
  );
};

const TeammateSearchBox = styled.div`
  width: 700px;
  height: 700px;
  margin: 0 auto;
  background-color: #c2d9ff;
  text-align: center;
  align-items: flex-start;
  justify-content: center;
`;
const GameParty = styled.div`
  width: 600px;
  height: 100px;
  background-color: #8e8ffa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px auto 15px auto;
`;

export default TeamMateList;
