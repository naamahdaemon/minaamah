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
import styles from './styles.module.css';
import naamah_bp_qrcode from './img/naamah_bp_qrcode.png';

const queryClient = new QueryClient()

const EpochStats = ({ apiUrl, isRelative }) => {
  
  const [selectedApi, setSelectedApi] = useState(
    apiUrl
  );    
     
  const { isDarkTheme } = useColorMode()
  const { siteConfig } = useDocusaurusContext()

  const handleApiChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedApi(selectedValue);
  };  

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


  const [dateTime, setDateTime] = useState('');
  const [blockData, setBlockData] = useState(null);


  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedDateTime = now.toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setDateTime(formattedDateTime);
    };

    const fetchGraphQLData = async () => {
      const query = {
        query: `
          query MyQuery {
            blocks(sortBy: DATETIME_DESC, limit: 1) {
              protocolState {
                consensusState {
                  epoch
                  blockHeight
                  slot
                  slotSinceGenesis
                }
              }
            }
          }
        `,
      };

      try {
        const result = await fetchAPI(query);
        return result.data.blocks[0].protocolState.consensusState;
      } catch (error) {
        console.error('Error fetching GraphQL data:', error);
      }
    };

    const convertMinutesToTime = (totalMinutes) => {
      const minutesInADay = 1440;
      const minutesInAnHour = 60;

      const days = Math.floor(totalMinutes / minutesInADay);
      const hours = Math.floor((totalMinutes % minutesInADay) / minutesInAnHour);
      const minutes = totalMinutes % minutesInAnHour;

      return { days, hours, minutes };
    };

    const formatDateTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const updateGraphQLData = async () => {
      const data = await fetchGraphQLData();
      if (data) {
        const remainingMinutes = (7140 - data.slot - 1) * 3;

        const time = convertMinutesToTime(remainingMinutes);
        const now = new Date();
        const futureDate = new Date(now.getTime() + remainingMinutes * 60000);
        const formattedFutureDateTime = formatDateTime(futureDate);

        setBlockData({
          ...data,
          remainingTime: `${time.days}d, ${time.hours}h, ${time.minutes}m`,
          futureDateTime: formattedFutureDateTime,
        });
      }
    };

    const timeInterval = setInterval(updateTime, 1000);
    const dataInterval = setInterval(updateGraphQLData, 60000);

    updateTime();
    updateGraphQLData();

    return () => {
      clearInterval(timeInterval);
      clearInterval(dataInterval);
    };
  }, []);
  
  const slotPercentage = blockData ? (blockData.slot / 7140) * 100 : 0;
  
  return (
    <div className="App">
      <p className="digital-watch2">{dateTime}</p>
      <h2>BLOCKCHAIN INFORMATION</h2>
      <div id="graphql-data">
        {blockData ? (
        <>
          <table>
            <tbody>
              <tr>
                <td className="legend">Epoch</td>
                <td className="value digital-watch blanc">{blockData.epoch}</td>
              </tr>
              <tr>
                <td className="legend">Slot in Epoch</td>
                <td className="value digital-watch blanc">
                  <div className={styles.progressbarcontainer}>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <progress className={styles.progressbar} value={blockData.slot} max="7140"
                        style={{
                          background: `linear-gradient(to right, #1a8870 ${slotPercentage}%, #e0e0e0 ${slotPercentage}%)`,
                        }}></progress>
                      <div
                        style={{
                          position: 'absolute',
                          top: '0',
                          left: `${slotPercentage}%`,
                          transform: 'translateX(-90%)',
                          fontSize: '14px',
                          color: 'white',
                          backgroundColor: '#25c2a0',
                          padding: '2px 5px',
                          borderRadius: '3px',
                          height: '50px'
                        }}
                      >
                        {blockData.slot}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', top: '-5px', width: '100%' }}>
                        <span>0</span>
                        <span>7140</span>
                      </div>
                    </div>  
                  </div>
                  <br/>
                </td>
              </tr>
              <tr>
                <td className="legend">Block Height</td>
                <td className="value digital-watch blanc">{blockData.blockHeight}</td>
              </tr>
              <tr>
                <td className="legend">Slot Since Genesis</td>
                <td className="value digital-watch blanc">{blockData.slotSinceGenesis}</td>
              </tr>
              <tr>
                <td className="legend">Remaining time in epoch (approx.)</td>
                <td className="value digital-watch vert">{blockData.remainingTime}</td>
              </tr>
              <tr>
                <td className="legend">Epoch {blockData.epoch} will end on (approx.)</td>
                <td className="value digital-watch vert">{blockData.futureDateTime}</td>
              </tr>
            </tbody>
          </table>
        </>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <h2>Delegate to my validator</h2>
      <div style={{ display: 'flex', justifyContent: 'center', border: 'none' }}>
        <table style={{ border: 'none' }}>
          <tbody>
            <tr style={{ border: 'none' }}>
              <td style={{ textAlign: 'center', border: 'none' }}>
                <img src={naamah_bp_qrcode} alt="QR Code" style={{ width: '20%', height: 'auto' }} />
              </td>
             </tr>
             <tr>
              <td style={{ textAlign: 'center', border: 'none', whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '200px' }}>
                <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} className="addresse">B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );  
}

const EpochStatsWrapper = (props) => (
  <QueryClientProvider client={queryClient}>
    <EpochStats {...props} />
  </QueryClientProvider>
);

export default EpochStatsWrapper