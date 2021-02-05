import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const CohostPhoto = styled.img`
  border-radius: 50%;
  height: 40px;
  width: 40px;
`;

const CohostName = styled.p`
  font-size: 16px;
  font-weight: 300;
  margin: 0 0 0 12px;
`;

const CohostContainer = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  text-decoration: none;
`;

const Cohost = ({ avatarUrl, name }) => {
  return (
    <CohostContainer>
      <a href='#'>
        <CohostPhoto src={avatarUrl} />
      </a>
      <CohostName>{ name }</CohostName>
    </CohostContainer>
  );
};

Cohost.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default Cohost;