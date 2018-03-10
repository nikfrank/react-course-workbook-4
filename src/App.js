import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import connectHooks from './connectHooks';

class App extends Component {
  static hooks = {
    convert: (fromCoin, toCoin, amount)=>
      fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${fromCoin}&tsyms=${toCoin}`
      ).then( response => response.json() )
       .then( ({ [toCoin]: Xrate }) => cache => ({
         trades: (cache.trades || []).concat({
           fromCoin, toCoin, fromAmount: amount,
           toAmount: Xrate * amount,
           date: (new Date()).getTime(),
         })
       }) ),
  }

  state = { fromCoin: 'ETH', toCoin: 'WINGS', amount: 10 }

  setFromCoin = ({ target: { value } })=> this.setState({ fromCoin: value.toUpperCase() })
  setToCoin = ({ target: { value } })=> this.setState({ toCoin: value.toUpperCase() })
  
  setAmount = ({ target: { value } })=> this.setState({ amount: 1* value })

  trade = ()=> this.props.convert(
    this.state.fromCoin,
    this.state.toCoin,
    this.state.amount
  )
  
  render() {
    const { fromCoin, toCoin, amount } = this.state;
    const { trades=[] } = this.props;
    
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        <div>
          From <input value={fromCoin} onChange={this.setFromCoin}/>
          To <input value={toCoin} onChange={this.setToCoin}/>
          Amount <input value={amount} onChange={this.setAmount} type='number'/>
          <button onClick={this.trade}>Trade</button>
        </div>

        <ul className='trades'>
          {
            trades.map( ({ fromCoin, toCoin, fromAmount, toAmount, date}, ti)=> (
              <li key={ti} className='trade'>
                {fromAmount} {fromCoin} => {toAmount} {toCoin} @
                time: {(new Date(date)).toString().split(' ').slice(0, 5).join(' ')}
              </li>
            ) )
          }
        </ul>
      </div>
    );
  }
}

export default connectHooks(App);
