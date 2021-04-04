import React from 'react';
const { styled } = window;
import PropTypes from 'prop-types';
import { colors, months, query } from '../utils';


const HostName = styled.h2`
  color: ${colors.mineshaft};
  font-size: 22px;
  font-weight: 400;
  margin: 0;
`;

const JoinedText = styled.div`
  color: ${colors.dovegray};
  font-size: 14px;
  padding-top: 8px;
`;

const HostDetails = ({ name, date }) => {
  // const month = date ? months[date.split(' ')[0]] : null;
  // const year = date ? date.split(' ')[3] : null;

  //need to look into how to avoid warnings for required fields
  // console.log('Host details name : ', name);
  // console.log('Host details date : ', date);

  var options = { month: 'long' };
  const month = date ? (new Intl.DateTimeFormat('en-US', options).format(new Date(date))) : null;
  const year = date ? (new Date(date)).getFullYear() : null;

  return (
    <div>
      <HostName>Hosted by {name}</HostName>
      {date ? (<JoinedText>Joined in {`${month} ${year}`}</JoinedText>) : null}
    </div>
  );
};

export default HostDetails;

HostDetails.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};
