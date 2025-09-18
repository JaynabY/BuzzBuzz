import api from './api';

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const patientService = {
  async getAllPatients(page = 1, limit = 10) {
    const response = await api.get(`/patients?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getPatientDetails(patientId) {
    const response = await api.get(`/patients/${patientId}`);
    return response.data;
  },

  async getPatientMedicalHistory(patientId, page = 1, limit = 10) {
    const response = await api.get(`/patients/${patientId}/medical-history?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getPatientPrescriptions(patientId, page = 1, limit = 10) {
    const response = await api.get(`/patients/${patientId}/prescriptions?page=${page}&limit=${limit}`);
    return response.data;
  },

  async searchPatients(query) {
    const response = await api.get(`/patients/search?query=${encodeURIComponent(query)}`);
    return response.data;
  }
};

export const doctorService = {
  async getAllDoctors(page = 1, limit = 10) {
    const response = await api.get(`/doctors?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getDoctorDetails(doctorId) {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  },

  async updateDoctorProfile(doctorId, updates) {
    const response = await api.put(`/doctors/${doctorId}`, updates);
    return response.data;
  },

  async getDoctorPatients(doctorId, page = 1, limit = 10) {
    const response = await api.get(`/doctors/${doctorId}/patients?page=${page}&limit=${limit}`);
    return response.data;
  },

  async searchDoctors(query, specialization, department) {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (specialization) params.append('specialization', specialization);
    if (department) params.append('department', department);
    
    const response = await api.get(`/doctors/search?${params.toString()}`);
    return response.data;
  }
};

export const medicalService = {
  async getMyReports(page = 1, limit = 10) {
    const response = await api.get(`/medical/my-reports?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getMyPrescriptions(page = 1, limit = 10) {
    const response = await api.get(`/medical/my-prescriptions?page=${page}&limit=${limit}`);
    return response.data;
  },

  async createMedicalReport(reportData) {
    const response = await api.post('/medical/reports', reportData);
    return response.data;
  },

  async createPrescription(prescriptionData) {
    const response = await api.post('/medical/prescriptions', prescriptionData);
    return response.data;
  },

  async getReportDetails(reportId) {
    const response = await api.get(`/medical/reports/${reportId}`);
    return response.data;
  },

  async getPrescriptionDetails(prescriptionId) {
    const response = await api.get(`/medical/prescriptions/${prescriptionId}`);
    return response.data;
  }
};