import React from 'react'

const NdcOrderTable = () => {


  return (
        <>
      {/* {viewMssrFilter && viewMssrFilter !== null && ( */}
        <div className="card border-0 rounded-0 mb-3">
          <div className="card-body">
            <div className="table-responsive">
              <table
                className="table table-bordered"
                id="ndcOrderTable"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Claim Type</th>
                    <th style={{ textAlign: "center" }}>Details Remark </th>
                    <th style={{ textAlign: "center" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  

                  {/* {viewMssrFilter.length === 0 && (
                    <tr>
                      <td></td>
                      <td className="text-nowrap">No data found </td>
                      <td></td>
                    </tr>
                  )} */}
                </tbody>
              </table>
            </div>
           
          </div>
        </div>
      {/* )} */}
    </>
  )
}

export default NdcOrderTable
