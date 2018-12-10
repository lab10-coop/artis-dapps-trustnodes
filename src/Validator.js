import React, { Component } from 'react'

class Validator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmation: null
    }
    this.props.metadataContract.getConfirmations({ miningKey: this.props.address }).then(confirmation => {
      this.setState({ confirmation: confirmation[0] })
    })
  }
  render() {
    let { address, firstName, licenseId, fullAddress, state, zipcode, updatedDate, index, children } = this.props
    const showAllValidators = this.props.methodToCall === 'getAllValidatorsData'
    const confirmations = showAllValidators ? (
      ''
    ) : (
      <div className="validators-header--confirmations">{this.state.confirmation} confirmations</div>
    )
    const indexAndAddress = showAllValidators ? `#${index}. ${address}` : address
    const pendingChangeDate = !updatedDate ? (
      ''
    ) : (
      <div className="validators-table-i">
        <p className="validators-header--hint">Pending Change Date</p>
        <p>{updatedDate}</p>
      </div>
    )

    return (
      <div className="validators-i">
        <div className="validators-header">
          <div>
            <div className="validators-header--address">{indexAndAddress}</div>
            <div className="validators-header--hint">Mining Key</div>
          </div>
          {confirmations}
        </div>
        <div className="validators-body">
          <div className="validators-notary">
            <p className="validators-title validators-title--notary">Trustnode Operator</p>
            <div className="validators-table">
              <div className="validators-table-i">
                <p className="validators-header--hint">Name</p>
                <div>{fullAddress}</div>
              </div>
              <div className="validators-table-i">
                <p className="validators-header--hint">Organization ID (Company Record)</p>
                <p>{licenseId}</p>
              </div>
              <div className="validators-table-i">
                <p className="validators-header--hint">Country (Tax Residency)</p>
                <p>{state}</p>
              </div>
              <div className="validators-table-i">
                <p className="validators-header--hint">Hosting Provider Name</p>
                <p>{firstName}</p>
              </div>
              <div className="validators-table-i">
                <p className="validators-header--hint">Data Center Location (City, Country)</p>
                <p>{zipcode}</p>
              </div>
              {pendingChangeDate}
            </div>
          </div>
        </div>
        <div className="validators-footer">{children}</div>
      </div>
    )
  }
}
export default Validator
