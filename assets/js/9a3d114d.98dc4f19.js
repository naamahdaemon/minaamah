"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[5297],{547:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>j,contentTitle:()=>b,default:()=>g,frontMatter:()=>x,metadata:()=>m,toc:()=>k});var n=s(5893),o=s(1151),a=s(7294),c=(s(5742),s(2949)),r=s(2263),l=s(8767),i=s(9669),d=s.n(i);s(938),s(9085),s(9722);const h=new l.QueryClient,u=e=>{let{apiUrl:t,isRelative:s}=e;const[o,l]=(0,a.useState)(t),{isDarkTheme:i}=(0,c.I)(),{siteConfig:h}=(0,r.Z)(),[u,p]=(0,a.useState)(""),[x,b]=(0,a.useState)(""),[m,j]=(0,a.useState)(""),[k,y]=(0,a.useState)(""),[g,f]=(0,a.useState)(""),[S,T]=(0,a.useState)(""),[B,C]=(0,a.useState)(""),[v,F]=(0,a.useState)([]);(0,a.useEffect)((()=>{(async()=>{const{epochData:e,blocksBegin:t,finBlock:s,epochs:n}=await q(),{params:o}=await E(e.epoch,t,s);w(e.epoch,o),C(e.epoch),F(n)})()}),[]),(0,a.useEffect)((()=>{(async()=>{if(""!==B){const{epochData:e,blocksBegin:t,finBlock:s,epochs:n}=await q(B),{params:o}=await E(B,t,s);w(B,o)}})()}),[B]);const P=async e=>{const t=s?`https://graphql.minaexplorer.com/${o}`:o;try{return(await d().post(t,e,{headers:{"Content-Type":"application/json"}})).data}catch(n){throw new Error(n.message)}},q=async function(e){void 0===e&&(e=B);const{epoch:t,blocksEnd:s,epochs:n}=await(async()=>{const e={query:"query {\n      blocks(sortBy: DATETIME_DESC, limit: 1) {\n        protocolState {\n          consensusState {\n            epoch,\n            blockHeight,\n          }\n        }\n      }\n    }"},t=await P(e),s=t.data.blocks[0].protocolState.consensusState.epoch,n=t.data.blocks[0].protocolState.consensusState.blockHeight;let o=[],a=0;for(let r=0;r<=10;r++)console.log("epoch:"+s),console.log("epoch-i:"+(s-r)),s-r<0?a=80+s-r:0==s?(console.log("EPOCH 0"),a=0):a=s-r,console.log("epochArray:"+a),o.push(a);const c=o;return F(o),{epoch:s,blocksEnd:n,epochs:c}})();let o,a=s;e?(console.log("selectedEpoch="+e),o=0==e?79:e-1,console.log("previousEpoch="+o)):(console.log("selectedEpoch==false"),e=t,o=0==t?79:t-1),console.log("**************************** getEpoch ****************************"),console.log("L'epoch courante dans getEpoch est : "+t),console.log("L'epoch pr\xe9c\xe9dente dans getEpoch est : "+o);const c={query:`query {\n      block1: blocks(sortBy: DATETIME_DESC, limit: 1, query: {protocolState: {consensusState: {epoch: ${o}}}}) {\n        protocolState {\n          consensusState {\n            epoch\n            epochCount\n            blockHeight\n            slot\n          }\n        }\n      }\n      block2: blocks(sortBy: DATETIME_DESC, limit: 1, query: {protocolState: {consensusState: {epoch: ${e}}}}) {\n        protocolState {\n          consensusState {\n            epoch\n            epochCount\n            blockHeight\n            slot\n          }\n        }\n      }\n    }`},r=await P(c),l=r.data.block1[0].protocolState.consensusState.blockHeight+1;a=r.data.block2[0].protocolState.consensusState.blockHeight;const i={epoch:e,begin:l,end:a};return T(i),p(l),b(a),{epochData:i,blocksBegin:l,finBlock:a,epochs:n}},E=async function(e,t,s){void 0===e&&(e=B),void 0===t&&(t=parseInt(u)),void 0===s&&(s=parseInt(x)),console.log("**************************** getBlocks ****************************");const n={query:`query {\n      blocks(sortBy: DATETIME_DESC, query: {\n        creatorAccount: {publicKey: "B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr"},\n        blockHeight_gt: ${t},\n        blockHeight_lt: ${s},\n        canonical: true\n      }) {\n        blockHeight\n        canonical\n        creator\n        dateTime\n        receivedTime\n        snarkFees\n        txFees\n        transactions {\n          coinbase\n          feeTransfer {\n            fee\n            type\n          }          \n        }\n      }\n    }`},o=await P(n);j(o.data.blocks);const a=o.data.blocks.reduce(((e,t)=>e+parseInt(t.transactions.coinbase)),0)/1e9,c=o.data.blocks.reduce(((e,t)=>e+parseInt(t.snarkFees)),0)/1e9,r=o.data.blocks.reduce(((e,t)=>e+parseInt(t.txFees)),0)/1e9,l=o.data.blocks.length,i=o.data.blocks.reduce(((e,t)=>t.transactions&&Array.isArray(t.transactions.feeTransfer)?e+t.transactions.feeTransfer.reduce(((e,t)=>"Fee_transfer_via_coinbase"===t.type?e+parseInt(t.fee):e),0):e),0),d={creatorAccount:o.data.blocks[0].creatorAccount,numberOfBlocks:l,sumCoinbase:a,sumFeeTransferViaCoinbase:i/1e9,sumToBurn:e<=10?0:a/2,sumSnarkFees:c,sumTxFees:r};return w(e,d),y(d),{params:d}},w=async function(e,t){void 0===t&&(t=k);const s=["B62qn9zWo5HcC2RRRi5P8278Hq5RoKgQWqFvXRYxsbVQeDCsAJP7aop","B62qjeFLiBdA94f9AAznCqBUJKNpo5BEYf5hUydp1sXyLwic6RQWMg2","B62qrzDMYjLf2opTM3KSozahGGKkQhVhQmiAfVZ39FZoKa4WGgcdaAq","B62qjmFWHTMqtXby9FnwxNh1qoaRMMCsTp2TZuSgM94jJE6B6V278NR","B62qimKm1pqwrR9yYBrdPVS8Cb3PU3RV9pd4gzBk9qyxtYUuxFGdovf"],n={query:`query {\n      stakes(limit: 1000,query: {\n        delegate: "B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr", \n        epoch: ${e}\n      }) {\n        balance \n        epoch \n        public_key \n        delegationTotals {\n           countDelegates \n           totalDelegated\n          }\n         }\n        }`},o=await P(n),a=o.data.stakes.reduce(((e,t)=>e+t.balance),0),c=o.data.stakes.filter((e=>!s.includes(e.public_key)));console.log("**************************** getDelegations : tout va bien ?****************************");const r=c.reduce(((e,t)=>e+t.balance),0),l=o.data.stakes.map((e=>{if(s.includes(e.public_key)){const s=e.balance/a,n=0;let o=(t.sumCoinbase-t.sumToBurn)*s;return o*=.92,{...e,locked:!0,sharePercentage:s,shareUnlockedPercentage:n,feeShare:0,totalDue:o}}{const s=e.balance/a,n=e.balance/r;let o=(t.sumCoinbase-t.sumToBurn)*s;return o*=.99,o+=t.sumTxFees*n*.99,o-=t.sumSnarkFees*n*.99,{...e,locked:!1,sharePercentage:s,shareUnlockedPercentage:n,feeShare:0,totalDue:o}}}));l.sort(((e,t)=>t.totalDue-e.totalDue)),f(l)};return(0,n.jsxs)("div",{children:[(0,n.jsx)("h2",{children:"B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr"}),(0,n.jsxs)("select",{value:B,onChange:e=>C(e.target.value),children:[(0,n.jsx)("option",{value:"",children:"Select an Epoch"}),v.map(((e,t)=>(0,n.jsx)("option",{value:e,children:e},t)))]}),(0,n.jsx)("input",{type:"number",placeholder:"Please Wait ...",value:u,onChange:e=>p(e.target.value)}),(0,n.jsx)("input",{type:"number",placeholder:"Please Wait ...",value:x,onChange:e=>b(e.target.value)}),(0,n.jsxs)("button",{onClick:()=>E(S.epoch,u,x),children:["Get Payout Parameter for block ",u," to ",x]}),(0,n.jsx)("hr",{}),(0,n.jsxs)("div",{children:[(0,n.jsx)("h3",{children:"Payout Parameters"}),k?(0,n.jsxs)("table",{children:[(0,n.jsx)("thead",{children:(0,n.jsxs)("tr",{children:[(0,n.jsx)("th",{children:"Number of block"}),(0,n.jsx)("th",{children:"Total Coinbase"}),(0,n.jsx)("th",{children:"Burnt Amount"}),(0,n.jsx)("th",{children:"Total Snark Fees"}),(0,n.jsx)("th",{children:"Total Coinbase snark fee"}),(0,n.jsx)("th",{children:"Total Tx. Fees"}),(0,n.jsx)("th",{children:"Comm. rate"}),(0,n.jsx)("th",{children:"Foundation rate"})]})}),(0,n.jsx)("tbody",{children:(0,n.jsxs)("tr",{children:[(0,n.jsx)("td",{children:k.numberOfBlocks}),(0,n.jsx)("td",{children:k.sumCoinbase}),(0,n.jsx)("td",{children:k.sumToBurn}),(0,n.jsx)("td",{children:k.sumSnarkFees}),(0,n.jsx)("td",{children:k.sumFeeTransferViaCoinbase}),(0,n.jsx)("td",{children:k.sumTxFees}),(0,n.jsx)("td",{children:"1%"}),(0,n.jsx)("td",{children:"8%"})]})})]}):null,(0,n.jsx)("h3",{children:"Delegations"}),g?(0,n.jsxs)("table",{children:[(0,n.jsx)("thead",{children:(0,n.jsxs)("tr",{children:[(0,n.jsx)("th",{children:"PK"}),(0,n.jsx)("th",{children:"Balance"}),(0,n.jsx)("th",{children:"locked"}),(0,n.jsx)("th",{children:"Total Share"}),(0,n.jsx)("th",{children:"Unlock Share"}),(0,n.jsx)("th",{children:"Total Due"})]})}),(0,n.jsx)("tbody",{children:g.map(((e,t)=>(0,n.jsxs)("tr",{children:[(0,n.jsx)("td",{children:e.public_key}),(0,n.jsx)("td",{children:e.balance}),(0,n.jsx)("td",{children:e.locked?"Yes":"No"}),(0,n.jsx)("td",{children:e.sharePercentage}),(0,n.jsx)("td",{children:e.shareUnlockedPercentage}),(0,n.jsx)("td",{children:e.totalDue})]},t)))})]}):null,(0,n.jsx)("h3",{children:"Block list"}),m?(0,n.jsxs)("table",{children:[(0,n.jsx)("thead",{children:(0,n.jsxs)("tr",{children:[(0,n.jsx)("th",{children:"Block Height"}),(0,n.jsx)("th",{children:"Creator"}),(0,n.jsx)("th",{children:"Date Time"}),(0,n.jsx)("th",{children:"Received Time"}),(0,n.jsx)("th",{children:"Snark Fees"}),(0,n.jsx)("th",{children:"Tx Fees"}),(0,n.jsx)("th",{children:"Coinbase"})]})}),(0,n.jsx)("tbody",{children:m.map(((e,t)=>(0,n.jsxs)("tr",{children:[(0,n.jsx)("td",{children:e.blockHeight}),(0,n.jsx)("td",{children:e.creator}),(0,n.jsx)("td",{children:e.dateTime}),(0,n.jsx)("td",{children:e.receivedTime}),(0,n.jsx)("td",{children:e.snarkFees/1e9}),(0,n.jsx)("td",{children:e.txFees/1e9}),(0,n.jsx)("td",{children:e.transactions.coinbase/1e9})]},t)))})]}):null]})]})},p=e=>(0,n.jsx)(l.QueryClientProvider,{client:h,children:(0,n.jsx)(u,{...e})}),x={title:"Payouts",sidebar_label:"Payouts",hide_table_of_contents:!0},b="BP Stats",m={id:"Node Statistics/payouts",title:"Payouts",description:"Payouts Calculator",source:"@site/docs/01-Node Statistics/payouts.md",sourceDirName:"01-Node Statistics",slug:"/Node Statistics/payouts",permalink:"/docs/Node Statistics/payouts",draft:!1,unlisted:!1,editUrl:"https://github.com/naamahdaemon/minaamah/tree/main/docs/01-Node Statistics/payouts.md",tags:[],version:"current",frontMatter:{title:"Payouts",sidebar_label:"Payouts",hide_table_of_contents:!0},sidebar:"mainSidebar",previous:{title:"Epoch Statistics",permalink:"/docs/Node Statistics/epoch_stats"},next:{title:"Payouts Simulator",permalink:"/docs/Node Statistics/payouts_simulator"}},j={},k=[{value:"Payouts Calculator",id:"payouts-calculator",level:2}];function y(e){const t={admonition:"admonition",h1:"h1",h2:"h2",mdxAdmonitionTitle:"mdxAdmonitionTitle",p:"p",strong:"strong",...(0,o.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h1,{id:"bp-stats",children:"BP Stats"}),"\n","\n","\n",(0,n.jsx)(t.h2,{id:"payouts-calculator",children:"Payouts Calculator"}),"\n",(0,n.jsxs)(t.admonition,{type:"warning",children:[(0,n.jsx)(t.mdxAdmonitionTitle,{}),(0,n.jsxs)(t.p,{children:["The data below is provided for reference purposes only.\nA rule change in delegation conditions, particularly by the Mina Foundation or O1Labs, may lead to inaccurate results.\n",(0,n.jsx)(t.strong,{children:"Only the official payout script is authoritative in calculating rewards."})]})]}),"\n",(0,n.jsx)(p,{apiUrl:"",isRelative:"true"})]})}function g(e={}){const{wrapper:t}={...(0,o.a)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(y,{...e})}):y(e)}}}]);