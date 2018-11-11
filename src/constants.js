const constants = {}
constants.organization = 'lab10-coop'
constants.repoName = 'poa-chain-spec'
constants.addressesSourceFile = 'contracts.json'
constants.ABIsSources = {
  KeysManager: 'KeysManager.abi.json',
  PoaNetworkConsensus: 'PoaNetworkConsensus.abi.json',
  ValidatorMetadata: 'ValidatorMetadata.abi.json',
  ProofOfPhysicalAddress: 'ProofOfPhysicalAddress.abi.json'
}
constants.userDeniedTransactionPattern = 'User denied transaction'

constants.NETWORKS = {
  '4281427': {
    NAME: 'ARTIS',
    BRANCH: 'ARTIS',
    TESTNET: false
  },
  '246785': {
    NAME: 'ARTIS',
    BRANCH: 'ARTIS',
    TESTNET: false
  }
}

module.exports = {
  constants
}
