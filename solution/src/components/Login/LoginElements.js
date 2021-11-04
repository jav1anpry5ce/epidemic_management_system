import styled from "styled-components";

export const Card = styled.div`
  border-radius: 10px;
  border: 1px solid;
  background-color: black;
  color: white;
  padding: 7px;
`;
export const Input = styled.input`
  display: flex;
  justify-content: center;
  width: ${({ block }) => (block ? "100%" : "55%")};
  color: black;
  border-radius: 5px;
`;

export const Button = styled.button`
  color: black;
  border-radius: 4px;
  height: 35px;
  width: 100%;
  background-color: ${(props) => props.color};
  transition: 0.2s ease-in-out;

  &:hover {
    background-color: white;
    transition: 0.2s ease-in-out;
  }
`;
