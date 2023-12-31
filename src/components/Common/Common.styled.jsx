import styled from 'styled-components';

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

export const CenterVertical = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`;

export const Button = styled.button`
  border: none;
  background-color: #7752fe;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  font-family: 'MaplestoryOTFLight', serif !important;
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid lightgrey;
  border-radius: 5px;
  padding: 15px;
`;

export default CenterContainer;
