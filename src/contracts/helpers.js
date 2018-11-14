import { constants } from '../constants'

function addressesURL(branch) {
  return `/networks/${branch}/${constants.addressesSourceFile}`
}

function ABIURL(branch, contract) {
  return `/networks/${branch}/abis/` + constants.ABIsSources[contract]
}

function getABI(branch, contract) {
  let addr = helpers.ABIURL(branch, contract)
  return fetch(addr).then(function(response) {
    return response.json()
  })
}

const helpers = {
  addressesURL,
  ABIURL,
  getABI
}

export default helpers
