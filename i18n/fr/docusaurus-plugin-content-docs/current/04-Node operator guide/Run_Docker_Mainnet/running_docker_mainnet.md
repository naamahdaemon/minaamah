---
sidebar_position: 1
sidebar_label: Running Mainnet using Docker
sidebar_class_name: green
---
# Running Mina Mainnet with Docker 
## Install Docker
I will not explain here how to install docker.
You will find a lot of resources on the internet explaining docker installation in details.

So we can jump to the next step : getting docker image

* * *
## Getting lastest Mina Image
You can search for the latest docker image available for your system on Docker Hub.
Either go to : https://hub.docker.com/r/minaprotocol/mina-daemon/tags and search for the name of the image you want to retrieve or you can search from a simple `curl`from your shell

```bash
curl -sN "https://registry.hub.docker.com/v2/repositories/minaprotocol/mina-daemon/tags?ordering=last_updated&name=focal" | jq -r '.results[] | select(.name | contains("mainnet")) | " \(.last_updated) \t \(.name)"'
```

This command will look for the latest `mainnet` `focal` release of mina-daemon. it will return the following :

```
 2024-03-28T06:01:17.39397Z      1.4.1-e76fc1c-focal-mainnet
 2024-03-14T21:14:24.761851Z     1.4.1-master-ad8ed6e-focal-mainnet
 2024-03-14T16:52:34.529917Z     1.4.1-21acbdc-focal-mainnet
 2024-03-12T21:58:26.106807Z     1.4.1beta1-21acbdc-focal-mainnet
 2024-03-12T20:58:06.691164Z     1.4.1beta1-master-21acbdc-focal-mainnet
```

Then you will just have to pick the latest version available which is in this case `1.4.1-e76fc1c-focal-mainnet`.

After you found the correct version to be installed, just pull the image from docker hub :


```bash
docker pull minaprotocol/mina-daemon:1.4.1-e76fc1c-focal-mainnet
docker images
docker container ls
```

:::note  NOTE
Ensure you use the latest docker image available on docker hub.
Go to https://github.com/MinaProtocol/mina/releases/ to check for the latest release available.
:::

## Preparing launch
Here, we'll create the required directories and files to map with the docker container.

```bash
cd /home/mina
mkdir docker
cd docker/
mkdir mina
cd mina/
mkdir .mina-config
mkdir keys
ll ~/keys/
```

:::note  Existing Keys
If you already have some keys you want to use for your BP, then simply copy those keys to your mapped folder :

```bash
cp ~/keys/* keys/
ll keys/
chmod 700 keys
```
:::

Then copy your `.mine-env` existing folder if you already have one

```bash
cp ~/.mina-env ./
```

## Running the container
:::note  Running  Mina container interactive bash session
```bash
docker run --name mina  -p 9302:9302 -p 4085:3085 -p 4095:4095 -p 7060:7060 \ 
--mount "type=bind,source=$(pwd)/.mina-env,dst=/entrypoint.d/.mina-env,readonly" \ 
--mount "type=bind,source=$(pwd)/keys,dst=/keys,readonly" \ 
--mount "type=bind,source=$(pwd)/.mina-config,dst=/root/.mina-config" \ 
--env MINA_LIBP2P_PASS='****' \ 
--env MINA_PRIVKEY_PASS='****' \ 
--env UPTIME_PRIVKEY_PASS='****' \ 
--entrypoint /bin/bash -it f12d8a034bda
```
:::

:::tip  Working with containers
`f12d8a034bda` is the container identifier.
press `CTRL+P CTRL+Q` to detach container
User `docker attach mina` to reattach container
:::

:::note  Generate new keys
If you did not use existing BP keys (see [⬆️Preparing Launch](#preparing-launch)), you can generate freshj new ones using `mina-generate-keypair` utility once inside the running container :

```bash
root@b8244db5dff8:~# mina-generate-keypair --privkey-path /root/keys/my-wallet
Password for new private key file:
Again to confirm:
Keypair generated
Public key: B62...
Raw public key: 63B...
```
:::

* * *
## Launching Mina Daemon
Once logged into the Docker container : 

:::note  Run Mina
```bash
mina daemon --peer-list-url https://storage.googleapis.com/mina-seed-lists/mainnet_seeds.txt \ 
--external-port 9302 \ 
--block-producer-key /keys/my-wallet \ 
--limited-graphql-port 4095 \ 
--metrics-port 7060 \ 
--coinbase-receiver B62qr1kSFmLBtFbx22VwX2m9WWHVLziYUXNnY8413dsTAfsChHjTM2S \ 
--uptime-submitter-key /keys/my-wallet \ 
--uptime-url https://uptime-backend.minaprotocol.com/v1/submit \ 
--external-ip ***.***.***.*** \ 
--insecure-rest-server
```
:::

## Getting daemon status from host
#### Status
```bash
docker exec -it mina mina client status
```

## Network notice
Docker run in **bridged** mode by default (it is possible to run docker in **host** mode).
This can lead to network problems if you need to access some networking ports exposed by the mina daemon running into a docker container.

If you encounter some network problems with your running daemon, get the virtuel ip adress of your docker container (using `ifconfig` for instance) and use this IP address to communicate.

:::note  Running Docker in host mode
There are both benefits and caveats to running Docker in either bridge mode or host mode. You can learn more from the official Docker documentation: https://docs.docker.com/network/drivers/host/
:::