import api from './api';

export const scanService = {
  analyzePrescription: (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post('/scan/prescription', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
  },
};
