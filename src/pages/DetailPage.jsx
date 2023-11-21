import React, {useState} from 'react';
import {useDispatch, useSelector} from '../../node_modules/react-redux/es/exports';
import {useParams} from '../../node_modules/react-router-dom/dist/index';
import {addComment} from 'redux/modules/PostModule';

const DetailPage = () => {
  const posts = useSelector(state => state.PostModule);
  const dispatch = useDispatch();
  const params = useParams();
  const {id} = params;
  const [comment, setComment] = useState('');

  const selectedPost = posts.filter(post => post.postId === id)[0];

  console.log(selectedPost.postTitle);

  const submitComment = e => {
    e.preventDefault();
    const newComment = {
      commentId: '댓글123',
      userId: '댓글작성자',
      content: comment,
      commentDate: new Date(),
    };
    dispatch(addComment({id, newComment}));
  };

  const changeInput = e => {
    setComment(e.target.value);
  };

  return (
    <>
      {/* {posts.map(item => {
        if (item.postId === id) {
          return (
            <div>
              <div key={item.postId}>
                <div>{item.postTitle}</div>
                <div>{item.postContent}</div>
              </div>
              <form onSubmit={submitComment}>
                <input type="text" placeholder="댓글을 입력해주세요" value={comment} onChange={changeInput} />
                <button>등록</button>
              </form>
              {item.comment ? (
                <div>
                  <div>{item.comment[0].content}</div>
                  <div>{item.comment[1].content}</div>
                </div>
              ) : null}
            </div>
          );
        }
      })} */}
      <div>{selectedPost.postTitle}</div>
      <div>{selectedPost.postContent}</div>{' '}
      <form onSubmit={submitComment}>
        <input type="text" placeholder="댓글을 입력해주세요" value={comment} onChange={changeInput} />
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
