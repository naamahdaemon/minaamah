---
sidebar_position: 8
sidebar_label: How to Run a node
sidebar_class_name: green
---
# How to run a node  
You can find the official documentation on how to install, configure and run a node here :  

https://docs.minaprotocol.com/node-operators/getting-started  

The official documentation is complete and well explained. 

:::note
This page do not aim at replicating this documentation so I highly recommand you follow the official documentation.  
You will find here some additional information regarding some question I had initially when configuring and running a node the first time.  
As well as recurent questions asked on the official Mina discord.
:::

## Prerequisites
Official documentation states the following hardware and software requirements to run a node :  

> **Software**: Supported environments include macOS, Linux (Debian 10, 11 and Ubuntu 20.04 LTS), and any host machine with Docker. 
> 
> **Processor**: Only AMD64 CPU architecture is supported.  
>  
> **Hardware**: Sending and receiving MINA does not require any special hardware.  
>  
> Running a block producer on the Mina network requires at least:  
> 
>* 8-core processor  
>* 16 GB of RAM  
>  
> :::note[Executing one or more Snarks worker]
> More RAM is required to run a SNARK worker node at the same time as a block producer.  
> :::
> 
> **Network**: At least 1 Mbps connection  
>  
> **Officially Tested VM Instances :**  
> 
> O(1) Labs has tested running nodes on several cloud providers. We recommend the following instances for basic node operator needs.  
> Custom requirements and different cost constraints might require a different instance type.
> 
>* AWS c5.2xlarge  
>* GCP c2-standard-8  
>* Azure Standard_F8s_v2  
>* Digital Ocean c-8-16gib  

:::info[Additional Note on Prerequisites]  
Regarding the official recommendations, I would add some remarks below.
:::

* Regarding supported hardware  
Note that only Intel/AMD 64-bit processors are supported.  
Don't try to run Mina on a Raspberry Pi, **it won't work !!**.

* Regarding supported operating systems  
In addition to the official list, it's worth mentioning that a Linux distribution (e.g., Ubuntu 20.04) installed via WSL2 (Windows Linux Subsystem) allows you to run a validation node and all associated features (Snark Worker, etc.) without any issues as easily as on a native Linux machine.  
It is also possible to use Docker™ on Windows to install and run Mina.

* Regarding machine power / required memory quantity  
While it is possible to run Mina, according to the official recommendations, on a machine with an 8-core processor and 16GB of RAM, from experience, I **strongly recommend** a machine with a 16-core CPU and 32GB of RAM.

:::note
I have **never** been able to produce and broadcast a block on time with a machine equipped with an 8-core processor and 16GB of RAM!!
:::

:::note
Mina does not (yet) leverage the power of graphics cards for validation.  
Therefore, being a gamer is unnecessary to run a validation node.  
Only the CPU power is utilized.  
:::

:::note[Processor Generation]
Furthermore, the CPU generation also plays a significant role. An older processor, with the same number of cores/threads, will be much less powerful than a recent processor.

**I recommend a Ryzen 7 7700 which will provide more than sufficient power for block production and Snarks generation.**
:::

* Regarding cloud providers / VPS / VMs and dedicated servers    
In addition to the official list provided by Mina, which includes major cloud providers (AWS, Azure, GCP, Digital Ocean), it is possible to find other providers offering dedicated servers and/or VMs capable of running a validation node.  
However, it should be noted that the usage policy of these providers may prohibit the use of machines for any blockchain-related purposes, particularly the implementation of a validation node, whether in PoW or PoS.  

It is also worth noting that the operating cost of a rented machine or dedicated VM in a cloud environment can be extremely prohibitive and ultimately not profitable.  
This cost can range from tens of Euros per month (€50-90) for a dedicated server to several hundred Euros per month (€300-800) for the most expensive cloud services (GCP, Azure, AWS, etc.).  

:::danger
It is therefore very important to assess the profitability of the project before committing to recurring costs that can be very high.  
Especially since it is often desirable/necessary to ensure redundancy at the machine level (between 2 and 3 servers), which multiplies costs, to ensure continuous blockchain operation.  
:::

:::tip[Alternative]
The best alternative in terms of cost, service, blockchain philosophy, and decentralization is of course running a local validation node, not hosted by a third-party provider.  
For this, any sufficiently powerful computer can suffice provided that this machine can remain connected to the network 24/7.  
There are sufficiently powerful mini-PCs (Ryzen 7, Core i7/i9) that are very affordable and can run a local validation node from home.  
Example: the Geekom A5 equipped with a Ryzen 7 5800H and 32GB of RAM (between €400 and €450)  
| ![Geekom A5](../assets/geekom_a5.png) | https://www.geekom.fr/geekom-a5-mini-pc |
| -- | -- |
:::

