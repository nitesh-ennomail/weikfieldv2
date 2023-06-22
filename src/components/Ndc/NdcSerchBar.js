import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NDCService from "../../axios/services/api/ndc";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
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


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // const fileUrl = URL.createObjectURL(file);
    setSelectedFile(file);
  };

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
    const updatedValues = formData.map((ndc) => {
      if (ndc.ndc_type_id === ndcTypeId) {
        return {...ndc, [fieldName]: value};
      }
      return ndc;
    });
    setFormData(updatedValues)
    }

  const handleImgSubmit =async (e)=>{
     e.preventDefault();
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



  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalFilteredFormData = formData.filter((obj) => {
      return obj.hasOwnProperty('detail_remark') && obj.hasOwnProperty('claim_amount') 
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
                               value={distributor}
                                readOnly
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
                        <th>Claim Type</th>
                        <th>Details Remark</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                    
                      {ndcType &&
                        ndcType.map((ndc, index) => (
                          <tr key={index}>
                            <td className="text-nowrap">
                              {ndc.ndc_type_value}
                            </td>
                            <td className="text-nowrap">
                              <input
                                style={{ textAlign: "right" }}
                                type="text"
                                onChange={(e) => handleInputChange(ndc.ndc_type_id, e.target.value, 'detail_remark')}
                                  />
                            </td>
                            <td className="text-nowrap">
                              <input
                                style={{ textAlign: "right" }}
                                type="number"
                                min={1}
                                // placeholder={"Enter closing stock"}
                                onChange={(e) => handleInputChange(ndc.ndc_type_id, e.target.value, 'claim_amount')}
                                onKeyPress={(event) => {
                                  if (event.charCode < 48 || event.charCode > 58) {
                                    event.preventDefault();
                                  }
                                }}
                            />
                            </td>
                          </tr> 
                        ))}
                    </tbody>
                  </table>
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
                        onClick={handleImgSubmit}
                      >
                        <i className="fa-solid fa-upload"></i> upload img
                      </button>
                    </span>
                  </div>
                </div>

                <div
                  className="col-md-8 text-right"
                  style={{ position: "relative" }}
                >
                  <button
                  disabled={enableSave}
                    onClick={handleSubmit}
                    type="submit"
                    className="btn btn-primary btn-md"
                    style={{ position: "absolute", top: 10, left: 0 }}
                  >
                    <i className="fa-solid fa-save"></i> Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NdcSearchBar;
