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
  const postCategory = selectCategory => {
    setfilterCategory(selectCategory);
    console.log(selectCategory);
  };
  const isUserLoggedIn = getAuth().currentUser;

  useEffect(() => {
    console.log(getAuth().currentUser);
  }, []);

  // const SearchParties = () => {
  //   const serachResult = postparty.filter(item => item.postTitle.includes(partyInput));
  //   setFilteredPosts(serachResult);
  // };
  // const Inputsearching = event => {
  //   setpartyInput(event.target.value);
  // };
  return (
    <div>
      <ScCategoriSection>
        {gameNames.map((gameName, index) => (
          <ScCategoriList key={index} onClick={() => postCategory(gameName)}>
            {gameName}
          </ScCategoriList>
        ))}
      </ScCategoriSection>
      <ScSearchBox>
        <ScSearchInput placeholder="원하는 파티를 검색하세오" value={partyInput} />
        <ScSearchButton>검색</ScSearchButton>
      </ScSearchBox>

      <ScTeammateSearchBox>
        <TeamMateList filterCategory={filterCategory} isUserLoggedIn={isUserLoggedIn} />
      </ScTeammateSearchBox>
      <Footer />
    </div>
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
  cursor: pointer;
  &:active {
    background-color: gray;
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
