import React, { Component } from 'react'
import Validator from './Validator'
import Loading from './Loading'

export default class AllValidators extends Component {
  constructor(props) {
    super(props)
    this.getMetadataContract = this.getMetadataContract.bind(this)
    this.getKeysManagerContract = this.getKeysManagerContract.bind(this)
    this.state = {
      validators: [],
      loading: true
    }
    this.getValidatorsData.call(this)
  }
  componentWillMount() {
    const { props } = this
    const { web3Config } = props
    const { netId } = web3Config
    this.setState({ loading: true, netId: netId })
  }
  async getValidatorsData() {
    const netId = this.props.web3Config.netId
    this.getMetadataContract()
      [this.props.methodToCall](netId)
      .then(data => {
        for (let i = 0; i < data.length; i++) {
          data[i].index = i + 1
        }
        return this.augmentValidatorsWithPhysicalAddress(data)
      })
      .then(augmentedValidators => {
        this.setState({
          validators: augmentedValidators,
          loading: false,
          reload: false,
          netId
        })
      })
  }
  async augmentValidatorsWithPhysicalAddress(validators) {
    let augmentedValidators = validators.map(validator => ({
      ...validator,
      physicalAddress: {
        fullAddress: validator.fullAddress,
        us_state: validator.us_state,
        postal_code: validator.postal_code
      }
    }))

    return augmentedValidators
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.web3Config.netId !== this.state.netId) {
      this.getValidatorsData.call(this)
      return false
    }
    return true
  }
  getMetadataContract() {
    return this.props.web3Config.metadataContract
  }
  getKeysManagerContract() {
    return this.props.web3Config.keysManager
  }
  render() {
    const loading = this.state.loading ? <Loading netId={this.state.netId} /> : ''
    const filtered = this.state.validators.filter((validator, index) => {
      return Object.values(validator).some(val =>
        String(val)
          .toLowerCase()
          .includes(this.props.searchTerm)
      )
    })
    let validators = []
    for (let [index, validator] of filtered.entries()) {
      let childrenWithProps = React.Children.map(this.props.children, child => {
        return React.cloneElement(child, { miningkey: validator.address })
      })
      validators.push(
        <Validator
          key={index}
          physicalAddress={validator.physicalAddress}
          address={validator.address}
          firstName={validator.firstName}
          lastName={validator.lastName}
          licenseId={validator.licenseId}
          fullAddress={validator.fullAddress}
          state={validator.state}
          zipcode={validator.zipcode}
          createdDate={validator.createdDate}
          updatedDate={validator.updatedDate}
          index={validator.index}
          metadataContract={this.props.web3Config.metadataContract}
          methodToCall={this.props.methodToCall}
        >
          {childrenWithProps}
        </Validator>
      )
    }
    const isValidatorsPage = this.props.methodToCall === 'getAllValidatorsData'
    const validatorsCountObj = (
      <div className="validators-count">
        <span className="validators-count-label">Total number of Trustnodes: </span>
        <span className="validators-count-val">{this.state.validators.length}</span>
      </div>
    )
    const validatorsCount = isValidatorsPage ? validatorsCountObj : ''

    const titleContainer = (
      <div className="main-title-container">
        <span className="main-title">{this.props.viewTitle}</span>
        {validatorsCount}
      </div>
    )

    return (
      <div className="container">
        {loading}
        {titleContainer}
        {validators}
      </div>
    )
  }
}
