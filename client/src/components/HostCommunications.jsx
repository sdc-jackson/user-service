import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import PropTypes from 'prop-types';

const HostCommunicationsContainer = styled.div`
  p {
    font-size: 16px;
    font-weight: 300;
    line-height: 20px;
    margin: 0 0 8px 0;
  }
`;

const HostCommunications = ({ languages = [], responseRate, responseTime }) => {

  const languagesArrayToString = (array) => {
    let languageList;
    if (languages) {
      languages.length > 1 ? languageList = 'Languages:' : languageList = 'Language:';
      languages.forEach((language, i) => {
        languageList += ` ${language}`;
        if (languages.length - 1 !== i) {
          languageList += ',';
        }
      });
    }
    return languageList;
  };

  const hostLanguages = languagesArrayToString(languages);

  return (
    <HostCommunicationsContainer>
      {hostLanguages && <p>{ hostLanguages }</p>}
      <p>Response Rate: { responseRate }%</p>
      <p>Response Time: { responseTime }</p>
      <Button text='Contact host' link='#'/>
    </HostCommunicationsContainer>
  );
};

HostCommunications.propTypes = {
  languages: PropTypes.array,
  responseRate: PropTypes.number,
  responseTime: PropTypes.string
};

export default HostCommunications;