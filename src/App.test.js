import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import fakeFetch from './fakeFetch';
import connectHooks from './connectHooks';

import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('that submit button makes call to fetch', (done)=>{
  const ConnectedApp = connectHooks(App);

  const calledApi = jest.fn();
  
  fakeFetch.loadMock('getXrate', {
    status: 200,
    body: { Data: [{ close: 700 }] },
    pattern: /^https:\/\/min-api.cryptocompare.com/,
    callback: calledApi,
  });

  const p = mount(<ConnectedApp/>);

  p.find('button').first().simulate('click');

  setTimeout(()=> {
    expect(calledApi.mock.calls).toHaveLength( 1 );

    fakeFetch.unloadMock('getXrate');
    done();
  }, 0);
});
