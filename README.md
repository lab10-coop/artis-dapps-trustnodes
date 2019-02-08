# ARTIS Network Validators Dapp

This Dapp allows to list the currently registered trustnodes of the connected ARTIS network with associated metadata (name, location, ...).  
It also allows trustnode operators to initially set their metadata, to request changes to it and to confirm metadata change requests of other trustnode operators.  

The Dapp directly interacts with the [governance contracts](https://github.com/lab10-coop/artis-network-consensus-contracts) of the ARTIS network connected via web3 interface (no server backend involved).

## Supported browsers

Chrome/Chromium v59+ or Brave v0.58+ with MetaMask   
(in principle it should work in any modern browser with web3 API, but this is the tested and recommended configuration)

## MetaMask setup

The recommended way to connect to an ARTIS network is via the [MetaMask browser plugin](http://metamask.io/).  
In order to set up MetaMask for ARTIS, follow the [instructions for tau1](https://github.com/lab10-coop/tau1#use-with-metamask) or [instructions for sigma1](https://github.com/lab10-coop/sigma1#use-with-metamask)).

## Building from source

1) `npm i`

2) `npm start`
