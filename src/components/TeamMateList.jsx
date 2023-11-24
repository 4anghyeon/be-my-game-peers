import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import moment from 'moment';

const TeamMateList = ({filterCategory, isUserLoggedIn, filteredPosts, partyInput, onSearch}) => {
  const postparty = useSelector(state => state.PostModule);

  const postm = useSelector(state => state.categoriModule);

  const navigate = useNavigate();

  const partypage = 5;

  // 각 카테고리에 대한 현재 페이지를 저장하는 상태
  const [currentPage, setCurrentPage] = useState({});

  const startPageIndex = (currentPage[filterCategory] - 1) * partypage;
  const endPageIndex = startPageIndex + partypage;

  const totalPage = Math.ceil(postparty.filter(item => item.category === filterCategory).length / partypage);

  const currentPageList = onSearch
    ? filteredPosts
        .filter(item => item.category === filterCategory && item.postTitle.includes(partyInput))
        .slice(startPageIndex, endPageIndex)
    : postparty.filter(item => item.category === filterCategory).slice(startPageIndex, endPageIndex);

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  };
  const moveDetailpage = postId => {
    navigate(`/detail/${postId}`);
  };

  const getCategoryPlayers = category => {
    const selectedCategory = postm.find(intro => intro.game === category);
    return selectedCategory ? selectedCategory.players : 0;
  };
  useEffect(() => {
    if (!currentPage[filterCategory]) {
      setCurrentPage(prev => ({
        ...prev,
        [filterCategory]: 1,
      }));
    }
  }, [filterCategory]);
  return (
    <>
      <ScTeammateSearchBox>
        {currentPageList.filter(item => item).length === 0 ? (
          <NoPostParty>파티구인 구직 글이 없습니다 글을 작성해주세요</NoPostParty>
        ) : (
          currentPageList.map((post, index) => (
            <ScGameParty key={post.postId} onClick={() => moveDetailpage(post.postId)}>
              <ScPostBox>
                <span>{startPageIndex + index + 1}</span>
                <div>
                  ({post.category}) {truncate(post.postTitle, 5)}
                </div>
                <div>
                  {post.currentParticipants} / {getCategoryPlayers(post.category)}
                </div>
                <span>{truncate(post.author, 4)}</span>
                <time>{moment.unix(post.postDate.seconds).format('yyyy-MM-DD HH:mm')}</time>
              </ScPostBox>
            </ScGameParty>
          ))
        )}
        <ScPageNation>
          {currentPage[filterCategory] > 1 && (
            <ScPageButton
              onClick={() =>
                setCurrentPage(prev => ({
                  ...prev,
                  [filterCategory]: prev[filterCategory] - 1,
                }))
              }
            >
              이전
            </ScPageButton>
          )}
          {Array.from({length: totalPage}, (_, index) => (
            <ScPageButton
              key={index}
              onClick={() =>
                setCurrentPage(prev => ({
                  ...prev,
                  [filterCategory]: index + 1,
                }))
              }
              isActive={currentPage[filterCategory] === index + 1}
            >
              {index + 1}
            </ScPageButton>
          ))}
          {currentPage[filterCategory] < totalPage && (
            <ScPageButton
              onClick={() =>
                setCurrentPage(prev => ({
                  ...prev,
                  [filterCategory]: prev[filterCategory] + 1,
                }))
              }
            >
              다음
            </ScPageButton>
          )}
        </ScPageNation>
        {isUserLoggedIn && (
          <ScWirteButton
            onClick={() => {
              navigate(`/write`);
            }}
          >
            글쓰기
          </ScWirteButton>
        )}
      </ScTeammateSearchBox>
    </>
  );
};
const ScTeammateSearchBox = styled.div`
  width: 1000px;
  height: 650px;
  margin: 0 auto;
  border: 3px solid #190482;
  border-radius: 5px;
  text-align: center;
  align-items: flex-start;
  justify-content: center;
  position: relative;
`;

const ScGameParty = styled.div`
  width: 700px;
  height: 100px;
  background-color: white;
  border: 2px solid #7752fe;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px auto 15px auto;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    transform: scale(1.02);
  }
`;

const ScPostBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  font-family: arial;
  span {
    margin-right: 30px;
  }
  time {
    margin-left: auto;
  }
  div {
    margin: 18px;
  }
`;

const ScPageNation = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  width: 70%;
  right: 15%;
  top: 94%;
`;
const ScPageButton = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  border-radius: 3px;
  color: white;
  background-color: #8e8ffa;
  &:hover {
    background-color: #7752fe;
  }

  ${({isActive}) =>
    isActive &&
    `
    background-color: #7752fe;
  `}
`;

const ScWirteButton = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #7752fe;
  color: white;
  font-weight: bold;
  &:hover {
    background-color: #8e8ffa;
  }
  position: absolute;
  bottom: 15px;
  left: 90%;
  transform: translateX(-50%);
`;
const NoPostParty = styled.p`
  top: 50%;
  color: #190482;
  font-size: 30px;
  font-weight: bold;
  margin-top: 20px;
`;
export default TeamMateList;
