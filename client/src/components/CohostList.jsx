import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Cohost from './Cohost';
import { query } from '../utils';

const CohostListContainer = styled.div`
  display: none;
  .section-header {
    font-size: 16px;
    margin: 0 0 8px 0;
  }
  @media (min-width: ${query.large}) {
    display: block;
  }
`;

const CohostList = ({ cohosts }) => {
  const cohostList = cohosts.map((cohost, i) => <Cohost avatarUrl={cohost.avatarUrl} name={cohost.name} key={`${cohost.name}-${i}`} />);
  return (
    <CohostListContainer>
      <p className='section-header'>Co-hosts</p>
      { cohostList }
    </CohostListContainer>
  );
};

CohostList.propTypes = {
  cohosts: PropTypes.array.isRequired
};

export default CohostList;