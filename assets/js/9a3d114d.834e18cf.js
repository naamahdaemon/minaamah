"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[5297],{547:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>m,contentTitle:()=>b,default:()=>g,frontMatter:()=>x,metadata:()=>j,toc:()=>k});var s=n(5893),a=n(1151),o=n(7294),c=(n(5742),n(2949)),r=n(2263),i=n(8767),l=n(9669),d=n.n(l);n(938),n(9085),n(9722);const h=new i.QueryClient,u=e=>{let{apiUrl:t,isRelative:n}=e;const[a,i]=(0,o.useState)(t),{isDarkTheme:l}=(0,c.I)(),{siteConfig:h}=(0,r.Z)(),[u,p]=(0,o.useState)(""),[x,b]=(0,o.useState)(""),[j,m]=(0,o.useState)(""),[k,y]=(0,o.useState)(""),[g,f]=(0,o.useState)(""),[S,T]=(0,o.useState)(""),[B,C]=(0,o.useState)(""),[v,F]=(0,o.useState)([]);(0,o.useEffect)((()=>{(async()=>{const{epochData:e,blocksBegin:t,finBlock:n,epochs:s}=await P(),{params:a}=await w(e.epoch,t,n);_(e.epoch,a),C(e.epoch),F(s)})()}),[]),(0,o.useEffect)((()=>{(async()=>{if(""!==B){const{epochData:e,blocksBegin:t,finBlock:n,epochs:s}=await P(B),{params:a}=await w(B,t,n);_(B,a)}})()}),[B]);const D=async e=>{const t=n?`https://graphql.minaexplorer.com/${a}`:a;try{return(await d().post(t,e,{headers:{"Content-Type":"application/json"}})).data}catch(s){throw new Error(s.message)}},P=async function(e){void 0===e&&(e=B);const{epoch:t,blocksEnd:n,epochs:s}=await(async()=>{const e={query:"query {\n      blocks(sortBy: DATETIME_DESC, limit: 1) {\n        protocolState {\n          consensusState {\n            epoch,\n            blockHeight,\n          }\n        }\n      }\n    }"},t=await D(e),n=t.data.blocks[0].protocolState.consensusState.epoch,s=t.data.blocks[0].protocolState.consensusState.blockHeight;let a=[];for(let c=0;c<=10;c++){const e=n-c;a.push(e)}const o=a;return F(a),{epoch:n,blocksEnd:s,epochs:o}})();let a,o=n;e?a=e-1:(e=t,a=t-1),console.log("**************************** getEpoch ****************************");const c={query:`query {\n      block1: blocks(sortBy: DATETIME_DESC, limit: 1, query: {protocolState: {consensusState: {epoch: ${a}}}}) {\n        protocolState {\n          consensusState {\n            epoch\n            epochCount\n            blockHeight\n            slot\n          }\n        }\n      }\n      block2: blocks(sortBy: DATETIME_DESC, limit: 1, query: {protocolState: {consensusState: {epoch: ${e}}}}) {\n        protocolState {\n          consensusState {\n            epoch\n            epochCount\n            blockHeight\n            slot\n          }\n        }\n      }\n    }`},r=await D(c),i=r.data.block1[0].protocolState.consensusState.blockHeight+1;o=r.data.block2[0].protocolState.consensusState.blockHeight;const l={epoch:e,begin:i,end:o};return T(l),p(i),b(o),{epochData:l,blocksBegin:i,finBlock:o,epochs:s}},w=async function(e,t,n){void 0===e&&(e=B),void 0===t&&(t=parseInt(u)),void 0===n&&(n=parseInt(x)),console.log("**************************** getBlocks ****************************");const s={query:`query {\n      blocks(sortBy: DATETIME_DESC, query: {\n        creatorAccount: {publicKey: "B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr"},\n        blockHeight_gt: ${t},\n        blockHeight_lt: ${n},\n        canonical: true\n      }) {\n        blockHeight\n        canonical\n        creator\n        dateTime\n        receivedTime\n        snarkFees\n        txFees\n        transactions {\n          coinbase\n          feeTransfer {\n            fee\n            type\n          }          \n        }\n      }\n    }`},a=await D(s);m(a.data.blocks);const o=a.data.blocks.reduce(((e,t)=>e+parseInt(t.transactions.coinbase)),0)/1e9,c=a.data.blocks.reduce(((e,t)=>e+parseInt(t.snarkFees)),0)/1e9,r=a.data.blocks.reduce(((e,t)=>e+parseInt(t.txFees)),0)/1e9,i=a.data.blocks.length,l=a.data.blocks.reduce(((e,t)=>t.transactions&&Array.isArray(t.transactions.feeTransfer)?e+t.transactions.feeTransfer.reduce(((e,t)=>"Fee_transfer_via_coinbase"===t.type?e+parseInt(t.fee):e),0):e),0),d={creatorAccount:a.data.blocks[0].creatorAccount,numberOfBlocks:i,sumCoinbase:o,sumFeeTransferViaCoinbase:l/1e9,sumToBurn:o/2,sumSnarkFees:c,sumTxFees:r};return _(e,d),y(d),{params:d}},_=async function(e,t){void 0===t&&(t=k);const n=["B62qn9zWo5HcC2RRRi5P8278Hq5RoKgQWqFvXRYxsbVQeDCsAJP7aop","B62qjeFLiBdA94f9AAznCqBUJKNpo5BEYf5hUydp1sXyLwic6RQWMg2","B62qrzDMYjLf2opTM3KSozahGGKkQhVhQmiAfVZ39FZoKa4WGgcdaAq"],s={query:`query {\n      stakes(limit: 1000,query: {\n        delegate: "B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr", \n        epoch: ${e}\n      }) {\n        balance \n        epoch \n        public_key \n        delegationTotals {\n           countDelegates \n           totalDelegated\n          }\n         }\n        }`},a=await D(s),o=a.data.stakes.reduce(((e,t)=>e+t.balance),0),c=a.data.stakes.filter((e=>!n.includes(e.public_key)));console.log("**************************** getDelegations : tout va bien ?****************************");const r=c.reduce(((e,t)=>e+t.balance),0),i=a.data.stakes.map((e=>{if(n.includes(e.public_key)){const n=e.balance/o,s=0;let a=(t.sumCoinbase-t.sumToBurn)*n;return a*=.92,{...e,locked:!0,sharePercentage:n,shareUnlockedPercentage:s,feeShare:0,totalDue:a}}{const n=e.balance/o,s=e.balance/r;let a=(t.sumCoinbase-t.sumToBurn)*n;return a*=.99,a+=t.sumTxFees*s*.99,a-=t.sumSnarkFees*s*.99,{...e,locked:!1,sharePercentage:n,shareUnlockedPercentage:s,feeShare:0,totalDue:a}}}));i.sort(((e,t)=>t.totalDue-e.totalDue)),f(i)};return(0,s.jsxs)("div",{children:[(0,s.jsx)("h2",{children:"B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr"}),(0,s.jsxs)("select",{value:B,onChange:e=>C(e.target.value),children:[(0,s.jsx)("option",{value:"",children:"Select an Epoch"}),v.map(((e,t)=>(0,s.jsx)("option",{value:e,children:e},t)))]}),(0,s.jsx)("input",{type:"number",placeholder:"Please Wait ...",value:u,onChange:e=>p(e.target.value)}),(0,s.jsx)("input",{type:"number",placeholder:"Please Wait ...",value:x,onChange:e=>b(e.target.value)}),(0,s.jsxs)("button",{onClick:()=>w(S.epoch,u,x),children:["Get Payout Parameter for block ",u," to ",x]}),(0,s.jsx)("hr",{}),(0,s.jsxs)("div",{children:[(0,s.jsx)("h3",{children:"Payout Parameters"}),k?(0,s.jsxs)("table",{children:[(0,s.jsx)("thead",{children:(0,s.jsxs)("tr",{children:[(0,s.jsx)("th",{children:"Number of block"}),(0,s.jsx)("th",{children:"Total Coinbase"}),(0,s.jsx)("th",{children:"Burnt Amount"}),(0,s.jsx)("th",{children:"Total Snark Fees"}),(0,s.jsx)("th",{children:"Total Coinbase snark fee"}),(0,s.jsx)("th",{children:"Total Tx. Fees"}),(0,s.jsx)("th",{children:"Comm. rate"}),(0,s.jsx)("th",{children:"Foundation rate"})]})}),(0,s.jsx)("tbody",{children:(0,s.jsxs)("tr",{children:[(0,s.jsx)("td",{children:k.numberOfBlocks}),(0,s.jsx)("td",{children:k.sumCoinbase}),(0,s.jsx)("td",{children:k.sumToBurn}),(0,s.jsx)("td",{children:k.sumSnarkFees}),(0,s.jsx)("td",{children:k.sumFeeTransferViaCoinbase}),(0,s.jsx)("td",{children:k.sumTxFees}),(0,s.jsx)("td",{children:"1%"}),(0,s.jsx)("td",{children:"8%"})]})})]}):null,(0,s.jsx)("h3",{children:"Delegations"}),g?(0,s.jsxs)("table",{children:[(0,s.jsx)("thead",{children:(0,s.jsxs)("tr",{children:[(0,s.jsx)("th",{children:"PK"}),(0,s.jsx)("th",{children:"Balance"}),(0,s.jsx)("th",{children:"locked"}),(0,s.jsx)("th",{children:"Total Share"}),(0,s.jsx)("th",{children:"Unlock Share"}),(0,s.jsx)("th",{children:"Total Due"})]})}),(0,s.jsx)("tbody",{children:g.map(((e,t)=>(0,s.jsxs)("tr",{children:[(0,s.jsx)("td",{children:e.public_key}),(0,s.jsx)("td",{children:e.balance}),(0,s.jsx)("td",{children:e.locked?"Yes":"No"}),(0,s.jsx)("td",{children:e.sharePercentage}),(0,s.jsx)("td",{children:e.shareUnlockedPercentage}),(0,s.jsx)("td",{children:e.totalDue})]},t)))})]}):null,(0,s.jsx)("h3",{children:"Block list"}),j?(0,s.jsxs)("table",{children:[(0,s.jsx)("thead",{children:(0,s.jsxs)("tr",{children:[(0,s.jsx)("th",{children:"Block Height"}),(0,s.jsx)("th",{children:"Creator"}),(0,s.jsx)("th",{children:"Date Time"}),(0,s.jsx)("th",{children:"Received Time"}),(0,s.jsx)("th",{children:"Snark Fees"}),(0,s.jsx)("th",{children:"Tx Fees"}),(0,s.jsx)("th",{children:"Coinbase"})]})}),(0,s.jsx)("tbody",{children:j.map(((e,t)=>(0,s.jsxs)("tr",{children:[(0,s.jsx)("td",{children:e.blockHeight}),(0,s.jsx)("td",{children:e.creator}),(0,s.jsx)("td",{children:e.dateTime}),(0,s.jsx)("td",{children:e.receivedTime}),(0,s.jsx)("td",{children:e.snarkFees/1e9}),(0,s.jsx)("td",{children:e.txFees/1e9}),(0,s.jsx)("td",{children:e.transactions.coinbase/1e9})]},t)))})]}):null]})]})},p=e=>(0,s.jsx)(i.QueryClientProvider,{client:h,children:(0,s.jsx)(u,{...e})}),x={title:"Payouts",sidebar_label:"Payouts",hide_table_of_contents:!0},b="BP Stats",j={id:"Node Statistics/payouts",title:"Payouts",description:"Payouts Calculator",source:"@site/docs/01-Node Statistics/payouts.md",sourceDirName:"01-Node Statistics",slug:"/Node Statistics/payouts",permalink:"/docs/Node Statistics/payouts",draft:!1,unlisted:!1,editUrl:"https://github.com/naamahdaemon/minaamah/tree/main/docs/01-Node Statistics/payouts.md",tags:[],version:"current",frontMatter:{title:"Payouts",sidebar_label:"Payouts",hide_table_of_contents:!0},sidebar:"mainSidebar",previous:{title:"Delegations",permalink:"/docs/Node Statistics/delegations"},next:{title:"Useful links",permalink:"/docs/General Information/usefull_links"}},m={},k=[{value:"Payouts Calculator",id:"payouts-calculator",level:2}];function y(e){const t={admonition:"admonition",h1:"h1",h2:"h2",mdxAdmonitionTitle:"mdxAdmonitionTitle",p:"p",strong:"strong",...(0,a.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"bp-stats",children:"BP Stats"}),"\n","\n","\n",(0,s.jsx)(t.h2,{id:"payouts-calculator",children:"Payouts Calculator"}),"\n",(0,s.jsxs)(t.admonition,{type:"warning",children:[(0,s.jsx)(t.mdxAdmonitionTitle,{}),(0,s.jsxs)(t.p,{children:["The data below is provided for reference purposes only.\nA rule change in delegation conditions, particularly by the Mina Foundation or O1Labs, may lead to inaccurate results.\n",(0,s.jsx)(t.strong,{children:"Only the official payout script is authoritative in calculating rewards."})]})]}),"\n",(0,s.jsx)(p,{apiUrl:"",isRelative:"true"})]})}function g(e={}){const{wrapper:t}={...(0,a.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(y,{...e})}):y(e)}}}]);