---
title: BP Information
sidebar_label: BP Information
hide_table_of_contents: true
---

# BP Stats

import BlockProduction from "@site/src/components/NodeStatus"
import NodeDelegations from "@site/src/components/NodeDelegations"

## Blocks
<BlockProduction apiUrl="node_info.json" isRelative="true">
</BlockProduction>

* * *
## Delegations
<NodeDelegations apiUrl="node_delegations.json" isRelative="true">
</NodeDelegations>
