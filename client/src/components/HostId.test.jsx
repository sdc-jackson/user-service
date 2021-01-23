import React from 'react';
import { render, screen } from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom';
import HostId from './HostId';

jest.mock('./HostDetails', () => () => <div data-testid='host-details'></div>);
jest.mock('./HostPhoto', () => () => <div data-testid='host-photo'></div>);

describe('HostId', () => {

  const props = {
    host: {
      avatarUrl: 'http://placekitten.com/75/75',
      name: 'Travis',
      joinDate: 'Fri Aug 14 2020 21:23:21 GMT-0700 (Pacific Daylight Time)',
    }
  };

  test('should render expected child components', () => {

    const { getByTestId } = render(<HostId {...props} />);
    const hostDetails = screen.getByTestId('host-details');
    const hostPhoto = screen.getByTestId('host-details');
    expect(hostDetails).toBeInTheDocument();
    expect(hostPhoto).toBeInTheDocument();

  });

});