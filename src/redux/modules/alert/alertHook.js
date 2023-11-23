import {useDispatch} from 'react-redux';
import {hideAlert, showAlert} from './alertModule';
import {json} from 'react-router-dom';

export class AlertType {
  static noButton = 'noButton';
  static alert = 'alert';
  static confirm = 'confirm';
}

/**
 * HOW TO USE
 * alert(message): 전달한 message와 확인 버튼이 포함된 알람을 띄운다.
 * twinkle(message, ?millis) 전달한 message와 확인 버튼이 없는 알람을 띄운다. millis를 지정하지 않으면 1초 뒤에 꺼진다.
 * confirm(message, yesCb, noCb) 전달한 message와 예, 아니오 버튼 알람을 띄운다. 버튼 클릭시 yesCb, noCb 에 전달한 콜백 함수가 실행 된다.
 *
 * const alert = useAlert();
 * alert.alert("안녕하세요");
 * alert.twinkle("하이", 2000);
 * alert.confirm("삭제하시겠습니까?", () => {}, () => {)}
 */
export const useAlert = () => {
  const dispatch = useDispatch();

  return class {
    // 확인 버튼과 알람
    static alert(message) {
      dispatch(showAlert(message, AlertType.alert));
    }
    // 확인 버튼 없이 millis 만큼 있다가 사라지는 알람
    static twinkle(message, millis = 1000) {
      dispatch(showAlert(message, AlertType.noButton));

      setTimeout(() => {
        dispatch(hideAlert());
      }, millis);
    }
    // 예 아니오 버튼
    static confirm(message, yesCb, noCb) {
      if (typeof yesCb !== 'function') yesCb = () => dispatch(hideAlert());
      if (typeof noCb !== 'function') noCb = () => dispatch(hideAlert());

      dispatch(showAlert(message, AlertType.confirm, yesCb, noCb));
    }
  };
};
