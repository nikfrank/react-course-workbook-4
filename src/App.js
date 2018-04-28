import React, { Component } from 'react';

class App extends Component {
  static hooks = {
  }

  state = {
  }

  setFromCoin = ({ target: { value } })=> this.setState({ fromCoin: value.toUpperCase() })
  setToCoin = ({ target: { value } })=> this.setState({ toCoin: value.toUpperCase() })
  
  setAmount = ({ target: { value } })=> this.setState({ amount: 1* value })
  
  render() {
    const { fromCoin, toCoin, amount } = this.state;

    return (
      <div className='App'>
        <header className='App-header'>
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

        Here output result of trade
        
      </div>
    );
  }
}

export default App;
