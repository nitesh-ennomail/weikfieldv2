import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import NdcViewSearchBar from "../../components/NdcView/NdcViewSearchBar";
import NdcViewOrderTable from "../../components/NdcView/NdcViewOrderTable";
const NdcView = () => {

	const userProfile = useSelector((state) => state.userProfile);

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
							<NdcViewOrderTable />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default NdcView;
