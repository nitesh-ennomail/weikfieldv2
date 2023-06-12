import { ActionTypes } from "../constants/action-type";



const initialState = {
	otp: "null",
	expiry_time:"null"
};
export const ndcReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case ActionTypes.SET_NDC_OTP:
			return { ...state, otp: payload };

		case ActionTypes.SET_NDC_EXPIRY:
			return { ...state, expiry_time: payload };
		default:
			return state;
	}
};
