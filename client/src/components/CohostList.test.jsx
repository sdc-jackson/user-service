import React from 'react';
import { render, screen } from '@testing-library/react';
import CohostList from './CohostList';

jest.mock('./Cohost', () => () => <div data-testid='cohost'></div>);

describe('CohostList', () => {

  test('should render a list of cohosts', () => {

    const props = {
      cohosts: [
        {
          avatarUrl: 'http://placekitten.com/75/75',
          name: 'Lewis'
        },
        {
          avatarUrl: 'http://placekitten.com/75/75',
          name: 'Clark'
        },
      ]
    };

    const { getAllByTestId } = render(<CohostList {...props} />);
    expect(getAllByTestId('cohost').length).toBe(2);

  });

  test('should not render a list of cohosts if provided an empty array', () => {

    const props = { cohosts: [] };
    const { queryAllByTestId } = render(<CohostList {...props} />);
    expect(queryAllByTestId('cohost')).toStrictEqual([]);

  });

});