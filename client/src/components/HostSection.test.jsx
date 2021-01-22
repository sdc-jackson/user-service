import React from 'react';
import { render, screen } from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom';
import HostSection from './HostSection';
import { data } from '../../../testdata';

jest.mock('./HostId', () => () => <div data-testid='host-id'></div>);

describe('HostSection', () => {

  const props = data;

  test('should render the HostId component', () => {

    const { getByTestId } = render(<HostSection {...props} />);
    const element = screen.getByTestId('host-id');
    expect(element).toBeInTheDocument();

  });

});