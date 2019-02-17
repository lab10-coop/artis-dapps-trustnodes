import React, { Component } from 'react'
import './stylesheets/application.css'
import Loading from './Loading'
import { messages } from './messages'
import helpers from './helpers'
import { constants } from './constants'

class App extends Component {
  constructor(props) {
    super(props)
    this.checkValidation = this.checkValidation.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onChangeFormField = this.onChangeFormField.bind(this)
    this.getKeysManager = this.getKeysManager.bind(this)
    this.getMetadataContract = this.getMetadataContract.bind(this)
    this.getVotingKey = this.getVotingKey.bind(this)
    this.state = {
      web3Config: {},
      form: {
        fullAddress: '',
        postal_code: '',
        us_state: '',
        firstName: '',
        lastName: '',
        licenseId: ''
      },
      hasData: false
    }

    this.defaultValues = null
    this.setMetadata.call(this)

    this.isValidVotingKey = false
    this.setIsValidVotingKey.call(this)
  }
  async setMetadata() {
    const currentData = await this.getMetadataContract().getValidatorData(this.getMiningKey())
    const hasData = currentData.fullAddress ? true : false
    this.defaultValues = currentData
    const pendingChange = await this.getMetadataContract().getPendingChange(this.getMiningKey())
    if (Number(pendingChange.minThreshold) > 0) {
      var msg = `
        Name: <b>${pendingChange.fullAddress}</b> <br/>
        Organization ID: <b>${pendingChange.licenseId}</b> <br/>
        Country: <b>${pendingChange.state}</b> <br/>
        Hosting Provider Name: <b>${pendingChange.firstName}</b> <br/>
        Data Center Location: <b>${pendingChange.zipcode}</b> <br/>
      `
      helpers.generateAlert('warning', 'You have pending changes!', msg)
    }
    this.setState({
      form: {
        fullAddress: currentData.fullAddress,
        licenseId: currentData.licenseId,
        state: currentData.state,
        firstName: currentData.firstName,
        zipcode: currentData.zipcode
      },
      hasData
    })
  }
  async setIsValidVotingKey() {
    this.isValidVotingKey = await this.getKeysManager().isVotingActive(this.getVotingKey())
    if (!this.isValidVotingKey) {
      helpers.generateAlert('warning', 'Warning!', messages.invalidaVotingKey)
    }
  }
  getKeysManager() {
    return this.props.web3Config.keysManager
  }
  getMetadataContract() {
    return this.props.web3Config.metadataContract
  }
  getVotingKey() {
    return this.props.web3Config.votingKey
  }
  getMiningKey() {
    return this.props.web3Config.miningKey
  }
  checkValidation() {
    if (!this.state.form['fullAddress']) {
      this.setState({ loading: false })
      helpers.generateAlert('warning', 'Warning!', `Name cannot be empty`)
      return false
    }
    let keys = Object.keys(this.state.form)
    let hasError = false
    for (var iKey = 0; iKey < keys.length; iKey++) {
      let key = keys[iKey]
      if (this.state.form[key]) {
        let stringToTransmit = this.state.form[key]
        for (var i = 0; i < stringToTransmit.length; i++) {
          let char = stringToTransmit.charCodeAt(i)
          if (char > 127) {
            this.setState({ loading: false })
            helpers.generateAlert(
              'warning',
              'Warning!',
              `Special characters are not allowed. Invalid: ${this.state.form[key]}`
            )
            hasError = true
            return false
          }
        }
      }
    }
    return !hasError
  }
  async onClick() {
    this.setState({ loading: true })
    const isFormValid = this.checkValidation()
    if (isFormValid) {
      const votingKey = this.getVotingKey()
      console.log('voting', votingKey)
      const isValid = await this.getKeysManager().isVotingActive(votingKey)
      console.log(isValid)
      if (isValid) {
        // add loading screen
        await this.sendTxToContract()
      } else {
        this.setState({ loading: false })
        helpers.generateAlert('warning', 'Warning!', messages.invalidaVotingKey)
        return
      }
    }
  }
  async sendTxToContract() {
    this.getMetadataContract()
      .createMetadata({
        firstName: this.state.form.firstName,
        fullAddress: this.state.form.fullAddress,
        licenseId: this.state.form.licenseId,
        state: this.state.form.state,
        zipcode: this.state.form.zipcode,
        votingKey: this.getVotingKey(),
        hasData: this.state.hasData
      })
      .then(receipt => {
        console.log(receipt)
        this.setState({ loading: false })
        helpers.generateAlert('success', 'Congratulations!', 'Your metadata was sent!')
      })
      .catch(error => {
        console.error(error.message)
        let errDescription
        if (error.message.includes(constants.userDeniedTransactionPattern))
          errDescription = `Error: ${constants.userDeniedTransactionPattern}`
        else errDescription = error.message
        this.setState({ loading: false })
        var msg = `
        Something went wrong!<br/><br/>
        ${errDescription}
      `
        helpers.generateAlert('error', 'Error!', msg)
      })
  }
  onChangeFormField(event) {
    const field = event.target.id
    const value = event.target.value
    let form = this.state.form
    form[field] = value

    this.setState({ form })
  }
  render() {
    if (!this.isValidVotingKey) {
      return null
    }
    const BtnAction = this.state.hasData ? 'Update' : 'Set'
    let loader = this.state.loading ? <Loading /> : ''
    let createKeyBtn = (
      <div className="create-keys">
        <form className="create-keys-form">
          <div className="create-keys-form-i">
            <label htmlFor="fullAddress">Name</label>
            <input type="text" id="fullAddress" value={this.state.form.fullAddress} onChange={this.onChangeFormField} />
          </div>
          <div className="create-keys-form-i">
            <label htmlFor="licenseId">Organization ID (company record)</label>
            <input type="text" id="licenseId" value={this.state.form.licenseId} onChange={this.onChangeFormField} />
          </div>
          <div className="create-keys-form-i">
            <label htmlFor="state">Country (Tax Residency)</label>
            <input type="text" id="state" value={this.state.form.state} onChange={this.onChangeFormField} />
          </div>
          <div className="create-keys-form-i">
            <label htmlFor="firstName">Hosting Provider Name</label>
            <input type="text" id="firstName" value={this.state.form.firstName} onChange={this.onChangeFormField} />
          </div>
          <div className="create-keys-form-i">
            <label htmlFor="zipcode">Data Center Location (City, Country)</label>
            <input type="text" id="zipcode" value={this.state.form.zipcode} onChange={this.onChangeFormField} />
          </div>
        </form>
        <button onClick={this.onClick} className="create-keys-button">
          {BtnAction} Metadata
        </button>
      </div>
    )

    let content = createKeyBtn
    const titleContainer = (
      <div className="main-title-container no-search-on-top">
        <span className="main-title">{this.props.viewTitle}</span>
      </div>
    )

    return (
      <div className="container">
        {loader}
        {titleContainer}
        {content}
      </div>
    )
  }
}

export default App
