import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NDCService from "../../axios/services/api/ndc";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { maxLengthCheck } from "../../pages/pages/utils/maxLengthInput";
function NdcSearchBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Collecting data from Redux store
  const userProfile = useSelector((state) => state.userProfile);

  // useEffect(() => {
  //   if (userProfile.usertype !== "null") {
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   } else {
  //     navigate("/");
  //   }
  // }, []);

  const userId = useSelector(
    (state) => state.dashboard.dashboard.profile_details.user_id
  );

  const [ndcPeriods, setNdcPeriods] = useState(0);
  const [ndcPeriodFrom, setNdcPeriodFrom] = useState("");
  const [ndcPeriodTo, setNdcPeriodTo] = useState("");
  const [enableSave, setEnableSave] = useState(true);
  const [detailRemark, setDetailRemark] = useState(0);
  const [amount, setAmount] = useState(0);
  const [distributor, setDistributor] = useState("");
  const [ndcType, setNdcType] = useState([]);
  const [selectedFileUpload, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ImgFile, setImgFile] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [approveCheckboxChecked, setApproveCheckboxChecked] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);

  const getCreateNdcData = async () => {
    await NDCService.createNDC(userProfile).then((response) => {
      setDistributor(response.data.data.distributor_details.customer_name);
      setNdcPeriodFrom(response.data.data.ndc_periods.ndc_period_from);
      setNdcPeriodTo(response.data.data.ndc_periods.ndc_period_to);
      setNdcType(response.data.data.ndc_types);
      setFormData(response.data.data.ndc_types);
    });
  };

  const handleInputChange = (ndcTypeId, value, fieldName) => {
    const updatedValues = formData.map((ndc) => {
      if (ndc.ndc_type_id === ndcTypeId) {
        return { ...ndc, [fieldName]: value };
      }
      return ndc;
    });
    setFormData(updatedValues);
  };
  // const [selectedUpFile, setSelectedUpFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // const handleFileChange = async (event) => {
  //   setSelectedFile(null)
  //   setErrorMessage(null)
  //   setEnableSave(true);
  //   const selectedFile = event.target.files[0];
  //   setSelectedFile(selectedFile.name)
  //   const fileType = selectedFile.type;
  //   if (fileType === "text/javascript") {
  //     setSelectedUpFile(null);
  //     setErrorMessage("JavaScript files (.js) are not allowed.");
  //   } else {
  //     setSelectedUpFile(selectedFile);
  //     setErrorMessage("");
  //   }
  //   await NDCService.uploadFile(userProfile, selectedFile)
  //     .then((response) => {
  //       setImgFile(response.data);
  //       setEnableSave(false);
  //     })
  //     .catch((error) => {
  //       console.log({ message: error });
  //     });
    
  // };


  const handleFileChange = async (event) => {
    if (approveCheckboxChecked) {
      Swal.fire("Please check the checkbox before uploading the image.");
      return;
    }
  
    setSelectedFile(null);
    setErrorMessage(null);
    setEnableSave(true);
    const selectedFile = event.target.files[0];
    // File size validation
    const maxSizeInBytes = 4 * 1024 * 1024; // 4MB
    if (selectedFile.size > maxSizeInBytes) {
      Swal.fire("File size exceeds the maximum allowed limit (4MB).");
      return;
    }
  
    // File type validation
    const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedFileTypes.includes(selectedFile.type)) {
      Swal.fire("Invalid file type. Please upload a PDF, JPEG or PNG image.");
      return;
    }
  
    setSelectedFile(selectedFile.name);
  
    // Perform the rest of the file handling tasks and upload
      await NDCService.uploadFile(userProfile, selectedFile)
      .then((response) => {
        setImgFile(response.data);
        setEnableSave(false);
      })
      .catch((error) => {
        console.log({ message: error });
      });
  };
  const handleNoClaimCheckbox = () => {
    setIsCheckboxChecked(!isCheckboxChecked);
  };

  const handleApproveCheckBox = () => {
    setApproveCheckboxChecked(!approveCheckboxChecked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalFilteredFormData=[]

    if(isCheckboxChecked){

      finalFilteredFormData=[{"ndc_type_value":"No Claim","ndc_type_id":"N099","claim_amount":"0","detail_remark":"No Claim Pending"}]


    }else {

     finalFilteredFormData = formData.filter((obj) => {
      return (
        obj.hasOwnProperty("detail_remark") ||
        obj.hasOwnProperty("claim_amount")
      );
    });
  }

    if (finalFilteredFormData.length > 0) {
      await NDCService.saveNDC(
        userProfile,
        userId,
        ndcPeriodFrom,
        ndcPeriodTo,
        ImgFile,
        finalFilteredFormData
      ).then((response) => {
        console.log("response", response.data);
        Swal.fire({
          icon: `${response.data.data.error_message}`,
          title: `${response.data.data.message}`,
          text: `${response.data.data.add_message}--${response.data.data.ndc_entry_no}`,
          allowOutsideClick: false,
          allowEscapeKey: false,
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
    } else {
      Swal.fire({
        icon: "warning",
        title: "NO DATA FOUND",
        text: "Please fill details and amount ",
        showCancelButton: false,
        showCloseButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "your-custom-class",
        },
      });
    }
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
                          type="text"
                          name="OrderNumber"
                          className="form-control"
                          placeholder={ndcPeriodFrom + "~" + ndcPeriodTo}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="Distributor" className="control-label">
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
                      <div className="col-md-12">
                        <input
                          id="noClaim"
                          className="form-check-label"
                          type="checkbox"
                          checked={isCheckboxChecked}
                          onChange={handleNoClaimCheckbox}
                        />
                        <label htmlFor="noclaim" className="control-label">
                          No Claim Pending
                        </label>
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
                            <td style={{textAlign:"center"}}
                              // className="text-nowrap"
                              // className="text-center"
                            >
                              <input
                                disabled={isCheckboxChecked}
                                className="form-control form-control-sm"
                                style={{ textAlign: "right", width: "100%",  border:"1px solid grey" }}
                             
                                type="number"
                                min={1}
                                maxLength={9}
                                id={`input1_${ndc.ndc_type_id}`}
                                onChange={(e) =>
                                  handleInputChange(
                                    ndc.ndc_type_id,
                                    e.target.value,
                                    "claim_amount"
                                  )
                                }
                                onKeyPress={(event) => {
                                  if (
                                    (event.charCode < 45 ||
                                      event.charCode > 57) &&
                                    event.charCode !== 46
                                  ) {
                                    event.preventDefault();
                                  }
                                  if (
                                    parseFloat(event.target.value) > 999999.99
                                  ) {
                                    event.preventDefault();
                                  }
                                }}
                                onBlur={(event) => {
                                  const value = parseFloat(event.target.value);
                                  if (isNaN(value)) {
                                    event.target.value = ""; // Clear the input if it's not a valid number
                                  } else {
                                    event.target.value = value.toFixed(2); // Round the number to two decimal places
                                  }
                                }}
                              />
                            </td>
                            <td
                              className="text-nowrap"
                              style={{ textAlign: "center" }}
                            >
                              <input
                                id={`input2_${ndc.ndc_type_id}`}
                                disabled={isCheckboxChecked}
                                className="form-control form-control-sm"
                                style={{ textAlign: "right", width: "100%", border:"1px solid grey"}}
                                // style={{ textAlign: "right", width: "80px", border:"1px solid grey" }}
                                type="text"
                                onChange={(e) =>
                                  handleInputChange(
                                    ndc.ndc_type_id,
                                    e.target.value,
                                    "detail_remark"
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-check">
                      <input
                        id="approveClaim"
                        className="form-check-input"
                        type="checkbox"
                        checked={!approveCheckboxChecked}
                        onChange={handleApproveCheckBox}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="approveClaim"
                      >
                        {/* I agree to the terms and conditions. */}I hereby
                        confirm that the above details filled by me are correct
                        to the best of my knowledge.
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <label htmlFor="fileInput" className="btn btn btn-md btn-primary">
                      <input
                        type="file"
                        id="fileInput"
                        style={{ display: "none" }}
                        // disabled={approveCheckboxChecked}
                        onChange={handleFileChange}
                      />
                      Upload file
                    </label>
                    <span className="ml-3" style={{ fontSize: "12px", lineHeight:"40px", }}>{selectedFileUpload && selectedFileUpload}</span>
                    <br/>
                    {errorMessage && (
                    <span style={{ fontSize: "12px", lineHeight:"40px", color:"red" }}>{errorMessage}</span>
                  )}
                  </div>
                  <div className="col-md-6 mt-2 mt-md-0">
                    <button
                      className="btn btn-primary btn-md"
                      // disabled={
                      //   !selectedUpFile || enableSave || approveCheckboxChecked
                      // }
                      disabled={
                        enableSave || approveCheckboxChecked || !selectedFileUpload
                      }
                      onClick={handleSubmit}
                      type="submit"
                    >
                      <i className="fa-solid fa-save"></i> Save
                    </button>
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
