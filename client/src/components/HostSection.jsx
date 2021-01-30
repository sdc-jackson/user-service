import React, { useState, useEffect } from 'react';
import HostId from './HostId';
import HostStats from './HostStats';
import HostDescription from './HostDescription';
import HostCommunications from './HostCommunications';
import Security from './Security';
import styled from 'styled-components';
import axios from 'axios';
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

const defaultState = {
  'languages': [],
  '_id': '',
  'userId': null,
  'name': '',
  'joinDate': '',
  'bio': '',
  'avatarUrl': '',
  'isSuperhost': null,
  'identityVerified': null,
  'responseRate': null,
  'responseTime': '',
  '__v': null
};

const HostSection = () => {
  const [ host, setHost ] = useState(defaultState);

  useEffect(() => {

    const fetchHostData = async (id) => {
      const res = await axios.get(`/users/${id}`);
      setHost(res.data);
    };
    fetchHostData(window.location.pathname.split('/')[2]);
  }, []);

  return (
    <HostSectionContainer>
      <HostId host={host} />
      <HostStats
        isSuperhost={host.isSuperhost}
        isVerified={host.identityVerified}
        reviews={17} // Needs data from another service
      />
      <HostDescription
        bio={host.bio}
        cohosts={[{name: host.name, avatarUrl: host.avatarUrl }]}
        duringYourStay={`My interaction with guests will be minimal. Although I may bump into you occasionally, we'll give you as much privacy as we can. Since I live in another house on the property, I'm always around if you need anything. Texting is best, but you can call or knock on my door if it's urgent.`} // Needs data from another service
        isSuperhost={host.isSuperhost}
        name={host.name}
      />
      <HostCommunications
        languages={host.languages}
        responseRate={host.responseRate}
        responseTime={host.responseTime}
      />
      <Security />
    </HostSectionContainer>
  );
};

export default HostSection;