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
  
  // mount the component
  
  // enter some values

    // once the Promise resolves, expect the api to've been called

    // and once we've triggered a render, expect a trade to be rendered

  // clean up
  done();
});

// next, write such a test for localStorage feature



// unit style test
test('raw App with mock hook functions', ()=>{
  // do all the same behaviours as in prev test mode
  // expectations will be different
});
