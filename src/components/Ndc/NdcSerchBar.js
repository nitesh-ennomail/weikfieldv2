import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NDCService from "../../axios/services/api/ndc";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { maxLengthCheck } from "../../pages/pages/utils/maxLengthInput";
function NdcSearchBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  // Collecting data from Redux store
  const userProfile = useSelector((state) => state.userProfile)

    const userId = useSelector(
      (state) => state.dashboard.dashboard.profile_details.user_id
    );


  const [ndcPeriods, setNdcPeriods] = useState(0);
  const [ndcPeriodFrom, setNdcPeriodFrom] = useState(0);
  const [ndcPeriodTo, setNdcPeriodTo] = useState(0);
  const [enableSave, setEnableSave] = useState(true)
  const [detailRemark, setDetailRemark] = useState(0);
  const [amount, setAmount] = useState(0);
  const [distributor, setDistributor] = useState(0);
  const [ndcType, setNdcType] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ImgFile, setImgFile] = useState('');
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [approveCheckboxChecked, setApproveCheckboxChecked] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);
  
  const getCreateNdcData = async () => {
    await NDCService.createNDC(userProfile).then((response) => {
      console.log("response", response.data);
    setDistributor(response.data.data.distributor_details.customer_name);
      setNdcPeriodFrom(response.data.data.ndc_periods.ndc_period_from);
      setNdcPeriodTo(response.data.data.ndc_periods.ndc_period_to);
      setNdcType(response.data.data.ndc_types);
      setFormData(response.data.data.ndc_types)
    });
  };

  const handleInputChange = (ndcTypeId, value, fieldName) => {
    // const input1 = document.getElementById(`input1_${ndcTypeId}`)
    // const input2 = document.getElementById(`input2_${ndcTypeId}`)

    const updatedValues = formData.map((ndc) => {
      if (ndc.ndc_type_id === ndcTypeId) {
        return {...ndc, [fieldName]: value};
      }
      return ndc;
    });
    setFormData(updatedValues)
    }

    const handleFileChange = async (event) => {
      const selectedFile = event.target.files[0];
      // const fileUrl = URL.createObjectURL(file);
      await NDCService.uploadFile(userProfile,selectedFile)
      .then((response)=>{
      console.log("response ==",response.data)
       setImgFile(response.data)
      
        setEnableSave(false)
     
          })
          .catch((error)=>{
          console.log({message : error})
      })
    };
    const handleNoClaimCheckbox = () => {
    
      setIsCheckboxChecked(!isCheckboxChecked);

    };

    const handleApproveCheckBox = ()=>{
      setApproveCheckboxChecked(!approveCheckboxChecked)

    }
    console.log("handle approve",approveCheckboxChecked)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalFilteredFormData = formData.filter((obj) => {
      return obj.hasOwnProperty('detail_remark') || obj.hasOwnProperty('claim_amount') 
    });
    console.log("filtered form data formData",finalFilteredFormData);

if(finalFilteredFormData.length > 0){
    await NDCService.saveNDC(
          userProfile,
          userId,
          ndcPeriodFrom,
          ndcPeriodTo,
          ImgFile,
          finalFilteredFormData,

          ).then((response) => {
          console.log("response", response.data);
          Swal.fire({
            icon: `${response.data.data.error_message}`,
            title:`${response.data.data.message}`,
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
              // Navigate to the dashboard page
              navigate("/dashboard");
            }
          });
        });
}else{
          Swal.fire({
            icon: 'warning',
            title: 'NO DATA FOUND',
            text: 'Plz fill details and amount ',
            showCancelButton: false,
            showCloseButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'your-custom-class',
            },
          });
}
  

    
    // console.log("data on submit handler",formData);
    // console.log("start_date", ndcPeriodFrom);
    // console.log("end_date", ndcPeriodTo);
    // console.log("status");
  };

  useEffect(() => {
    getCreateNdcData();
  }, []);
 
  return (
    <div className="row mb-3">
      <div className="col-lg-12">
        <div className="card card-primary border-0">
          <div
            className="card-header "
            // data-toggle="collapse"
            // data-target="#collapseOne"
            // aria-expanded="true"
          >
            Search NDC Entries
          </div>
          <div className="card-body collapse show py-0">
            <div className="column pt-3 col-sm-offset-0">
              <form
                data-toggle="validator"
                role="form"
                className="form-horizontal"
              >
                <div className="form-group row">
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="OrderNumber" className="control-label">
                          NDC Periods:
                        </label>
                      </div>
                      <div className="col-md-8">
                        <input
                          name="OrderNumber"
                          className="form-control selectpicker"
                          data-live-search="true"
                          value={ndcPeriodFrom + "~" + ndcPeriodTo}
                          readOnly
                        />
                      </div>
                      
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row">
                        <div className="col-md-4">
                            <label htmlFor="SalePerson" className="control-label">
                                Distributor:
                            </label>
                        </div>
                        <div className="col-md-8">
                            <input
                                type="text"
                                name="Distributor"
                                className="form-control"
                               defaultValue={distributor}
                                readOnly
                            />
                        </div>
                    </div>
                </div>
              </div>
              <div className="form-group row">
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="noclaim" className="control-label">
                          No Claim Pending:
                        </label>
                      </div>
                      <div className="col-md-8">
                      <input
                      id="noClaim"
                      className="form-check-label"
                      type="checkbox"
                      checked={isCheckboxChecked}
                      onChange={handleNoClaimCheckbox}
                        />
                    </div>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table
                    className="table table-bordered"
                    id="distributorTable"
                    width="100%"
                    cellSpacing="0"
                  >
                    <thead className="MuiTableHead-root">
                    <tr>
                    <th style={{ textAlign: "center" }}>Claim Type</th>
                    <th style={{ textAlign: "center" }}>Amount</th>
                    <th style={{ textAlign: "center" }}>Details Remark </th>
                  </tr>
                    </thead>
                    <tbody>
                    
                      {ndcType &&
                        ndcType.map((ndc, index) => (
                          <tr key={index}>
                            <td className="text-nowrap">
                              {ndc.ndc_type_value}
                            </td>
                            <td className="text-nowrap"
                            style={{ textAlign: "center" }}>
                                <input
                                  disabled={isCheckboxChecked}
                                  style={{ textAlign: "right" }}
                                  type="number"
                                  min={1}
                                  maxLength={9}
                                  id={`input1_${ndc.ndc_type_id}`}
                                  onChange={(e) => handleInputChange(ndc.ndc_type_id, e.target.value, 'claim_amount')}
                                  onKeyPress={(event) => {
                                    if ((event.charCode < 45 || event.charCode > 57) && event.charCode !== 46) {
                                      event.preventDefault();
                                    }
                                    if (parseFloat(event.target.value) > 999999.99) {
                                      event.preventDefault();
                                    }
                                  }}
                                  onBlur={(event) => {
                                  const value = parseFloat(event.target.value);
                                  if (isNaN(value)) {
                                    event.target.value = ''; // Clear the input if it's not a valid number
                                  } else {
                                    event.target.value = value.toFixed(2); // Round the number to two decimal places
                                  }
                                }}

                                />
                            </td>
                            <td className="text-nowrap"
                            style={{ textAlign: "center" }}>
                              <input
                              id={`input2_${ndc.ndc_type_id}`}
                              disabled={isCheckboxChecked}
                                style={{ textAlign: "right" }}
                                type="text"
                                onChange={(e) => handleInputChange(ndc.ndc_type_id, e.target.value , 'detail_remark')}/>
                            </td>
                          </tr> 
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="row">
                      <div className="row">
                <div className="col-md-12">
                  <p htmlFor="approveclaim" className="control-label">
                    I hereby confirm that the above details filled by me are correct to the best of my knowledge.
                  </p>
                </div>
                <div className="col-md-12">
                  <div className="form-check">
                    <input
                      id="approveClaim"
                      className="form-check-input"
                      type="checkbox"
                      checked={!approveCheckboxChecked}
                      onChange={handleApproveCheckBox}
                    />
                    <label className="form-check-label" htmlFor="approveClaim">
                      I agree to the terms and conditions.
                    </label>
                  </div>
                </div>
              </div>
              </div>
           
                <div className="row">
                  <div className="col-md-6">
                    <span>
                      <input
                        type="file"
                        className="btn btn btn-md"
                        onChange={handleFileChange}
                      />
                      <button className="btn btn-primary btn-md"
                         //  disabled={enableSave && approveCheckboxChecked}
                           disabled={enableSave }
                          onClick={handleSubmit}
                          type="submit"
                      >
                        <i className="fa-solid fa-save"></i> Save
                      </button>
                    </span>
                  </div>
                </div>

                {/* <div
                  className="col-md-8 text-right"
                  style={{ position: "relative" }}
                >
                  
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NdcSearchBar;
