import InputMask from "react-input-mask";
import { Input } from "antd";

export default function PhoneMask(props) {
  return (
    <InputMask
      value={props.value}
      onChange={props.onChange}
      mask={"+1\\(999) 999-9999"}
      readOnly={props.read}
    >
      {() => {
        return <Input className="rounded-md" placeholder="+1(876) 123-4567" />;
      }}
    </InputMask>
  );
}
