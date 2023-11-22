import React from 'react';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

const TeamMateList = () => {
  const postparty = useSelector(state => state.PostModule);

  const partypage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const startPageIndex = (currentPage - 1) * partypage;
  const endPageIndex = startPageIndex + partypage;

  const totalPage = Math.ceil(postparty.length / partypage);
  const currentPageList = postparty.slice(startPageIndex, endPageIndex);

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  };
  return (
    <>
      <ScTeammateSearchBox>
        {currentPageList.map(post => (
          <ScGameParty key={post.postId}>
            <ScPostBox>
              <span>[{post.postId}]</span>
              <div>
                ({post.category}) {truncate(post.postTitle, 5)}
              </div>
              <div>{post.currentParticipants}</div>
              <span>{post.author}</span>
              <time>{post.postDate}</time>
            </ScPostBox>
          </ScGameParty>
        ))}
        <ScPageNation>
          {Array.from({length: totalPage}, (_, index) => (
            <ScPageButton key={index} onClick={() => setCurrentPage(index + 1)} isActive={currentPage === index + 1}>
              {index + 1}
            </ScPageButton>
          ))}
        </ScPageNation>
        <ScWirteButton>글쓰기</ScWirteButton>
      </ScTeammateSearchBox>
    </>
  );
};

const ScTeammateSearchBox = styled.div`
  width: 800px;
  height: 650px;
  margin: 0 auto;
  background-color: #c2d9ff;

  border-radius: 5px;
  text-align: center;
  align-items: flex-start;
  justify-content: center;
`;
const ScGameParty = styled.div`
  width: 650px;
  height: 100px;
  background-color: white;
  border: 2px solid black;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px auto 15px auto;
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
    margin: 10px;
  }
`;
const ScPageNation = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;
const ScPageButton = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  border-radius: 3px;
  background-color: #ddd;
  &:hover {
    background-color: #bbb;
  }
`;
const ScWirteButton = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #ddd;
  &:hover {
    background-color: #bbb;
  }
  margin-left: 600px;
`;
export default TeamMateList;
