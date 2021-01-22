import React, { useState } from 'react';
import HostId from './HostId';
import { data } from '../../../testdata';
import styled from 'styled-components';

const HostSection = () => {
  const [ host, setHost ] = useState(data);
  return (
    <div>
      <HostId host={host} />
    </div>
  );
};

export default HostSection;