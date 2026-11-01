import axiosClient from '../api/axiosClient';

export const attendanceService = {
  getAttendance: (params) => axiosClient.get('/attendance', { params }),
  markAttendance: (data) => axiosClient.post('/attendance/mark', data),
  updateStatus: (id, status, notes) => axiosClient.put(`/attendance/${id}`, { status, notes }),
  exportCSV: () => axiosClient.get('/reports/export/csv', { responseType: 'blob' }),
};

export default attendanceService;
