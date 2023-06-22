import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import MssrService from "../../axios/services/api/mssr";
import { useNavigate } from "react-router-dom";
import NDCService from "../../axios/services/api/ndc";
import {maxLengthCheck} from "../../pages/pages/utils/maxLengthInput"

import Swal from "sweetalert2";
const NdcViewOrderModel = ({ id, reset }) => {
  const ndc = useSelector((state) => state.ndc);
  const { getNdcDetailsLines } = ndc;
  const navigate = useNavigate()
  const userProfile = useSelector((state) => state.userProfile);
  const [qtySaleableData, setQtySaleableData] = useState([]);
  const [returnQtyData, setReturnQtyData] = useState([]);
  const [damageQtyData, setDamageQtyData] = useState([]);
  const [inputData, setInputData] = useState([]);
  const [saveMssrData, setSaveMssrData] = useState([]);

///////////////////////////////////////////////////////////////////////////
const [data, setData] = useState([]);
const [initialData, setInitialData] = useState([]);
const [changedData, setChangedData] = useState([]);
// useEffect(() => {
// if(getViewStockDetailsLines && getViewStockDetailsLines.length>0)
// {
// setInitialData(getViewStockDetailsLines) ;
// setData(getViewStockDetailsLines)
// }
// }, [getViewStockDetailsLines])
  const handleInputChange = (id, field, value) => {
    const updatedData = data.map(obj => {
      if (obj.item_code === id) {
        return { ...obj, [field]: value };
      }
      return obj;
    });
    setData(updatedData);
  };
  const handleSubmit = async(event) => {
    event.preventDefault();
    const stock_entry_no  = 0;
    // Filter only the changed data objects
    const changedDataObjects = data.filter(obj => {
      const initialObj = initialData.find(initial => initial.item_code === obj.item_code);
      return (
        initialObj.cls_stk_qty_damage !== obj.cls_stk_qty_damage ||
        initialObj.cls_stk_qty_saleable !== obj.cls_stk_qty_saleable ||
        initialObj.market_return_qty !== obj.market_return_qty
      );
    });
    const submitData = changedDataObjects.map((mssr, index)=>({
      item_code: mssr.item_code,
      cls_stk_qty_saleable: mssr.cls_stk_qty_saleable,
      cls_stk_qty_damage: mssr.cls_stk_qty_damage,
      market_return_qty: mssr.market_return_qty
    }));
    // Log the changed data objects
    // console.log('Changed Data:', changedDataObjects);
    // console.log('submitData Data:', submitData);
    //Call api for saving mssr object
    if (submitData.length > 0) {
      await MssrService.getUpdateStockDetails(userProfile, stock_entry_no, submitData)
        .then((response) => {
          Swal.fire({
            title: `${response.data.data.message}`,
            text: `${response.data.data.add_message}`,
            showCancelButton: false,
            showCloseButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "your-custom-class",
            },
          }).then((result) => {
            if (result.isConfirmed) {
              const closeButton = document.querySelector(".close");
              if (closeButton) {
                closeButton.click();
              }
            }
          },
         
          );
        });
    } else {
      Swal.fire({
        title: "Please Fill in the Input",
        text: "I'm sorry, but it seems like you forgot to fill in the required input.",
         icon: "warning",
        confirmButtonText: "OK",
      });
      console.log("error", "error in else condition");
    
    }
  };
  return (
    <div
      className="modal bd-example-modal-lg fade"
      id={id}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      data-backdrop="static"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              View NDC Line Details
            </h5>
            <button
              className="close"
              type="button"
              data-dismiss="modal"
              aria-label="Close"
              onClick={()=>reset()}
            >
              {" "}
              <span aria-hidden="true">×</span>{" "}
            </button>
          </div>
          <div className="modal-body">
            <div className="table-responsive d-none d-sm-block">
              <table
                width="100%"
                border="0"
                cellSpacing="0"
                cellPadding="0"
                className="table tableDash table-striped no-border linkUnd table-hover"
                id="dataTables1"
              >
                <thead>
                  <tr>
                    <th style={{ minWidth: "100px" }}>Ndc Entry No</th>
                    <th style={{ minWidth: "280px" }}>Details Remark</th>
                    <th style={{ minWidth: "100px" }}> Ndc Type </th>
                    <th style={{ minWidth: "100px" }}>Claim Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {getNdcDetailsLines &&
                    getNdcDetailsLines.map((ndc, index) => (
                      <tr key={index}>
                        <td>{ndc.ndc_entry_no}</td>
                        <td>{ndc.detail_remark}</td>
                        <td>
                        {ndc.ndc_type}
                        </td>
                        <td>
                        {ndc.claim_amount}
                        </td>
                        
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="cart-prod-list d-block d-sm-none">
              {getNdcDetailsLines &&
                getNdcDetailsLines.map((ndc, index) => (
                  <div className="cart-prod-div" key={index}>
                    <div className="cart-prod-desc">
                      <span className="cart-prod-lbl">
                      Ndc Entry No :{" "}
                      </span>
                      <span className="cart-prod-val">
                        {ndc.ndc_entry_no}
                      </span>
                    </div>
                    <div className="cart-prod-desc">
                      <span className="cart-prod-lbl">
                      Details Remark :{" "}
                      </span>
                      <span className="cart-prod-val">
                        {ndc.detail_remark}
                      </span>
                    </div>
                    <div className="cart-prod-desc pt-1">
                      <span className="cart-prod-lbl">
                      Ndc Type :{" "}
                      </span>
                      {ndc.ndc_type}
                    </div>
                    <div className="cart-prod-desc pt-1">
                      <span
                        className="cart-prod-lbl"
                        style={{ width: "180px" }}
                      >
                       Claim Amount :{" "}
                      </span>
                      {ndc.claim_amount}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="modal-footer text-center">
            <button
              type="submit"
              className="btn btn-primary  btn-md"
              onClick={handleSubmit}
            >
              <i className="fa-solid fa-check mr-2"></i> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default  NdcViewOrderModel;
