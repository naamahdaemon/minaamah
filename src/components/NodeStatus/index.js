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

const NodeStatus = ({ apiUrl, isRelative }) => {
  const [selectedApi, setSelectedApi] = useState(
    apiUrl
  );  
  
const DateCourante = new Date();
const AnneeCourante = DateCourante.getFullYear();
const MoisCourant = DateCourante.getMonth();

// First day of the previous month
const firstDayOfPreviousMonth = new Date(AnneeCourante, MoisCourant - 1, 1);
const formattedFirstDayOfPreviousMonth = firstDayOfPreviousMonth.toISOString().split('T')[0];

// Last day of the current month
const lastDayOfCurrentMonth = new Date(AnneeCourante, MoisCourant + 1, 0);
const formattedLastDayOfCurrentMonth = lastDayOfCurrentMonth.toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(formattedFirstDayOfPreviousMonth);
  const [endDate, setEndDate] = useState(formattedLastDayOfCurrentMonth);  
  
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };
  
  const handleApiChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedApi(selectedValue);
  };  
  
  const { isDarkTheme } = useColorMode()
  const { siteConfig } = useDocusaurusContext()


  const serverUrl = 'http://akirion.com' //siteConfig.themeConfig.serverUrl

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
  
  const getStatusColor = (status) => {
    return status === 'Healthy' ? 'green' : 'red';
  }
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

	/*
	{
	  "data": {
		"blocks": [
		  {
			"txFees": "538944452",
			"blockHeight": 335622,
			"canonical": true,
			"creator": "B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr",
			"dateTime": "2024-03-06T16:27:00Z",
			"receivedTime": "2024-03-06T16:28:45.154Z",
			"snarkFees": "290519487"
		  },
	*/





  // Preprocess the data to aggregate block counts by date
  const blockCounts = {};
  data.data.blocks.forEach(block => {
    const date = block.dateTime.split('T')[0]; // Extract date part only
    if (date in blockCounts) {
      blockCounts[date]++;
    } else {
      blockCounts[date] = 1;
    }
  });

  // Convert object into array of key-value pairs
  const blockCountsArray = Object.entries(blockCounts);

  //console.log (blockCountsArray)
  console.log ("blockCounts")
  console.log (blockCounts)

  // Sort array by date (key)
  blockCountsArray.sort((a, b) => {
    return new Date(a[0]) - new Date(b[0]);
  });

  // Reconstruct sorted object
  const sortedBlockCounts = {};
  blockCountsArray.forEach(([date, count]) => {
    sortedBlockCounts[date] = count;
  });

  //console.log ("sortedBlockCounts")  
  //console.log (sortedBlockCounts) //OK

  // Fill in missing dates with zero block counts
  const beginDate = new Date(Object.keys(sortedBlockCounts)[0]); // First date in data
  //console.log (beginDate)
  const finDate = new Date(); // Current date
  const currentDate = new Date(beginDate);
  while (currentDate <= finDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (!(dateStr in sortedBlockCounts)) {
      sortedBlockCounts[dateStr] = 0;
    }
    //console.log (dateStr)
    //console.log (sortedBlockCounts[dateStr])
    currentDate.setDate(currentDate.getDate() + 1); // Move to next day
  }

  // Sort dates in ascending order
  const sortedDates = Object.keys(sortedBlockCounts).sort();
  //console.log("sortedDates");
  //console.log(sortedDates);

  console.log ("sortedBlockCounts")  
  console.log (sortedBlockCounts) //OK

  // Calculate cumulative blocks
  const cumulativeBlocks = sortedDates.map((date, index) => {
    const blocksUntilDate = sortedDates.slice(0, index + 1);
    return blocksUntilDate.reduce((acc, cur) => acc + sortedBlockCounts[cur], 0);
  });

  //console.log("cumulativeBlocks");
  //console.log(cumulativeBlocks);
  console.log(sortedDates.map(date => sortedBlockCounts[date]))

// Filter block counts based on selected date range
const filteredBlockCountsArray = blockCountsArray.filter(([date]) => {
  return date >= startDate && date <= endDate;
});

// Reconstruct sorted object based on filtered block counts
const filteredSortedBlockCounts = {};
filteredBlockCountsArray.forEach(([date, count]) => {
  filteredSortedBlockCounts[date] = count;
});

// Sort filtered dates in ascending order
const filteredSortedDates = Object.keys(filteredSortedBlockCounts).sort();

// Calculate cumulative blocks based on filtered dates
const filteredCumulativeBlocks = filteredSortedDates.map((date, index) => {
  const blocksUntilDate = filteredSortedDates.slice(0, index + 1);
  return blocksUntilDate.reduce((acc, cur) => acc + filteredSortedBlockCounts[cur], 0);
});



  // Prepare data for the chart
  const chartData = {
    labels: filteredSortedDates,
    datasets: [
      {
		type: 'bar',
        label: 'Number of Blocks',
        data: filteredSortedBlockCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
		yAxisID: 'y'
      },
      {
        label: 'Cumulative Blocks',
        data: filteredCumulativeBlocks,
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
        text: 'Number of Blocks',
      },
      //max: 5,
    },
    y1: {
      position: 'right', // Secondary Y-axis on the right
      beginAtZero: true,
      title: {
        display: true,
        text: 'Cumulative Blocks',
      },
      //max: 200,
    },
    x: {
      type: 'time',
      time: {
        unit: 'day',
        tooltipFormat: 'yyyy-MM-dd',
      },
      title: {
        display: true,
        labelString: 'Date',
      },
    },
  },
};

  return (
    <div>	
		<h2>Blocks by B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr</h2>
		<div>
		  <div style={{ display: 'inline-block', marginRight: '10px' }}>
			<label htmlFor="startDate">Start Date: </label>
			<input 
			  type="date" 
			  id="startDate" 
			  value={startDate} 
			  onChange={handleStartDateChange} 
			/>
		  </div>
		  <div style={{ display: 'inline-block' }}>
			<label htmlFor="endDate">End Date: </label>
			<input 
			  type="date" 
			  id="endDate" 
			  value={endDate} 
			  onChange={handleEndDateChange} 
			/>
		  </div>
		</div>	
		
		<Line data={chartData} options={chartOptions} />		  

		<table>
		  <thead>
			<tr>
			  <th>Block Height</th>
			  <th>Creator</th>
			  <th>Date Time</th>
			  <th>Received Time</th>
			  <th>Transaction Fees</th>
			  <th>Snark Fees</th>
			</tr>
		  </thead>
		  <tbody>
			{data.data.blocks.map((block, index) => (
			  <tr key={index}>
				<td>{block.blockHeight}</td>
				<td>{block.creator}</td>
				<td>{block.dateTime}</td>
				<td>{block.receivedTime}</td>
				<td>{block.txFees/1000000000}</td>
				<td>{block.snarkFees/1000000000}</td>
			  </tr>
			))}
		  </tbody>
		</table>
    </div>
  );  
}

const NodeStatusWrapper = (props) => (
  <QueryClientProvider client={queryClient}>
    <NodeStatus {...props} />
  </QueryClientProvider>
);

export default NodeStatusWrapper