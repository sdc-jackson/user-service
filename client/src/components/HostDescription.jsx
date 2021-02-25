import React, { useState, useEffect } from 'react';
const { styled } = window;
import PropTypes from 'prop-types';
import CohostList from './CohostList';
import { query } from '../utils';

const HostDescriptionContainer = styled.div`
  .section-header {
    font-size: 16px;
    margin: 0 0 8px 0;
  }
`;

const HostDescriptionSection = styled.div`
  margin-bottom: 24px;
  p {
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    margin: 0;
  }
  .section-header {
    font-weight: 400;
    line-height: 24px;
  }
`;

const HostDescription = ({ bio, cohosts = [], duringYourStay, isSuperhost, name }) => {

  const [ shortBio, setShortBio ] = useState(null);

  useEffect(() => {
    if (bio && bio.length > 180) {
      setShortBio(bio.slice(0, 180) + '...');
    }
  }, []);

  return (
    <HostDescriptionContainer>
      {bio &&
        <HostDescriptionSection>
          { shortBio
            ? <p>{ shortBio }<a href='#' onClick={() => setShortBio(null)}>read more</a></p>
            : <p>{ bio }</p> }
        </HostDescriptionSection>
      }
      {cohosts.length > 0 && <CohostList cohosts={cohosts} />}
      {duringYourStay &&
        <HostDescriptionSection>
          <p className='section-header'>During your stay</p>
          <p>{ duringYourStay }</p>
        </HostDescriptionSection>
      }
      {isSuperhost &&
        <HostDescriptionSection>
          <p className='section-header'>{ name } is a Superhost</p>
          <p>Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
        </HostDescriptionSection>
      }
    </HostDescriptionContainer>
  );
};

HostDescription.propTypes = {
  bio: PropTypes.string,
  cohosts: PropTypes.array,
  duringYourStay: PropTypes.string,
  isSuperhost: PropTypes.bool,
  name: PropTypes.string,
};

export default HostDescription;