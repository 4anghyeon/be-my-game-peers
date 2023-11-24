import React, {useEffect, useState} from 'react';
import newBell from '../../../assets/img/new-bell.png';
import bell from '../../../assets/img/bell.png';
import styled from 'styled-components';
import {onValue, ref} from 'firebase/database';
import {realTimeDb} from '../../../shared/firebase/firebase';
import {useNavigate} from 'react-router-dom';
import {deleteMessage} from '../../../shared/firebase/query';

const Message = ({onClickOpenMessageList, showMessageList, setShowMessageList, currentUser}) => {
  const [newMessage, setNewMessage] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      // 로그인한 유저는 realtime database의 이메일/message 경로를 구독한다.
      // 해당 경로에 값이 변경 될 때마다 아래 이벤트가 발생한다.
      const messageRef = ref(realTimeDb, `${currentUser.email.replace(/\./g, '')}/message`);
      onValue(messageRef, snapshot => {
        const data = snapshot.val();
        if (data) {
          const messages = Object.entries(data);
          const unCheckedList = messages.filter(message => !message[1].check);
          if (unCheckedList.length > 0) setNewMessage(true);
          setMessageList(
            messages.map(m => {
              return {...m[1], id: m[0]};
            }),
          );
        }
      });
    }
  }, []);

  useEffect(() => {
    if (messageList.length > 0) setNewMessage(true);
    else setNewMessage(false);
  }, [messageList]);

  const onClickMessage = async message => {
    navigate(`/detail/${message.postId}`);
    await deleteMessage(currentUser.email, message.id);
    setMessageList(prev => prev.filter(v => v.id !== message.id));
    setShowMessageList(false);
  };

  return (
    <>
      {newMessage ? (
        <ScBell key={messageList.length} $img={newBell} onClick={onClickOpenMessageList}></ScBell>
      ) : (
        <ScBell $img={bell} onClick={onClickOpenMessageList}></ScBell>
      )}
      <ScMessageContainer>
        {showMessageList &&
          messageList.map(row => (
            <ScMessageRow key={row.id} onClick={onClickMessage.bind(null, row)}>
              {row.message}
            </ScMessageRow>
          ))}
      </ScMessageContainer>
    </>
  );
};

const ScBell = styled.div`
  background-image: url(${({$img}) => $img});
  background-size: cover;
  width: 40px;
  height: 40px;
  margin-right: 20px;
  cursor: pointer;

  animation: shake 0.5s;
  @keyframes shake {
    0% {
      transform: scale(0.7);
    }
    45% {
      transform: scale(1) rotate(20deg);
    }
    80% {
      transform: scale(0.95) rotate(-20deg);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const ScMessageContainer = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  width: fit-content;
  z-index: 200;
`;

const ScMessageRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: fit-content;
  height: 50px;
  cursor: pointer;

  &:hover {
    background: #c2d9ff;
  }
`;

export default Message;
