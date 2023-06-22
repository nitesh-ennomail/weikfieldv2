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



function createNDC(userProfile) {
	return request({
		url: `/ndc/getNDCTypes`,
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		// data: JSON.stringify({
		// 	usertype: userProfile.usertype,
		// }),
	});
}

function uploadFile(userProfile,selectedFile) {
	const formData = new FormData();
		formData.append('file',selectedFile);
	
	return request({
		url: `/storage/uploadFile`,
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${userProfile.token}`,
		
		},
		data: formData,
	});
}

function saveNDC(
	userProfile,
	userId,
	ndcPeriodFrom,
	ndcPeriodTo,
	ImgFile,
	finalFilteredFormData,
) {
	return request({
		url: `/ndc/saveNDC`,
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
			customer_code:userId,
			created_by_uid:userId,
			period_from:ndcPeriodFrom,
			period_to:ndcPeriodTo,
			file_path:ImgFile,
			data:finalFilteredFormData,
		}),
	});
};


///// api for NDCView page

function viewNDCFilter(userProfile) {
	return request({
		url: `ndc/viewNDCFilter`,
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		
	});
}

function getNDCHeaderList(
	userProfile,
	ndcPeriodFrom,
	ndcPeriodTo,
	ndc_status,
    limitNo,
    offsetStart
) {
	return request({
		url: `/ndc/getNDCHeaderList`,
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
			usertype:userProfile.usertype,
			period_from:ndcPeriodFrom,
			period_to:ndcPeriodTo,
			ndc_status:ndc_status,
			limitNo:limitNo,
			offsetStart:offsetStart
		
		}),
	});
}

function getNDCLineDetails(userProfile, ndc_entry_no) {
	return request({
		url: `ndc/getNDCLineDetails`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
			// ndc_entry_no:"NC2300001",
			 ndc_entry_no: ndc_entry_no,
		}),
	});
}

function setValidationStatus(
	userProfile,
	ndc_entry_no,
	cur_status_code,
	remark,
	){
	return request({
		url: `ndc/setNDCApproverStatus`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
			ndc_entry_no:ndc_entry_no,
			cur_status_code:cur_status_code,
			vaidation_remarks:remark,
		}),
	});
}


const NDCService = {
	sendOTP,
	getNDCHeaderList,
	createNDC,      // getNDCTypes
	uploadFile,     //, update, delete, etc. ...
	viewNDCFilter,
	saveNDC,
	getNDCLineDetails,
	setValidationStatus,
	
};

export default NDCService;
