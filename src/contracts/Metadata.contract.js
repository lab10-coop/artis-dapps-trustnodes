import PoaConsensus from './PoaConsensus.contract'
import moment from 'moment'
import helpers from './helpers'
import helpersGlobal from '../helpers'
import { messages } from '../messages'
import { constants } from '../constants'

var toAscii = function(hex) {
  var str = '',
    i = 0,
    l = hex.length
  if (hex.substring(0, 2) === '0x') {
    i = 2
  }
  for (; i < l; i += 2) {
    var code = parseInt(hex.substr(i, 2), 16)
    if (code === 0) continue // this is added
    str += String.fromCharCode(code)
  }
  return str
}

export default class Metadata {
  async init({ web3, netId, addresses }) {
    this.web3 = web3
    this.gasPrice = web3.utils.toWei('2', 'gwei')

    const { METADATA_ADDRESS, MOC } = addresses
    console.log('Metadata contract Address: ', METADATA_ADDRESS)

    const MetadataAbi = await helpers.getABI(constants.NETWORKS[netId].BRANCH, 'ValidatorMetadata')

    this.metadataInstance = new web3.eth.Contract(MetadataAbi, METADATA_ADDRESS)
    this.MOC_ADDRESS = MOC
    this.addresses = addresses

    const poaInstance = new PoaConsensus()
    await poaInstance.init({ web3, netId, addresses })
    this.mocRemoved = await poaInstance.isMasterOfCeremonyRemoved()
    this.miningKeys = await poaInstance.getValidators()
  }
  async createMetadata({ firstName, fullAddress, licenseId, state, zipcode, votingKey, hasData }) {
    let methodToCall = hasData ? 'changeRequest' : 'createMetadata'
    return await this.metadataInstance.methods[methodToCall](
      this.web3.utils.fromAscii(firstName),
      this.web3.utils.fromAscii(''),
      this.web3.utils.fromAscii(licenseId),
      fullAddress,
      this.web3.utils.fromAscii(state),
      this.web3.utils.fromAscii(zipcode),
      0
    ).send({ from: votingKey, gasPrice: this.gasPrice })
  }

  getMocData() {
    return {
      firstName: '',
      lastName: '',
      fullAddress: 'Nellie Bly',
      createdDate: '',
      updatedDate: '',
      us_state: '',
      postal_code: ''
    }
  }

  async getValidatorData(miningKey) {
    if (!miningKey) {
      helpersGlobal.generateAlert('warning', 'Warning!', messages.invalidaVotingKey)
      return {}
    }

    let validatorData = await this.metadataInstance.methods.validators(miningKey).call()
    let createdDate = validatorData.createdDate > 0 ? moment.unix(validatorData.createdDate).format('YYYY-MM-DD') : ''
    let updatedDate = validatorData.updatedDate > 0 ? moment.unix(validatorData.updatedDate).format('YYYY-MM-DD') : ''
    return {
      firstName: toAscii(validatorData.firstName),
      lastName: toAscii(validatorData.lastName),
      fullAddress: validatorData.fullAddress == null ? '' : validatorData.fullAddress,
      licenseId: toAscii(validatorData.licenseId),
      createdDate,
      updatedDate,
      state: toAscii(validatorData.state),
      zipcode: toAscii(validatorData.zipcode)
    }
  }

  async getAllValidatorsData(netId) {
    let all = []
    return new Promise(async (resolve, reject) => {
      console.log(this.miningKeys)
      const mocAddressLowercase = this.MOC_ADDRESS.toLowerCase()
      for (let key of this.miningKeys) {
        let data
        if (key.toLowerCase() === mocAddressLowercase) {
          if (this.mocRemoved) {
            continue
          }
          data = this.getMocData()
        } else {
          data = await this.getValidatorData(key)
        }
        data.address = key
        all.push(data)
      }
      resolve(all)
    })
  }

  async getPendingChange(miningKey) {
    if (!miningKey) {
      helpersGlobal.generateAlert('warning', 'Warning!', messages.invalidaVotingKey)
      return {}
    }

    let pendingChanges = await this.metadataInstance.methods.pendingChanges(miningKey).call()
    let createdDate = pendingChanges.createdDate > 0 ? moment.unix(pendingChanges.createdDate).format('YYYY-MM-DD') : ''
    let updatedDate = pendingChanges.updatedDate > 0 ? moment.unix(pendingChanges.updatedDate).format('YYYY-MM-DD') : ''
    return {
      firstName: toAscii(pendingChanges.firstName),
      lastName: toAscii(pendingChanges.lastName),
      fullAddress: pendingChanges.fullAddress,
      licenseId: toAscii(pendingChanges.licenseId),
      createdDate,
      updatedDate,
      state: toAscii(pendingChanges.state),
      zipcode: toAscii(pendingChanges.zipcode),
      minThreshold: pendingChanges.minThreshold
    }
  }

  async getAllPendingChanges() {
    let pendingChanges = []
    for (let key of this.miningKeys) {
      let pendingChange = await this.getPendingChange(key)
      pendingChange.address = key
      if (pendingChange.fullAddress) {
        pendingChanges.push(pendingChange)
      }
    }
    return pendingChanges
  }

  async confirmPendingChange({ miningKeyToConfirm, senderVotingKey, senderMiningKey }) {
    const { methods } = this.metadataInstance
    let alreadyConfirmed
    if (methods.isValidatorAlreadyVoted) {
      alreadyConfirmed = await methods.isValidatorAlreadyVoted(miningKeyToConfirm, senderMiningKey).call()
    } else {
      alreadyConfirmed = await methods.isAddressAlreadyVoted(miningKeyToConfirm, senderVotingKey).call()
    }
    console.log(alreadyConfirmed)
    if (alreadyConfirmed) {
      throw new Error(`You already confirmed this change.`)
    }
    if (senderMiningKey === miningKeyToConfirm) {
      throw new Error(`You cannot confirm your own changes.\n
          Please ask other validators to verify your new information.`)
    }
    return await this.metadataInstance.methods
      .confirmPendingChange(miningKeyToConfirm)
      .send({ from: senderVotingKey, gasPrice: this.gasPrice })
  }

  async getConfirmations({ miningKey }) {
    return await this.metadataInstance.methods.confirmations(miningKey).call()
  }

  async getMinThreshold({ miningKey }) {
    let validatorData = await this.metadataInstance.methods.validators(miningKey).call()
    return validatorData.minThreshold
  }

  async finalize({ miningKeyToConfirm, senderVotingKey }) {
    const confirmations = await this.getConfirmations({
      miningKey: miningKeyToConfirm
    })
    const getMinThreshold = await this.getMinThreshold({
      miningKey: miningKeyToConfirm
    })
    if (Number(confirmations[0]) < Number(getMinThreshold)) {
      throw new Error(`There is not enough confimations.\n
          The minimum threshold to finalize is ${getMinThreshold}.`)
    }
    return await this.metadataInstance.methods
      .finalize(miningKeyToConfirm)
      .send({ from: senderVotingKey, gasPrice: this.gasPrice })
  }
}
