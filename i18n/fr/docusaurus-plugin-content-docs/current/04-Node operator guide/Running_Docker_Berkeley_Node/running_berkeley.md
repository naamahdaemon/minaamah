---
sidebar_position: 14
sidebar_label: Running Mina Berkeley Node with Docker
sidebar_class_name: green
---
# Running Mina Berkeley (the easiest way .. I found)
## STEP 1 - Pull latest docker image
```bash
$ docker pull gcr.io/o1labs-192920/mina-daemon:2.0.0berkeley-rc1-1551e2f-focal-berkeley
$ docker images
REPOSITORY                  TAG                                        IMAGE ID       CREATED       SIZE
minaprotocol/mina-daemon    2.0.0berkeley-rc1-1551e2f-focal-berkeley   353043fd4878   2 weeks ago   2.41GB
```

## STEP 2 - Create your `keys` and `config` directories **on the host**
```bash
$ mkdir keys
$ mkdir config
```

## STEP 3 - Getting an interactive bash session to the container
```bash
$ docker run --name mina -p 9302:8302 -p 127.0.0.1:3085:3085 --mount "type=bind,source=$(pwd)/keys,dst=/root/keys" --mount "type=bind,source=$(pwd)/config,dst=/root/.mina-config" --env MINA_LIBP2P_PASS='pass' --env MINA_PRIVKEY_PASS='pass' --env UPTIME_PRIVKEY_PASS='pass' --entrypoint /bin/bash -it 353043fd4878
```

* Map `keys` and `config` directory from the host to the target container.
* Set your env variables `MINA_LIBP2P_PASS`, `MINA_PRIVKEY_PASS` (optionnal if you want to run a bloc producer) and UPTIME_PRIVKEY_PASS (not required/useless on berkeley)

 > `353043fd4878` is your image id.

## STEP 4 - Generating libp2p keypair
Once inside your container, you now have access to the shell.
We'll use this to generate the libp2p key pair inside the /root/keys directory :

```bash
root@09437a971acb:~# mina libp2p generate-keypair -privkey-path /root/keys/libp2p
Password for new private key file:
Again to confirm:
libp2p keypair:
CAESQFGW4XhXBHPsGf...
```

> Put the same password as the one you specify above for `MINA_LIBP2P_PASS` environment variable

## STEP 5 - Generating BP keys
Then we'll generate the BP key (if needed) :

```bash
root@b8244db5dff8:~# mina-generate-keypair --privkey-path /root/keys/my-wallet
Password for new private key file:
Again to confirm:
Keypair generated
Public key: B62...
Raw public key: 63B...
```

> Put the same password as the one you specify above for `MINA_PRIVKEY_PASS` environment variable

## STEP 6 - Launch Mina Daemon
```bash
root@b8244db5dff8:~# mina daemon --peer-list-url https://storage.googleapis.com/seed-lists/berkeley_seeds.txt --libp2p-keypair ~/keys/libp2p --block-producer-key /root/keys/my-wallet --insecure-rest-server --open-limited-graphql-port --limited-graphql-port 3095 --file-log-level Debug -log-level Info
```

> Once inside the container, pressing Ctrl + p, Ctrl + q will detach you from the container's console and leave the container running in the background.

You'll be able to reattach to you running mina container using :

```bash
$ docker attach mina
```

# Launch intercative shell session again and check mina daemon status
You can launch an additionnal interactive session again to interact with mina daemon if needed : 

```bash
$ docker exec -it mina /bin/bash
```

Then you can get the status of you mina daemon and guess what ? **It is synced !!**

```bash
root@156a3593fdf3:~# mina client status
Mina daemon status
-----------------------------------

Global number of accounts:                     8181
Block height:                                  4285
Max observed block height:                     4285
Max observed unvalidated block height:         4285
Local uptime:                                  26m32s
Ledger Merkle root:                            jwi4sfjSY6JYKrjaL2wUUhYb6t7Ra5p5JhiMdznNFxbSPFZoN4W
Protocol state hash:                           3NLwovdQsqLfz8qHFrqbuLx7u4KccdbD94S65pKrw6tVVgHWkbkb
Chain id:                                      fd7d111973bf5a9e3e87384f560fdead2f272589ca00b6d9e357fca9839631da
Git SHA-1:                                     1551e2faaa246c01636908aabe5f7981715a10f4
Configuration directory:                       /root/.mina-config
Peers:                                         14
User_commands sent:                            0
SNARK worker:                                  None
SNARK work fee:                                100000000
Sync status:                                   Synced
Catchup status:
        To build breadcrumb:           0
        To initial validate:           0
        Finished:                      293
        To download:                   0
        Waiting for parent to finish:  0
        To verify:                     0

Block producers running:                       1 (B62qmo7WKXRS3NNC7XNjZ15XDVD2doVgEoXKW4ELeE4SFDACzSm8vT7)
Coinbase receiver:                             Block producer
Best tip consensus time:                       epoch=1, slot=359
Best tip global slot (across all hard-forks):  7499
Next block will be produced in:                None this epoch… checking at in 14.125d (Generated from consensus at slot: 6970 slot-since-genesis: 6970)
Consensus time now:                            epoch=1, slot=359
Consensus mechanism:                           proof_of_stake
Consensus configuration:
        Delta:                     0
        k:                         290
        Slots per epoch:           7140
        Slot duration:             3m
        Epoch duration:            14d21h
        Chain start timestamp:     2024-02-02 14:01:01.000000Z
        Acceptable network delay:  3m

Addresses and ports:
        External IP:    0.0.0.0
        Bind IP:        0.0.0.0
        Libp2p PeerID:  12D3KooWE1tZXChc9c9ZbgwMgVVnmjqio49KKoZvEjeyaAEAWkYH
        Libp2p port:    8302
        Client port:    8301

Metrics:
        block_production_delay:             7 (0 0 0 0 0 0 0)
        transaction_pool_diff_received:     48
        transaction_pool_diff_broadcasted:  0
        transactions_added_to_pool:         24
        transaction_pool_size:              6
        snark_pool_diff_received:           41
        snark_pool_diff_broadcasted:        0
        pending_snark_work:                 0
        snark_pool_size:                    18
```