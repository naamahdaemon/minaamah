"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[8029],{8024:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>c,frontMatter:()=>s,metadata:()=>i,toc:()=>d});var n=a(5893),o=a(1151);const s={slug:"Updated Mina Pool Payout Script",title:"Mina Pool Payout script updated",authors:["naamah"],tags:["mina","payouts","script","tool"]},r="Mina Pool Payout Script updated",i={permalink:"/fr/blog/Updated Mina Pool Payout Script",editUrl:"https://github.com/naamahdaemon/minaamah/tree/main/blog/2024-06-22-updated_payout_script/index.md",source:"@site/blog/2024-06-22-updated_payout_script/index.md",title:"Mina Pool Payout script updated",description:"The Jonathan's Mina Pool Payout Script has been updated.",date:"2024-06-22T00:00:00.000Z",formattedDate:"22 juin 2024",tags:[{label:"mina",permalink:"/fr/blog/tags/mina"},{label:"payouts",permalink:"/fr/blog/tags/payouts"},{label:"script",permalink:"/fr/blog/tags/script"},{label:"tool",permalink:"/fr/blog/tags/tool"}],readingTime:.565,hasTruncateMarker:!1,authors:[{name:"Naamah",title:"Administrator",url:"https://github.com/naamahdaemon",imageURL:"https://github.com/naamahdaemon.png",key:"naamah"}],frontMatter:{slug:"Updated Mina Pool Payout Script",title:"Mina Pool Payout script updated",authors:["naamah"],tags:["mina","payouts","script","tool"]},unlisted:!1,nextItem:{title:"Epoch 0 Mina Payouts",permalink:"/fr/blog/Mina Payouts for Epoch 0"}},l={authorsImageUrls:[void 0]},d=[];function p(e){const t={a:"a",br:"br",code:"code",li:"li",p:"p",strong:"strong",ul:"ul",...(0,o.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(t.p,{children:["The Jonathan's Mina Pool Payout Script has been updated.",(0,n.jsx)(t.br,{}),"\n","All BP should update to the new v1.7.0 payout script."]}),"\n",(0,n.jsx)(t.p,{children:"This version fixes a discrepancy in the way Foundation and o1Labs delegation payouts are computed compared to the old script."}),"\n",(0,n.jsxs)(t.p,{children:["It adds a new environment variable ",(0,n.jsx)(t.code,{children:"PAYOUT_CALCULATOR"})," to drive the behavior of the transaction fees share."]}),"\n",(0,n.jsx)(t.p,{children:"Valid calculators include for the post-fork rewards :"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"postSuperChargeShareFees"})," : Share the fees between all delegates including foundation, investors and o1labs"]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"postSuperChargeKeepFees"})," : Validator keeps all the fees"]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"postSuperChargeCommonShareFees"})," : Share the fees between delegates excluding foundation, investors and o1labs (",(0,n.jsx)(t.strong,{children:"this was the old behaviour and the default one"}),")"]}),"\n"]}),"\n",(0,n.jsxs)(t.p,{children:["Update your script here : ",(0,n.jsx)(t.a,{href:"https://github.com/jrwashburn/mina-pool-payout",children:"https://github.com/jrwashburn/mina-pool-payout"})]})]})}function c(e={}){const{wrapper:t}={...(0,o.a)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(p,{...e})}):p(e)}},1151:(e,t,a)=>{a.d(t,{Z:()=>i,a:()=>r});var n=a(7294);const o={},s=n.createContext(o);function r(e){const t=n.useContext(s);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),n.createElement(s.Provider,{value:t},e.children)}}}]);