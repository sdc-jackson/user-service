import React from 'react';
import HostPhoto from './HostPhoto';
import HostDetails from './HostDetails';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const HostId = ({ host }) => {
  return (
    <div>
      <HostPhoto img={host.avatarUrl}/>
      <HostDetails name={host.name} date={host.joinDate}/>
    </div>
  );
};

export default HostId;

HostId.propTypes = {
  host: PropTypes.object.isRequired
};