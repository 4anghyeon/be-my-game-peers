import React, {useEffect, useState} from 'react';
import {CenterVertical} from 'components/Common/Common.styled';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {auth} from '../shared/firebase/firebase';
import {useNavigate} from 'react-router-dom';
import {useAlert} from '../redux/modules/alert/alertHook';
import moment from 'moment/moment';

export default function MyPost() {
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [selectedPost, setSelectedPost] = useState([]);
  const alert = useAlert();

  const navigate = useNavigate();
  const posts = useSelector(state => state.PostModule);

  // TODO: comments!!
  const comments = useSelector(state => state.PostModule);

  const currentUser = auth.currentUser;
  const selectedComments = comments.filter(comment => comment.commentId);

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

  const onClickPost = id => {
    navigate(`/detail/${id}`);
  };

  // 내 게시물
  return (
    <CenterVertical>
      <ScWrapper>
        <h3>내가 쓴 게시물 ({selectedPost.length})</h3>
        <ScMyPost>
          {selectedPost.map(list => {
            return (
              <li key={list.id} onClick={onClickPost.bind(null, list.postId)}>
                <h4 className="title">[{list.category}]</h4>
                <h4 className="title">{list.postTitle}</h4>
                <h4 className="title">{moment.unix(list.postDate.seconds).format('yyyy-MM-DD HH:mm')}</h4>
              </li>
            );
          })}
        </ScMyPost>
      </ScWrapper>
      <ScWrapper className="myComment">
        <h3>내가 쓴 댓글</h3>
        <ScMyPost>
          {selectedComments.length === 0
            ? `${currentUserEmail.displayName}님이 작성한 댓글이 없습니다.`
            : comments
                .filter(comment => comment.authorEmail === currentUserEmail)
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    height: 40px;
    border: 1px solid lightgrey;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;

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
