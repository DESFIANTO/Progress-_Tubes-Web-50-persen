import { i18n } from '@/i18n';
import { ElNotification } from 'element-plus';

export default class Message {
  static success(payload) {
    ElNotification({
      showClose: true,
      message: payload,
      type: 'success',
      duration: 6000,
    });
  }

  static error(payload) {
    let message = payload;

    if (!message) {
      message = i18n('errors.defaultErrorMessage');
    }
    // eslint-disable-next-line

    ElNotification({
      showClose: true,
      message,

      type: 'error',
      duration: 6000,
    });
  }
}
