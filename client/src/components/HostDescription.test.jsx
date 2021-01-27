import React from 'react';
import { render, screen } from '@testing-library/react';
import HostDescription from './HostDescription';

describe('HostDescription', () => {

  test('should render all elements when all props are provided or truthy', () => {

    const props = {
      bio: 'It was the best of times, it was the worst of times ...',
      cohosts: [
        {
          avatarUrl: 'http://placekitten.com/75/75',
          name: 'Jodi'
        }
      ],
      duringYourStay: 'Beware of dog',
      isSuperhost: true,
      name: 'Ted'
    };

    const { getByText } = render(<HostDescription {...props} />);

  });

  test('should not render elements for which props are not provided or falsy', () => {

    const { queryByText } = render(<HostDescription />);

    expect(screen.queryByText('During your stay')).toBe(null);
    expect(screen.queryByText('Co-hosts')).toBe(null);
    expect(screen.queryByText('is a Superhost', { exact: false })).toBe(null);

  });

});