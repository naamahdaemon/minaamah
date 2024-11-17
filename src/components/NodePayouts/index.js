import React, { useEffect, useState } from 'react'
import Head from '@docusaurus/Head'
import { useColorMode } from '@docusaurus/theme-common'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useQuery } from 'react-query'
import axios from 'axios'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import './styles.module.css'

const queryClient = new QueryClient()

const NodePayouts = ({ apiUrl, isRelative }) => {
  
  const [selectedApi, setSelectedApi] = useState(
    apiUrl
  );    
     
  const { isDarkTheme } = useColorMode()
  const { siteConfig } = useDocusaurusContext()

  // State variables to hold selected values
  const [blockHeightGt, setBlockHeightGt] = useState('');
  const [blockHeightLt, setBlockHeightLt] = useState('');
  const [blocksData, setBlocks] = useState(''); 
  const [paramData, setParamData] = useState(''); 
  const [delegationsData, setDelegationsData] = useState(''); 
  const [epochData, setEpochData] = useState(''); 
  const [currentEpoch, setCurrentEpoch] = useState('');   
  const [epochsArray, setEpochsArray] = useState([]);   

  const handleApiChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedApi(selectedValue);
  };  

  // useEffect at component initialization
  useEffect(() => {
    const fetchData = async () => {
      // Call getEpoch function and wait for it to finish
      // Get Current eopch data, start block and end block
      const  {epochData, blocksBegin, finBlock, epochs  } = await getEpoch();
      //console.log ("FETCHDATA");
      // Once getEpoch() is finished, call getBlocks
      const { params } = await getBlocks(epochData.epoch,blocksBegin,finBlock);
      //console.log("************************** USE EFFECT PARAM : " + JSON.stringify(params, null, 2) + "**************************");
      getDelegations(epochData.epoch,params);  
      setCurrentEpoch(epochData.epoch)
      setEpochsArray(epochs);
    };

  // Call the async function
    fetchData();  
      
  }, []); // Empty dependency array ensures it only runs once on component mount
    
  useEffect(() => {
    const fetchData = async () => {
      if (currentEpoch !== '') {
        const  {epochData, blocksBegin, finBlock, epochs  } = await getEpoch(currentEpoch);
        const { params } = await getBlocks(currentEpoch,blocksBegin,finBlock);
        getDelegations(currentEpoch,params);
        //setCurrentEpoch(currentEpoch)
      }
    };

  // Call the async function
    fetchData();  
  }, [currentEpoch]);


  const serverUrl = 'https://graphql.minaexplorer.com'

  const fetchAPI = async (body) => {
    const fullAPIUrl = isRelative
      ? `${serverUrl}/${selectedApi}`
      : selectedApi

    try {
      const response = await axios.post(fullAPIUrl,body, {headers: {'Content-Type': 'application/json'}})
      return response.data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const getCurrentEpoch = async () => {
    const query = `query {
      blocks(sortBy: DATETIME_DESC, limit: 1) {
        protocolState {
          consensusState {
            epoch,
            blockHeight,
          }
        }
      }
    }`;

    const body = { query };

    // Call the fetchAPI function with the constructed query body
    const responseData = await fetchAPI(body);
    
    // Calculate the sums of coinbase, snarkFees, and txFees divided by 1e9
    const epoch = responseData.data.blocks[0].protocolState.consensusState.epoch;
    const blocksEnd = responseData.data.blocks[0].protocolState.consensusState.blockHeight;

    // Initialize an array to store the epochs
    let epochsArray = [];
    let previousEpoch = 0;

    // Loop to fetch epochs from current epoch to 10 epochs before
    for (let i = 0; i <= 10; i++) {
      // Calculate the epoch value to query
      console.log ("epoch:" + epoch);
      console.log ("epoch-i:" + (epoch-i));
      if (epoch-i<0)
        previousEpoch = (80+epoch) - i;
      else 
        if (epoch == 0) {
          console.log ("EPOCH 0");
          previousEpoch = 0;
        }
        else
          previousEpoch = epoch - i;
      console.log ("epochArray:" + previousEpoch);
      epochsArray.push(previousEpoch);
    }
    
    const epochs=epochsArray
    
    setEpochsArray(epochsArray);

    //console.log(epochsArray);
    //console.log("L'epoch courante dans getCurrentEpoch est : " + epoch)

    //setCurrentEpoch(epoch);
    
    return { epoch, blocksEnd, epochs };
  };

  const getEpoch = async (selectedEpoch=currentEpoch) => {
    const { epoch, blocksEnd, epochs } = await getCurrentEpoch();
    //console.log("getEpoch blockHeightGt" + blockHeightGt);
    //console.log("getEpoch blockHeightLt" + blockHeightLt);   
    
    let previousEpoch;
    let finBlock=blocksEnd;
    
    if (selectedEpoch){
       //previousEpoch = selectedEpoch - 1;
       console.log("selectedEpoch=" + selectedEpoch)
       if (selectedEpoch==0)
          previousEpoch = 79;
       else 
          previousEpoch = selectedEpoch - 1;      
          console.log("previousEpoch=" + previousEpoch)
    }
    else {
      console.log("selectedEpoch==false")
      selectedEpoch=epoch
      if (epoch==0)
          previousEpoch = 79;
        else 
          previousEpoch = epoch - 1;    
    }
    
    console.log ("**************************** getEpoch ****************************");
    
    console.log("L'epoch courante dans getEpoch est : " + epoch)
    console.log("L'epoch précédente dans getEpoch est : " + previousEpoch)
    
    const query = `query {
      block1: blocks(sortBy: DATETIME_DESC, limit: 1, query: {protocolState: {consensusState: {epoch: ${previousEpoch}}}}) {
        protocolState {
          consensusState {
            epoch
            epochCount
            blockHeight
            slot
          }
        }
      }
      block2: blocks(sortBy: DATETIME_DESC, limit: 1, query: {protocolState: {consensusState: {epoch: ${selectedEpoch}}}}) {
        protocolState {
          consensusState {
            epoch
            epochCount
            blockHeight
            slot
          }
        }
      }
    }`;

    const body = { query };

    // Call the fetchAPI function with the constructed query body
    const responseData = await fetchAPI(body);


    //console.log(JSON.stringify(query, null, 2));
    //console.log(JSON.stringify(responseData, null, 2));
    
    // Calculate the sums of coinbase, snarkFees, and txFees divided by 1e9
    //const epoch = responseData.data.blocks[0].protocolState.consensusState.epoch+1;
    const blocksBegin = responseData.data.block1[0].protocolState.consensusState.blockHeight+1;
    finBlock = responseData.data.block2[0].protocolState.consensusState.blockHeight;
    
    //console.log("############" + blocksBegin + "############");
    //console.log("############" + parseInt(blocksBegin) + "############");
    
  
    const nbslots=finBlock-blocksBegin;
    
    //console.log ("EPOCH " + selectedEpoch)
    //console.log ("BLOCK START " + blocksBegin)
    //console.log ("BLOCK END " + finBlock)
    //console.log ("NB SLOT " + nbslots)
    
    // Construct the JSON structure
    const epochData = {
      epoch: selectedEpoch,
      begin: blocksBegin,
      end: finBlock
    };    

    setEpochData(epochData);
    setBlockHeightGt(blocksBegin);
    //console.log ("***********************************" + blocksBegin + "***********************************")
    setBlockHeightLt(finBlock);

    // Do whatever you need with paramData
    //console.log(JSON.stringify(epochData, null, 2));
    //console.log("blockHeightGt: " + blockHeightGt); // Log blockHeightGt
    //console.log("blockHeightLt: " + blockHeightLt); // Log blockHeightLt
    
    return { epochData, blocksBegin, finBlock, epochs  };
    
  };

  const getBlocks = async (epoch=currentEpoch, blocksDebut = parseInt(blockHeightGt), blocksEnd = parseInt(blockHeightLt)) => {
    //await getEpoch();
    
    //console.log("GET BLOCKS BLOCK HEIGHT LT = " + blockHeightLt);
    //console.log("GET BLOCKS BLOCK HEIGHT GT = " + blockHeightGt + " / " + blocksDebut);
    console.log ("**************************** getBlocks ****************************");    
    
    const query = `query {
      blocks(sortBy: DATETIME_DESC, query: {
        creatorAccount: {publicKey: "B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr"},
        blockHeight_gt: ${blocksDebut},
        blockHeight_lt: ${blocksEnd},
        canonical: true
      }) {
        blockHeight
        canonical
        creator
        dateTime
        receivedTime
        snarkFees
        txFees
        transactions {
          coinbase
          feeTransfer {
            fee
            type
          }          
        }
      }
    }`;

    const body = { query };

    // Call the fetchAPI function with the constructed query body
    const blockData = await fetchAPI(body);
    
    //console.log(JSON.stringify(body, null, 2));
    //console.log(JSON.stringify(blockData, null, 2));
    
    setBlocks(blockData.data.blocks); // Store response data in state
    
    // Calculate the sums of coinbase, snarkFees, and txFees divided by 1e9
    const sumCoinbase = blockData.data.blocks.reduce((acc, block) => acc + parseInt(block.transactions.coinbase), 0) / 1e9;
    const sumSnarkFees = blockData.data.blocks.reduce((acc, block) => acc + parseInt(block.snarkFees), 0) / 1e9;
    const sumTxFees = blockData.data.blocks.reduce((acc, block) => acc + parseInt(block.txFees), 0) / 1e9;
    // Count the number of blocks
    const numBlocks = blockData.data.blocks.length;    
    
    
    const sumFeeTransferViaCoinbase = blockData.data.blocks.reduce((acc, block) => {
      // Check if transactions is an object and has the feeTransfer property
      if (block.transactions && Array.isArray(block.transactions.feeTransfer)) {
        return acc + block.transactions.feeTransfer.reduce((totalFee, feeTransfer) => {
          if (feeTransfer.type === "Fee_transfer_via_coinbase") {
            return totalFee + parseInt(feeTransfer.fee);
          }
          return totalFee;
        }, 0);
      }
      return acc;
    }, 0); 
    
    // Construct the JSON structure
    const params = {
      creatorAccount: blockData.data.blocks[0].creatorAccount, // Assuming all blocks have the same creatorAccount
      numberOfBlocks: numBlocks,
      sumCoinbase: sumCoinbase,
      sumFeeTransferViaCoinbase: sumFeeTransferViaCoinbase / 1e9,
      //sumToBurn: epoch <= 10 ? 0 : sumCoinbase / 2,
      sumToBurn: 0,
      sumSnarkFees: sumSnarkFees,
      sumTxFees: sumTxFees
    };    

    getDelegations(epoch, params);
    
    setParamData(params);
    
    return { params  };

    // Do whatever you need with paramData
    //console.log(JSON.stringify(paramData, null, 2));
    //console.log(JSON.stringify(body, null, 2));
    //console.log(blockData); // Handle response data as needed
  };

  const getDelegations = async (currentEpoch = currentEpoch, param = paramData) => {
    //await getEpoch();
    const burnt_pk = ["B62qn9zWo5HcC2RRRi5P8278Hq5RoKgQWqFvXRYxsbVQeDCsAJP7aop", "B62qjeFLiBdA94f9AAznCqBUJKNpo5BEYf5hUydp1sXyLwic6RQWMg2", "B62qrzDMYjLf2opTM3KSozahGGKkQhVhQmiAfVZ39FZoKa4WGgcdaAq", "B62qjmFWHTMqtXby9FnwxNh1qoaRMMCsTp2TZuSgM94jJE6B6V278NR", "B62qimKm1pqwrR9yYBrdPVS8Cb3PU3RV9pd4gzBk9qyxtYUuxFGdovf","B62qkcBfRcKCWgVTDfrRPzx9j6t3WB4uXqAGsecyXfEeki8b5y45KdF","B62qk4dMFUML6Ape99PGF5sg6Sv7FD9p7u9oq1MWy61zryownHVGh8E"];

    //console.log ("**************************** getDelegations epoch = " + currentEpoch + " / param = " + JSON.stringify(param, null, 2) + "****************************");
   
    const query = `query {
      stakes(limit: 1000,query: {
        delegate: "B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr", 
        epoch: ${currentEpoch}
      }) {
        balance 
        epoch 
        public_key 
        delegationTotals {
           countDelegates 
           totalDelegated
          }
         }
        }`;

    const body = { query };

    // Call the fetchAPI function with the constructed query body
    const responseData = await fetchAPI(body);
    
    const totalBalance = responseData.data.stakes.reduce((acc, delegation) => acc + delegation.balance, 0);   

    // Filter DelegationsData to include only entries where locked is false
    const unlockedDelegationsData = responseData.data.stakes.filter(delegation => !burnt_pk.includes(delegation.public_key));

    console.log ("**************************** getDelegations : tout va bien ?****************************");

    // Calculate the sum of all balance amounts for unlocked=false accounts
    const totalUnlockedBalance = unlockedDelegationsData.reduce((acc, delegation) => acc + delegation.balance, 0);    
    
    
    // Iterate over the DelegationsData array
    const updatedDelegationsData = responseData.data.stakes.map(delegation => {
      // Check if the public key is in the locked_pk array
      if (burnt_pk.includes(delegation.public_key)) {
        const sharePercentage = delegation.balance / totalBalance;
        const shareUnlockedPercentage=0;
        // If found, add the 'locked' attribute with a value of true
        let totalDue = (param.sumCoinbase-param.sumToBurn) * sharePercentage;
        totalDue *= 0.92
        return { ...delegation, 
          locked: true ,
          sharePercentage: sharePercentage,
          shareUnlockedPercentage: shareUnlockedPercentage,
          feeShare: 0, 
          totalDue: totalDue
          };
      } else {
        const sharePercentage = delegation.balance / totalBalance;
        const shareUnlockedPercentage = delegation.balance / totalUnlockedBalance;
        let totalDue = (param.sumCoinbase-param.sumToBurn) * sharePercentage;
        totalDue *= 0.99; // Apply 0.99 multiplier for unlocked accounts        
        totalDue += param.sumTxFees * shareUnlockedPercentage * 0.99
        totalDue -= param.sumSnarkFees * shareUnlockedPercentage * 0.99
        // If not found, return the original delegation object
        return { ...delegation, 
        locked: false,
        sharePercentage: sharePercentage,
        shareUnlockedPercentage: shareUnlockedPercentage,
        feeShare: 0,
        totalDue: totalDue
        };
      }
    });
    
    // Sort the array by totalDue
    updatedDelegationsData.sort((a, b) => b.totalDue - a.totalDue);    
 
    //console.log(JSON.stringify(updatedDelegationsData, null, 2));
    
    setDelegationsData(updatedDelegationsData);
    
    
  };

  const renderTable = () => {
    if (!blocksData) return null; // If response data is not available, return null

    // Render table headers and rows based on responseData
    return (
      <table>
        <thead>
          <tr>
            <th>Block Height</th>
            <th>Creator</th>
            <th>Date Time</th>
            <th>Received Time</th>
            <th>Snark Fees</th>
            <th>Tx Fees</th>
            <th>Coinbase</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through responseData to render table rows */}
          {blocksData.map((block, index) => (
            <tr key={index}>
              <td>{block.blockHeight}</td>
              <td>{block.creator}</td>
              <td>{block.dateTime}</td>
              <td>{block.receivedTime}</td>
              <td>{block.snarkFees / 1e9}</td>
              <td>{block.txFees / 1e9}</td>
              <td>{block.transactions.coinbase / 1e9}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderParamTable = () => {
    if (!paramData) return null; // If response data is not available, return null

    // 
    //{
    //  "numberOfBlocks": 8,
    //  "sumCoinbase": 11520,
    //  "sumSnarkFees": 0.697560179,
    //  "sumTxFees": 13.125536528
    //}
    // Render table headers and rows based on responseData
    return (
      <table>
        <thead>
          <tr>
            <th>Number of block</th>
            <th>Total Coinbase</th>
            <th>Burnt Amount</th>
            <th>Total Snark Fees</th>
            <th>Total Coinbase snark fee</th>
            <th>Total Tx. Fees</th>
            <th>Comm. rate</th>
            <th>Foundation rate</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through responseData to render table rows */}
            <tr>
              <td>{paramData.numberOfBlocks}</td>
              <td>{paramData.sumCoinbase}</td>
              <td>{paramData.sumToBurn}</td>
              <td>{paramData.sumSnarkFees}</td>
              <td>{paramData.sumFeeTransferViaCoinbase}</td>
              <td>{paramData.sumTxFees}</td>
              <td>1%</td>
              <td>8%</td>
            </tr>
        </tbody>
      </table>
    );
  };

  const renderDelegations = () => {
    if (!delegationsData) return null; // If response data is not available, return null

    // 
    //{
    //  "numberOfBlocks": 8,
    //  "sumCoinbase": 11520,
    //  "sumSnarkFees": 0.697560179,
    //  "sumTxFees": 13.125536528
    //}
    // Render table headers and rows based on responseData
    return (
      <table>
        <thead>
          <tr>
            <th>PK</th>
            <th>Balance</th>
            <th>locked</th>
            <th>Total Share</th>
            <th>Unlock Share</th>
            <th>Total Due</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through responseData to render table rows */}
          {delegationsData.map((stake, index) => (
            <tr key={index}>
              <td>{stake.public_key}</td>
              <td>{stake.balance}</td>
              <td>{stake.locked ? 'Yes' : 'No'}</td>
              <td>{stake.sharePercentage}</td>
              <td>{stake.shareUnlockedPercentage}</td>
              <td>{stake.totalDue}</td>
            </tr>
          ))}
        </tbody>        
      </table>
    );
  };

/*  const { isLoading, isError, data, error } = useQuery(
    ['fetchAPI', { selectedApi,body }],
    () => fetchAPI(body),
    {
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    },
  )
*/
  
  const getStatusColor = (status) => {
    return status === 'Healthy' ? 'green' : 'red';
  }
  
/*  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
*/

  //await getEpoch();

  //const blocks = data?.data?.blocks;

  //[ { "txFees": "440172211", "blockHeight": 338159, "canonical": true, "creator": "B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr", "dateTime": "2024-03-17T11:33:00Z", "receivedTime": "2024-03-17T11:34:31.274Z", "snarkFees": "0", "transactions": { "coinbase": "1440000000000" } }, { "txFees": "1490472213", "blockHeight": 336944, "canonical": true, "creator": "B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr", "dateTime": "2024-03-12T19:45:00Z", "receivedTime": "2024-03-12T19:47:22.236Z", "snarkFees": "0", "transactions": { "coinbase": "1440000000000" } }, { "txFees": "4141758798", "blockHeight": 336462, "canonical": true, "creator": "B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr", "dateTime": "2024-03-10T15:06:00Z", "receivedTime": "2024-03-10T15:08:28.167Z", "snarkFees": "393880140", "transactions": { "coinbase": "1440000000000" } }, { "txFees": "5714672204", "blockHeight": 336281, "canonical": true, "creator": "B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr", "dateTime": "2024-03-09T15:30:00Z", "receivedTime": "2024-03-09T15:31:38.951Z", "snarkFees": "0", "transactions": { "coinbase": "1440000000000" } }, { "txFees": "243272211", "blockHeight": 336160, "canonical": true, "creator": "B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr", "dateTime": "2024-03-09T02:15:00Z", "receivedTime": "2024-03-09T02:17:08.536Z", "snarkFees": "13160552", "transactions": { "coinbase": "1440000000000" } } ]

  return (
    <div>	
      <h2>B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr</h2>
      <select value={currentEpoch} onChange={(e) => setCurrentEpoch(e.target.value)}>
        <option value="">Select an Epoch</option>
        {epochsArray.map((epoch, index) => (
          <option key={index} value={epoch}>{epoch}</option>
        ))}
      </select>      
      <input
        type="number"
        placeholder="Please Wait ..."
        value={blockHeightGt}
        onChange={(e) => setBlockHeightGt(e.target.value)}
      />
      <input
        type="number"
        placeholder="Please Wait ..."
        value={blockHeightLt}
        onChange={(e) => setBlockHeightLt(e.target.value)}
      />
      <button onClick={() => getBlocks(epochData.epoch, blockHeightGt, blockHeightLt)}>Get Payout Parameter for block {blockHeightGt} to {blockHeightLt}</button>
      <hr/>
      <div>
        {/*JSON.stringify(data, null, 2)*/}
        {/*JSON.stringify(blocks, null, 2)*/}
        <h3>Payout Parameters</h3>
        {renderParamTable()}
        <h3>Delegations</h3>
        {renderDelegations()}
        <h3>Block list</h3>
        {renderTable()}

      </div>	
    </div>
  );  
}

const NodePayoutsWrapper = (props) => (
  <QueryClientProvider client={queryClient}>
    <NodePayouts {...props} />
  </QueryClientProvider>
);

export default NodePayoutsWrapper