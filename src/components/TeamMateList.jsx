import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';

const TeamMateList = ({filterCategory, isUserLoggedIn, filteredPosts, partyInput, onSearch}) => {
  const postparty = useSelector(state => state.PostModule);
  const navigate = useNavigate();
  const partypage = 5;
  console.log(filteredPosts);
  // 각 카테고리에 대한 현재 페이지를 저장하는 상태
  const [currentPage, setCurrentPage] = useState(1);

  const startPageIndex = (currentPage - 1) * partypage;
  const endPageIndex = startPageIndex + partypage;

  const totalPage = Math.ceil(postparty.filter(item => item.category === filterCategory).length / partypage);

  const currentPageList = onSearch
    ? filteredPosts
        .filter(item => item.category === filterCategory && item.postTitle.includes(partyInput))
        .slice(startPageIndex, endPageIndex)
    : postparty.filter(item => item.category === filterCategory).slice(startPageIndex, endPageIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, partyInput, filteredPosts, onSearch]);

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  };
  const moveDetailpage = postId => {
    navigate(`/detail/${postId}`);
  };
  return (
    <>
      <ScTeammateSearchBox>
        {currentPageList.map(post => (
          <ScGameParty key={post.postId} onClick={() => moveDetailpage(post.postId)}>
            <ScPostBox>
              <span>[{post.postId}]</span>
              <div>
                ({post.category}) {truncate(post.postTitle, 5)}
              </div>
              <div>{post.currentParticipants}</div>
              <span>{truncate(post.author, 5)}</span>
              <time>{post.postDate}</time>
            </ScPostBox>
          </ScGameParty>
        ))}
        <ScPageNation>
          {totalPage > 1 && <ScPageButton onClick={() => setCurrentPage(currentPage - 1)}>이전</ScPageButton>}
          {Array.from({length: totalPage}, (_, index) => (
            <ScPageButton key={index} onClick={() => setCurrentPage(index + 1)} isActive={currentPage === index + 1}>
              {index + 1}
            </ScPageButton>
          ))}
          {currentPage < totalPage && <ScPageButton onClick={() => setCurrentPage(currentPage + 1)}>다음</ScPageButton>}
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
  position: absolute; /* absolute로 설정 */
  width: 70%;
  right: 15%;
  top: 94%; /* 조정이 필요한 위치로 설정 */
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
  position: absolute; /* absolute로 설정 */
  bottom: 15px; /* 조정이 필요한 위치로 설정 */
  left: 90%;
  transform: translateX(-50%);
`;
export default TeamMateList;
