import React from 'react';
const { styled } = window;
import PropTypes from 'prop-types';
import { colors, query } from '../utils';

const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 32px 0 0 0;
  @media (min-width: ${query.medium}) {
    display: block;
    text-align: left;
  }
`;

const StyledButton = styled.a`
  border: 1px solid ${colors.mineshaft};
  border-radius: 8px;
  color: ${colors.mineshaft};
  display: inline-block;
  font-size: 16px;
  font-weight: 500;
  padding: 13px 23px;
  text-decoration: none;
  :hover {
    background-color: #EEEEEE;
  }
`;

const Button = ({ text, link }) => {
  return (
    <StyledButtonContainer>
      <StyledButton href={link}>{ text }</StyledButton>
    </StyledButtonContainer>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  link: PropTypes.string,
};

export default Button;