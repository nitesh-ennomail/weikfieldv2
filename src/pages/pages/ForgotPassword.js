import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../axios/services/api/auth";
import Swal from "sweetalert2";

function ForgotPassword() {
	const navigate = useNavigate();
	const forgetPassward = async (event) => {
      event.preventDefault();
      console.log(event.target[0].value);
      //AXIOS WRAPPER FOR API CALL
      let data = event.target[0].value;
      await AuthService.forgetPassward(data).then((response) => {
		Swal.fire(response.data.data.password_confirmation_response.message);
		navigate('/');
      });
      //AXIOS WRAPPER FOR API CALL
    };

	
	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-6 m-auto">
					<div className="card card-login mx-auto">
						<div className="card-body">
							<div className="text-center">
								<img
									src="assets/images/Weikfield-Logo.svg"
									className="img-fluid my-3"
									width="179"
								/>
								<h3 className=" my-4">Forgot Password?</h3>
								<p className="card-text mb-2">
									Enter your Login Id and we'll send the Password to your Mail
									Id
								</p>
							</div>
							<form onSubmit={forgetPassward}>
								<div className="form-group">
									<label htmlFor="InputUserid">Login ID</label>
									<input
										className="form-control"
										id="InputUserid"
										type="text"
										aria-describedby="InputUserid"
										placeholder="Login ID"
										required
									/>
								</div>
								<input type="submit" className="btn btn-md btn-primary btn-block" />
							</form>
							<div className="text-center mt-4 mb-2">
								<Link to="/">
									<i className="fa-solid fa-arrow-left-long"></i> Back to login
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ForgotPassword;
