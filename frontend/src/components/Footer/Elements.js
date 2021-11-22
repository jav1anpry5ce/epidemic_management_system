import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: rgba(18, 20, 43);
`;

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 85%;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Item = styled.div`
  padding: 5px;
  display: flex;
  justify-content: center;
`;

export const Title = styled.h4`
  color: white;
  font-size: 15px;
  font-weight: 300px;
`;
