import React from 'react';
import { render, screen } from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom';
import HostSection from './HostSection';

jest.mock('./HostId', () => () => <div data-testid='host-id'></div>);

describe('HostSection', () => {

  const props = {
    '_id': {
      '$oid': '60079bdc5e6046463c1d54b6'
    },
    'languages': ['Cambodian', 'Thai'],
    'userId': {
      '$numberInt': '106'
    },
    'name': 'Ursula',
    'joinDate': 'Fri Aug 14 2020 21:23:21 GMT-0700 (Pacific Daylight Time)',
    'bio': 'Quis voluptatum quis id dolorem illo nobis illum cumque qui. Natus autem officia. Aut blanditiis nisi aut aspernatur. In et voluptas sint.',
    'avatarUrl': 'https://fec-gnocchi-user-profile.s3.us-west-2.amazonaws.com/1611026757110.jpg',
    'isSuperhost': false,
    'identityVerified': true,
    'responseRate': {
      '$numberInt': '100'
    },
    'responseTime': {
      '$numberInt': '117'
    },
    '__v': {
      '$numberInt': '0'
    }
  };

  test('should render the HostId component', () => {

    const { getByTestId } = render(<HostSection {...props} />);
    const element = screen.getByTestId('host-id');
    expect(element).toBeInTheDocument();

  });

});