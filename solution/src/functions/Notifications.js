import { Notification } from "rsuite";

export function open(funcName, title, description) {
  Notification[funcName]({
    title: title,
    placement: "topEnd",
    description: description,
  });
}
