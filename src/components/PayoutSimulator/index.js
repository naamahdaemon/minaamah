import React, { useEffect, useState } from 'react'
import Head from '@docusaurus/Head'
import { useColorMode } from '@docusaurus/theme-common'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useQuery } from 'react-query'
import axios from 'axios'
import { ReactQueryDevtools } from 'react-query/devtools'
import styles from './styles.module.css';

const PayoutSimulator = () => {
    const [epoch, setEpoch] = useState(1);
    const [publicKey1, setPublicKey1] = useState('B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr');
    const [accountTable, setAccountTable] = useState(null);
    const [delegatorTable1, setDelegatorTable1] = useState(null);
    const [delegatorTable2, setDelegatorTable2] = useState(null);
    const [validatorTable1, setValidatorTable1] = useState(null);
    const [validatorTable2, setValidatorTable2] = useState(null);
    const [fee1, setFee1] = useState(1);
    const [fee2, setFee2] = useState(5);
    const [publicKey3, setPublicKey3] = useState('');
    const [publicKey2, setPublicKey2] = useState('');
    const [showPublicKey3, setShowPublicKey3] = useState(true);

    // Define fetchData function
    const fetchData = async () => {
        try {
            let epochSinceHardfork = Number(epoch) + 80; // Adjust as needed
            let beforeHF = false; // Adjust as needed

            const auth = "my_secret";
            const apiUrl = "https://minataur.net/api/v1";
            const proxyUrl = "https://www.akirion.com:4664/proxy?url=";
            const cors_proxy = true;
            let accountRoute = apiUrl + "/account";
            let delegatorsRoute = apiUrl + "/delegators";
            let workRoute = apiUrl + "/work";
            let headers = {
                'Content-Type': 'application/json',
                'Minataur-Authorization': 'minataur-token:ede9adcaec633f3290865e0f85faddbb:4d8801b69d7870786620996ddcb14e551719693200945',
            };

            if (cors_proxy) {
                accountRoute = proxyUrl + encodeURIComponent(`${apiUrl}/account`);
                delegatorsRoute = proxyUrl + encodeURIComponent(`${apiUrl}/delegators`);
                workRoute = proxyUrl + encodeURIComponent(`${apiUrl}/work`);
                headers = {
                    'Content-Type': 'application/json',
                    'x-api-key': 'e0d9da01-c1c5-4c44-b4fa-3cbdb4982ed3',
                };
            }

            console.log ("PublicKey3 :" + publicKey3);

            console.log("****DEBUT DU FETCH DATA****");

            const accountPayload = { auth, publicKey: publicKey3 };
            const delegatorsPayload = { auth, epoch: epochSinceHardfork, publicKey: publicKey1, includeOrphanBlocks: false, beforeHardFork: beforeHF, limit: 25000 };
            //let delegatorsPayload2 = { auth, epoch: epochSinceHardfork, publicKey: publicKey2, includeOrphanBlocks: false, beforeHardFork: beforeHF };

            // Clear existing tables before populating (you need to implement clearTable function)

            // Fetch account data first
            const accountResponse = await fetch(accountRoute, {
                method: 'POST',
                headers,
                body: JSON.stringify(accountPayload)
            });
            const accountData = await accountResponse.json();

            // Update publicKey2 input field with delegate_key if it's empty
            if (!publicKey2) {
                let delegateKey = "";
                if (accountData && accountData.payload && accountData.payload.account && accountData.payload.account.ledger && accountData.payload.account.ledger.delegate_key) {
                    delegateKey = accountData.payload.account.ledger.delegate_key;
                }
                setPublicKey2(delegateKey);
            }
            
            if (publicKey3)
               setPublicKey3(publicKey3);
            
            // Update delegatorsPayload2 with the correct publicKey2
            const delegatorsPayload2 = { auth, epoch: epochSinceHardfork, publicKey: publicKey2, includeOrphanBlocks: false, beforeHardFork: beforeHF, limit:25000 };

            // Fetch all other necessary data
            const [delegatorsResponse, workResponse, delegatorsResponse2, workResponse2] = await Promise.all([
                fetch(delegatorsRoute, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(delegatorsPayload)
                }).then(res => res.json()),
                fetch(workRoute, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ auth, epoch: epochSinceHardfork, publicKey: publicKey1, includeOrphanBlocks: false, beforeHardFork: beforeHF })
                }).then(res => res.json()),
                fetch(delegatorsRoute, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(delegatorsPayload2)
                }).then(res => res.json()),
                fetch(workRoute, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ auth, epoch: epochSinceHardfork, publicKey: publicKey2, includeOrphanBlocks: false, beforeHardFork: beforeHF })
                }).then(res => res.json())
            ]);

            // Populate tables with fetched data (you need to implement these functions)
            if (accountData && accountData.payload && accountData.payload.account) {
              setAccountTable(accountData.payload.account);
            } else {
              console.error("Invalid account data:", accountData);
              // Optionally, you can set accountTable to null or a default value
              setAccountTable(null);
            }

            // Build first validator table
            let combineData;
            
            if (delegatorsResponse && workResponse && accountData) {
              combineData = () => {
                  const ledgerData = delegatorsResponse.payload.ledger;
                  const workData = workResponse.payload.work;

                  // Combine the data as needed. Adjust the structure based on your requirements.
                  return {
                      ledger: ledgerData,
                      work: workData,
                      tableName: 'ValidatorTable'
                  };
              };
   
              // Update state with combined data

                setValidatorTable1(combineData());
            }  else {
              console.error("Invalid validator data");
              // Optionally, you can set accountTable to null or a default value
              setValidatorTable1(null);
            } 
            
            // Build second validator table
            if (delegatorsResponse2 && workResponse2 && accountData) {
              combineData = () => {
                  const ledgerData = delegatorsResponse2.payload.ledger;
                  const workData = workResponse2.payload.work;

                  // Combine the data as needed. Adjust the structure based on your requirements.
                  return {
                      ledger: ledgerData,
                      work: workData,
                      tableName: 'ValidatorTable'
                  };
              };
   
              // Update state with combined data
            
                setValidatorTable2(combineData());
            } else {
              console.error("Invalid validator data");
              // Optionally, you can set accountTable to null or a default value
              setValidatorTable2(null);
            } 
 
            if (delegatorsResponse && workResponse && accountData) {
              combineData = () => {
                  const ledgerData = delegatorsResponse.payload.ledger;
                  const workData = workResponse.payload.work;
                  const accountDataInfo = accountData.payload.account;

                  // Combine the data as needed. Adjust the structure based on your requirements.
                  return {
                      ledger: ledgerData,
                      work: workData,
                      account: accountDataInfo,
                      tableName: 'delegatorsTable',
                      publicKey: publicKey3,
                      showPublicKey: showPublicKey3,
                      fee: fee1
                  };
              };

            // Update state with combined data
 
                console.log (delegatorsResponse);
                console.log (workResponse);
                console.log(accountData);
                setDelegatorTable1(combineData());
            }  else {
              console.error("Invalid delegator data");
              // Optionally, you can set accountTable to null or a default value
              setDelegatorTable1(null);
            }              

            if (delegatorsResponse2 && workResponse2 && accountData) {
              combineData = () => {
                  const ledgerData = delegatorsResponse2.payload.ledger;
                  const workData = workResponse2.payload.work;
                  const accountDataInfo = accountData.payload.account;

                  // Combine the data as needed. Adjust the structure based on your requirements.
                  return {
                      ledger: ledgerData,
                      work: workData,
                      account: accountDataInfo,
                      tableName: 'delegatorsTable',
                      publicKey: publicKey3,
                      showPublicKey: showPublicKey3,
                      fee: fee2
                  };
              };

              // Update state with combined data

                console.log (delegatorsResponse2);
                console.log (workResponse2);
                console.log(accountData);
                setDelegatorTable2(combineData());
            } else {
              console.error("Invalid delegator data");
              // Optionally, you can set accountTable to null or a default value
              setDelegatorTable2(null);
            }     
            console.log("****FIN DU FETCH DATA****");
            //console.log("DELEGATORS TABLE");
            //console.log (delegatorTable1);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        // Call fetchData when component mounts or dependencies change
        fetchData();
    }, [epoch, publicKey1, publicKey2, publicKey3, fee1, fee2, showPublicKey3]);

    /*useEffect(() => {
        // Log delegatorTable1 whenever it changes
        console.log('delegatorTable1 updated:', delegatorTable1);
    }, [delegatorTable1]);*/

    const createTruncatedKeyCell = ({ key }) => {
        const fullKey = key;
        //console.log (fullKey);
        const truncatedKey = `${fullKey.slice(0, 6)}...${fullKey.slice(-6)}`;
        //console.log (truncatedKey);
    
        const copyToClipboard = () => {
            navigator.clipboard.writeText(fullKey).then(() => {
                alert(`${fullKey} copied to clipboard!`);
            }).catch(err => {
                console.error('Failed to copy full key: ', err);
            });
        };

        return (
            <td style={{ whiteSpace: 'nowrap' }}>
                {truncatedKey}
                <span
                    style={{ cursor: 'pointer', marginLeft: '5px' }}
                    onClick={copyToClipboard}
                    title="Click to copy full key"
                >
                    📋
                </span>
            </td>
        );
    };

    const renderValidatorTable = (validatorTable, titre) => {
        console.log("*** VALIDATOR TABLE ***");
        console.log(validatorTable);
        if (!validatorTable) return (
            <>
              <h2>{titre}</h2>
              <p className={styles.rouge}>Validator information is not available</p>
            </>
          );

        // Convert object keys to an array for iteration
        const { ledger, work } = validatorTable;

        if (!ledger || !work) {
          return (
            <>
              <h2>{titre}</h2>
              <p className={styles.rouge}>Validator information is not available</p>
            </>
          );
        }

        // Render table headers and rows based on accountTable
        return (
          <>
            <h2>{titre}</h2>
            <table className={styles.courrier}>
                <thead>
                    <tr>
                      <th>Key</th>
                      <th>#Blocks</th>
                      <th>Rewards</th>
                      <th>Snarks Fee</th>
                      <th>Trans. Fee</th>
                      <th>#Del</th>
                      <th>Stake</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {createTruncatedKeyCell({ key: work.publicKey })}
                        <td className={styles.rightalign}>{ work.count }</td>
                        <td className={styles.rightalign}>{(Number(work.rewards) / 1000000000).toFixed(4)}</td>
                        <td className={styles.rightalign}>{(Number(work.snarks_fee) / 1000000000).toFixed(4)}</td>
                        <td className={styles.rightalign}>{(Number(work.transactions_fee) / 1000000000).toFixed(4)}</td>
                        <td className={styles.rightalign}>{ledger.delegators_count}</td>
                        <td className={styles.rightalign}>{(Number(ledger.stake) / 1000000000).toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
           </>
        );
    };

    const renderAccountTable = () => {
        if (!accountTable) return (
            <>
              <h2>Account Information</h2>
              <p className={styles.rouge}>Account information is not available</p>
            </>
          );
        console.log("*** ACCOUNT TABLE ***");
        console.log(accountTable);
        // Convert object keys to an array for iteration
        const { info, ledger } = accountTable;
        
        let cle = ledger && ledger.delegate_key 
          ? createTruncatedKeyCell({ key: ledger.delegate_key }) 
          : <td className={styles.rouge}>Key is not in staking ledger yet</td>;
        
        console.log("*** ACCOUNT TABLE LEDGER***");
        console.log(ledger);

        if (!info) {
          return (
            <>
              <h2>Account Information</h2>
              <p className={styles.rouge}>Account information is not available</p>
            </>
          );
        }

        // Render table headers and rows based on accountTable
        return (
          <>
            <h2>Account Information</h2>
            <table  className={styles.courrier}>
                <thead>
                    <tr>
                        <th>Public Key</th>
                        <th>Balance</th>
                        <th>Delegate Key</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {createTruncatedKeyCell({ key: info.key })}
                        <td className={styles.rightalign}>{(Number(info.balance) / 1000000000).toFixed(4)}</td>
                        {cle}
                    </tr>
                </tbody>
            </table>
          </>
        );
    };

const renderDelegatorTable = (delegatorTable, titre) => {
        if (!delegatorTable) return (
            <>
              <h2>{titre}</h2>
              <p className={styles.rouge}>Delegator information is not available</p>
            </>
          );
        console.log("*** DELEGATOR TABLE ***");
        console.log(delegatorTable);
        // Convert object keys to an array for iteration
        const { ledger, work, account, tableName , publicKey, showPublicKey, fee} = delegatorTable;

        if (!ledger || !work || !account || !account.info) {
          return (
            <>
              <h2>{titre}</h2>
              <p className={styles.rouge}>Delegators information is not available</p>
            </>
          );
        }

        let totalStake = Number(ledger.stake);
        //const totalStake = ledger.delegators.reduce((acc, delegator) => acc + delegator.balance, 0);

        if (!ledger.delegators.some(d => d.public_key === account.info.key)) {
            totalStake += Number(account.info.balance);
        }
        
        
        const totalRewards = (Number(work.rewards) + Number(work.transactions_fee)) / 1000000000;

        // Add the third public key as a delegator only if it's not already in the list
        const thirdDelegator = {
            public_key: account.info.key,
            balance: account.info.balance,
            locked: false,
            is_olabs: account.info.is_olabs,
            is_found: account.info.is_found,
            is_investor: account.info.is_investor
        };

        if (!ledger.delegators.some(d => d.public_key === thirdDelegator.public_key)) {
            // Add thirdDelegator to ledger.delegators
            ledger.delegators.push(thirdDelegator);
        }

        // Sort the delegators array by balance in descending order
        const sortedDelegators = ledger.delegators.sort((a, b) => Number(b.balance) - Number(a.balance));

        let totalBalance = 0;
        let totalShares = 0;
        let totalPayouts = 0;

        // Render table headers and rows based on accountTable
        return (
         <>
          <h2>{titre}</h2>
          <table className={styles.courrier}>
            <thead>
              <tr>
                <th>Key</th>
                <th>Lock</th>
                <th>Bal.</th>
                <th>O</th>
                <th>F</th>
                <th>I</th>
                <th>Share</th>
                <th>Payout</th>
              </tr>
            </thead>
            <tbody>
              {sortedDelegators.map((delegator, index) => {
                // Calculate share percentage rounded to 8 decimal places
                let share = (delegator.balance / totalStake * 100).toFixed(8);
                let roundedShare = (delegator.balance / totalStake * 100).toFixed(4);

                // Calculate due amount based on conditions
                let dueAmount;
                if (delegator.is_found || delegator.is_investor) {
                  dueAmount = totalRewards * (share / 100) * 0.92;
                } else if (delegator.is_o1labs) {
                  dueAmount = totalRewards * (share / 100) * 0.95;
                } else {
                  dueAmount = totalRewards * (share / 100) * ((100 - fee) / 100);
                }
                
                // Accumulate totals
                totalBalance += Number(delegator.balance) / 1000000000;
                totalShares += parseFloat(share);
                totalPayouts += dueAmount;      

                // Determine if the current row should be highlighted
                let isHighlighted = (delegator.public_key === publicKey);
                
                if (isHighlighted) 
                   console.log (delegator.public_key + " higlighted");
                 
                if (!showPublicKey || delegator.public_key === publicKey) {
                  return (
                    <tr key={index} className={isHighlighted ? styles.highlightedrow : ''}>
                      {createTruncatedKeyCell({ key: delegator.public_key })}
                      <td>
                        <input
                          type="checkbox"
                          checked={delegator.locked}
                          disabled={true}
                        />
                      </td>
                      <td className={styles.rightalign}>{(Number(delegator.balance) / 1000000000).toFixed(2)}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={delegator.is_olabs}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={delegator.is_found}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={delegator.is_investor}
                          disabled={true}
                        />
                      </td>
                      <td className={styles.rightalign}>{roundedShare}</td>
                      <td className={styles.rightalign}>{dueAmount.toFixed(4)}</td>
                    </tr>
                  );
                }
              })}
                {/* Summary row */}
                <tr>
                  <td><strong>Total:</strong></td>
                  <td></td>
                  <td className={styles.rightalign}><strong>{totalBalance.toFixed(2)}</strong></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className={styles.rightalign}><strong>{totalShares.toFixed(2)}</strong></td>
                  <td className={styles.rightalign}><strong>{totalPayouts.toFixed(2)}</strong></td>
                </tr>              
            </tbody>
          </table>
         </>
        );
    };



    return (
        <div>
            <label className={styles.libelle} htmlFor="epoch">Epoch (since hardfork)</label>
            <input className={styles.entree} type="number" id="epoch" value={epoch} min="0" onChange={(e) => setEpoch(e.target.value)} /><br />

            <label className={styles.libelle} htmlFor="publicKey1">Naamah's validator</label>
            <input className={`${styles.entree} ${styles.noir}`} type="text" id="publicKey1" value={publicKey1} onChange={(e) => setPublicKey1(e.target.value)}/><br />

            <label className={styles.libelle} htmlFor="fee1">Naamah's Fees (%)</label>
            <input className={`${styles.entree} ${styles.noir}`} type="number" id="fee1" value={fee1} min="0" max="100" onChange={(e) => setFee1(e.target.value)} /><br />

            <label className={styles.libelle} htmlFor="fee2">Enter your validator's fee (%)</label>
            <input className={styles.entree} type="number" id="fee2" value={fee2} min="0" max="100" onChange={(e) => setFee2(e.target.value)} /><br />

            <label className={styles.libelle} htmlFor="publicKey3">Enter your public Key</label>
            <input className={styles.entree} type="text" id="publicKey3" value={publicKey3} onChange={(e) => setPublicKey3(e.target.value)} /><br />

            <label className={styles.libelle} htmlFor="publicKey2">Your current validator address</label>
            <input className={`${styles.entree} ${styles.noir}`} type="text" id="publicKey2" value={publicKey2} onChange={(e) => setPublicKey2(e.target.value)}/><br />

            <br /><br />
            <input type="checkbox" id="showPublicKey3" checked={showPublicKey3} onChange={() => setShowPublicKey3(!showPublicKey3)} /> Filter to display your public key only<br />
 
            <hr />
            
            <div className={styles.tablecontainer}>
                {renderAccountTable()}
            </div>
            
            <div className={styles.tablecontainer}>
              {renderValidatorTable(validatorTable1, "Naamah's Block Stats")}
            </div>
            
            <div className={styles.tablecontainer}>
              {renderValidatorTable(validatorTable2, "Your Validator Block Stats")}
            </div>           
            
            <div className={styles.tablecontainer}>
              {renderDelegatorTable(delegatorTable1, "Naamah's Payouts")}
            </div>

            <div className={styles.tablecontainer}>
              {renderDelegatorTable(delegatorTable2, "Your Validator Payouts")}
            </div>

            <footer>
                <p>&copy; 2024 Naamah</p>
            </footer>
        </div>
    );
};

const PayoutSimulatorWrapper = (props) => (
    <QueryClientProvider client={queryClient}>
        <PayoutSimulator {...props} />
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
);

export default PayoutSimulator