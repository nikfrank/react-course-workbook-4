import React, { Component } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const ETH = [
  {x: 1528791856000, y: 300},
  {x: 1528791866000, y: 200},
  {x: 1528791876000, y: 100},
  {x: 1528791886000, y: 400},
  {x: 1528791896000, y: 150},
  {x: 1528791906000, y: 250},
];

const BTC = [
  {x: 1528791856000, y: 100},
  {x: 1528791868000, y: 140},
  {x: 1528791879000, y: 182},
  {x: 1528791890000, y: 151},
  {x: 1528791891000, y: 199},
  {x: 1528791906000, y: 170},
];

const SimpleLineChart = ({ trades })=> {

  // here convert trades

  console.log(JSON.stringify(trades));
  const exampleTrades = [
    {
      "fromCoin":"ETH",
      "toCoin":"BTC",
      "fromAmount":10,
      "toAmount":174.3,
      "date":1528791856000,
    },
    
    {
      "fromCoin":"BTC",
      "toCoin":"ETH",
      "toAmount":10,
      "fromAmount":180.3,
      "date":1528791957000,
    },
    {
      "fromCoin":"BTC",
      "toCoin":"ETH",
      "toAmount":10,
      "fromAmount":185.3,
      "date":1528791958000,
    },
    {
      "fromCoin":"ETH",
      "toCoin":"BTC",
      "toAmount":100,
      "fromAmount":5.3,
      "date":1528791959000,
    },
  ];

  
  
  return (
    <ScatterChart width={600} height={400}
                  margin={{top: 20, right: 20, bottom: 20, left: 20}}>
      <CartesianGrid />
      <XAxis type="number" dataKey={'x'} name='time' unit='ms' domain={['auto', 'auto']}/>
      <YAxis type="number" dataKey={'y'} name='amount'/>
      <ZAxis range={[100]}/>
      <Tooltip cursor={{strokeDasharray: '3 3'}}/>
      <Legend/>
      <Scatter name='ETH' data={ETH} fill='#8884d8' line shape="cross"/>
      <Scatter name='BTC' data={BTC} fill='#82ca9d' line shape="diamond"/>
    </ScatterChart>  );
};

export default SimpleLineChart;
