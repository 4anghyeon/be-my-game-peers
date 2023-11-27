import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from '../../node_modules/react-redux/es/exports';
import {Link, useNavigate, useParams} from '../../node_modules/react-router-dom/dist/index';
import {getAuth} from 'firebase/auth';
import {v4 as uuid} from 'uuid';
import {setData} from 'redux/modules/PostModule';
import {MessageText, Menu} from 'iconoir-react';
import moment from 'moment';

import styled from 'styled-components';
import CenterContainer, {Button, Input} from 'components/Common/Common.styled';
import {useAlert} from 'redux/modules/alert/alertHook';
import {hideAlert} from 'redux/modules/alert/alertModule';

import {db} from 'shared/firebase/firebase';
import {collection, query, getDocs, doc, deleteDoc, updateDoc} from 'firebase/firestore';
import {sendMessage} from '../shared/firebase/query';

const DetailPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const {id} = params;
  const textAreaRef = useRef();
  const alert = useAlert();

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState({
    postTitle: '',
    postDate: '',
    comments: [],
  });
  const [postAuthor, setPostAuthor] = useState('');
  const [postAuthorEmail, setPostAuthorEmail] = useState('');

  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [editedText, setEditedText] = useState(selectedPost?.postContent);
  const currentUser = getAuth().currentUser;

  const fetchData = async () => {
    const q = query(collection(db, 'posts'));
    const querySnapshot = await getDocs(q);

    const initialPosts = [];
    querySnapshot.forEach(doc => {
      initialPosts.push({...doc.data(), id: doc.id});
    });

    setPosts(initialPosts);
    return initialPosts;
  };

  // 최신 데이터 가져오기
  useEffect(() => {
    fetchData().then(posts => {
      const post = posts.find(post => post.postId === id);
      if (post) {
        setSelectedPost(post);
        setPostAuthor(post.author);
        setPostAuthorEmail(post.authorEmail);
        setCommentList(posts.comments);
      } else {
        navigate('/nodetail');
      }
    });
  }, []);

  useEffect(() => {
    fetchData().then(posts => {
      const post = posts.find(post => post.postId === id);
      if (post) {
        setSelectedPost(post);
        setPostAuthor(post.author);
        setPostAuthorEmail(post.authorEmail);
        setEditedText(post.postContent);
      }
    });
  }, [commentList]);

  // comment input 변경
  const changeCommentText = e => {
    setComment(e.target.value);
  };

  // content input 변경
  const changeContentText = e => {
    setEditedText(e.target.value);
  };

  // comment 등록
  const addComment = async e => {
    e.preventDefault();

    // 로그인 되어있지 않으면
    if (!currentUser) {
      alert.alert('로그인 후 이용해주세요');
      return;
    }

    // 아무 값도 입력하지 않으면
    if (comment.trim().length === 0) {
      alert.alert('댓글 내용을 입력해주세요');
      return;
    }
    const newComment = {
      commentId: uuid(),
      userId: currentUser && currentUser.displayName,
      userEmail: currentUser && currentUser.email,
      content: comment,
      commentDate: new Date(),
    };

    const commentRef = doc(db, 'posts', selectedPost.id);
    await updateDoc(commentRef, {...selectedPost, comments: [...selectedPost.comments, newComment]});
    const allData = await fetchData();
    if (allData) {
      setCommentList([...selectedPost.comments, newComment]);
      dispatch(setData(allData));
    }

    // 알림보내기
    if (postAuthorEmail !== currentUser.email) {
      sendMessage(
        postAuthorEmail,
        `${currentUser.displayName}님이 ${selectedPost.postTitle} 글에 댓글을 남겼습니다.`,
        id,
        'post',
      );
    }

    setComment('');
  };

  // comment 삭제
  const deleteComment = async (commentId, selectedPostId) => {
    const commentRef = doc(db, 'posts', selectedPostId);
    const updateComment = selectedPost.comments.filter(comment => comment.commentId !== commentId);
    await updateDoc(commentRef, {...selectedPost, comments: updateComment});
    setCommentList(updateComment);
    setIsEdit(false);
    setEditedText(editedText);
    alert.alert('삭제되었습니다');
  };

  // 게시글 수정
  const editPost = async id => {
    // 수정상태이고 수정 사항이 없으면
    if (isEdit && selectedPost.postContent.trim() === editedText.trim()) {
      alert.alert('수정내용이 없습니다');
      return;
    }

    // 수정
    if (isEdit) {
      const postRef = doc(db, 'posts', id);
      await updateDoc(postRef, {...selectedPost, postContent: editedText});
      const allData = await fetchData();
      if (allData) {
        dispatch(setData(allData));
      }
      setIsEdit(false);
      setEditedText(editedText);
      alert.alert('수정되었습니다');
      return;
    }

    // 수정상태가 아니면
    setIsEdit(true);
  };

  // 게시글 삭제
  const deletePost = async id => {
    alert.confirm('정말 삭제하시겠습니까?', async () => {
      const postRef = doc(db, 'posts', id);
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

  // 목록(=홈)으로 이동
  const moveToHome = () => {
    navigate('/');
  };

  return (
    <ScVerticalContainer>
      <ScDetailElementGroup>
        <h1>{selectedPost?.postTitle}</h1>
        <ScPostDetailGroup>
          <ScPostDetailHeader>
            <ScAuthorAndDateGroup>
              <Link to={`/user/${postAuthorEmail}`}>
                <span>{postAuthor} </span>
              </Link>
              <time>
                &#183;{' '}
                {moment.unix(selectedPost?.postDate && selectedPost?.postDate.seconds).format('yyyy-MM-DD HH:mm')}
              </time>
            </ScAuthorAndDateGroup>
            <span> 필요 인원수 : {selectedPost?.needPlayers}</span>
          </ScPostDetailHeader>
          {isEdit && <ScTextarea value={editedText} onChange={changeContentText} ref={textAreaRef} />}
          {!isEdit && <ScTextarea disabled value={editedText} />}
          {currentUser && currentUser.email === postAuthorEmail ? (
            <ScBtnGroup>
              <ScEditBtn onClick={() => editPost(selectedPost.id)}>수정</ScEditBtn>
              <ScDeleteBtn onClick={() => deletePost(selectedPost.id)}>삭제</ScDeleteBtn>
            </ScBtnGroup>
          ) : null}
        </ScPostDetailGroup>
        <hr />
        <ScCommentTitle>
          <MessageText />
          <span>댓글 ({selectedPost?.comments && selectedPost?.comments.length})</span>
        </ScCommentTitle>
        <ScCommentFormGroup onSubmit={addComment}>
          <Input type="text" placeholder="댓글을 입력해주세요" value={comment} onChange={changeCommentText} />
          <ScRegisterBtn>등록</ScRegisterBtn>
        </ScCommentFormGroup>
        <SCCommentGroup>
          {selectedPost?.comments.length > 0 ? (
            selectedPost?.comments.map(item => (
              <div key={item.commentId}>
                <span>
                  <Link to={`/user/${item.userEmail}`}>{item.userId}</Link>
                </span>

                <ScCommentContent $editable={currentUser && currentUser.email === item.userEmail}>
                  {item.content}
                </ScCommentContent>

                {currentUser && currentUser.email === item.userEmail && (
                  <ScDeleteButton onClick={() => deleteComment(item.commentId, selectedPost.id)}>삭제</ScDeleteButton>
                )}
              </div>
            ))
          ) : (
            <p>'등록된 댓글이 없습니다 댓글을 등록해주세요'</p>
          )}
        </SCCommentGroup>
        <ScMoveToHomeBtn onClick={moveToHome}>
          <Menu strokeWidth={2.5} />
          목록으로
        </ScMoveToHomeBtn>
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
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 50px 30px;
  width: 70%;
  height: 90%;

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
  height: 100%;
  padding: 20px;
  border-radius: 10px;

  span {
    display: inline-block;
    text-align: right;
  }

  a {
    color: #7752fe;
  }
`;

const ScPostDetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 16px;
`;

const ScAuthorAndDateGroup = styled.div`
  width: 30%;
`;

const ScTextarea = styled.textarea`
  background-color: #fff;
  color: #000;
  width: 100%;
  height: 60%;
  border: none;
  border-radius: 5px;
  padding: 15px;
  resize: none;
`;

const ScBtnGroup = styled.div`
  text-align: right;
  margin: 10px 0 10px 0;
  padding-bottom: 30px;
`;

const ScEditBtn = styled(Button)`
  padding: 10px 20px;
  margin-right: 10px;
`;

const ScDeleteBtn = styled(Button)`
  background-color: #8e8ffa;
  padding: 10px 20px;
`;

const ScCommentTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    margin-right: 4px;
  }

  span {
    display: inline-block;
  }
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

  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 30%;
  overflow-y: auto;
  margin: 0 10px;

  div {
    display: flex;
    align-items: center;
    width: 100%;
  }

  span {
    display: inline-block;
    text-align: center;
    width: 25%;
  }

  a {
    color: #7752fe;
  }

  p {
    padding-left: 15px;
  }
`;

const ScCommentContent = styled.p`
  width: ${props => (props.$editable ? '100%' : '125%')};
  background-color: #eee;
  padding: 10px;
  border-radius: 10px;
  max-height: 100px;
  overflow: auto;
  margin-right: 10px;
`;

const ScDeleteButton = styled(Button)`
  padding: 10px;
  margin-right: 10px;
  background-color: #ff8787;
  color: white;
  width: 20%;
`;

const ScMoveToHomeBtn = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background-color: #8a84fb;

  svg {
    margin-right: 4px;
  }
`;

export default DetailPage;
