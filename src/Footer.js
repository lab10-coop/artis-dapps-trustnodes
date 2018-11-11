import React from 'react'
import moment from 'moment'
import Socials from './Socials'
import { constants } from './constants'

const Footer = ({ netId }) => {
  const footerClassName = netId in constants.NETWORKS && constants.NETWORKS[netId].TESTNET ? 'sokol' : ''
  return <footer />
}

export default Footer
