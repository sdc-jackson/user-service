import React from 'react';
const { styled } = window;
import PropTypes from 'prop-types';
import { query } from '../utils';

const CirclePhoto = styled.img`
  border-radius: 50%;
  height: 48px;
  width: 48px;
  @media (min-width: ${query.medium}) {
    height: 56px;
    width: 56px;
    margin-right: 16px;
  }
  @media (min-width: ${query.large}) {
    height: 64px;
    width: 64px;
  }
`;

const HostPhoto = ({ img }) => {
  return (
    <div>
      <a href='#'>
        <CirclePhoto src={img} />
      </a>
    </div>
  );
};

HostPhoto.propTypes = {
  img: PropTypes.string.isRequired,
};

export default HostPhoto;
