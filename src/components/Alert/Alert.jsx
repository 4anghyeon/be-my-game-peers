import React, {useRef} from 'react';
import styled from 'styled-components';
import CenterContainer, {Button} from '../Common/Common.styled';
import {useDispatch, useSelector} from 'react-redux';
import {hideAlert} from '../../redux/modules/alert/alertModule';
import {AlertType} from '../../redux/modules/alert/alertHook';

const Alert = () => {
  const {show, message, type, yesCb, noCb} = useSelector(state => state.alertModule);
  const overlayRef = useRef(null);
  const dispatch = useDispatch();

  const onClickOverlay = e => {
    if (e.target === overlayRef.current) {
      dispatch(hideAlert());
    }
  };

  return (
    <>
      {show && (
        <ScAlertOverlay onClick={onClickOverlay} ref={overlayRef}>
          <ScAlertContainer>
            <p>{message}</p>
            {type === AlertType.alert && (
              <div>
                <ScConfirmButton onClick={() => dispatch(hideAlert())}>확인</ScConfirmButton>
              </div>
            )}
            {type === AlertType.confirm && (
              <ScButtonContainer>
                <ScYesButton onClick={yesCb}>예</ScYesButton>
                <ScNoButton onClick={noCb}>아니오</ScNoButton>
              </ScButtonContainer>
            )}
          </ScAlertContainer>
        </ScAlertOverlay>
      )}
    </>
  );
};

const ScAlertOverlay = styled(CenterContainer)`
  position: fixed;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.3);
`;

const ScAlertContainer = styled.section`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  height: 140px;
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

const ScButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ScConfirmButton = styled(Button)`
  width: 50px;
  height: 40px;
`;

const ScYesButton = styled(ScConfirmButton)`
  background-color: #7752fe;
`;

const ScNoButton = styled(ScConfirmButton)`
  margin-left: 10px;
  background-color: #8e8ffa;
`;

export default Alert;
