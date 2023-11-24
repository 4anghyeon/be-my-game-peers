import React from 'react';
import moment from 'moment';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';

const MyPostListContainer = ({list}) => {
  const navigate = useNavigate();

  const onClickPost = id => {
    navigate(`/detail/${id}`);
  };

  return (
    <ScMyPost>
      {list.map(list => {
        return (
          <li key={list.id} onClick={onClickPost.bind(null, list.postId)}>
            <h4 className="title">[{list.category}]</h4>
            <h4 className="title">{list.postTitle}</h4>
            <h4 className="title">{moment.unix(list.postDate.seconds).format('yyyy-MM-DD HH:mm')}</h4>
          </li>
        );
      })}
    </ScMyPost>
  );
};

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

export default MyPostListContainer;
