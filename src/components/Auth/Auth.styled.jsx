import styled from 'styled-components';

export const ScWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const ScContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ScForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50vw;
  height: fit-content;
  padding: 40px 40px 20px 40px;
  box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
  border-radius: 10px;

  h1 {
    font-size: 2rem;
  }

  p {
    margin: 10px 0 20px 0;
    font-size: 1.1rem;
  }
`;

export const ScSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: max-content;
  margin: 20px 0 10px 0;

  div {
    display: flex;
    align-items: center;
  }
`;

export const ValidationMessage = styled.span`
  color: ${({$isValid}) => ($isValid ? '#40c057' : '#f03e3e')};
  margin-top: 10px;
`;
