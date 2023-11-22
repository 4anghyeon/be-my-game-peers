import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from '../../node_modules/react-redux/es/exports';
import {useNavigate, useParams} from '../../node_modules/react-router-dom/dist/index';
import {addComment, deletePost, editPost} from 'redux/modules/PostModule';
import {getAuth} from 'firebase/auth';

const DetailPage = () => {
  const posts = useSelector(state => state.PostModule);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const {id} = params;

  const selectedPost = posts.find(post => post.postId === id);
  const [comment, setComment] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [editedText, setEditedText] = useState(selectedPost.postContent);

  const changeCommentText = e => {
    setComment(e.target.value);
  };

  const changeContentText = e => {
    setEditedText(e.target.value);
  };

  const HandleSubmitComment = e => {
    e.preventDefault();
    const newComment = {
      commentId: '댓글123',
      userId: '댓글작성자',
      content: comment,
      commentDate: new Date(),
    };
    setComment('');
    dispatch(addComment({id, newComment}));
  };

  const handleEditPost = () => {
    setIsEdit(isEdit => !isEdit);
    dispatch(editPost({id, editedText}));
  };

  const HandleDeletePost = () => {
    dispatch(deletePost(id));
    navigate('/write');
  };

  return (
    <>
      <div>
        <div>{selectedPost.postTitle}</div>
        {isEdit && <textarea value={editedText} onChange={changeContentText} />}
        {!isEdit && <div>{selectedPost.postContent}</div>}
        <button onClick={handleEditPost}>수정</button>
        <button onClick={HandleDeletePost}>삭제</button>
      </div>
      <form onSubmit={HandleSubmitComment}>
        <input type="text" placeholder="댓글을 입력해주세요" value={comment} onChange={changeCommentText} />
        <button>등록</button>
      </form>
      {selectedPost.comments.map(item => (
        <div>
          <div>{item.userId}</div>
          <div>{item.content}</div>
        </div>
      ))}
    </>
  );
};

export default DetailPage;
