import React, { useState } from 'react';
import axios from 'axios'
import './App.css'

const TopSalesTracker = () => {
  const [contractAddress, setcontractAddress] = useState('');
  const [blockchain, setBlockchain] = useState('eth-main');
  const [timeframe, setTimeframe] = useState('30_DAYS');
  const [sales, setSales] = useState([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasClicked, setHasClicked] = useState(false)

  const getSales = async () => {
    setHasClicked(true)
    setSales([])
    setLoading(true)
    // URL is in old format and is wrong
    const timestamp = '2023-01-15T09:17:59.000Z'
    const url = `http://localhost:8080/v1/collections/topsales/${contractAddress}?chain=${blockchain}&timeframe=${timeframe}&timestamp_end=${timestamp}`;
    const headers = {
      accept: 'application/json',
      'X-API-KEY': 'YOUR_BLOCKSPAN_API_KEY',
    };

    try {
      const response = await axios.get(url, { headers });
      setSales(response.data.results)
      console.log('response.data.results:', response.data.results)
      setError(null);
      setLoading(false)
    } catch (error) {
      console.error(error);
      error.response.status === 401 ?
        setError('Invalid blockspan API key!') :
        setError('No sales found in this collection over this timeframe.');
      setSales([]);
      setLoading(false)
    }
  };

  const checkData = (data) => {
    if (data === null) {
        return 'N/A'
    } 
    return data
  }

  return (
    <div>
      <h1 className="title">Top Sales Tracker</h1>
      <p className="message">
          Select a blockchain and timeframe, and input a contract address to see most expensive transactions in the collection.
      </p>
      <div className="inputContainer">
        <select name="blockchain"
          value={blockchain}
          onChange={e => setBlockchain(e.target.value)}>
          <option value="eth-main">eth-main</option>
          <option value="arbitrum-main">arbitrum-main</option>
          <option value="optimism-main">optimism-main</option>
          <option value="poly-main">poly-main</option>
          <option value="bsc-main">bsc-main</option>
          <option value="eth-goerli">eth-goerli</option>
        </select>
        <select name="timeframe"
          value={timeframe}
          onChange={e => setTimeframe(e.target.value)}>
          <option value="30_DAYS">Thirty Days</option>
          <option value="7_DAYS">Seven Days</option>
          <option value="1_DAY">One Day</option>
        </select>
        <input type="text" placeholder="Contract Address" onChange={e => setcontractAddress(e.target.value)}/>
        <button onClick={getSales}>Find Top Sales</button>
      </div>
      {loading && (
        <p className='message'>Loading...</p>
      )}
      {error && !loading && (
        <p className='errorMessage'>{error}</p>
      )}
      {sales.length > 0 ? (
        <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Top Sale: Token {sales[0].id},{' '}
          {sales[0].transfer_type} for ${parseFloat(sales[0].price_usd).toFixed(5)}{' '}
          ({parseFloat(sales[0].price_native).toFixed(5)} {sales[0].price_currency})
        </p>
      ) : !error && hasClicked && !loading && sales.length === 0 && (
        <p className='message'>No sales data found for this collection!</p>
      )}
      {sales.length > 0 && (
        <div>
          <table className='tableContainer'>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>Number</th>
                <th>Price USD</th>
                <th>Price Native</th>
                <th>Token ID</th>
                <th>Block Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => ( 
                <tr style={{ backgroundColor: '#f2f2f2' }} key={index}>
                  <td>{index + 1}</td>
                  <td>{checkData(parseFloat(sale.price_usd).toFixed(5))}</td>
                  <td>{checkData(parseFloat(sale.price_native).toFixed(5))}</td>
                  <td>{checkData(sale.id)}</td>
                  <td>{checkData(sale.block_timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TopSalesTracker;
