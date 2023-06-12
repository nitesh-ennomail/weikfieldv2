import request from "../../shared/lib/request";

function sendOTP(userProfile) {
	return request({
		url: `/ndc/sendOTP`,
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
			usertype: userProfile.usertype,
		}),
	});
}

const NDCService = {
	sendOTP,
	 //, update, delete, etc. ...
};

export default NDCService;
