import React from 'react';
import styled from 'styled-components';

export default function UserComments() {
  return (
    <>
      <Container>
        <BtnBox>
          <button>Like</button>
          <button>Dislike</button>
        </BtnBox>
        <CommentBox>
          <h3>123님에게 후기를 보내주세요!</h3>
          <form>
            <input />
            <button>send</button>
          </form>
          <ul className="comment-list">
            <li></li>
          </ul>
        </CommentBox>
      </Container>
    </>
  );
}

const Container = styled.div`
  color: black;
  display: flex;
  flex-direction: column;
  width: 1200px;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 12px;
  border-top: 1px solid #bbb;
`;

const BtnBox = styled.div`
  width: 600px;
  display: flex;
  margin: 0 auto;
  gap: 12px;
  margin: 20px 0;
  justify-content: center;
`;

const CommentBox = styled.div`
  width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-direction: column;
`;
