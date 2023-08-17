# TOP SALES TRACKER


## HOW TO USE THE BLOCKSPAN API TO FIND TOP SALES DATA WITHIN A COLLECTION

Blockspan is a leading provider of NFT API services, enabling developers to easily interact with the world of non-fungible tokens (NFTs). NFTs represent ownership of a unique item or piece of content on the blockchain. A top sales of collection tracking tool will provide users with an overview of key transactions in a collection, including
from and to address and price. 


## REQUIREMENTS:
- Node.js and npm installed on your system.
- Basic knowledge of React.js
- Blockspan API key


## STEP 1: SET UP YOU REACT APPLICATION

First, you'll need to set up your React application. If you already have a React application set up, you can skip this step.

`npx create-react-app top-sales-tracker` 
`cd top-sales-tracker`

This will create a new React application named `top-sales-tracker` and navigate into the new directory.


## STEP 2: INSTALL AXIOS

We'll be using Axios to send HTTP requests to the Blockspan API. Install it with the following command:

`npm install axios`


## STEP 3: CREATE YOUR REACT COMPONENT

Next, you'll need to create a React component that uses the Blockspan API to fetch portfolio data. Create a new file in the `src` directory called `topSalesTracker.js` and include the following code:

```
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

```

Remember to replace `YOUR_BLOCKSPAN_API_KEY` with your actual Blockspan API key.


## STEP 4: UPDATING THE STYLES WITHIN CSS FILE

To enhance the user interface in the browser, replace all code in the App.css file with the following:

```
.App {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: auto;
}

.title {
  margin-top: 20px;
  margin-bottom: 0;
  text-align: center;
}

.errorMessage {
  text-align: center;
  color: red;
  font-weight: bold;
}

.successMessage {
  text-align: center;
  color: green;
  font-weight: bold;
}

.message {
  text-align: center;
}

.image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.inputContainer {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.inputContainer input {
  padding: 10px;
  font-size: 1em;
  width: 200px;
}

.inputContainer button {
  padding: 10px;
  font-size: 1em;
  background-color: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
}

.inputContainer button:hover {
  background-color: #0056b3;
}

.imageContainer {
  display: flex;
  justify-content: center;
  width: 100%; 
}

.imageContainer img {
  width: 100%; 
  max-width: 500px;
  height: auto; 
}
.nftData {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.nftData .image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.nftData h2 {
  margin: 10px 0;
}

.nftData p {
  font-size: 1.2em;
  font-weight: bold;
}

td {
  padding: 10px;
  text-align: center;
}

th {
  padding: 10px;
  text-align: center;
}

.tableContainer {
  width: 100%;
  border-collapse: separate;
  border-spacing: 4px; 
}

```

## STEP 5: INTEGRATING COMPONENTS IN THE APP

Finally, let's use the `TopSalesTracker` component in our main `App` component.

Open App.js and modify it as follows:

```
import React from 'react';
import './App.css';
import TopSalesTracker from './topSalesTracker';

function App() {
  return (
    <div className="App">
      <TopSalesTracker/>
    </div>
  );
}

export default App;
```

Now, start the app with the following command:

`npm start`

You should now see the following:

- A drop down menu to select a blockchain
- A drop down menu to select the timeframe
- A text box for contract address
- A find top sales button

Input the chain, timeframe and contract address for the collection you want sales data for, and click the find top sales button. You should then see a bold line with information on the top sale, and a grey table with transaction data all the sales in the collection over the timeframe (max 25)

## CONCLUSION

Congratulations! You've just built a simple yet powerful top sales tracker using the Blockspan API and React.js. As you've seen, the Blockspan API is intuitive to use and provides detailed and accurate information, making it a perfect choice for this kind of application. This tutorial is just a starting point - there are many ways you can expand and improve your tool. For example, you could add more error checking, improve the UI, or display additional data.

As the world of NFTs continues to grow and evolve, tools like this will become increasingly important. Whether you're an NFT enthusiast, a developer, or a startup, understanding NFTs is a valuable skill. We hope you found this tutorial helpful.
