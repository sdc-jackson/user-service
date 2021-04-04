import React from 'react';
import HostPhoto from './HostPhoto';
import HostDetails from './HostDetails';
const { styled } = window;
import PropTypes from 'prop-types';
import { query } from '../utils';

const HostIdContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
  @media (min-width: ${query.medium}) {
    align-items: center;
    flex-direction: row-reverse;
    justify-content: flex-end;
  }
`;

const HostId = ({ host }) => {
  return (
    <HostIdContainer>
      <HostDetails name={host.name} date={host.joinDate} />
      <HostPhoto img={host.avatarUrl} />
    </HostIdContainer>
  );
};

export default HostId;

HostId.propTypes = {
  host: PropTypes.object.isRequired
};