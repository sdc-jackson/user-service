import React from 'react';
import HostPhoto from './HostPhoto';
import HostDetails from './HostDetails';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { query } from '../utils';

const HostIdContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media (min-width: ${query.medium}) {
    align-items: center;
    flex-direction: row-reverse;
    justify-content: flex-end;
  }
  @media (min-width: ${query.large}) {

  }
`;

const HostId = ({ host }) => {
  return (
    <HostIdContainer>
      <HostDetails name={host.name} date={host.joinDate}/>
      <HostPhoto img={host.avatarUrl}/>
    </HostIdContainer>
  );
};

export default HostId;

HostId.propTypes = {
  host: PropTypes.object.isRequired
};