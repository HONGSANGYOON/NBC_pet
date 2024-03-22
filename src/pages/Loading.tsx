import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { opacity: 1 }
  100% { opacity: 0 }
`;

const SpinnerContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SpinnerAnimation = styled.div`
  width: 200px;
  height: 200px;
  position: relative;
`;

const SpinnerElement = styled.div`
  left: 96px;
  top: 54px;
  position: absolute;
  animation: ${spin} linear 1s infinite;
  background: #000000;
  width: 8px;
  height: 12px;
  border-radius: 1.68px / 1.68px;
  transform-origin: 4px 46px;
`;

const Loading = () => (
  <SpinnerContainer>
    <SpinnerAnimation>
      <SpinnerElement></SpinnerElement>
      <SpinnerElement style={{ transform: 'rotate(30deg)', animationDelay: '-0.833s' }}></SpinnerElement>
      <SpinnerElement style={{ transform: 'rotate(60deg)', animationDelay: '-0.75s' }}></SpinnerElement>
      <SpinnerElement style={{ transform: 'rotate(90deg)', animationDelay: '-0.667s' }}></SpinnerElement>
      <SpinnerElement style={{ transform: 'rotate(120deg)', animationDelay: '-0.583s' }}></SpinnerElement>
      <SpinnerElement style={{ transform: 'rotate(150deg)', animationDelay: '-0.5s' }}></SpinnerElement>
      <SpinnerElement style={{ transform: 'rotate(180deg)', animationDelay: '-0.417s' }}></SpinnerElement>
      <SpinnerElement style={{ transform: 'rotate(210deg)', animationDelay: '-0.333s' }}></SpinnerElement>
      <SpinnerElement style={{ transform: 'rotate(240deg)', animationDelay: '-0.25s' }}></SpinnerElement>
      <SpinnerElement style={{ transform: 'rotate(270deg)', animationDelay: '-0.167s' }}></SpinnerElement>
      <SpinnerElement style={{ transform: 'rotate(300deg)', animationDelay: '-0.083s' }}></SpinnerElement>
      <SpinnerElement style={{ transform: 'rotate(330deg)', animationDelay: '0s' }}></SpinnerElement>
    </SpinnerAnimation>
  </SpinnerContainer>
);

export default Loading;
