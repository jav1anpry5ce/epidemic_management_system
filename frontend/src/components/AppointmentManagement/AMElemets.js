import styled from "styled-components";
import { Button as B } from "rsuite";

export const Button = styled(B)`
  background-color: ${(props) => props.color};
  color: #fff;

  &:hover {
    box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.2);
    transition: 0.4s ease-in-out;
  }
`;
