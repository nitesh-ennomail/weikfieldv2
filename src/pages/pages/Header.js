import { click } from "@testing-library/user-event/dist/click";
import React, { Component, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sortMenuFunction } from "./utils/sortMenu";

import { setMenu } from "../../redux/actions/menuAction";
import Swal from "sweetalert2";
import {
  setAddToCart,
  setSelectedDistributor,
  setSelectedSalePerson,
  showPopUp,
} from "../../redux/actions/placeOrderAction";
import NDCService from "../../axios/services/api/ndc";
import { setNdcExpiry, setNdcOtp } from "../../redux/actions/ndcAction";

const Header = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ref = useRef(null);

	const userProfile = useSelector((state) => state.userProfile);

  const dashboard = useSelector((state) => state.dashboard.dashboard);

  const addTocart = useSelector((state) => state.placeOrder.addTocart);

  const showPopup = useSelector((state) => state.placeOrder.showPopUp);

  const ndc = useSelector((state) => state.ndc);

  const {otp, expiry_time} = ndc;

  const { menu_details, profile_details } = dashboard;

  const showpopUp = async (link) => {
    let title = `OOPS! You will loose CART data,Press Exit to come out or Cancel to be in ${link}`;
    Swal.fire({
      title: title,
      showDenyButton: true,
      confirmButtonText: "Exit",
      denyButtonText: `Cancel`,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        {
          link === "Place Order" &&
            Swal.fire("Item removed from cart", "", "success");
        }
        dispatch(setAddToCart([]));
        dispatch(setSelectedDistributor("null"));
        dispatch(setSelectedSalePerson(""));
        dispatch(showPopUp(false));
      } else if (result.isDenied) {
        window.history.back();
      }
    });
    console.log(window.location.pathname);
  };

  const showPopUps = (path) => {
    if (path === "/modifyorder" && !showPopup) {
      dispatch(setAddToCart([]));
      dispatch(setSelectedDistributor("null"));
      dispatch(setSelectedSalePerson(""));
      return;
    } else if (path === "/modifyorder" && showPopup) {
      showpopUp("Modify Order");
    } else if (path === "/placeorder" && addTocart.length > 0) {
      showpopUp("Place Order");
    } else {
      return;
    }
  };

  const toggleClass = () => {
    if (ref.current.classList.contains("show")) {
      ref.current.classList.remove("show");
    } else {
      console.log();
    }
  };


  // const [otp,setOtp] = useState('');
  // const [expireOtp, setExpiryOtp] = useState('');

const checkOTP = async (otp,expiry) => {
  const { value: remark } = await Swal.fire({
    input: "text",
    inputLabel: `Please enter the OTP received in mail!`,
    inputPlaceholder: "Please Enter OTP",
  });

  // console.log("remark", remark);
  // console.log("otp", otp);
  // console.log("expiry_time", expiry_time);

  if (remark == otp) {
    console.log(remark);
    // const targetDate = new Date('2023-06-12 23:10:51.596');
    const targetDate = new Date(expiry);
    const currentTime = new Date();
    if (currentTime <= targetDate) {
      Swal.fire("show page");
      

    } else {
      Swal.fire("OTP expire");
    }
  } else {
    Swal.fire("Wrong OTP!");
  }
};

 const ndcLoginPopup = async()=>{
   await Swal.fire({
    title: 'This screen require OTP Do you want to continue?',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
  }).then((result) => {
    if (result.isConfirmed) {
       NDCService.sendOTP(userProfile).then(
				(response) => {
          console.log("opt api -- ",response.data.data);
        // dispatch(setNdcOtp(response.data.data.otp))&&
        // dispatch(setNdcExpiry(response.data.data.expiry_timestamp))&& 
        checkOTP(response.data.data.otp,response.data.data.expiry_timestamp);

				}
			);
    } else if (result.isDenied) {
      Swal.fire('Changes are not saved', '', 'info')
    }
  })
 }

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-light fixed-top"
      id="mainNav"
    >
      {console.log(addTocart)}
      <Link className="navbar-brand" to="/dashboard">
        <img src="assets/images/Weikfield-Logo.svg" title="Logo" height="56" />
      </Link>
      <button
        className="navbar-toggler navbar-toggler-right"
        type="button"
        data-toggle="collapse"
        data-target="#navbarResponsive"
        aria-controls="navbarResponsive"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i className="fa fa-fw fa-bars"></i>
      </button>
      <div className="collapse navbar-collapse" ref={ref} id="navbarResponsive">
        <ul className="navbar-nav sidenav-toggler">
          <li className="nav-item">
            <a className="nav-link" id="sidenavToggler">
              <i className="fa fa-fw fa-bars"></i>
            </a>
          </li>
        </ul>
        <ul className="navbar-nav navbar-sidenav" id="exampleAccordion">
          {/* {console.log("employees - menu_details", menu)} */}
          {menu_details &&
            menu_details.map((item, index) => (
              <li
                onClick={toggleClass}
                key={index}
                className={`nav-item ${
                  window.location.pathname === `${item.menu_href}`
                    ? "active"
                    : ""
                }`}
                data-toggle="tooltip"
                data-placement="right"
                title={item.menu_display_name}
              >
                <Link
                  className="nav-link"
                  to={item.menu_href}
                  onClick={() => showPopUps(window.location.pathname)}
                >
                  {/* fa fa-fw  */}
                  <i className={`${item.menu_icon}`}></i>
                  <span className="nav-link-text">
                    {" "}
                    {item.menu_display_name}
                  </span>
                </Link>
              </li>
            ))}

          <li
            onClick={toggleClass}
            className="nav-item"
            data-toggle="tooltip"
            data-placement="right"
            title={"NDC"}
          >
            <span
              className="nav-link"
              // to={"#"}
              onClick={() => ndcLoginPopup()}
            >
              <i className="fa fa-fw fa-dashboard"></i>
              <span className="nav-link-text">{" send otp"}</span>
            </span>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto" onClick={toggleClass}>
          <li className="nav-item dropdown profile_details_drop">
            <a
              href="#"
              className="nav-link dropdown-toggle"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="profile_img">
                <div className="prfil-img">
                  <img
                    src="assets/images/sc1.jpg"
                    width="40px"
                    className="rounded-circle"
                    alt=""
                  />
                </div>
                <div className="user-name">
                  <p>{profile_details && profile_details.user_name}</p>
                  <span>{profile_details && profile_details.user_id}</span>
                </div>
              </div>
            </a>
            <ul className="dropdown-menu drp-mnu">
              <li>
                <Link
                  to="/myprofile"
                  onClick={() => showPopUps(window.location.pathname)}
                >
                  <i className="fa fa-user"></i> Manage Profile
                </Link>
              </li>
              <li>
                <Link to="/logout">
                  <i className="fa fa-sign-out"></i> Logout
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
