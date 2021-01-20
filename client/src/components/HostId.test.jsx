import React from 'react';
import { render } from '@testing-library/react';
import HostId from './HostId';

describe('HostDetails', () => {

  const props = {
    host: {
      avatarUrl: 'http://placekitten.com/75/75',
      name: 'Travis',
      joinDate: 'Fri Aug 14 2020 21:23:21 GMT-0700 (Pacific Daylight Time)',
    }
  };

  test('should render host name', () => {

    const { getByRole } = render(<HostId {...props} />);
    const imgNode = getByRole('img');
    expect(imgNode).toBeDefined();

  });

  test('should render host name', () => {

    const { getByText } = render(<HostId {...props} />);
    const nameNode = getByText('Hosted by Travis');
    expect(nameNode).toBeDefined();

  });

  test('should render host join date', () => {

    const { getByText } = render(<HostId {...props} />);
    const dateNode = getByText('Joined in August 2020');
    expect(dateNode).toBeDefined();

  });

});