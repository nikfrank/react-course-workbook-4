import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import fakeFetch from './fakeFetch';

import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('that submit button makes call to fetch', (done)=>{
  const calledApi = jest.fn();
  
  fakeFetch.loadMock('getXrate', {
    status: 200,
    body: { EUR: 700 },
    pattern: /^https:\/\/min-api.cryptocompare.com\/data\/price\?fsym=/,
    callback: calledApi,
  });

  const p = mount(<App/>);

  p.find('button').first().simulate('click');

  setTimeout(()=> {
    expect(calledApi.mock.calls).toHaveLength( 1 );
    done();
  }, 0);
});
