import React from 'react';
import {CenterVertical} from 'components/Common/Common.styled';
import {useSelector} from '../../node_modules/react-redux/es/hooks/useSelector';
import styled from 'styled-components';

import {getAuth} from 'firebase/auth';

export default function MyPost() {
  const getUserInfo = getAuth().currentUser.email;
  console.log(getUserInfo);
  const posts = useSelector(state => state.PostModule);
  console.log(posts);

  const selectedPost = posts.filter(post => post.authorEmail === getUserInfo);
  console.log(selectedPost);

  const comments = useSelector(state => state.PostModule);
  const selectedComments = comments.filter(comment => comment.commentId);
  console.log(selectedComments);

  // 내 게시물
  return (
    <CenterVertical>
      <ScWrapper>
        <h3>`내가 쓴 게시물 ({selectedPost.length})</h3>
        <ScMyPost>
          {posts
            .filter(post => post.authorEmail === getUserInfo)
            .map(list => {
              return (
                <li key={list.id}>
                  <h4 className="title">{list.postTitle}</h4>
                  <p className="content">{list.postContent}</p>
                  <p className="writer">작성자 : {list.author}</p>
                </li>
              );
            })}
        </ScMyPost>
      </ScWrapper>
      <ScWrapper className="myComment">
        <h3>내가 쓴 댓글</h3>
        <ScMyPost>
          {selectedComments.length === 0
            ? `${getUserInfo.displayName}님이 작성한 댓글이 없습니다.`
            : comments
                .filter(comment => comment.authorEmail === getUserInfo)
                .map(list => {
                  return (
                    <li key={list.id}>
                      <p className="content">{list.content}</p>
                      <p className="writer">작성자 : {list.userId}</p>
                    </li>
                  );
                })}
        </ScMyPost>
      </ScWrapper>
    </CenterVertical>
  );
}

const ScWrapper = styled.div`
  width: 90%;
  min-height: 300px;
  padding: 20px;
  gap: 10px;

  h3 {
    color: #7752fe;
    font-size: 1.2rem;
  }
`;

const ScMyPost = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  height: 100%;
  padding: 10px;
  gap: 12px;

  li {
    border: 1px solid #333;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    height: 40px;
    border: 1px solid lightgrey;
    border-radius: 5px;
    padding: 10px;

    .title {
      width: 200px;
    }

    .content {
      width: 300px;
    }

    .writer {
      font-size: 14px;
      color: #333;
    }
  }
`;
