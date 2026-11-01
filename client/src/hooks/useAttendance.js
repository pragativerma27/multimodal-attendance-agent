import { useState, useCallback } from 'react';
import attendanceService from '../services/attendanceService';

export const useAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  const fetchRecords = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const res = await attendanceService.getAttendance(params);
      if (res.data?.success) {
        setRecords(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, records, error, fetchRecords };
};

export default useAttendance;
