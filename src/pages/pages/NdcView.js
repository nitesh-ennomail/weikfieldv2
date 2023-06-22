import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import NdcViewSearchBar from "../../components/NdcView/NdcViewSearchBar";
import NdcViewOrderTable from "../../components/NdcView/NdcViewOrderTable";
import { ColorRing } from "react-loader-spinner";
const NdcView = () => {

	const userProfile = useSelector((state) => state.userProfile);
	const ndc = useSelector((state) => state.ndc);
	const {ndcLoading} = ndc;


	useEffect(() => {
	
	}, []);

	return (
		<>
		<Helmet title="Ndc View" />
			<div className="content-wrapper">
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							<ol className="breadcrumb">
								<li className="breadcrumb-item">
									{" "}
									<Link to="/dashboard">Dashboard</Link>
								</li>
								<li className="breadcrumb-item active">Ndc View</li>
							</ol>
							<div className="row">
								<div className="col-lg-12 mb-2">
									<h4>List of NDC</h4>
								</div>
							</div>
							 <NdcViewSearchBar/> 
							 {ndcLoading && <ColorRing
											visible={true}
											height="80"
											width="100%"
											ariaLabel="blocks-loading"
											wrapperStyle={{}}
											wrapperClass="blocks-wrapper"
											colors={[
												"#e15b64",
												"#f47e60",
												"#f8b26a",
												"#abbd81",
												"#849b87",
											]}
										/>}
							<NdcViewOrderTable />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default NdcView;
