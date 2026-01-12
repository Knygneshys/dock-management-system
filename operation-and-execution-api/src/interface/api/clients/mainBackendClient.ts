import axios from 'axios';

const mainBackendClient = axios.create({
  baseURL: process.env.MAIN_BACKEND_URL || 'http://localhost:5294/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const updateVVNStatus = async (vvnCode: number): Promise<void> => {
  try {
    await mainBackendClient.patch(`/VesselVisitNotifications/${vvnCode}/status`);
  } catch (error) {
    console.error('Failed to update VVN status:', error);
    throw new Error('Failed to update VVN status in main backend');
  }
};

export default mainBackendClient;
