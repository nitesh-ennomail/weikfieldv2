import { ActionTypes } from "../constants/action-type";

export const setNdcOtp = (otp) => {
	return {
		type: ActionTypes.SET_NDC_OTP,
		payload: otp,
	};
};

export const setNdcExpiry = (expiry) => {
	return {
		type: ActionTypes.SET_NDC_EXPIRY,
		payload: expiry,
	};
};



