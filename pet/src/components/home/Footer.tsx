import React from 'react';
import styled from 'styled-components';
import logo from '../../assets/images/logo.png';
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Footers>
      <Div>
        <FooterLogo>
          <img src={logo} alt={'footer logo'} />
        </FooterLogo>
        <P>© {currentYear} </P>
        <Links>
          <a href="/">쿠키 정책</a>
          <a href="/">고객 서비스 가이드</a>
        </Links>
      </Div>
    </Footers>
  );
};

const Footers = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f6f7c4;
`;

const FooterLogo = styled.div`
  justify-content: flex-start;

  img {
    width: 100px; // 로고 이미지의 너비 조정
    height: auto; // 높이를 자동으로 조절하여 비율 유지
  }
`;
const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 96%;
  max-width: 1100px;
  height: 100%;
`;

const P = styled.p``;
const Links = styled.p`
  margin-right: 10px;
  text-decoration: none;
  color: #333;
  font-family: GmarketSansMedium;

  a:hover {
    margin-right: 10px;
    text-decoration: underline;
  }
`;

export default Footer;
