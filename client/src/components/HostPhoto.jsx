import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const HostPhoto = ({ img }) => {
  return (
    <div>
      <img src={img} />
    </div>
  );
};

HostPhoto.propTypes = {
  img: PropTypes.string.isRequired,
};

export default HostPhoto;
