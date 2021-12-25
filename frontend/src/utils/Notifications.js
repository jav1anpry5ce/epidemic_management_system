import { notification } from "antd";
export function open(type, message, description) {
  notification[type]({
    message: message,
    description: description,
  });
}
