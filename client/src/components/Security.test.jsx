import React from 'react';
import { render, screen } from '@testing-library/react';
import Security from './Security';

describe('Security', () => {

  test('should render three divs', () => {

    const { getByText } = render(<Security />);

    expect(getByText('To protect your payment', { exact: false })).toBeDefined();
    expect(getByText('🛡')).toBeDefined();

  });

});