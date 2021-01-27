import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { colors, months, query } from '../utils';

const HostName = styled.h2`
  color: ${colors.mineshaft};
  font-size: 2.2rem;
  margin: 0;
`;

const JoinedText = styled.div`
  color: ${colors.dovegray};
  font-size: 1.4rem;
  padding-top: 8px;
`;

const HostDetails = ({ name, date }) => {
  const month = months[date.split(' ')[1]];
  const year = date.split(' ')[3];
  return (
    <div>
      <HostName>Hosted by { name }</HostName>
      <JoinedText>Joined in {`${month} ${year}`}</JoinedText>
    </div>
  );
};

export default HostDetails;

HostDetails.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};
