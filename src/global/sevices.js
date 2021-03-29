import axios from 'axios'
import config from './config'
import swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

const {BASE_URL_LOGIN, TIMEOUT} = config

const alert = {
	showAlert(message, status) {
		swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: message,
			confirmButtonText: 'Reload',
			allowOutsideClick: true,
			showClass: {
				popup: 'animate__animated animate__fadeInDown'
			},
			hideClass: {
				popup: 'animate__animated animate__fadeOutUp'
			}
		}).then(result => {
			if (status === 401) {
				sessionStorage.clear()
				window.location.href = '/'
			}
			else if (result.value) {
				window.location.reload();
			}
		});
	},
	alertCreateEditSuccess(message) {
		swal.fire({
			icon: 'success',
			title: `Success`,
			text: message,
			confirmButtonText: 'OK',
			allowOutsideClick: true,
			showClass: {
				popup: 'animate__animated animate__fadeInDown'
			},
			hideClass: {
				popup: 'animate__animated animate__fadeOutUp'
			}
		})
	},
	alertCreateEditError(message, from, type) {
		swal.fire({
			icon: 'error',
			title: `${type} ${from} Failed`,
			text: message,
			cancelButtonText: 'Close',
			allowOutsideClick: true,
			showConfirmButton: false,
			showCancelButton: true,
			cancelButtonColor: '#f27474',
			showClass: {
				popup: 'animate__animated animate__fadeInDown'
			},
			hideClass: {
				popup: 'animate__animated animate__fadeOutUp'
			}
		})
	},
};

const MatrixServices = {

	getEmploye(param) {
		return axios.get(`${BASE_URL_LOGIN}menuCutiTalent/${param.id}?page=${param.page - 1}&size=${param.size}&sort=${param.sort}&search=${param.search}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${param.token}`,
			},
			timeout: TIMEOUT
		}).then(response => {
			return response
		}).catch(err => {
			alert.showAlert(err.response.data.error.message, err.response.status)
		})
	},
	getDetailEmploye(param) {
		return axios.get(`${BASE_URL_LOGIN}leaveRequest/${param.id}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${param.token}`,
			},
			timeout: TIMEOUT
		}).then(response => {
			return response
		}).catch(err => {
			alert.showAlert(err.response.data.error.message, err.response.status)
		})
	},
	editCuti(body, id, token) {
		return axios.patch(`${BASE_URL_LOGIN}leaveRequest/${id}`, body, 
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			timeout: TIMEOUT
		}).then(response => {
			alert.alertCreateEditSuccess(response.data.message)
			return response
		}).catch(err => {
			alert.alertCreateEditError(err.response.data.error.message, 'Cuti', 'Edit', err.response.status)
			return err
		})
	},
	addCuti(body, token) {
		return axios.post(`${BASE_URL_LOGIN}leaveRequest`, body, 
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			timeout: TIMEOUT
		}).then(response => {
			alert.alertCreateEditSuccess(response.data.message)
			return response
		}).catch(err => {
			alert.alertCreateEditError(err.response.data.error.message, 'Cuti', 'Edit', err.response.status)
			return err
		})
	},
	sendCuti(param) {
		return axios.get(`${BASE_URL_LOGIN}sendCutiTalent/${param.id}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${param.token}`,
			},
			timeout: TIMEOUT
		}).then(response => {
			alert.alertCreateEditSuccess(response.data.message)
			return response
		}).catch(err => {
			alert.showAlert(err.response.data.error.message, err.response.status)
		})
	},
	cancelCuti(param) {
		return axios.get(`${BASE_URL_LOGIN}cancelCutiTalent/${param.id}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${param.token}`,
			},
			timeout: TIMEOUT
		}).then(response => {
			alert.alertCreateEditSuccess(response.data.message)
			return response
		}).catch(err => {
			alert.showAlert(err.response.data.error.message, err.response.status)
		})
	},
	deleteCuti(id, body, token) {
		return axios.delete(`${BASE_URL_LOGIN}leaveRequest/${id}`, 
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			data: {
				userid: body.userid
			},
			timeout: TIMEOUT
		}).then(response => {
			alert.alertCreateEditSuccess(response.data.message)
			return response
		}).catch(err => {
			alert.alertCreateEditError(err.response.data.error.message, 'Cuti', 'Edit', err.response.status)
			return err
		})
	},
	getUserLeaveRequest(param) {
		return axios.get(`${BASE_URL_LOGIN}leaveRequest?page=${param.page - 1}&size=${param.size}&sort=${param.sort}&search=${param.search}&role=admin`,
			{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${param.token}`,
			},
			timeout: TIMEOUT
		}).then(response => {
			return response
		}).catch(err => {
			alert.showAlert(err.response.data.error.message, err.response.status)
		})
	},
	getUserLeaveRequestOne(param, token) {
		return axios.get(`${BASE_URL_LOGIN}leaveRequest/${param.id}`,
			{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			timeout: TIMEOUT
		}).then(response => {
			return response
		}).catch(err => {
			alert.showAlert(err.response.data.error.message, err.response.status)
		})
	},
	approveSPV(param, token, body) {
		return axios.post(`${BASE_URL_LOGIN}approveSPV/${param.id}`,body,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			timeout: TIMEOUT
		}).then(response => {
			alert.alertCreateEditSuccess(response.data.message)
			return response
		}).catch(err => {
			alert.alertCreateEditError(err.response.data.error.message, 'Supervisor', 'Approve', err.response.status)
			return err
		})
	},
	rejectSPV(param, token, body) {
		return axios.post(`${BASE_URL_LOGIN}rejectSPV/${param.id}`,body,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			timeout: TIMEOUT
		}).then(response => {
			alert.alertCreateEditSuccess(response.data.message)
			return response
		}).catch(err => {
			alert.alertCreateEditError(err.response.data.error.message, 'Supervisor', 'Reject', err.response.status)
			return err
		})
	},

	getUserLeaveRequestHrd(param) {
		return axios.get(`${BASE_URL_LOGIN}leaveRequest?page=${param.page -1}&size=${param.size}&sort=${param.sort}&search=${param.search}&role=admin`,
			{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${param.token}`,
			},
			timeout: TIMEOUT
		}).then(response => {
			return response
		}).catch(err => {
			alert.showAlert(err.response.data.error.message, err.response.status)
		})
	},
	getUserLeaveRequestHrdCoba(param, token) {
		return axios.get(`${BASE_URL_LOGIN}leaveRequest/${param.id}`,
			{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			timeout: TIMEOUT
		}).then(response => {
			return response
		}).catch(err => {
			alert.showAlert(err.response.data.error.message, err.response.status)
		})
	},
	approveHRD(param, token, body) {
		return axios.post(`${BASE_URL_LOGIN}approveHRD/${param.id}`,body,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			timeout: TIMEOUT
		}).then(response => {
			alert.alertCreateEditSuccess(response.data.message)
			return response
		}).catch(err => {
			alert.alertCreateEditError(err.response.data.error.message, 'HRD', 'Approve', err.response.status)
			return err
		})
	},
	rejectHRD(param, token, body) {
		return axios.post(`${BASE_URL_LOGIN}rejectHRD/${param.id}`,body,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			timeout: TIMEOUT
		}).then(response => {
			alert.alertCreateEditSuccess(response.data.message)
			return response
		}).catch(err => {
			alert.alertCreateEditError(err.response.data.error.message, 'HRD', 'Reject', err.response.status)
			return err
		})
	},

	// get notif

	getNotif(param, token) {
		return axios.get(`${BASE_URL_LOGIN}leaveRequest/status/${param}`,
			{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			timeout: TIMEOUT
		}).then(response => {
			return response
		}).catch(err => {
			alert.showAlert(err.response.data.error.message, err.response.status)
		})
	},
	getNotifTalent(param, token) {
		return axios.get(`${BASE_URL_LOGIN}notifTalent/${param}`,
			{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			timeout: TIMEOUT
		}).then(response => {
			return response
		}).catch(err => {
			alert.showAlert(err.response.data.error.message, err.response.status)
		})
	},
} 

export { MatrixServices }