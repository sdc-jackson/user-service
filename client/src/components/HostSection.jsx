import React, { useState, useEffect } from 'react';
import HostId from './HostId';
import HostStats from './HostStats';
import HostDescription from './HostDescription';
import HostCommunications from './HostCommunications';
import Security from './Security';
const { styled } = window;
import axios from 'axios';
import { query } from '../utils';

const HostSectionContainer = styled.section`
  font-family: "Roboto";
  padding: 32px 24px;
  width: auto;
  @media (min-width: ${query.medium}) {
    padding: 48px 40px;
  }
  @media (min-width: ${query.large}) {
    padding: 48px 80px;
  }
`;

const SectionInnerContainer = styled.div`
  margin: 0 auto;
  max-width: 1128px;
  width: 100%;
`;

const TwoColumn = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: stretch;
  @media (min-width: ${query.medium}) {
    .col-one {
      width: 42%;
    }
    .col-two {
      width: 42%;
      margin-left: 8%;
    }
  }
`;

//original code for mongo
// const defaultState = {
//   'languages': [],
//   '_id': '',
//   'userId': null,
//   'name': '',
//   'joinDate': '',
//   'bio': '',
//   'avatarUrl': '',
//   'isSuperhost': null,
//   'identityVerified': null,
//   'responseRate': null,
//   'responseTime': '',
//   '__v': null
// };


const defaultState = {
  'userid': null,
  'joinDate:': '',
  'identityVerified:': null,
  'responserate:': null,
  'avatarUrl:': 'http://placeimg.com/640/480',
  'isSuperhost': null,
  'name': '',
  'languages': [],
  'during_stay': '',
  'bio': '',
  'responseTime': '',
  'reviewsCount': null

};

const HostSection = () => {
  const [host, setHost] = useState(defaultState);

  const fetchHostData = (id) => {
    axios.get(`/users/${id}`)
      .then(response => {
        return response.data;
      })
      .then(data => {
        setHost(data);
      })
      .catch(err => {
        console.log('Error in Host section : ', err);
      })

  }

  useEffect(() => {
    // const fetchHostData = async (id) => {
    //   const res = await axios.get(`/users/${id}`);
    //   console.log('res.data :', res.data);
    //   setHost(res.data);
    // };
    fetchHostData(window.location.pathname.split('/')[2]);
  }, []);

  return (

    <HostSectionContainer>
      <SectionInnerContainer>

        <HostId host={host} />
        <TwoColumn>
          <div className='col-one'>
            <HostStats
              isSuperhost={host.isSuperhost}
              isVerified={host.identityVerified}
              reviews={host.reviewsCount} // Needs data from another service
            />
            <HostDescription
              bio={host.bio}
              cohosts={[{ name: host.name, avatarUrl: host.avatarUrl }]}
              // duringYourStay={`My interaction with guests will be minimal. Although I may bump into you occasionally, we'll give you as much privacy as we can. Since I live in another house on the property, I'm always around if you need anything. Texting is best, but you can call or knock on my door if it's urgent.`} // Needs data from another service

              duringYourStay={host.during_stay} // created column in postgres and reading from there
              isSuperhost={host.isSuperhost}
              name={host.name}
            />
          </div>
          <div className='col-two'>
            <HostCommunications
              languages={host.languages}
              responseRate={host.responseRate}
              responseTime={host.responseTime}
            />
            <Security />
          </div>
        </TwoColumn>
      </SectionInnerContainer>
    </HostSectionContainer >

  );
};

export default HostSection;