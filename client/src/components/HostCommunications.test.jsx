import React from 'react';
import { render, screen } from '@testing-library/react';
import HostCommunications from './HostCommunications';

jest.mock('./Button', () => () => <div data-testid='button'></div>);

describe('HostCommunications', () => {

  const props = {
    'languages': ['Javascript', 'Python'],
    'responseRate': 100,
    'responseTime': 'within an hour'
  };

  test('should render all expected child elements', () => {

    const { getByText, getByTestId } = render(<HostCommunications {...props} />);
    expect(getByText(`Languages: ${props.languages[0]}, ${props.languages[1]}`)).toBeDefined();
    expect(getByText(`Response rate: ${props.responseRate}%`)).toBeDefined();
    expect(getByText(`Response time: ${props.responseTime}`)).toBeDefined();
    expect(getByTestId('button')).toBeDefined();

  });

});