import React, {useRef} from 'react';
import styled from 'styled-components';
import CenterContainer from '../Common/Common.styled';
import {useDispatch, useSelector} from 'react-redux';
import {hideModal} from '../../redux/modules/modal/modalModule';

const Modal = ({children}) => {
  const {show} = useSelector(state => state.modalModule);
  const overlayRef = useRef(null);
  const dispatch = useDispatch();

  const onClickOverlay = e => {
    if (e.target === overlayRef.current) {
      dispatch(hideModal());
    }
  };

  return (
    <>
      {show && (
        <ScModalOverlay onClick={onClickOverlay} ref={overlayRef}>
          <ScModalContainer>{children}</ScModalContainer>
        </ScModalOverlay>
      )}
    </>
  );
};

const ScModalOverlay = styled(CenterContainer)`
  position: fixed;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.5);
  height: 100%;
`;

const ScModalContainer = styled.section`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  height: fit-content;
  background-color: white;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.35) 0 5px 15px;
  padding: 20px;

  p {
    font-size: 1.5rem;
  }

  animation: show-popup 0.3s;

  @keyframes show-popup {
    0% {
      transform: scale(0.7);

      opacity: 0;
    }
    45% {
      transform: scale(1.05);

      opacity: 1;
    }
    80% {
      transform: scale(0.95);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export default Modal;
