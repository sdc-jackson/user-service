import React, { useState } from 'react';
import HostId from './HostId';
import HostStats from './HostStats';
import HostDescription from './HostDescription';
import styled from 'styled-components';
import { data } from '../../../testdata';
import { query } from '../utils';

const HostSectionContainer = styled.section`
  width: 0 auto;
  padding: 32px 24px;
  @media (min-width: ${query.medium}) {
    padding: 48px 40px;
  }
  @media (min-width: ${query.large}) {
    padding: 48px 80px;
  }
`;

const HostSection = () => {
  const [ host, setHost ] = useState(data);
  return (
    <HostSectionContainer>
      <HostId host={host} />
      <HostStats
        isSuperhost={true || host.isSuperhost}
        isVerified={host.identityVerified}
        reviews={17} // Needs data from another service
      />
      <HostDescription
        bio={host.bio}
        cohosts={[{name: host.name, avatarUrl: host.avatarUrl }]}
        duringYourStay={`My interaction with guests will be minimal. Although I may bump into you occasionally, we'll give you as much privacy as we can. Since I live in another house on the property, I'm always around if you need anything. Texting is best, but you can call or knock on my door if it's urgent.`}
        isSuperhost={true || host.isSuperhost}
        name={host.name}
      />
    </HostSectionContainer>
  );
};

export default HostSection;