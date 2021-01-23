import React from 'react';
import { render } from '@testing-library/react';
import HostDetails from './HostDetails';

describe('HostDetails', () => {

  const props = {
    name: 'Travis',
    date: 'Fri Aug 14 2020 21:23:21 GMT-0700 (Pacific Daylight Time)',
  };

  test('should render host name', () => {

    const { getByText } = render(<HostDetails {...props} />);
    const nameNode = getByText('Hosted by Travis');
    expect(nameNode).toBeDefined();

  });

  test('should render host join date', () => {

    const { getByText } = render(<HostDetails {...props} />);
    const dateNode = getByText('Joined in August 2020');
    expect(dateNode).toBeDefined();

  });

});