import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import styled, {css} from 'styled-components';
import {useNavigate} from 'react-router-dom';
import moment from 'moment';
import {getAuth} from 'firebase/auth';

const PARTY_PAGE = 5;

const TeamMateList = ({filterCategory, isUserLoggedIn, filteredPosts, partyInput, onSearch}) => {
  const postparty = useSelector(state => state.postModule);
  const postm = useSelector(state => state.categoriModule);
  // 각 카테고리에 대한 현재 페이지를 저장하는 상태
  const [currentPage, setCurrentPage] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentPage[filterCategory]) {
      setCurrentPage(prev => ({
        ...prev,
        [filterCategory]: 1,
      }));
    }
  }, [filterCategory]);

  const startPageIndex = (currentPage[filterCategory] - 1) * PARTY_PAGE;
  const endPageIndex = startPageIndex + PARTY_PAGE;

  //전체페이지를 저장
  const totalPage = Math.ceil(postparty.filter(item => item.category === filterCategory).length / PARTY_PAGE);

  //지정한 카테고리에서 카테고리와 홈페이지jsx 에 filterCategory와 일치하는 구인글을 보여줌
  const currentPageList = onSearch
    ? filteredPosts
        .filter(item => item.category === filterCategory && item.postTitle.includes(partyInput))
        .sort((a, b) => b.postDate.seconds - a.postDate.seconds)
        .slice(startPageIndex, endPageIndex)
    : postparty
        .filter(item => item.category === filterCategory)
        .sort((a, b) => b.postDate.seconds - a.postDate.seconds)
        .slice(startPageIndex, endPageIndex);

  // 문자열의 길이가 이상이면 ... 나오게
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  };

  const moveDetailpage = postId => {
    navigate(`/detail/${postId}`);
  };

  //리듀서로 받아온 파티 총 인원을 보여줌
  const getCategoryPlayers = category => {
    const selectedCategory = postm.find(intro => intro.game === category);
    return selectedCategory ? selectedCategory.players : 0;
  };

  return (
    <ScTeammateSearchBox>
      {currentPageList.filter(item => item).length === 0 ? (
        <ScNoPostParty>파티구인 구직 글이 없습니다. 글을 작성해주세요.</ScNoPostParty>
      ) : (
        currentPageList.map(post => (
          <ScGameParty key={post.postId} onClick={() => moveDetailpage(post.postId)}>
            <ScPostBox>
              <ScCateGory>
                {post.category} ({post.currentParticipants} / {getCategoryPlayers(post.category)})
              </ScCateGory>
              <ScTitle>
                {truncate(post.postTitle, 15)} <span>[{post.comments.length}]</span>
              </ScTitle>
              <ScWriter
                $isUserLoggedIn={isUserLoggedIn}
                $userDisplayName={getAuth().currentUser?.displayName === post.author}
                $postAuthor={truncate(post.author, 7)}
              >
                {truncate(post.author, 7)}
              </ScWriter>
              <ScPartyTime>
                <time>{moment.unix(post.postDate.seconds).format('yyyy-MM-DD HH:mm')}</time>
              </ScPartyTime>
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
            $isActive={currentPage[filterCategory] === index + 1}
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
            navigate(`/write?category=${filterCategory}`);
          }}
        >
          글쓰기
        </ScWirteButton>
      )}
    </ScTeammateSearchBox>
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
  padding: 10px 0;
  background-color: white;
  border: 2px solid #7752fe;
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  justify-content: center;
  margin: 10px auto 15px auto;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    transform: scale(1.02);
  }
`;

const ScPostBox = styled.div`
  justify-content: space-between;
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

  ${({$isActive}) =>
    $isActive &&
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
const ScNoPostParty = styled.p`
  top: 50%;
  color: #190482;
  font-size: 30px;
  font-weight: bold;
  margin-top: 20px;
`;
const ScCateGory = styled.div`
  text-align: left;
  margin-top: 2px;
  margin-left: 20px;
  font-family: 'BeaufortforLOL';
  font-weight: bold;
`;
const ScTitle = styled.div`
  text-align: left;
  font-size: 25px;
  margin-left: 20px;
  margin-top: 10px;

  span {
    color: #495057;
    font-size: 20px;
  }
`;
const ScWriter = styled.span`
  text-align: right;
  margin-right: 30px;
  margin-bottom: 5px;
  display: block;
  letter-spacing: 5px;

  ${props =>
    props.$isUserLoggedIn &&
    props.$userDisplayName &&
    props.$postAuthor &&
    css`
      color: ${props.userDisplayName === props.postAuthor ? '#a68efd' : 'inherit'};
    `}
`;

const ScPartyTime = styled.div`
  text-align: right;
  margin-left: auto;
  width: 200px;
  margin-right: 10px;
`;
export default TeamMateList;
