import React from 'react';
import { render } from '@testing-library/react';
import HostPhoto from './HostPhoto';


describe('HostPhoto', () => {

  test('renders an image', () => {

    const props = {
      img: 'http://placekitten.com/75/75'
    };

    const { getByRole } = render(<HostPhoto {...props} />);

    const imgNode = getByRole('img');
    expect(imgNode).toBeDefined();

  });

});