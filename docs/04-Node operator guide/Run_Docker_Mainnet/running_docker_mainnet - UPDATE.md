---
sidebar_position: 3
sidebar_label: Running Mainnet using Docker UPDATED VERSION 2025
sidebar_class_name: green
---
# Running Mina Mainnet with Docker

## Docker installation

### 1. Delete old version (optionnal/recommanded)
 
```bash
apt-cache policy docker-ce
sudo apt remove docker docker-engine docker.io containerd runc
```

### 2. Install dependencies

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release
```

### 3. Add Official Docker repository key

```
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

### 5. Add official Docker package repository

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### 6. Update package list and install docker

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

### ✅ Check Docker version
```bash
docker --version
docker compose version     # (avec un espace, pour la version V2)
```


## Prepare Mina Docker environment
```bash
$ mkdir docker
$ cd docker
$ mkdir mina
$ cd mina
$ mkdir .mina-config
$ cp ~/.mina-env ./
$ cp -r ~/keys/ ./
$ ll
 keys
 .mina-env
cat .mina-env
export CODA_PRIVKEY_PASS=""
export MINA_PRIVKEY_PASS=""
export UPTIME_PRIVKEY_PASS=""
PEER_LIST_URL=https://storage.googleapis.com/mina-seed-lists/mainnet_seeds.txt

EXTRA_FLAGS=" --external-port 8302 --limited-graphql-port 3095 --coinbase-receiver <COINBASE_RECEIVER_ADDRESS>  --metrics-port 6060 --block-producer-key /keys/my-wallet --uptime-submitter-key /keys/my-wallet --uptime-url https://uptime-backend.minaprotocol.com/v1/submit --external-ip <EXTERNAL_IP> --insecure-rest-server"
```

## Run Mina docker container
```sh
docker run --name mina -d -p 4085:3085 -p 4095:3095 -p 7060:6060 -p 9302:8302 --restart=always --mount "type=bind,source=$(pwd)/.mina-env,dst=/entrypoint.d/mina-env,readonly" --mount "type=bind,source=$(pwd)/keys,dst=/keys,readonly" --mount "type=bind,source=$(pwd)/.mina-config,dst=/root/.mina-config" gcr.io/o1labs-192920/mina-daemon:3.2.0-beta2-939b08d-noble-mainnet daemon
```

:::warning  Important
Don't forget to open the port that is mapped to your port 8302 (here **9302**) on your firewall otherwise you may have troubles syncing with peers.
:::

## Check everything is ok
```
docker logs -tf mina

2025-08-01 10:23:32 UTC [Info] Mina daemon is booting up; built with commit "939b08d879e4284829c897f8fa660ef89095b28e"
2025-08-01 10:23:32 UTC [Info] Booting may take several seconds, please wait
2025-08-01 10:23:32 UTC [Info] Reading configuration files $config_files
  config_files: [ "/var/lib/coda/config_939b08d8.json", "/root/.mina-config/daemon.json" ]
2025-08-01 10:23:32 UTC [Warn] Could not read configuration from "/root/.mina-config/daemon.json"
2025-08-01 10:23:32 UTC [Info] Initializing with runtime configuration. Ledger name: null
2025-08-01 10:23:32 UTC [Info] Using the constraint constants from the configuration file
2025-08-01 10:23:41 UTC [Info] Loaded genesis ledger from $ledger_file
  ledger_file: "/tmp/s3_cache_dir/genesis_ledger_5605a5a45c8ef6aac8fa88d5228640c00c16247a93cbeb55e2c95fd4782e88d2.tar.gz"
2025-08-01 10:24:06 UTC [Warn] `block-producer-key` is deprecated. Please set `MINA_BP_PRIVKEY` environment variable instead.
Using block producer keypair private-key password from environment variable MINA_PRIVKEY_PASS
2025-08-01 10:24:09 UTC [Info] Daemon will use chain id a7351abc7ddf2ea92d1b38cc8e636c271c1dfd2c081c637f62ebc2af34eb7cc1
2025-08-01 10:24:09 UTC [Info] Daemon running protocol version 3.0.0
Using uptime submitter keypair private-key password from environment variable UPTIME_PRIVKEY_PASS
2025-08-01 10:24:21 UTC [Info] Creating daemon with commit id: 939b08d879e4284829c897f8fa660ef89095b28e
2025-08-01 10:24:21 UTC [Info] Starting a new prover process
2025-08-01 10:24:37 UTC [Info] Daemon started process of kind "Prover" with pid 125
2025-08-01 10:24:37 UTC [Info] Starting a new verifier process
2025-08-01 10:24:40 UTC [Info] Daemon started process of kind "Verifier" with pid 152
2025-08-01 10:24:40 UTC [Info] Starting a new vrf-evaluator process
2025-08-01 10:24:40 UTC [Info] Daemon started process of kind "Vrf_evaluator" with pid 179
2025-08-01 10:24:40 UTC [Info] Starting a new uptime service SNARK worker process
2025-08-01 10:24:40 UTC [Info] Daemon started process of kind "Uptime_snark_worker" with pid 184
2025-08-01 10:24:40 UTC [Info] Custom child process "libp2p_helper" started with pid 190
2025-08-01 10:24:40 UTC [Error] libp2p_helper: failed to set log level debug for routing/record: error: No such logger
2025-08-01 10:24:40 UTC [Info] libp2p peer ID this session is $peer_id
  peer_id: "****"
2025-08-01 10:24:40 UTC [Info] Starting transition router
2025-08-01 10:24:40 UTC [Info] Initializing transition router
2025-08-01 10:24:40 UTC [Warn] GCLOUD_KEYFILE environment variable not set. Must be set to use upload_blocks_to_gcloud
2025-08-01 10:24:40 UTC [Info] Mina daemon is connecting
2025-08-01 10:24:40 UTC [Info] Created GraphQL server at: http://localhost:3085/graphql
2025-08-01 10:24:40 UTC [Info] Created GraphQL server with limited queries at: http://localhost:3095/graphql
2025-08-01 10:24:40 UTC [Info] Initializing plugins
2025-08-01 10:24:40 UTC [Info] Pausing block production while bootstrapping
2025-08-01 10:24:40 UTC [Info] Starting uptime service using URL $url
  url: "https://uptime-backend.minaprotocol.com/v1/submit"
2025-08-01 10:24:40 UTC [Info] Stopping daemon after 10500 mins and when there are no blocks to be produced
2025-08-01 10:24:40 UTC [Info] Attempted to turn on snark worker, but snark worker key is set to none
2025-08-01 10:24:40 UTC [Info] Daemon ready. Clients can now connect
```

And checking with `mina client status` command : 

```bash
$ docker exec -it mina mina client status
Mina daemon status
-----------------------------------

Global number of accounts:                     273694
Block height:                                  469394
Max observed block height:                     469394
Max observed unvalidated block height:         469394
Local uptime:                                  17m11s
Ledger Merkle root:                            jwZCJsEw4jKGFu7kvYht8p1uxVCPH5WV66h4HmBUXeHT9b5SbnT
Protocol state hash:                           3NLQuNvNfzghP3w2NkDVuUcD9NKc6o1J6zfEw9iBHuPb6Nz4PDbr
Chain id:                                      a7351abc7ddf2ea92d1b38cc8e636c271c1dfd2c081c637f62ebc2af34eb7cc1
Git SHA-1:                                     939b08d879e4284829c897f8fa660ef89095b28e
Configuration directory:                       /root/.mina-config
Peers:                                         1
User_commands sent:                            0
SNARK worker:                                  None
SNARK work fee:                                100000000
Sync status:                                   Synced
Catchup status:
        To build breadcrumb:           0
        To initial validate:           0
        Finished:                      291
        To download:                   0
        Waiting for parent to finish:  0
        To verify:                     0

Block producers running:                       1 (B62qpsy...)
Coinbase receiver:                             B62qr1...
Best tip consensus time:                       epoch=28, slot=2853
Best tip global slot (across all hard-forks):  767253
Next block will be produced in:                in **.**h for slot: ****** slot-since-genesis: ****** (Generated from consensus at slot: ****** slot-since-genesis: 766655)
Consensus time now:                            epoch=28, slot=2855
Consensus mechanism:                           proof_of_stake
Consensus configuration:
        Delta:                     0
        k:                         290
        Slots per epoch:           7140
        Slot duration:             3m
        Epoch duration:            14d21h
        Chain start timestamp:     2024-06-05 00:00:00.000000Z
        Acceptable network delay:  3m

Addresses and ports:
        External IP:    ***.***.***.***
        Bind IP:        ***.***.***.***
        Libp2p PeerID:  ****
        Libp2p port:    8302
        Client port:    8301
      
Metrics:
        block_production_delay:             7 (0 0 0 0 0 0 0)
        transaction_pool_diff_received:     10
        transaction_pool_diff_broadcasted:  0
        transactions_added_to_pool:         2
        transaction_pool_size:              2
        snark_pool_diff_received:           8
        snark_pool_diff_broadcasted:        0
        pending_snark_work:                 0
        snark_pool_size:                    32
```