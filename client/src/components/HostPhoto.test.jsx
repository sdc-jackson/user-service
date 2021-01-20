import React from 'react';
import { render } from '@testing-library/react';
import HostPhoto from './HostPhoto';


describe('HostPhoto', () => {

  test('renders an image', () => {

    // Arrange
    const props = {
      img: 'http://placekitten.com/75/75'
    };

    // Act
    const { getByRole } = render(<HostPhoto {...props} />);

    // Assert
    const imgNode = getByRole('img');
    expect(imgNode).toBeDefined();

  });

});