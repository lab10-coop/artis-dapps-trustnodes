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
    let { physicalAddress, address, firstName, lastName, createdDate, updatedDate, index, children } = this.props
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
        <p>Pending Change Date</p>
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
            <p className="validators-title validators-title--notary">Validator</p>
            <div className="validators-table">
              <div className="validators-table-i">
                <p className="validators-header--hint">Full Name</p>
                <div>
                  {firstName} {lastName}
                </div>
              </div>
              <div className="validators-table-i">
                <p className="validators-header--hint">Adress</p>
                <p>{physicalAddress.fullAddress}</p>
              </div>
              <div className="validators-table-i">
                <p className="validators-header--hint">Update Date</p>
                <p>{physicalAddress.updatedDate}</p>
              </div>
              <div className="validators-table-i">
                <p className="validators-header--hint">Create Date</p>
                <p>{physicalAddress.createdDate}</p>
              </div>
              <div className="validators-table-i">
                <p className="validators-header--hint">Miner Creation Date</p>
                <p>{createdDate}</p>
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
