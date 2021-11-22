import React from "react";
import { Container, ItemContainer, Item, Title } from "./Elements";

export default function Footer() {
  return (
    <Container>
      <ItemContainer>
        <Item>
          <Title>© 2021 Ministry of Health & Wellness Jamaica.</Title>
        </Item>
        <Item style={{ marginTop: -26 }}>
          <Title>Site developed by Blue Star Technologies Solution.</Title>
        </Item>
      </ItemContainer>
    </Container>
  );
}
