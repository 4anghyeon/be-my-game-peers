import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from '../../node_modules/react-router-dom/dist/index';
import TeamMateList from 'components/TeamMateList';
import {getAuth} from 'firebase/auth';
import GameCardContainer from '../components/Home/GameCardContainer';
import {fetchData, setData} from '../redux/modules/PostModule';
import {RefreshDouble} from 'iconoir-react';

const HomePage = () => {
  const categories = useSelector(state => state.categoriModule);
  const postParty = useSelector(state => state.PostModule);
  const dispatch = useDispatch();

  const gameNames = categories.map(category => category.game);

  const [filterCategory, setFilterCategory] = useState('LEAGUE OF LEGENDS');
  const [partyInput, setPartyInput] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(postParty);
  const [onSearch, setOnSearch] = useState(false);
  const postCategory = selectCategory => {
    setFilterCategory(selectCategory);
    setOnSearch(false);
  };

  const isUserLoggedIn = getAuth().currentUser;
  let remainSeconds = 10;
  const remainSecondsRef = useRef(null);

  //카테고리안에서 제목이름과 비슷한것들만 필터되게
  const SearchParties = event => {
    event.preventDefault();
    if (partyInput.trim() !== '') {
      const searchResult = postParty.filter(
        item => item.postTitle.includes(partyInput) && item.category === filterCategory,
      );
      setFilteredPosts(searchResult);
      setOnSearch(true);
    } else {
      setFilteredPosts(postParty);
      setOnSearch(false);
    }
    setPartyInput('');
  };

  const inputSearching = event => {
    setPartyInput(event.target.value);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (remainSeconds === 0) {
        fetchData().then(data => {
          dispatch(setData(data));
          setFilteredPosts(
            data.filter(item => item.postTitle.includes(partyInput) && item.category === filterCategory),
          );
        });
        remainSeconds = 10;
        setOnSearch(false); // 검색 중이 아닌 경우에도 새로고침 후에 검색 중이 아님을 설정
      } else {
        remainSeconds -= 1;
        remainSecondsRef.current.innerText = remainSeconds;
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [onSearch, partyInput, filterCategory]);

  return (
    <>
      <ScCategoriSection>
        {gameNames.map((gameName, index) => (
          <ScCategoriList key={index} onClick={() => postCategory(gameName)} selected={gameName === filterCategory}>
            {gameName}
          </ScCategoriList>
        ))}
      </ScCategoriSection>
      <GameCardContainer category={filterCategory} />
      <ScSearchBox>
        <ScSearchInput placeholder="제목을 입력하세요" value={partyInput} onChange={inputSearching} />
        <ScSearchButton onClick={SearchParties}>검색</ScSearchButton>
      </ScSearchBox>
      <ScRefreshBox>
        <span>
          <span ref={remainSecondsRef}>{remainSeconds}</span>초 후에 새로고침 합니다.
        </span>
        <RefreshDouble>🔄</RefreshDouble>
      </ScRefreshBox>
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
  font-family: 'BeaufortforLOL';
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
  font-size: 2vw;
  margin: 20px 0 20px 0;
  width: 100%;
  text-align: center;
`;
const ScSearchBox = styled.form`
  width: 100%;
  height: 100px;
  text-align: center;
  margin-top: 50px;
`;
const ScSearchInput = styled.input`
  width: 350px;
  height: 50px;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 3px solid black;
  font-size: 20px;
  font-family: 'MaplestoryOTFLight';

  font-weight: bold;
`;
const ScSearchButton = styled.button`
  width: 80px;
  height: 50px;
  margin-left: 15px;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 3px solid black;
  font-family: 'MaplestoryOTFLight';
  font-size: 20px;

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
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ScRefreshBox = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-right: 10px;
  }

  & button {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    background-color: white;
    border: 1px solid lightgrey;
    border-radius: 5px;
    cursor: pointer;
  }

  & button:hover {
    font-size: 1.3rem;
  }
`;

export default HomePage;
