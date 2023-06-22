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
export const setNdcHeaderList = (ndc) => {
	return {
		type: ActionTypes.SET_NDC_HEADER_LIST,
		payload: ndc,
	};
};
export const getNdcDetailsLines = (ndc) => {
	return {
		type: ActionTypes.SET_NDC_DETAILS_LINES,
		payload: ndc,
	};
};

export const setNdcTableLoading = (state) => {
	return {
		type: ActionTypes.SET_NDC_TABLE_LOADING,
		payload: state,
	};
};



