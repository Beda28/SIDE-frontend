import React from "react";
import styled from "styled-components";

const LoadingScreen = ({ progress }) => {
  return (
    <Container>
      <Title progress={progress}>SIDE</Title>
      <Percent>{progress}%</Percent>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0f0f0f;
`;

const Title = styled.h1`
  font-size: 7rem;
  font-weight: 1000;
  /* letter-spacing: 0.2em; */

  background: ${({ progress }) => `linear-gradient(to right, #565656 ${progress}%, #242424 ${progress}%)`};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 0.5px #868686;

  background-clip: text;
  color: transparent;

  transition: background 0.2s ease;
`;

const Percent = styled.p`
  margin-top: 1rem;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
`;

export default LoadingScreen;
