import React from 'react';
import HostPhoto from './HostPhoto';
import HostDetails from './HostDetails';
import styled from 'styled-components';

const HostId = ({ host }) => {
  return (
    <div>
      <HostPhoto img={host.avatarUrl}/>
      <HostDetails name={host.name} date={host.joinDate}/>
    </div>
  );
};

export default HostId;