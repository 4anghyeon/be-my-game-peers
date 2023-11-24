import React, {useEffect} from 'react';
import styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';
import Header from 'components/Layout/Header';
import Footer from 'components/Layout/Footer';
import PostModule from 'redux/modules/PostModule';
import categori, {seartchCategori} from 'redux/modules/categoriModule';
import {Link} from '../../node_modules/react-router-dom/dist/index';
import TeamMateList from 'components/TeamMateList';
import {getAuth} from 'firebase/auth';
import {useState} from 'react';

const HomePage = () => {
  const categoris = useSelector(state => state.categoriModule);
  const postparty = useSelector(state => state.PostModule);

  const gameNames = categoris.map(category => category.game);

  const [filterCategory, setfilterCategory] = useState('LEAGUE OF LEGENDS');
  const [partyInput, setpartyInput] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(postparty);
  const [onSearch, setOnSearch] = useState(false);
  const postCategory = selectCategory => {
    setfilterCategory(selectCategory);
    setOnSearch(false);
  };
  console.log(filterCategory);
  const isUserLoggedIn = getAuth().currentUser;

  useEffect(() => {
    console.log(getAuth().currentUser);
  }, []);

  //카테고리안에서 제목이름과 비슷한것들만 필터되게
  const SearchParties = event => {
    event.preventDefault();
    const searchResult = postparty.filter(
      item => item.postTitle.includes(partyInput) && item.category === filterCategory,
    );
    setFilteredPosts(searchResult);
    setOnSearch(true);

    setpartyInput(``);
  };

  const Inputsearching = event => {
    setpartyInput(event.target.value);
  };

  return (
    <>
      <ScCategoriSection>
        {gameNames.map((gameName, index) => (
          <ScCategoriList key={index} onClick={() => postCategory(gameName)} selected={gameName === filterCategory}>
            {gameName}
          </ScCategoriList>
        ))}
      </ScCategoriSection>
      <ScSearchBox>
        <ScSearchInput placeholder="제목을 입력하세요" value={partyInput} onChange={Inputsearching} />
        <ScSearchButton onClick={SearchParties}>검색</ScSearchButton>
      </ScSearchBox>

      <ScTeammateSearchBox>
        <TeamMateList
          filterCategory={filterCategory}
          isUserLoggedIn={isUserLoggedIn}
          filteredPosts={filteredPosts}
          partyInput={partyInput}
          onSearch={onSearch}
        />
      </ScTeammateSearchBox>
    </>
  );
};

const ScCategoriList = styled(Link)`
  color: black;
  margin: 50px;
  text-decoration: none;
  position: relative;
  font-weight: bold;

  &::before {
    content: '';
    position: absolute;
    width: ${({selected}) => (selected ? '100%' : '0')};
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
const ScCategoriSection = styled.section`
  margin-top: 20px;
  width: 100%;
  height: 150px;
  text-align: center;
`;
const ScSearchBox = styled.form`
  width: 100%;
  height: 150px;
  text-align: center;
`;
const ScSearchInput = styled.input`
  width: 350px;
  height: 50px;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 3px solid black;
  font-size: 20px;
  font-family: arial;
`;
const ScSearchButton = styled.button`
  width: 80px;
  height: 50px;
  margin-left: 15px;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 3px solid black;
  font-size: 20px;
  font-weight: bold;
  color: white;
  background-color: #7752fe;
  cursor: pointer;
  &:active {
    background-color: #8e8ffa;
    transition: background-color 0.5s;
  }
`;
const ScTeammateSearchBox = styled.div`
  width: 800px;
  height: 700px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default HomePage;
