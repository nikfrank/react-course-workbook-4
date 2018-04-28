import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import fakeFetch from './fakeFetch';
import connectHooks from './connectHooks';

import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});


// e2e module style test
test('connected app with mocked window.fetch', (done)=>{
  // mock over the api call
  
  const calledApi = jest.fn();
  
  fakeFetch.loadMock('getXrate', {
    status: 200,
    body: { Data: [{ close: 700 }] },
    pattern: /^https:\/\/min-api.cryptocompare.com/,
    callback: calledApi,
  });

  // mount the component
  
  const ConnectedApp = connectHooks(App);
  const p = mount( <ConnectedApp/> );

  const inputs = p.find('input');
  expect( inputs ).toHaveLength( 4 );

  // enter some values

  inputs.at(2).simulate('change', { target: { value: 100 } });
  inputs.at(1).simulate('change', { target: { value: 'USD' } });
  
  p.find('button').first().simulate('click');

  setTimeout(()=> {
    // once the Promise resolves, expect the api to've been called
    
    expect( calledApi.mock.calls ).toHaveLength( 1 );
    expect( calledApi.mock.calls[0][0].split('&')[1] ).toEqual('tsym=USD');

    // and once we've triggered a render, expect a trade to be rendered
    p.update();

    const trades = p.find('li.trade');
    expect( trades ).toHaveLength( 1 );

    expect( trades.at(0).text() ).toContain('100 ETH => 70000 USD');

    // clean up
    fakeFetch.unloadMock('getXrate');
    done();
  }, 0);
});

// next, write such a test for localStorage feature



// unit style test
test('raw App with mock hook functions', ()=>{
  // do all the same behaviours as in prev test mode
  // expectations will be different
});
