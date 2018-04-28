import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import BitcoinLogo from './logo.svg';
import './App.css';

import fakeFetch from './fakeFetch';


// mock the deprecated api
// this can also be used for offline devving!
if(false)
  fakeFetch.loadMock('getXrate', {
    body: { EUR: 700, WINGS: 1000 },
    pattern: /^https:\/\/min-api.cryptocompare.com\/data\/price\?fsym=/,
  });

//const oldApi = `https://min-api.cryptocompare.com/data/price?fsym=${fromCoin}&tsyms=${toCoin}`;


const now = moment();
const btcEpoch = moment('2009-01-01');

class App extends Component {
  static hooks = {
    convert: ({ fromCoin, toCoin, amount, date })=> fetch(
      'https://min-api.cryptocompare.com/data/histoday?fsym='+
      `${fromCoin}&tsym=${toCoin}&limit=1&toTs=${Math.floor(date/1000)}`
        
    ).then( response => response.json() )
     .then( ({ Data: [{ close: Xrate }] }) => Xrate )
     .then( Xrate=> ({
       lastTrade: {
         fromCoin, toCoin, fromAmount: amount,
         toAmount: Xrate * amount,
         date,
       }
     }) ),
  }

  state = {
    fromCoin: 'ETH',
    toCoin: 'WINGS',
    amount: 10,
    btcColor: 'green',
  }

  setFromCoin = ({ target: { value } })=> this.setState({ fromCoin: value.toUpperCase() })
  setToCoin = ({ target: { value } })=> this.setState({ toCoin: value.toUpperCase() })
  
  setAmount = ({ target: { value } })=> this.setState({ amount: 1* value })
  setTradeDate = tradeDate => this.setState({ tradeDate })
  
  trade = ()=> this.props.convert({
    fromCoin: this.state.fromCoin,
    toCoin: this.state.toCoin,
    amount: this.state.amount,
    date: (new Date()).getTime()
  })

  setBtcColor = ()=> this.setState({
    btcColor: '#' + Math.floor(16*Math.random()).toString(16) +
              '' + Math.floor(16*Math.random()).toString(16) +
              '' + Math.floor(16*Math.random()).toString(16),
  })

  render() {
    const { fromCoin, toCoin, amount, btcColor } = this.state;
    const { lastTrade={} } = this.props;
    const { fromCoin: lastFrom, toCoin: lastTo, fromAmount, toAmount, date } = lastTrade;
    
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
          <button onClick={this.trade}>Trade</button>
        </div>

        {
          !lastFrom ? null : (
            <div className='trade'>
              <div>{fromAmount} {lastFrom}</div>
              <div> => </div>
              <div>{toAmount} {lastTo}</div>
              <div>
                @ {(new Date(date)).toString().split(' ').slice(0, 5).join(' ')}
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export default App;
