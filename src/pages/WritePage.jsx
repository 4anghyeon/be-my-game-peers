import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from '../../node_modules/react-redux/es/exports';
import {addPost, fetchData, setData} from 'redux/modules/PostModule';
import {getAuth} from 'firebase/auth';
import {v4 as uuid} from 'uuid';
import {collection, addDoc} from 'firebase/firestore';

import styled from 'styled-components';
import CenterContainer, {Button, Input} from 'components/Common/Common.styled';
import {useNavigate} from '../../node_modules/react-router-dom/dist/index';
import {useAlert} from 'redux/modules/alert/alertHook';
import {db} from 'shared/firebase';

const WritePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categoryInfo = useSelector(state => state.categoriModule);

  const alert = useAlert();
  const [needPlayers, setNeedPlayers] = useState(0);
  const [players, setPlayers] = useState(0);

  const [inputs, setInputs] = useState({
    postTitle: '',
    postContent: '',
    category: 'LEAGUE OF LEGENDS',
    currentParticipants: 1,
  });

  useEffect(() => {
    // 로그인 안 되어 있으면 다시 메인으로..
    if (!getAuth().currentUser) navigate('/');
  }, []);

  // 1. 게임카테고리가 변하면 -> 현재 인원수(=최대파티원수)가 동적으로 변경
  useEffect(() => {
    let selectedCategory = categoryInfo.find(item => item.game === inputs.category);
    setInputs({
      ...inputs,
      currentParticipants: 1,
    });
    if (selectedCategory) {
      setPlayers(selectedCategory.players);
    }
  }, [inputs.category]);

  // 2. 현재 인원수가 변하면 -> 필요 인원수가 변경
  useEffect(() => {
    let selectedCategory = categoryInfo.find(item => item.game === inputs.category);
    if (selectedCategory) {
      setNeedPlayers(selectedCategory.players - inputs.currentParticipants);
    }
  }, [inputs.currentParticipants]);

  // 게시글 등록
  const submitForm = async e => {
    e.preventDefault();
    const newPost = {
      postId: uuid(),
      postTitle: inputs.postTitle,
      postContent: inputs.postContent,
      author: getAuth().currentUser.displayName,
      postDate: new Date(),
      category: inputs.category,
      currentParticipants: inputs.currentParticipants,
      needPlayers,
      comments: [],
    };

    if (inputs.postTitle.trim().length === 0 || inputs.postContent.trim().length === 0) {
      alert.alert('제목과 내용을 입력해주세요');
      return;
    }
    await addDoc(collection(db, 'posts'), newPost);
    const allData = await fetchData();

    if (allData) {
      dispatch(setData(allData));
      setInputs({
        postTitle: '',
        postContent: '',
        category: 'select',
        currentParticipants: 1,
      });
      alert.twinkle('글이 등록되었습니다!');
      navigate(`/detail/${newPost.postId}`);
    }
  };

  // input 변경
  const changeInput = e => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  // 게시글 작성 취소
  const cancelPost = () => {
    navigate('/');
  };

  return (
    <CenterContainer>
      <ScFormGroup onSubmit={submitForm}>
        <h1>게시글 작성</h1>
        <ScWriteElementGroup>
          <label htmlFor="postTitle">글제목</label>
          <Input
            id="postTitle"
            type="text"
            placeholder="제목을 입력하세요"
            name="postTitle"
            value={inputs.postTitle}
            onChange={changeInput}
          />
        </ScWriteElementGroup>
        <ScSelect name="category" id="category" value={inputs.category} onChange={changeInput}>
          <option value="LEAGUE OF LEGENDS">리그오브레전드</option>
          <option value="OVERWATCH">오버워치</option>
          <option value="STARCRAFT">스타크래프트</option>
          <option value="VALLORANT">발로란트</option>
        </ScSelect>
        <ScWriteElementGroup>
          <label htmlFor="currentParticipants">현재 인원수</label>
          <ScSelect
            name="currentParticipants"
            id="currentParticipants"
            value={inputs.currentParticipants}
            onChange={changeInput}
          >
            {new Array(players).fill(true).map((v, i) => {
              return (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              );
            })}
          </ScSelect>
        </ScWriteElementGroup>
        <ScWriteElementGroup>
          <p>필요인원수 : {needPlayers}</p>
        </ScWriteElementGroup>
        <ScWriteElementGroup>
          <ScTextarea
            name="postContent"
            id="postContent"
            value={inputs.postContent}
            placeholder="내용을 입력하세요"
            onChange={changeInput}
          />
        </ScWriteElementGroup>
        <ScBtnGroup>
          <ScRegisterBtn>게시글 등록</ScRegisterBtn>
          <ScCancelBtn onClick={cancelPost}>취소</ScCancelBtn>
        </ScBtnGroup>
      </ScFormGroup>
    </CenterContainer>
  );
};

const ScFormGroup = styled.form`
  box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 30px;
  width: 70%;
  height: 80%;

  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
  }

  label {
    display: inline-block;
  }

  input {
    width: 80%;
  }
`;

const ScSelect = styled.select`
  width: 80%;
  border: 1px solid lightgrey;
  border-radius: 5px;
  padding: 10px;
`;

const ScTextarea = styled.textarea`
  width: 100%;
  height: 200px;
  border: 1px solid lightgrey;
  border-radius: 5px;
  padding: 15px;
  resize: none;
`;

const ScWriteElementGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  text-align: center;
`;

const ScBtnGroup = styled.div`
  display: flex;
`;

const ScRegisterBtn = styled(Button)`
  padding: 10px 20px;
  margin-right: 10px;
`;

const ScCancelBtn = styled(Button)`
  background-color: #8e8ffa;
  padding: 10px 20px;
`;

export default WritePage;
