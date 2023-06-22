import { ActionTypes } from "../constants/action-type";



const initialState = {
	otp: "null",
	expiry_time:"null",
	getNdcList : [],
	getNdcDetailsLines :[],

};
export const ndcReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case ActionTypes.SET_NDC_OTP:
			return { ...state, otp: payload };

		case ActionTypes.SET_NDC_EXPIRY:
			return { ...state, expiry_time: payload };

			case ActionTypes.SET_NDC_HEADER_LIST:
				return { ...state, 	getNdcList: payload };

			case ActionTypes.SET_NDC_DETAILS_LINES:
				return { ...state, 	getNdcDetailsLines : payload };
		default:
			return state;
	}
};
