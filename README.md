# Install

`yarn install`

Install `subgraph-deploy`

`yarn add -D subgraph-deploy`

Modify

• subgraph.yaml

```yaml
source:
  address: "0x…" # Insert contract address e.g. 0xa5451cb3cf997b3775e913f4722ee411ac09be62
  startBlock: 000 # Insert starting block: e.g. 19164861
  abi: market
```

Deploy

`graph auth --studio c387xxx8fa` <-- insert your studio CLI auth

`cd YOUR_SUBGRAPH_DIR` <-- navigate to your local dir

`graph codegen && graph build` <-- build

`graph deploy --studio YOUR_SUBGRAPH_NAME` <-- deploy

Check studio to makesure it's syncing…

### Optional

in your package.json you can add a script to deploy that subgraph in your running graph-node

```json
{
  "scripts": {
    "deploy:eip721-subgraph": "subgraph-deploy -s ashbeech/eip721-subgraph -f eip721-subgraph -i http://localhost:5001/api -g http://localhost:8020"
  }
}
```

```javascript
  .requiredOption('-s, --subgraph <subgraphName>', 'name of the subgraph')
  .requiredOption('-f, --from <folder or npm package>', 'folder or npm package where compiled subgraphe exist')
  .requiredOption('-i, --ipfs <url>', 'ipfs node api url')
  .requiredOption('-g, --graph <url>', 'graph node url');
```

# Example graphQL query

```
# Specific token
query firstTokens {
  token(id: 3164) {./
    id
    soldTime
    firstTime
    latestTime
    firstAddress
    ownerAddress
    actor
    owners {
      id
      ownerNum
      timestamp
    }
  }
}
# Test token fields e.g. timestamps
query firstTokens {
  tokens(first: 100) {
    id
    soldTime
    firstTime
    latestTime
    firstAddress
    ownerAddress
    actor
    owners {
      id
      ownerNum
      timestamp
    }
  }
}

# Sort by timestamp on soldTime
# Note: Tokens initially set, but not sold: remove null results by soldTime
query latestSold {
  tokens(first: 10, where: { soldTime_not: null },orderBy: soldTime, orderDirection: desc) {
    id
    soldTime
    ownerAddress
    numOwners
  }
}

# Sort by latest timestamp on latestTime
query latestForSale {
  tokens(first: 10, orderBy: latestTime, orderDirection: desc) {
    id
    latestTime
    ownerAddress
  }
}

# Filter by soldTime existing and prevOwnerAddress
query latestSoldByOwner {
  tokens(first: 10, where: { soldTime_not: null, prevOwnerAddress: "0x12a21b86c9f2b9f37234db937fa4aaac8c89e182" }, orderBy: soldTime, orderDirection: desc) {
    id
    soldTime
    numOwners
    ownerAddress
    prevOwnerAddress
  }
}

# Filter latest for sale by owner
query latestForSaleByOwner {
  tokens(first: 10, where: { ownerAddress: "0x964a950b7b8445cb5d807f6942071fdde1c75e86" }, orderBy: latestTime, orderDirection: desc) {
    id
    latestTime
    ownerAddress
  }
}

# Sort by price
query sortByPrice {
  tokens(first: 10, orderBy: value, orderDirection: desc) {
    id
    value
    ownerAddress
  }
}

# Price ranges
query priceRange {
  tokens(where: { value_gt: "1000000000000000000", value_lt: "5000000000000000000" }, orderBy: value, orderDirection: desc) {
    id
    value
    ownerAddress
  }
}

# Sorting by most sold
# Note: Shows how to remove null results
query sortByMostSold {
  tokens(where: { value_not: null }, orderBy: numOwners, orderDirection: desc) {
    id
    value
    ownerAddress
    numOwners
  }
}

# First address used to filter and show owners since
query previouslyOwned {
  tokens(where: { firstAddress: "0xa372899d7fd00a5e26a3f02336169282653978d3" }, orderBy: value, orderDirection: desc) {
    id
    value
    firstAddress
    ownerAddress #current owner
    numOwners
    owners {
      id
    }
  }
}

# Hosted Studio Note: Avoid multiple queries (https://github.com/graphprotocol/graph-node/issues/934)
```
