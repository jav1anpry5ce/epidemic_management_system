import React from "react";
import InputMask from "react-input-mask";
import { Input } from "antd";

export default function TRNMask(props) {
  return (
    <InputMask
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      mask={"999-999-999"}
      readOnly={props.read}
    >
      {() => {
        return <Input placeholder="123-456-789" />;
      }}
    </InputMask>
  );
}
