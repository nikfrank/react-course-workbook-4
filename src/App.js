import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import BitcoinLogo from './logo.svg';
import './App.css';

const now = moment();
const btcEpoch = moment('2009-01-01');

class App extends Component {
  static hooks = {
    convert: ({ fromCoin, toCoin, amount, date })=> fetch(
      'https://min-api.cryptocompare.com/data/histoday?fsym='+
      `${fromCoin}&tsym=${toCoin}&limit=1&toTs=${Math.floor(date/1000)}`
        
    ).then( response => response.json() )
     .then( ({ Data: [{ close: Xrate }] }) => Xrate )
     .then( Xrate=> cache => ({
       trades: (cache.trades || []).concat({
         fromCoin, toCoin, fromAmount: amount,
         toAmount: Xrate * amount,
         date,
       })
     }) )
     .catch(err => console.error(err, fromCoin, toCoin, 'probably Coin no exists err')),
    // gobble up error after logging ! ? !
  }

  state = {
    fromCoin: 'ETH',
    toCoin: 'WINGS',
    amount: 10,
    btcColor: 'green',
    tradeDate: moment(),
    
    fromTotals: {},
    toTotals: {},
    alreadyTotalled: 0,
  }

  setFromCoin = ({ target: { value } })=> this.setState({ fromCoin: value.toUpperCase() })
  setToCoin = ({ target: { value } })=> this.setState({ toCoin: value.toUpperCase() })
  
  setAmount = ({ target: { value } })=> this.setState({ amount: 1* value })
  setTradeDate = tradeDate => this.setState({ tradeDate })
  
  trade = ()=> this.props.convert({
    fromCoin: this.state.fromCoin,
    toCoin: this.state.toCoin,
    amount: this.state.amount,
    date: this.state.tradeDate.unix()*1000
  })

  reduceTotals = (props = this.props)=> this.setState(state => ({
    alreadyTotalled: props.trades.length,
    fromTotals: props.trades.length ?
                props.trades.slice(state.alreadyTotalled).reduce( (p, c)=> ({
                  ...p, [c.fromCoin]: (p[c.fromCoin]||0) + c.fromAmount }), state.fromTotals ) : {},

    toTotals: props.trades.length ?
              props.trades.slice(state.alreadyTotalled).reduce( (p, c)=> ({
                ...p, [c.toCoin]: (p[c.toCoin]||0) + c.toAmount }), state.toTotals ) : {},
  }) )

  setBtcColor = ()=> this.setState({
    btcColor: '#' + Math.floor(16*Math.random()).toString(16) +
              '' + Math.floor(16*Math.random()).toString(16) +
              '' + Math.floor(16*Math.random()).toString(16),
  })
  
  componentWillReceiveProps(nuProps, oldProps){
    if( nuProps.trades && ( (oldProps.trades||{ length: -1 }).length !== nuProps.trades.length) )
      this.reduceTotals(nuProps);
  }

  render() {
    const { fromCoin, toCoin, amount, btcColor, fromTotals, toTotals } = this.state;
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
                        maxDate={now}
                        minDate={btcEpoch}
                        onChange={this.setTradeDate}/>
          </div>
          <button onClick={this.trade}>Trade</button>
        </div>

        <ul className='trades'>
          {
            trades.map( ({ fromCoin, toCoin, fromAmount, toAmount, date }, ti)=> (
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

        <div className='totals'>
          {Object.keys(fromTotals).length ? 'from' : null}
          <ul>
            {
              Object.keys(fromTotals).map( fromCoin => (
                <li key={fromCoin+'from'}>
                  {fromTotals[fromCoin]} - {fromCoin}
                </li>
              ) )
            }
          </ul>

          {Object.keys(toTotals).length ? 'to' : null}
          <ul>
            {
              Object.keys(toTotals).map( toCoin => (
                <li key={toCoin+'to'}>
                  {toTotals[toCoin]} - {toCoin}
                </li>
              ) )
            }
          </ul>

        </div>
      </div>
    );
  }
}

export default App;
