import React, {useState} from 'react';
import {useDispatch} from '../../node_modules/react-redux/es/exports';
import {addPost} from 'redux/modules/PostModule';

const WritePage = () => {
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({
    postTitle: '',
    postContent: '',
    category: 'select',
    currentParticipants: '1',
  });

  const submitForm = e => {
    e.preventDefault();
    const newPost = {
      postId: '',
      postTitle: inputs.postTitle,
      postContent: inputs.postContent,
      author: '겜돌이',
      postDate: new Date(),
      category: inputs.category,
      currentParticipants: inputs.currentParticipants,
      comment: [],
    };
    dispatch(addPost(newPost));
    setInputs({
      postTitle: '',
      postContent: '',
      category: 'select',
      currentParticipants: '1',
    });
  };

  const changeInput = e => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <form onSubmit={submitForm}>
      <div>
        <label htmlFor="postTitle">글제목</label>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          name="postTitle"
          value={inputs.postTitle}
          onChange={changeInput}
        />
      </div>
      <select name="category" id="category" value={inputs.category} onChange={changeInput}>
        <option value="select">게임선택</option>
        <option value="lol">리그오브레전드</option>
        <option value="overwatch">오버워치</option>
        <option value="starcraft">스타크래프트</option>
        <option value="lolchess">롤토체스</option>
        <option value="valorant">발로란트</option>
      </select>
      <div>
        <label htmlFor="Participants">현재 인원수</label>
        <select name="Participants" id="Participants" value={inputs.currentParticipants} onChange={changeInput}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <span>필요인원수 : 2</span>
      </div>
      <div>
        <textarea
          name="postContent"
          id="postContent"
          value={inputs.postContent}
          placeholder="내용을 입력하세요"
          onChange={changeInput}
        />
      </div>
      <button>게시글 등록</button>
    </form>
  );
};

export default WritePage;
