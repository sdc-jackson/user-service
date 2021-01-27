import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { query } from '../utils';

const HostStatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  @media (min-width: ${query.medium}) {
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }
`;

const StatText = styled.p`
  font-size: 1.6rem;
  margin: 0 0 16px 0;
  padding: 0 12px;
`;

const HostStats = ({ isSuperhost, isVerified, reviews }) => {
  return (
    <HostStatsContainer>
      {reviews && <StatText>⭐️ {reviews} Reviews</StatText>}
      {isVerified && <StatText>🛡 Identity verified</StatText>}
      {isSuperhost && <StatText>🎖 Superhost</StatText>}
    </HostStatsContainer>
  );
};

HostStats.propTypes = {
  isSuperhost: PropTypes.boolean,
  isVerified: PropTypes.boolean,
  reviews: PropTypes.number
};

export default HostStats;