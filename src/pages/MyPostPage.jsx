import React, {useEffect, useState} from 'react';
import {CenterVertical} from 'components/Common/Common.styled';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {auth} from '../shared/firebase/firebase';
import {useNavigate} from 'react-router-dom';
import {useAlert} from '../redux/modules/alert/alertHook';
import MyPostListContainer from '../components/UserDetail/MyPostListContainer';

export default function MyPost() {
  const posts = useSelector(state => state.postModule);

  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [selectedPost, setSelectedPost] = useState([]);

  const alert = useAlert();

  const navigate = useNavigate();

  const currentUser = auth.currentUser;

  const comments = posts.reduce((acc, cur) => {
    const filtered = cur.comments
      .filter(c => c.userEmail === currentUserEmail)
      .map(c => {
        return {
          postId: cur.postId,
          postTitle: cur.postTitle,
          category: cur.category,
          postDate: cur.postDate,
          ...c,
        };
      });
    if (filtered.length > 0) return [...acc, ...filtered];
    return acc;
  }, []);

  useEffect(() => {
    if (!currentUser) {
      alert.twinkle('로그인이 필요합니다.', 1500);
      navigate('/login');
    } else {
      const currentEmail = currentUser.email;
      setCurrentUserEmail(currentEmail);
      setSelectedPost(posts.filter(post => post.authorEmail === currentEmail));
    }
  }, []);

  // 내 게시물
  return (
    <CenterVertical>
      <ScWrapper>
        <h3>내가 쓴 게시물 ({selectedPost.length})</h3>
        <MyPostListContainer list={selectedPost} />
      </ScWrapper>
      <ScWrapper className="myComment">
        <h3>내가 쓴 댓글 ({comments.length})</h3>
        {comments.length === 0 ? (
          `${currentUser.displayName}님이 작성한 댓글이 없습니다.`
        ) : (
          <MyPostListContainer list={comments} />
        )}
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
    margin-bottom: 10px;
  }
`;
