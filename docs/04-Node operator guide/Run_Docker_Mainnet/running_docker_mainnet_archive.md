---
sidebar_position: 2
sidebar_label: Running Mina Archive Node with Docker
sidebar_class_name: green
---
# Running Mina Mainnet Archive Node on Docker
## Installing Postgres Database Docker Container
### Pull image
```bash
docker pull postgres
```

### Run container
```bash
docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
```

### create Database
```bash
docker exec -it postgres createdb -U postgres archive
``` 

:::info  Liste databases
```bash
echo "SELECT datname FROM pg_database;" | docker exec -i postgres psql -U postgres -d archive
```
:::

### Import database
```bash
curl -Ls https://raw.githubusercontent.com/MinaProtocol/mina/master/src/app/archive/create_schema.sql | docker exec -i postgres psql -U postgres -d archive
```

:::info List all databases
```bash
echo "\dt" | docker exec -i postgres psql -U postgres -d archive
```
:::

## Installing Mina Archive Node
### Get docker image
```bash
docker pull minaprotocol/mina-archive:1.4.1-e76fc1c-focal
```
### Create temporary directory
```bash
mkdir -p /tmp/archive
```
### Create local directory to store stuff and wget the latest database dump
```bash
mkdir archive_node
cd archive_node/
wget --inet4-only https://storage.googleapis.com/mina-archive-dumps/mainnet-archive-dump-2024-03-21_0001.sql.tar.gz
tar xvf mainnet-archive-dump-2024-03-21_0001.sql.tar.gz
```
### Import the dump into postgres
```bash
docker cp mainnet-archive-dump-2024-03-21_0001.sql postgres:/mainnet-archive-dump-2024-03-21_0001.sql
docker exec -i postgres psql -U postgres -d archive -f /mainnet-archive-dump-2024-03-21_0001.sql
```

:::info  checking everything is ok after the dump is imported
```bash
docker exec -it postgres  bash
```

Then once in the container :

```bash
root@f4f526a38062:/## psql -U postgres -d archive_balances_migrated
archive_balances_migrated=## SELECT datname FROM pg_catalog.pg_database;
          datname
---------------------------
 postgres
 archive
 template1
 template0
 archive_balances_migrated
(5 rows)
archive_balances_migrated=## \dt
                  List of relations
 Schema |           Name           | Type  |  Owner
--------+--------------------------+-------+----------
 public | balances                 | table | postgres
 public | blocks                   | table | postgres
 public | blocks_internal_commands | table | postgres
 public | blocks_user_commands     | table | postgres
 public | epoch_data               | table | postgres
 public | internal_commands        | table | postgres
 public | public_keys              | table | postgres
 public | snarked_ledger_hashes    | table | postgres
 public | timing_info              | table | postgres
 public | user_commands            | table | postgres
(10 rows)
```

:::note  
A new `archive_balances_migrated` database has been created
The `archive`database is useless  
:::

:::success  **THE DUMP IS IMPORTED !!**
The dump has been successfully imported.
We can check the latest leist of blocks that are present in the database :

```bash
archive_balances_migrated=## select * from blocks order by global_slot desc limit 10;

   id    |                      state_hash                      | parent_id |                     parent_hash                      | creator_id | block_winner_id | snarked_ledger_hash_id | staking_epoch_data_id | next_epoch_data_id |                     ledger_hash                     | height | global_slot | global_slot_since_genesis |   timestamp   | chain_status
---------+------------------------------------------------------+-----------+------------------------------------------------------+------------+-----------------+------------------------+-----------------------+--------------------+-----------------------------------------------------+--------+-------------+---------------------------+---------------+--------------
 1087577 | 3NKUGWfxWbDrfybV42unX38hnZ2yqMAyLLiQYZ2B4YcrPF9L4BWc |   1087575 | 3NKfzune2ker9cP4QhJ4vuqWzfVgJJVmX1c3Th4bRQH9bvYna3g8 |      94623 |          101819 |                  75169 |                497907 |             505105 | jxJ5Me5aQP4HF9Kcm7mmmeesNFifPHF5qB3hWz8a2QxXNa9Rd7T | 339070 |      527998 |                    527998 | 1710978840000 | pending
 1087575 | 3NKfzune2ker9cP4QhJ4vuqWzfVgJJVmX1c3Th4bRQH9bvYna3g8 |   1087573 | 3NL5P1dkGo2pXVTX7XedPK1zsvQrNreSF8YTJ1VYVMLXkCxBgfDF |       1987 |          107904 |                  75168 |                497907 |             505105 | jy1gishsu6Uts3exnAC5kCF9mNqZtMqfHaSuKhyaxuHtFCa3wiH | 339069 |      527996 |                    527996 | 1710978480000 | pending
 1087573 | 3NL5P1dkGo2pXVTX7XedPK1zsvQrNreSF8YTJ1VYVMLXkCxBgfDF |   1087571 | 3NLuoC89qa6cGjZ9m5idfAQjsVK5ShNdJmbUWY6KpuEotD4Df7Rp |     162470 |          162558 |                  75168 |                497907 |             505105 | jwshPjoFVzh7gxhhvwBn24DEZoE7s859q8nW5iLiqik7x9T1kVR | 339068 |      527994 |                    527994 | 1710978120000 | pending
 1087571 | 3NLuoC89qa6cGjZ9m5idfAQjsVK5ShNdJmbUWY6KpuEotD4Df7Rp |   1087566 | 3NKTBEhAuHgr43f3bpRsrJ7PuFKtjT3sfMQBDWSxfwkgpoFyK67o |       1483 |             205 |                  75168 |                497907 |             505105 | jwNvj1eFX2V7eRL6gDHJwprcHjJNQnDggHVErY1w7Hd7Nf1iJxV | 339067 |      527993 |                    527993 | 1710977940000 | pending
 1087569 | 3NKXFvaxf7YVhtt5FQKupVcEWWdvDmcaQVKYB5LRoXUuDxbvk9TV |   1087566 | 3NKTBEhAuHgr43f3bpRsrJ7PuFKtjT3sfMQBDWSxfwkgpoFyK67o |       1483 |             205 |                  75168 |                497907 |             505105 | jxDPWezuPbPst28NbtzXJv5EWpC1WVFaqW8quCmrzQPdnRsGbFu | 339067 |      527993 |                    527993 | 1710977940000 | pending
 1087568 | 3NKDL6KnnRQUEruiNEHQM1eeYyTU3E6RPLiS2AQqNGRYiBqk9HUj |   1087566 | 3NKTBEhAuHgr43f3bpRsrJ7PuFKtjT3sfMQBDWSxfwkgpoFyK67o |       1483 |             205 |                  75168 |                497907 |             505105 | jxmxAWv7a7Gje8tG33xYaJvQWs3TJrVU7wyAwJYqQkHhaaTFXiu | 339067 |      527993 |                    527993 | 1710977940000 | pending
 1087565 | 3NKCM4JqTrznCHxr7Xs1djmT4QAMNnZonawE9wghENC5QZU2SZGv |   1087563 | 3NLyYqoniFRMtmkcRkNVJX5Zy15eFNefpTxon57RsrTV63Ysmv25 |       1396 |            3507 |                  75168 |                497907 |             505105 | jxHdFJ3EYRpBhvfUWKpQyV8t2sETSkJCPcQhqe8V6XsRJH6vaHS | 339066 |      527991 |                    527991 | 1710977580000 | pending
 1087566 | 3NKTBEhAuHgr43f3bpRsrJ7PuFKtjT3sfMQBDWSxfwkgpoFyK67o |   1087563 | 3NLyYqoniFRMtmkcRkNVJX5Zy15eFNefpTxon57RsrTV63Ysmv25 |       1396 |            3507 |                  75168 |                497907 |             505105 | jwFrq2DwysFpHqNvpTRvH67h52W6vNWztmqAC99pZrZ7A63Vdz9 | 339066 |      527991 |                    527991 | 1710977580000 | pending
 1087563 | 3NLyYqoniFRMtmkcRkNVJX5Zy15eFNefpTxon57RsrTV63Ysmv25 |   1087558 | 3NLoCUELuKCVRgf6oWKdYtzisjgMonZQjRw81fB61geeXBkwyDYB |       1419 |           97463 |                  75168 |                497907 |             505105 | jxYLcPbCDiiBKdoSZzpuss5HhDUEbVUaxVq7BhvSvr1KtcefvU4 | 339065 |      527988 |                    527988 | 1710977040000 | pending
 1087559 | 3NKhopfj2JKqFvi7kGe3LL1xUbz7E6CbLQpUh1xgdqCAMhPgM53a |   1087556 | 3NL4US8Vt4RCDdWegfA24nFZiJKGHBS1AYHETt9Y7wLcXScvx5ZA |       1483 |           71062 |                  75168 |                497907 |             505105 | jwrqN8xGVmxSV7Z5BvQMWeMupBoa7yX5sjuM84ZPm3sCuWHRa9a | 339064 |      527987 |                    527987 | 1710976860000 | pending
```
:::

### Starting the mina-archive container
```bash
docker run --name mina-archive -p 3086:3086 -v /tmp/archive:/data --entrypoint /bin/bash -it 154109f4622a
```

### Running mina-archive
First check the IP adress of the docker container running postgres : `172.17.0.3`
```bash
$ docker exec -it postgres bash
root@f4f526a38062:/## ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.3  netmask 255.255.0.0  broadcast 172.17.255.255
        ether 02:42:ac:11:00:03  txqueuelen 0  (Ethernet)
        RX packets 145546  bytes 36562420 (34.8 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 149990  bytes 319049761 (304.2 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```


Then run an interactive bash shell to the `mina-archive` container and run the `mina-archive` process :
```bash
$ docker exec -it mina-archive bash
root@69c535e2f0b6:/## mina-archive run --postgres-uri postgres://postgres@172.17.0.3:5432/archive_balances_migrated --server-port 3086
```

:::success  SUCCESS
You are all done !!
You can get the last block indexed from the database by entering an interactive bash session to the `postgres`container :
```bash
$ docker exec -it postgres bash
root@f4f526a38062:/## psql -U postgres -d archive_balances_migrated
psql (16.2 (Debian 16.2-1.pgdg120+2))
Type "help" for help.

archive_balances_migrated=## SELECT TO_CHAR(TO_TIMESTAMP(timestamp / 1000), 'YYYY-MM-DD HH24:MI:SS') AS utc_time, height, global_slot from blocks order by timestamp desc limit 1;
      utc_time       | height | global_slot
---------------------+--------+-------------
 2024-03-21 14:24:00 | 339249 |      528288
(1 row)

```
:::

## Catchup missing blocks
In order to catchup missing block, we will use a shell script available here : https://github.com/MinaProtocol/mina/blob/develop/scripts/archive/download-missing-blocks.sh

:::warning  Script execution
The script execution requires some tools from the mina-archive package.
Notably :
* `mina-missing-blocks-auditor`
* `mina-archive-blocks`
:::

It means that the script can only be executed from the mina-archive docker container.
So we copy the script to the mina-archive container :

```bash
docker cp download-missing-blocks.sh mina-archive:/
```

:::warning  **PROBLEM**
Now the big problem when running the script from the mina-archive docker container is that it tries to connect to the archive database but failed to do so due to docker network isolation :-(

```bash
psql -h localhost -p 5432 -U postgres -d archive_balances_migrated
```

**FAILS**
:::

:::success  SOLUTION
Use Docker Postgresql network ip address

```bash
root@69c535e2f0b6:/## export PGPASSWORD=postgres
root@69c535e2f0b6:/## ./download-missing-blocks.sh -n mainnet -a postgres://postgres@172.17.0.3:5432/archive_balances_migrated
```
::: 

## USEFUL COMMANDS
### List running docker containers
```bash 
docker ps
```
### Docker container logs
```bash
docker logs mina
```
### Launch interactive shell session
##### POSTGRES Container

```bash
docker exec -it postgres bash
```

##### Mina Container
```bash
docker exec -it mina bash
```

##### Mina Archive Container
```bash
docker exec -it mina-archive bash
```

##### Copy a local file to a container
```bash
docker cp mainnet-archive-dump-2024-03-21_0001.sql postgres:/mainnet-archive-dump-2024-03-21_0001.sql
docker cp download-missing-blocks.sh mina-archive:/
```

##### Running Mina Archive Container
```bash
docker run --name mina-archive -p 3086:3086 -v /tmp/archive:/data --entrypoint /bin/bash -it 154109f4622a
```

:::note
We forward port 3086 in order for the mina daemon to be able to connect to the mina-archive process.
We also map /tmp/archive to /data
The archive process will be launched manually from within the container (not ideal but more control over)
:::

##### Running the `postgres` container
```bash
docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
```
