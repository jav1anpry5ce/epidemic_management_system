import styled from "styled-components";
import { Card as C } from "@mui/material";

export const Card = styled(C)`
  border-radius: 11px;
  width: 335px;
  height: 145px;
  background-color: ${(props) => props.backgroundcolour};
  color: ${(props) => props.color};
  background-image: ${(props) => props.backgroundImage};

  &:hover {
    box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
`;
