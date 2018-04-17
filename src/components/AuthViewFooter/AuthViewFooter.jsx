import React from 'react'
import { Link } from 'react-router'
import './AuthViewFooter.scss'

export default function AuthViewFooter() {
  return (
    <div className="wrapperAuthViewFooter">
      <Link href="http://www.choosemuse.com/professional/" className="linkTextAuthViewFooter" target="_blank"> Learn </Link>|
      <Link href="https://storage.googleapis.com/choosemuse/legal/museconnect-tos.pdf" target="_blank" className="linkTextAuthViewFooter"> Terms </Link>|
      <Link href="http://www.choosemuse.com/privacy/" target="_blank" className="linkTextAuthViewFooter"> Privacy </Link>|
      <Link href="mailto:customercare@choosemuse.com" className="linkTextAuthViewFooter"> Contact </Link>
    </div>
  )
}