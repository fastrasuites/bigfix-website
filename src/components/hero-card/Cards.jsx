import React from "react";
import styled from "styled-components";
import { FaUserCheck, FaUserTie, FaLightbulb } from "react-icons/fa"; // Example icons

const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Card = styled.div`
  flex: 1;
  min-width: 300px;
  background-color: ${({ bgColor }) => bgColor || "white"};
  color: ${({ textColor }) => textColor || "#040610"};
  padding: 20px;
  text-align: center;
`;

const IconWrapper = styled.div`
  font-size: 48px;
  margin-bottom: 10px;
`;

const HeaderText = styled.h4`
  font-size: 1.2em;
  color: ${({ color }) => color || "#040610"};
`;

const DescriptionText = styled.p`
  color: ${({ color }) => color || "#5C6C7B"};
`;

const CardComponent = ({
  icon: Icon,
  headerText,
  description,
  bgColor,
  headerColor,
  descColor,
}) => (
  <Card bgColor={bgColor} textColor={headerColor}>
    <IconWrapper>
      <Icon />
    </IconWrapper>
    <HeaderText color={headerColor}>{headerText}</HeaderText>
    <DescriptionText color={descColor}>{description}</DescriptionText>
  </Card>
);

const Cards = () => (
  <CardContainer>
    <CardComponent
      icon={FaUserCheck}
      headerText="Expert Guidance"
      description="Leverage the wisdom of industry leaders. Our team of seasoned experts is here to guide you through every decision."
      bgColor="white"
      headerColor="#040610"
      descColor="#5C6C7B"
    />
    <CardComponent
      icon={FaUserTie}
      headerText="Tailored Solutions"
      description="Get custom solutions designed to meet your unique business needs."
      bgColor="#0D3B66"
      headerColor="#FFFFFF"
      descColor="#B3CDE0"
    />
    <CardComponent
      icon={FaLightbulb}
      headerText="Innovative Ideas"
      description="Unlock creative strategies that propel your business forward."
      bgColor="white"
      headerColor="#040610"
      descColor="#5C6C7B"
    />
  </CardContainer>
);

export default Cards;
