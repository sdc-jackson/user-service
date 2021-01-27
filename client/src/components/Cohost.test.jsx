import React from 'react';
import { render, screen } from '@testing-library/react';
import Cohost from './Cohost';

describe('Cohost', () => {

  const props = {
    avatarUrl: 'http://placekitten.com/75/75',
    name: 'Lewis'
  };

  test('should render host name and photo', () => {

    const { getByText, getByRole } = render(<Cohost {...props} />);

    expect(getByText('Lewis')).toBeDefined();
    expect(getByRole('img')).toBeDefined();

  });

});
