"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[4235],{9968:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>g,contentTitle:()=>j,default:()=>k,frontMatter:()=>b,metadata:()=>y,toc:()=>f});var l=t(85893),s=t(11151),o=t(67294);t(35742),t(52263),t(88767),t(9669),t(20938);const n="courrier_jDEQ",r="tablecontainer_IuUn",i="highlightedrow_x0VV",c="rightalign_Dphx",d="libelle_kn7_",h="entree_sYoc",u="rouge_itf_",m="noir_MKq5",x=()=>{const[e,a]=(0,o.useState)(1),[t,s]=(0,o.useState)("B62qpsyB3gCndt8sNz4GRwusBtg9U72TNiL4mxmcQfWKZ5noa9fFnWr"),[x,p]=(0,o.useState)(null),[b,j]=(0,o.useState)(null),[y,g]=(0,o.useState)(null),[f,N]=(0,o.useState)(null),[k,_]=(0,o.useState)(null),[v,F]=(0,o.useState)(1),[S,w]=(0,o.useState)(5),[A,C]=(0,o.useState)(""),[T,K]=(0,o.useState)(""),[P,O]=(0,o.useState)(!0);(0,o.useEffect)((()=>{(async()=>{try{let a=Number(e)+80,l=!1;const s="my_secret",o="https://minataur.net/api/v1",n="https://www.akirion.com:4664/proxy?url=";let r=o+"/account",i=o+"/delegators",c=o+"/work",d={"Content-Type":"application/json","Minataur-Authorization":"minataur-token:ede9adcaec633f3290865e0f85faddbb:4d8801b69d7870786620996ddcb14e551719693200945"};r=n+encodeURIComponent(`${o}/account`),i=n+encodeURIComponent(`${o}/delegators`),c=n+encodeURIComponent(`${o}/work`),d={"Content-Type":"application/json","x-api-key":"e0d9da01-c1c5-4c44-b4fa-3cbdb4982ed3"},console.log("PublicKey3 :"+A),console.log("****DEBUT DU FETCH DATA****");const h={auth:s,publicKey:A},u={auth:s,epoch:a,publicKey:t,includeOrphanBlocks:!1,beforeHardFork:l,limit:25e3},m=await fetch(r,{method:"POST",headers:d,body:JSON.stringify(h)}),x=await m.json();if(!T){let e="";x&&x.payload&&x.payload.account&&x.payload.account.ledger&&x.payload.account.ledger.delegate_key&&(e=x.payload.account.ledger.delegate_key),K(e)}A&&C(A);const b={auth:s,epoch:a,publicKey:T,includeOrphanBlocks:!1,beforeHardFork:l,limit:25e3},[y,f,k,F]=await Promise.all([fetch(i,{method:"POST",headers:d,body:JSON.stringify(u)}).then((e=>e.json())),fetch(c,{method:"POST",headers:d,body:JSON.stringify({auth:s,epoch:a,publicKey:t,includeOrphanBlocks:!1,beforeHardFork:l})}).then((e=>e.json())),fetch(i,{method:"POST",headers:d,body:JSON.stringify(b)}).then((e=>e.json())),fetch(c,{method:"POST",headers:d,body:JSON.stringify({auth:s,epoch:a,publicKey:T,includeOrphanBlocks:!1,beforeHardFork:l})}).then((e=>e.json()))]);let w;x&&x.payload&&x.payload.account?p(x.payload.account):(console.error("Invalid account data:",x),p(null)),y&&f&&x?(w=()=>({ledger:y.payload.ledger,work:f.payload.work,tableName:"ValidatorTable"}),N(w())):(console.error("Invalid validator data"),N(null)),k&&F&&x?(w=()=>({ledger:k.payload.ledger,work:F.payload.work,tableName:"ValidatorTable"}),_(w())):(console.error("Invalid validator data"),_(null)),y&&f&&x?(w=()=>({ledger:y.payload.ledger,work:f.payload.work,account:x.payload.account,tableName:"delegatorsTable",publicKey:A,showPublicKey:P,fee:v}),console.log(y),console.log(f),console.log(x),j(w())):(console.error("Invalid delegator data"),j(null)),k&&F&&x?(w=()=>({ledger:k.payload.ledger,work:F.payload.work,account:x.payload.account,tableName:"delegatorsTable",publicKey:A,showPublicKey:P,fee:S}),console.log(k),console.log(F),console.log(x),g(w())):(console.error("Invalid delegator data"),g(null)),console.log("****FIN DU FETCH DATA****")}catch(a){console.error("Error fetching data:",a)}})()}),[e,t,T,A,v,S,P]);const E=e=>{let{key:a}=e;const t=a,s=`${t.slice(0,6)}...${t.slice(-6)}`;return(0,l.jsxs)("td",{style:{whiteSpace:"nowrap"},children:[s,(0,l.jsx)("span",{style:{cursor:"pointer",marginLeft:"5px"},onClick:()=>{navigator.clipboard.writeText(t).then((()=>{alert(`${t} copied to clipboard!`)})).catch((e=>{console.error("Failed to copy full key: ",e)}))},title:"Click to copy full key",children:"\ud83d\udccb"})]})},B=(e,a)=>{if(console.log("*** VALIDATOR TABLE ***"),console.log(e),!e)return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("h2",{children:a}),(0,l.jsx)("p",{className:u,children:"Validator information is not available"})]});const{ledger:t,work:s}=e;return t&&s?(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("h2",{children:a}),(0,l.jsxs)("table",{className:n,children:[(0,l.jsx)("thead",{children:(0,l.jsxs)("tr",{children:[(0,l.jsx)("th",{children:"Key"}),(0,l.jsx)("th",{children:"#Blocks"}),(0,l.jsx)("th",{children:"Rewards"}),(0,l.jsx)("th",{children:"Snarks Fee"}),(0,l.jsx)("th",{children:"Trans. Fee"}),(0,l.jsx)("th",{children:"#Del"}),(0,l.jsx)("th",{children:"Stake"})]})}),(0,l.jsx)("tbody",{children:(0,l.jsxs)("tr",{children:[E({key:s.publicKey}),(0,l.jsx)("td",{className:c,children:s.count}),(0,l.jsx)("td",{className:c,children:(Number(s.rewards)/1e9).toFixed(4)}),(0,l.jsx)("td",{className:c,children:(Number(s.snarks_fee)/1e9).toFixed(4)}),(0,l.jsx)("td",{className:c,children:(Number(s.transactions_fee)/1e9).toFixed(4)}),(0,l.jsx)("td",{className:c,children:t.delegators_count}),(0,l.jsx)("td",{className:c,children:(Number(t.stake)/1e9).toFixed(2)})]})})]})]}):(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("h2",{children:a}),(0,l.jsx)("p",{className:u,children:"Validator information is not available"})]})},I=(e,a)=>{if(!e)return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("h2",{children:a}),(0,l.jsx)("p",{className:u,children:"Delegator information is not available"})]});console.log("*** DELEGATOR TABLE ***"),console.log(e);const{ledger:t,work:s,account:o,tableName:r,publicKey:d,showPublicKey:h,fee:m}=e;if(!(t&&s&&o&&o.info))return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("h2",{children:a}),(0,l.jsx)("p",{className:u,children:"Delegators information is not available"})]});let x=Number(t.stake);t.delegators.some((e=>e.public_key===o.info.key))||(x+=Number(o.info.balance));const p=(Number(s.rewards)+Number(s.transactions_fee))/1e9,b={public_key:o.info.key,balance:o.info.balance,locked:!1,is_olabs:o.info.is_olabs,is_found:o.info.is_found,is_investor:o.info.is_investor};t.delegators.some((e=>e.public_key===b.public_key))||t.delegators.push(b);const j=t.delegators.sort(((e,a)=>Number(a.balance)-Number(e.balance)));let y=0,g=0,f=0;return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("h2",{children:a}),(0,l.jsxs)("table",{className:n,children:[(0,l.jsx)("thead",{children:(0,l.jsxs)("tr",{children:[(0,l.jsx)("th",{children:"Key"}),(0,l.jsx)("th",{children:"Lock"}),(0,l.jsx)("th",{children:"Bal."}),(0,l.jsx)("th",{children:"O"}),(0,l.jsx)("th",{children:"F"}),(0,l.jsx)("th",{children:"I"}),(0,l.jsx)("th",{children:"Share"}),(0,l.jsx)("th",{children:"Payout"})]})}),(0,l.jsxs)("tbody",{children:[j.map(((e,a)=>{let t,s=(e.balance/x*100).toFixed(8),o=(e.balance/x*100).toFixed(4);t=e.is_found||e.is_investor?p*(s/100)*.92:e.is_o1labs?p*(s/100)*.95:p*(s/100)*((100-m)/100),y+=Number(e.balance)/1e9,g+=parseFloat(s),f+=t;let n=e.public_key===d;if(n&&console.log(e.public_key+" higlighted"),!h||e.public_key===d)return(0,l.jsxs)("tr",{className:n?i:"",children:[E({key:e.public_key}),(0,l.jsx)("td",{children:(0,l.jsx)("input",{type:"checkbox",checked:e.locked,disabled:!0})}),(0,l.jsx)("td",{className:c,children:(Number(e.balance)/1e9).toFixed(2)}),(0,l.jsx)("td",{children:(0,l.jsx)("input",{type:"checkbox",checked:e.is_olabs,disabled:!0})}),(0,l.jsx)("td",{children:(0,l.jsx)("input",{type:"checkbox",checked:e.is_found,disabled:!0})}),(0,l.jsx)("td",{children:(0,l.jsx)("input",{type:"checkbox",checked:e.is_investor,disabled:!0})}),(0,l.jsx)("td",{className:c,children:o}),(0,l.jsx)("td",{className:c,children:t.toFixed(4)})]},a)})),(0,l.jsxs)("tr",{children:[(0,l.jsx)("td",{children:(0,l.jsx)("strong",{children:"Total:"})}),(0,l.jsx)("td",{}),(0,l.jsx)("td",{className:c,children:(0,l.jsx)("strong",{children:y.toFixed(2)})}),(0,l.jsx)("td",{}),(0,l.jsx)("td",{}),(0,l.jsx)("td",{}),(0,l.jsx)("td",{className:c,children:(0,l.jsx)("strong",{children:g.toFixed(2)})}),(0,l.jsx)("td",{className:c,children:(0,l.jsx)("strong",{children:f.toFixed(2)})})]})]})]})]})};return(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:d,htmlFor:"epoch",children:"Epoch (since hardfork)"}),(0,l.jsx)("input",{className:h,type:"number",id:"epoch",value:e,min:"0",onChange:e=>a(e.target.value)}),(0,l.jsx)("br",{}),(0,l.jsx)("label",{className:d,htmlFor:"publicKey1",children:"Naamah's validator"}),(0,l.jsx)("input",{className:`${h} ${m}`,type:"text",id:"publicKey1",value:t,onChange:e=>s(e.target.value)}),(0,l.jsx)("br",{}),(0,l.jsx)("label",{className:d,htmlFor:"fee1",children:"Naamah's Fees (%)"}),(0,l.jsx)("input",{className:`${h} ${m}`,type:"number",id:"fee1",value:v,min:"0",max:"100",onChange:e=>F(e.target.value)}),(0,l.jsx)("br",{}),(0,l.jsx)("label",{className:d,htmlFor:"fee2",children:"Enter your validator's fee (%)"}),(0,l.jsx)("input",{className:h,type:"number",id:"fee2",value:S,min:"0",max:"100",onChange:e=>w(e.target.value)}),(0,l.jsx)("br",{}),(0,l.jsx)("label",{className:d,htmlFor:"publicKey3",children:"Enter your public Key"}),(0,l.jsx)("input",{className:h,type:"text",id:"publicKey3",value:A,onChange:e=>C(e.target.value)}),(0,l.jsx)("br",{}),(0,l.jsx)("label",{className:d,htmlFor:"publicKey2",children:"Your current validator address"}),(0,l.jsx)("input",{className:`${h} ${m}`,type:"text",id:"publicKey2",value:T,onChange:e=>K(e.target.value)}),(0,l.jsx)("br",{}),(0,l.jsx)("br",{}),(0,l.jsx)("br",{}),(0,l.jsx)("input",{type:"checkbox",id:"showPublicKey3",checked:P,onChange:()=>O(!P)})," Filter to display your public key only",(0,l.jsx)("br",{}),(0,l.jsx)("hr",{}),(0,l.jsx)("div",{className:r,children:(()=>{if(!x)return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("h2",{children:"Account Information"}),(0,l.jsx)("p",{className:u,children:"Account information is not available"})]});console.log("*** ACCOUNT TABLE ***"),console.log(x);const{info:e,ledger:a}=x;let t=a&&a.delegate_key?E({key:a.delegate_key}):(0,l.jsx)("td",{className:u,children:"Key is not in staking ledger yet"});return console.log("*** ACCOUNT TABLE LEDGER***"),console.log(a),e?(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("h2",{children:"Account Information"}),(0,l.jsxs)("table",{className:n,children:[(0,l.jsx)("thead",{children:(0,l.jsxs)("tr",{children:[(0,l.jsx)("th",{children:"Public Key"}),(0,l.jsx)("th",{children:"Balance"}),(0,l.jsx)("th",{children:"Delegate Key"})]})}),(0,l.jsx)("tbody",{children:(0,l.jsxs)("tr",{children:[E({key:e.key}),(0,l.jsx)("td",{className:c,children:(Number(e.balance)/1e9).toFixed(4)}),t]})})]})]}):(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("h2",{children:"Account Information"}),(0,l.jsx)("p",{className:u,children:"Account information is not available"})]})})()}),(0,l.jsx)("div",{className:r,children:B(f,"Naamah's Block Stats")}),(0,l.jsx)("div",{className:r,children:B(k,"Your Validator Block Stats")}),(0,l.jsx)("div",{className:r,children:I(b,"Naamah's Payouts")}),(0,l.jsx)("div",{className:r,children:I(y,"Your Validator Payouts")}),(0,l.jsx)("footer",{children:(0,l.jsx)("p",{children:"\xa9 2024 Naamah"})})]})},p=x,b={title:"Payout Simulator",sidebar_label:"Payouts Simulator",hide_table_of_contents:!0},j="NAAMAH'S BP PERFORMANCE COMPARISON",y={id:"Node Statistics/payouts_simulator",title:"Payout Simulator",description:"Compare the performance of your actual validator with mine \ud83d\ude0a",source:"@site/docs/01-Node Statistics/payouts_simulator.md",sourceDirName:"01-Node Statistics",slug:"/Node Statistics/payouts_simulator",permalink:"/fr/docs/Node Statistics/payouts_simulator",draft:!1,unlisted:!1,editUrl:"https://github.com/naamahdaemon/minaamah/tree/main/docs/01-Node Statistics/payouts_simulator.md",tags:[],version:"current",frontMatter:{title:"Payout Simulator",sidebar_label:"Payouts Simulator",hide_table_of_contents:!0},sidebar:"mainSidebar",previous:{title:"Payouts",permalink:"/fr/docs/Node Statistics/payouts"},next:{title:"Liens utiles",permalink:"/fr/docs/General Information/usefull_links"}},g={},f=[];function N(e){const a={admonition:"admonition",em:"em",h1:"h1",p:"p",...(0,s.a)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(a.h1,{id:"naamahs-bp-performance-comparison",children:"NAAMAH'S BP PERFORMANCE COMPARISON"}),"\n",(0,l.jsx)(a.p,{children:(0,l.jsx)(a.em,{children:"Compare the performance of your actual validator with mine \ud83d\ude0a"})}),"\n",(0,l.jsx)(a.admonition,{title:"notice",type:"warning",children:(0,l.jsx)(a.p,{children:"Only the epochs post hardfork (>0) on the new chain are taken into account."})}),"\n",(0,l.jsx)(p,{})]})}function k(e={}){const{wrapper:a}={...(0,s.a)(),...e.components};return a?(0,l.jsx)(a,{...e,children:(0,l.jsx)(N,{...e})}):N(e)}}}]);