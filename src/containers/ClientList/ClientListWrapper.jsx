import React from 'react'
import styleVariables from '!!sass-variable-loader!./../../styles/variables/colors.scss'
import ClientListComponent from './ClientList'
import ClientListFiltersComponent from './ClientListFilters'
import './ClientListWrapper.scss'

export default function ClientListWrapper() {
  return (
    <div>
      <div className="TitleContainerClientList">
        <span className="TitleStyleClientList">ALL CLIENTS</span>
      </div>
      <div className="dividerClientList">
        <hr style={{ border: `solid 0.5px ${styleVariables.lightestGrey}` }} />
      </div>
      <div className="FilterContainerClientList">
        <ClientListFiltersComponent />
      </div>
      <div className="ListContainerClientList">
        <ClientListComponent />
      </div>
    </div>
  )
}
