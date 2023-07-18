import React from 'react';
import withAuthentication from '../../helper/Authentication';
import TableList from './table-list';
import AddTableComponent from './add';

const TableManagement = () => {  
  return (
    <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8">
              <TableList />
              <hr/>
            </div>
            <div className="col-lg-4">
              <AddTableComponent/>
            </div>
          </div>
        </div>
  );
};

export default withAuthentication(TableManagement);
