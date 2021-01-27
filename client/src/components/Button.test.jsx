import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {

  const props = {
    text: 'Jelly bean',
    link: 'https://airbnb.com',
  };

  test('should contain text passed in as props', () => {

    const { getByText } = render(<Button {...props} />);
    expect(getByText(props.text)).toBeDefined();

  });

});