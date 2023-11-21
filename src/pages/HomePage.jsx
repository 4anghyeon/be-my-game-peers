import React from 'react';
import styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';
import categori from 'redux/modules/categoriModule';
import {seartchCategori} from 'redux/modules/categoriModule';
import {Link} from '../../node_modules/react-router-dom/dist/index';
import TeamMateList from 'components/TeamMateList';
const HomePage = () => {
  const categoris = useSelector(state => state.categoriModule);
  //const categoriList = categoris.map();
  console.log(categoris);
  const gameNames = categoris.map(category => category.game);
  console.log(gameNames);
  return (
    <div>
      <header>header</header>
      <CategoriSection>
        {gameNames.map((gameName, index) => (
          <CategoriList key={index}>{gameName}</CategoriList>
        ))}
      </CategoriSection>
      <SearchBox>
        <SearchInput placeholder="원하는 파티를 검색하세오" />
        <SearchButton>검색</SearchButton>
      </SearchBox>

      <TeammateSearchBox>
        <TeamMateList />
      </TeammateSearchBox>
      <footer>footer.</footer>
    </div>
  );
};

const CategoriList = styled(Link)`
  color: black;
  margin: 50px;
  text-decoration: none;
  position: relative;
  font-weight: bold;

  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 4px;
    bottom: 0;
    left: 0;
    background-color: black;
    transition: width 0.3s ease-in-out;
    margin-bottom: -5px;
  }

  &:hover::before {
    width: 100%;
  }
`;
const CategoriSection = styled.section`
  width: 100%;
  height: 150px;
  text-align: center;
`;
const SearchBox = styled.form`
  width: 100%;
  height: 150px;
  text-align: center;
`;
const SearchInput = styled.input`
  width: 350px;
  height: 50px;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 3px solid black;
  font-size: 20px;
  font-family: arial;
`;
const SearchButton = styled.button`
  width: 80px;
  height: 50px;
  margin-left: 15px;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 3px solid black;
  cursor: pointer;
  &:active {
    background-color: gray;
    transition: background-color 0.5s;
  }
`;
const TeammateSearchBox = styled.div`
  width: 700px;
  height: 700px;
  margin: 0 auto;
  background-color: #c2d9ff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default HomePage;
