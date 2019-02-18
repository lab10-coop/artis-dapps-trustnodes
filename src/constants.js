const constants = {}
constants.organization = 'lab10-coop'
constants.repoName = 'poa-chain-spec'
constants.addressesSourceFile = 'contracts.json'
constants.ABIsSources = {
  KeysManager: 'KeysManager.abi.json',
  PoaNetworkConsensus: 'PoaNetworkConsensus.abi.json',
  ValidatorMetadata: 'ValidatorMetadata.abi.json'
}
constants.userDeniedTransactionPattern = 'User denied transaction'

constants.NETWORKS = {
  '246529': {
    NAME: 'ARTIS sigma1',
    RPC: 'https://rpc.sigma1.artis.network',
    BRANCH: 'sigma1',
    TESTNET: false
  },
  '246785': {
    NAME: 'ARTIS tau1',
    RPC: 'https://rpc.tau1.artis.network',
    BRANCH: 'tau1',
    TESTNET: true
  }
}

module.exports = {
  constants
}
