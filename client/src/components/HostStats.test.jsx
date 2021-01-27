import React from 'react';
import HostStats from './HostStats';
import { render, screen } from '@testing-library/react';

describe('HostStats', () => {

  test('should render all elements when boolean props are true', () => {

    const props = {
      isSuperhost: true,
      isVerified: true,
      reviews: 7
    };

    const { getByText } = render(<HostStats {...props} />);
    expect(screen.getByText('Identity verified', { exact: false })).toBeDefined();
    expect(screen.getByText('Superhost', { exact: false })).toBeDefined();

  });

  test('should not render all elements when boolean props are false', () => {

    const props = {
      isSuperhost: false,
      isVerified: false,
      reviews: 7
    };

    const { queryByText } = render(<HostStats {...props} />);
    expect(screen.queryByText('Identity verified')).toBe(null);
    expect(screen.queryByText('Superhost')).toBe(null);

  });

});