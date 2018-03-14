import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import BitcoinLogo from './logo.svg';
import './App.css';

import connectHooks from './connectHooks';

class App extends Component {
  static hooks = {
    convert: (fromCoin, toCoin, amount, date)=>
      // needs to include here the date
      fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${fromCoin}&tsyms=${toCoin}`
      ).then( response => response.json() )
       .then( ({ [toCoin]: Xrate }) => cache => ({
         trades: (cache.trades || []).concat({
           fromCoin, toCoin, fromAmount: amount,
           toAmount: Xrate * amount,
           date: date.getTime(),
         })
       }) ),
  }

  state = {
    fromCoin: 'ETH',
    toCoin: 'WINGS',
    amount: 10,
    btcColor: 'green',
    tradeDate: moment(),
  }

  setFromCoin = ({ target: { value } })=> this.setState({ fromCoin: value.toUpperCase() })
  setToCoin = ({ target: { value } })=> this.setState({ toCoin: value.toUpperCase() })
  
  setAmount = ({ target: { value } })=> this.setState({ amount: 1* value })
  setTradeDate = tradeDate => this.setState({ tradeDate })
  
  trade = ()=> this.props.convert(
    this.state.fromCoin,
    this.state.toCoin,
    this.state.amount,
    this.state.tradeDate
  )

  setBtcColor = ()=> this.setState({
    btcColor: '#' + Math.floor(16*Math.random()).toString(16) +
              '' + Math.floor(16*Math.random()).toString(16) +
              '' + Math.floor(16*Math.random()).toString(16),
  })
  
  render() {
    const { fromCoin, toCoin, amount, btcColor } = this.state;
    const { trades=[] } = this.props;

    return (
      <div className='App'>
        <header className='App-header'>
          <BitcoinLogo className='App-logo'
                       bgColor={ btcColor }
                       onClick={ this.setBtcColor }/>
          <h1 className='App-title'>Coin Exchange</h1>
        </header>

        <div>
          <div>
            From <input value={fromCoin} onChange={this.setFromCoin}/>
          </div>
          <div>
            To <input value={toCoin} onChange={this.setToCoin}/>
          </div>
          <div>
            Amount <input value={amount} onChange={this.setAmount} type='number'/>
          </div>
          <div>
            <DatePicker selected={this.state.tradeDate}
                        onChange={this.setTradeDate}/>
          </div>
          <button onClick={this.trade}>Trade</button>
        </div>

        <ul className='trades'>
          {
            trades.map( ({ fromCoin, toCoin, fromAmount, toAmount, date}, ti)=> (
              <li key={ti} className='trade'>
                <div>{fromAmount} {fromCoin}</div>
                <div> => </div>
                <div>{toAmount} {toCoin}</div>
                <div>
                  @ {(new Date(date)).toString().split(' ').slice(0, 5).join(' ')}
                </div>
              </li>
            ) )
          }
        </ul>
      </div>
    );
  }
}

export default connectHooks(App);
