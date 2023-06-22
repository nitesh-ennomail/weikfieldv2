import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NDCService from "../../axios/services/api/ndc";
import { setNdcHeaderList } from "../../redux/actions/ndcAction";

import DatePicker from "react-datepicker";
import {
  selectedMssrPagesNumber,
  setViewMssrFilter,
  setViewMssrTotalPages,
  setViewMssrTotalRecord,
} from "../../redux/actions/mssrAction";

function NdcViewSearchBar() {
  const dispatch = useDispatch();



  // Collecting data from Redux store
  const userProfile = useSelector((state) => state.userProfile);
  const userId = useSelector(
    (state) => state.dashboard.dashboard.profile_details.user_id
  );

  const viewOrder = useSelector((state) => state.viewOrder);
  const { viewOrderFilter, viewOrderTotalPages, selectedPage } = viewOrder;

  const [ndcPeriods, setNdcPeriods] = useState(0);
  const [ndcStatus, setNdcStatus] = useState(0);
  const [distributor, setDistributor] = useState(0);

  const [selectedNdcStatus, setSelectedNdcStatus] = useState(0);
  const [selectedDistributer, setSelectedDistributer] = useState(0);
  const [selectedNdcPeriods, setSelectedNdcPeriods] = useState(0);
  const [loading, setLoading] = useState(true);

  const getCreateNdcData = async () => {
    await NDCService.viewNDCFilter(userProfile).then((response) => {
      console.log("response =====", response.data.data);
      setDistributor(response.data.data.distributor_details.customer_name);
      setNdcStatus(response.data.data.ndc_status);
      setNdcPeriods(response.data.data.ndc_periods)
    });
  };

  const resetSearch = () => {
    setSelectedNdcPeriods(0);
    setSelectedDistributer(0);
    setSelectedNdcStatus(0);
  };

  // on button submit
  const getNDCHeaderList = async (fromDate,toDate) => {
    const selectedPageN = 0;
    const limitNo = 10;
        await NDCService.getNDCHeaderList(
      userProfile,
      fromDate,
      toDate,
      selectedNdcStatus,
      limitNo,
      selectedPageN
    ).then((response) => {
      console.log("response of headerList", response.data.data.ndc_header_details);
    dispatch(setNdcHeaderList(response.data.data.ndc_header_details));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const [fromDate, toDate] = selectedNdcPeriods?.split("~");
     getNDCHeaderList(fromDate,toDate);
  };

  useEffect(() => {
    getCreateNdcData();
  }, []);

  return (
    <div className="row mb-3">
      <div className="col-lg-12">
        <div className="card card-primary border-0">
          <div
            className="card-header collapsepanel"
            data-toggle="collapse"
            data-target="#collapseOne"
            aria-expanded="true"
          >
            Search NDC Entries
          </div>
          <div
            className="card-body collapse show py-0"
            id="collapseOne"
            aria-expanded="true"
          >
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
                        <select
                          name="OrderNumber"
                          className="form-control selectpicker"
                          data-live-search="true"
                           onChange={(e) =>
                            setSelectedNdcPeriods(e.target.value)
                          }
                          required
                        >
                          <option value={0}>Show All</option>
                          {ndcPeriods &&
                            ndcPeriods.map((ndc, index) => (
                              <option
                                key={index}
                                value={ndc.ndc_status_code}
                              >
                                {ndc.ndc_periods}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-4">
                        <label
                          htmlFor="DistributorName"
                          className="control-label"
                        >
                          Distributor:
                        </label>
                      </div>
                      <div className="col-md-8">
                        <input
                          name="DistributorName"
                          className="form-control selectpicker"
                          data-live-search="true"
                          // onChange={(e) =>
                          //   setSelectedDistributer(e.target.value)
                          // }
                          value={distributor}
                          required
                          readOnly
                        />
                          {/* <option value={0}>Show All</option>

                          {distributor &&
                            distributor.map((dist, index) => (
                              <option
                                key={dist.customer_code}
                                value={dist.customer_code}
                              >
                                {dist.customer_name}
                              </option> 
                            ))}*/}
                        {/* </select> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="OrderStatus" className="control-label">
                          NDC Status:
                        </label>
                      </div>
                      <div className="col-md-8">
                        <select
                          name="OrderStatus"
                          className="form-control selectpicker"
                          data-live-search="true"
                          onChange={(e) =>
                            setSelectedNdcStatus(e.target.value)
                          }
                          required
                        >
                          <option value={0}>Show All</option>
                          {ndcStatus &&
                            ndcStatus.map((ndc, index) => (
                              <option
                                key={ndc.ndc_status_code}
                                value={ndc.ndc_status_code}
                              >
                                {ndc.ndc_status_value}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="username" className="control-label">
                          {" "}
                        </label>
                      </div>
                      <div className="col-md-8 text-right">
                        <button
                          onClick={handleSubmit}
                          type="submit"
                          className="btn btn-primary  btn-md"


                          data-toggle="collapse"
                                data-target="#collapseOne"
                                aria-expanded="false"
                        >
                          <i className="fa-solid fa-magnifying-glass"></i>
                          Search
                        </button>
                        &nbsp;
                        <button
                          type="reset"
                          onClick={resetSearch}
                          className="btn btn-danger btn-md"
                        >
                          <i className="fa-solid fa-rotate-right"></i> Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NdcViewSearchBar;