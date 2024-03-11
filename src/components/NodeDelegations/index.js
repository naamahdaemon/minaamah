import React, { useEffect, useState } from 'react'
import Head from '@docusaurus/Head'
import { useColorMode } from '@docusaurus/theme-common'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useQuery } from 'react-query'
import axios from 'axios'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Line } from 'react-chartjs-2';
//import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
//import Loader from '@theme/Loaders'
import './styles.module.css'

const queryClient = new QueryClient()

const NodeDelegations = ({ apiUrl, isRelative }) => {
  const [selectedApi, setSelectedApi] = useState(
    apiUrl
  );  

  const [selectedEpoch, setSelectedEpoch] = useState(null);
  const [epoch, setEpochs] = useState([]);  
  const [filteredData2, setFilteredData2] = useState([]);
  

  const { isDarkTheme } = useColorMode()
  const { siteConfig } = useDocusaurusContext()


  const serverUrl = 'https://akirion.com' //siteConfig.themeConfig.serverUrl

  const fetchAPI = async () => {
    const fullAPIUrl = isRelative
      ? `${serverUrl}/${selectedApi}`
      : selectedApi

    try {
      const response = await axios.get(fullAPIUrl)
      return response.data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const { isLoading, isError, data, error } = useQuery(
    ['fetchAPI', { selectedApi }],
    fetchAPI,
    {
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    },
  )

  useEffect(() => {
    if (data && data.data && data.data.stakes) {
      const allEpochs = [...new Set(data.data.stakes.map((stake) => stake.epoch))];
      setEpochs(allEpochs);
    }
  }, [data]);

useEffect(() => {
  if (data && data.data && data.data.stakes) {
    // Filter data based on the selected epoch only
    const filteredData2 = data.data.stakes.filter((stake) =>
      !selectedEpoch || stake.epoch >= selectedEpoch
    );

    // Prepare data for the table
    let tableData = filteredData2.map((stake) => ({
      epoch: stake.epoch,
      publicKey: stake.public_key,
      balance: stake.balance,
    }));
    // Sort tableData first by epoch, then by balance in descending order
    tableData = tableData.sort((a, b) => {
      // Sort by epoch
      if (a.epoch !== b.epoch) {
        return a.epoch - b.epoch;
      }
      // If epochs are the same, sort by balance in descending order
      return b.balance - a.balance;
    });
    // Store the filtered data for the table in the state
    setFilteredData2(tableData);
  }
}, [selectedEpoch, data]); // Dependencies: selectedEpoch and data

/*  useEffect(() => {
    if (!data) return;
    const filtered = selectedEpoch
      ? data.data.stakes.filter((stake) => stake.epoch >= selectedEpoch)
      : data.data.stakes;
    setFilteredData2(filtered);
  }, [data, selectedEpoch]);*/
  
  const handleEpochChange = (event) => {
    setSelectedEpoch(parseInt(event.target.value));
  };  
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

	/*
{
  "data": {
    "stakes": [
      {
        "public_key": "B62qpe15stHjxU2pvRDkM9hp6J1hWD4Cf1zmKGCtzsg9awuVK5GxcUR",
        "balance": 947019.638576209,
        "delegationTotals": {
          "totalDelegated": null,
          "countDelegates": null
        },
        "epoch": 61
      },
      {
        "public_key": "B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr",
        "balance": 17.288053713,
        "delegationTotals": {
          "totalDelegated": 1612640.594901639,
          "countDelegates": 4
        },
        "epoch": 61
      },	  
	*/

  // Filter the data for the specific public key and selected epoch
  let filteredData = data.data.stakes.filter(
    (stake) =>
      stake.public_key === 'B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr' &&
      (!selectedEpoch || stake.epoch >= selectedEpoch)
  );
  
	// Filter the data based on the selected epoch only
	//let filteredData2 = data.data.stakes.filter((stake) => 
	//	!selectedEpoch || stake.epoch >= selectedEpoch);
		


  // Extract epoch, totalDelegated, and countDelegates from the filtered data
  const epochs = filteredData.map(stake => stake.epoch);
  const totalDelegated = filteredData.map(stake => stake.delegationTotals.totalDelegated);
  const countDelegates = filteredData.map(stake => stake.delegationTotals.countDelegates);

  // Prepare data for the chart
  const chartData = {
    labels: epochs,
    datasets: [
      {
		type: 'bar',
        label: 'Total Delegated',
        data: totalDelegated,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
		yAxisID: 'y'
      },
      {
        label: '# Delegates',
        data: countDelegates,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
		yAxisID: 'y1'
      },
    ],
  };

	// Configure chart options
const chartOptions = {
  scales: {
    y: {
      position: 'left',
      beginAtZero: true,
      title: {
        display: true,
        text: 'Total Delegated',
      },
      //max: 5,
    },
    y1: {
      position: 'right', // Secondary Y-axis on the right
      beginAtZero: true,
      title: {
        display: true,
        text: '# Delegates',
      },
      //max: 200,
    },
    x: {
      title: {
        display: true,
        labelString: 'Epoch',
      },
    },
  },
};

  return (
    <div>	
		<h2>B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr</h2>
		<div>
			<label htmlFor="epoch">Select Epoch after: </label>
			<select id="epoch" value={selectedEpoch || ''} onChange={handleEpochChange}>
			  <option value="">All Epochs</option>
			  {epochs.map((epoch) => (
				<option key={epoch} value={epoch}>
				  {epoch}
				</option>
			  ))}
			</select>
		</div>		
		<Line data={chartData} options={chartOptions} />	

      <table>
        <thead>
          <tr>
            <th>Epoch</th>
            <th>Public Key</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {filteredData2.map((row) => (
            <tr>
              <td>{row.epoch}</td>
              <td>{row.publicKey}</td>
              <td>{row.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>		
    </div>
  );  
}

const NodeDelegationsWrapper = (props) => (
  <QueryClientProvider client={queryClient}>
    <NodeDelegations {...props} />
  </QueryClientProvider>
);

export default NodeDelegationsWrapper