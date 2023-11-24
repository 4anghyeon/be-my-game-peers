import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from '../../node_modules/react-redux/es/exports';
import {Link, useNavigate, useParams} from '../../node_modules/react-router-dom/dist/index';
import {getAuth} from 'firebase/auth';
import {v4 as uuid} from 'uuid';
import {addComment, deletePost, editPost, fetchData, setData} from 'redux/modules/PostModule';

import styled from 'styled-components';
import CenterContainer, {Button, Input} from 'components/Common/Common.styled';
import {useAlert} from 'redux/modules/alert/alertHook';
import {hideAlert} from 'redux/modules/alert/alertModule';

import {db} from 'shared/firebase/firebase';
import {collection, query, getDocs, doc, deleteDoc, updateDoc} from 'firebase/firestore';
import {sendMessage} from '../shared/firebase/query';

const DetailPage = () => {
  // const posts = useSelector(state => state.PostModule);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const {id} = params;
  const textAreaRef = useRef();
  const alert = useAlert();

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState({
    postTitle: '',
  });
  const [postAuthor, setPostAuthor] = useState('');
  const [postAuthorEmail, setPostAuthorEmail] = useState('');

  // 최신 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'posts'));
      const querySnapshot = await getDocs(q);

      const initialPosts = [];
      querySnapshot.forEach(doc => {
        initialPosts.push({...doc.data(), id: doc.id});
      });

      console.log('test', initialPosts);
      setPosts(initialPosts);
      return initialPosts;
    };
    // 수정한 부분!!!!
    fetchData().then(posts => {
      const post = posts.find(post => post.postId === id);
      setSelectedPost(post);

      setPostAuthor(post.author);
      setPostAuthorEmail(post.authorEmail);
    });
  }, []);

  // const selectedPost = posts.find(post => post.postId === id);
  const [comment, setComment] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [editedText, setEditedText] = useState('');
  const currentUser = getAuth().currentUser;

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
    if (!currentUser) {
      alert.alert('로그인 후 이용해주세요');
      return;
    }
    const newComment = {
      commentId: uuid(),
      userId: currentUser && currentUser.displayName,
      content: comment,
      commentDate: new Date(),
    };

    if (comment.trim().length === 0) {
      alert.alert('댓글 내용을 입력해주세요');
      return;
    }
    setComment('');
    dispatch(addComment({id, newComment}));
    if (postAuthorEmail !== currentUser.email)
      sendMessage(
        postAuthorEmail,
        `${currentUser.displayName}님이 ${selectedPost.postTitle} 글에 댓글을 남겼습니다.`,
        id,
        'post',
      );
  };

  const editPost = async id => {
    if (!isEdit) {
      setIsEdit(true);
      setEditedText(selectedPost.postContent);
      console.log('성공');
    }

    if (isEdit && selectedPost.postContent.trim() === editedText.trim()) {
      alert.alert('수정내용이 없습니다');
      return;
    }

    if (isEdit) {
      const postRef = doc(db, 'posts', id);
      await updateDoc(postRef, {...selectedPost, postContent: editedText});
      const allData = await fetchData();
      if (allData) {
        dispatch(setData(allData));
      }
    }
  };

  // 게시글 삭제
  const deletePost = async id => {
    alert.confirm('정말 삭제하시겠습니까?', async () => {
      const postRef = doc(db, 'posts', id);
      console.log(id);
      await deleteDoc(postRef);
      const allNewList = await fetchData();
      dispatch(setData(allNewList));
      navigate('/');
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
          <Link to={`/user/${postAuthorEmail}`}>
            <span>작성자 : {postAuthor}</span>
          </Link>
          {isEdit && <ScTextarea value={editedText} onChange={changeContentText} ref={textAreaRef} />}
          {!isEdit && <ScTextarea disabled value={selectedPost.postContent} />}
          <ScNeedPlayersSpan> 필요 인원수 : {selectedPost.needPlayers}</ScNeedPlayersSpan>

          {currentUser && currentUser.email === postAuthorEmail ? (
            <ScBtnGroup>
              <ScEditBtn onClick={() => editPost(selectedPost.id)}>수정</ScEditBtn>
              <ScDeleteBtn onClick={() => deletePost(selectedPost.id)}>삭제</ScDeleteBtn>
            </ScBtnGroup>
          ) : null}
        </ScPostDetailGroup>

        <hr />
        <ScCommentFormGroup onSubmit={HandleSubmitComment}>
          <Input type="text" placeholder="댓글을 입력해주세요" value={comment} onChange={changeCommentText} />
          <ScRegisterBtn>등록</ScRegisterBtn>
        </ScCommentFormGroup>

        <SCCommentGroup>
          {selectedPost.comments &&
            selectedPost.comments.map(item => (
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
