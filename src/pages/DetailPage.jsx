import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from '../../node_modules/react-redux/es/exports';
import {Link, useNavigate, useParams} from '../../node_modules/react-router-dom/dist/index';
import {getAuth} from 'firebase/auth';
import {v4 as uuid} from 'uuid';
import {addComment, deletePost, editPost} from 'redux/modules/PostModule';

import styled from 'styled-components';
import CenterContainer, {Button, Input} from 'components/Common/Common.styled';
import {useAlert} from 'redux/modules/alert/alertHook';
import {hideAlert} from 'redux/modules/alert/alertModule';

const DetailPage = () => {
  const posts = useSelector(state => state.PostModule);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const {id} = params;
  const textAreaRef = useRef();
  const alert = useAlert();

  const selectedPost = posts.find(post => post.postId === id);
  const [comment, setComment] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [editedText, setEditedText] = useState(selectedPost.postContent);

  const currentUser = getAuth().currentUser;
  const currentAuthor = currentUser ? currentUser.displayName || 'Guest' : 'Guest';
  const postedAuthor = selectedPost.author;
  const postedAuthorEmail = selectedPost.authorEmail;

  console.log(postedAuthorEmail);

  // comment input 변경
  const changeCommentText = e => {
    setComment(e.target.value);
  };

  // content input 변경
  const changeContentText = e => {
    setEditedText(e.target.value);
  };

  // comment 등록
  const HandleSubmitComment = e => {
    e.preventDefault();
    const newComment = {
      commentId: uuid(),
      userId: getAuth().currentUser.displayName,
      content: comment,
      commentDate: new Date(),
    };
    if (comment.trim().length === 0) {
      alert.alert('댓글 내용을 입력해주세요');
      return;
    }
    setComment('');
    dispatch(addComment({id, newComment}));
  };

  // 수정 상태 토글
  const handleEditPost = () => {
    if (!isEdit) setIsEdit(true);

    if (isEdit && selectedPost.postContent.trim() === editedText.trim()) {
      alert.alert('수정내용이 없습니다');
      return;
    }

    if (isEdit) {
      alert.confirm(
        '이대로 수정하시겠습니까?',
        () => {
          dispatch(editPost({id, editedText}));
          setIsEdit(false);
          dispatch(hideAlert());
        },
        () => {
          setEditedText(selectedPost.postContent);
          setIsEdit(false);
          dispatch(hideAlert());
        },
      );
    }
  };

  // 게시글 삭제
  const HandleDeletePost = () => {
    alert.confirm('정말 삭제하시겠습니까?', () => {
      dispatch(deletePost(id));
      navigate('/write');
      dispatch(hideAlert());
    });
  };

  // 텍스트의 끝으로 커서를 이동 (focus)
  useEffect(() => {
    if (isEdit) {
      const textArea = textAreaRef.current;
      if (textArea) {
        textArea.focus();
        textArea.setSelectionRange(textArea.value.length, textArea.value.length);
      }
    }
  }, [isEdit]);

  return (
    <ScVerticalContainer>
      <ScDetailElementGroup>
        <h1>{selectedPost.postTitle}</h1>
        <ScPostDetailGroup>
          {currentUser ? (
            <Link to={`/user/${postedAuthorEmail}`}>
              <span>작성자 : {postedAuthor}</span>
            </Link>
          ) : (
            <span>작성자 : Guest</span>
          )}
          {isEdit && <ScTextarea value={editedText} onChange={changeContentText} ref={textAreaRef} />}
          {!isEdit && <ScTextarea disabled value={selectedPost.postContent} />}
          <ScNeedPlayersSpan> 필요 인원수 : {selectedPost.needPlayers}</ScNeedPlayersSpan>

          {currentAuthor === postedAuthor ? (
            <ScBtnGroup>
              <ScEditBtn onClick={handleEditPost}>수정</ScEditBtn>
              <ScDeleteBtn onClick={HandleDeletePost}>삭제</ScDeleteBtn>
            </ScBtnGroup>
          ) : null}
        </ScPostDetailGroup>

        <hr />
        <ScCommentFormGroup onSubmit={HandleSubmitComment}>
          <Input type="text" placeholder="댓글을 입력해주세요" value={comment} onChange={changeCommentText} />
          <ScRegisterBtn>등록</ScRegisterBtn>
        </ScCommentFormGroup>

        <SCCommentGroup>
          {selectedPost.comments.map(item => (
            <div key={item.postId}>
              <span>{item.userId}</span>
              <p>{item.content}</p>
            </div>
          ))}
        </SCCommentGroup>
      </ScDetailElementGroup>
    </ScVerticalContainer>
  );
};

const ScVerticalContainer = styled(CenterContainer)`
  flex-direction: column;
  padding: 20px;
  overflow: auto;
`;

const ScDetailElementGroup = styled.div`
  box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 30px;
  width: 70%;
  height: 80%;

  hr {
    border: 1px solid lightgrey;
    width: 100%;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 10px;
  }
`;

const ScPostDetailGroup = styled.div`
  background-color: #eee;
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  min-height: 40%;
  position: relative;

  span {
    display: inline-block;
    margin-bottom: 10px;
    text-align: right;
  }
`;

const ScTextarea = styled.textarea`
  background-color: #fff;
  color: #000;
  width: 100%;
  border: none;
  border-radius: 5px;
  padding: 15px;
  resize: none;
`;

const ScNeedPlayersSpan = styled.span`
  position: absolute;
  bottom: 30px;
  left: 20px;
`;

const ScBtnGroup = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  text-align: right;
`;

const ScEditBtn = styled(Button)`
  padding: 10px 20px;
  margin-right: 10px;
`;

const ScDeleteBtn = styled(Button)`
  background-color: #8e8ffa;
  padding: 10px 20px;
`;

const ScCommentFormGroup = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const ScRegisterBtn = styled(Button)`
  width: 100px;
  padding: 15px;
  margin-left: 10px;
`;

const SCCommentGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  overflow-y: auto;

  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  span {
    display: inline-block;
    text-align: center;
    width: 18%;
  }

  p {
    width: 80%;
    background-color: #eee;
    padding: 10px;
    border-radius: 10px;
    max-height: 100px;
    overflow: auto;
    margin-right: 10px;
  }
`;

export default DetailPage;
