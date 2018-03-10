import React, { Component } from 'react';

const mapValues = (obj={}, vMap)=> Object
  .keys(obj)
  .reduce( (p, c)=> ({...p, [c]: vMap(obj[c]) }), {});

export default P => class HookedP extends Component {
  state = { }

  hooks = mapValues( P.hooks, hook=> (...hookArgs) => {
    const hookRes = hook(...hookArgs);

    if( hookRes instanceof Promise )
      hookRes.then( resolved => this.setState( resolved ) )
             .catch( err => console.error(err) );

    else this.setState( hookRes );
  })
  
  render(){
    return (
      <P {...this.hooks} {...this.props} {...this.state}/>
    );
  }
}
