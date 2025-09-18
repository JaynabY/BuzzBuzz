import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { medicalService } from '../services/hospitalService';

const PatientDashboard = () => {
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('reports');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'reports') {
          const response = await medicalService.getMyReports();
          setReports(response.data.reports);
        } else {
          const response = await medicalService.getMyPrescriptions();
          setPrescriptions(response.data.prescriptions);
        }
      } catch (error) {
        setError(`Failed to fetch ${activeTab}`);
        console.error(`Error fetching ${activeTab}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">My Medical Records</h1>
            <p className="mt-2 text-sm text-gray-700">
              View your medical reports and prescriptions.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reports'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Medical Reports
              </button>
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'prescriptions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Prescriptions
              </button>
            </nav>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="mt-8">
          {activeTab === 'reports' ? (
            <div className="space-y-6">
              {reports.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No medical reports</h3>
                  <p className="mt-1 text-sm text-gray-500">You don't have any medical reports yet.</p>
                </div>
              ) : (
                reports.map((report) => (
                  <div key={report._id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {report.title}
                          </h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            {report.reportType.replace('_', ' ').toUpperCase()}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(report.createdAt)}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm text-gray-900">{report.description}</p>
                        {report.diagnosis?.primary && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {report.diagnosis.primary}
                            </span>
                          </div>
                        )}
                      </div>

                      {report.doctor && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-500">
                            Doctor: {report.doctor.user.firstName} {report.doctor.user.lastName}
                            {report.doctor.specialization && ` • ${report.doctor.specialization}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {prescriptions.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions</h3>
                  <p className="mt-1 text-sm text-gray-500">You don't have any prescriptions yet.</p>
                </div>
              ) : (
                prescriptions.map((prescription) => (
                  <div key={prescription._id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Prescription #{prescription.prescriptionId}
                          </h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            {prescription.diagnosis}
                          </p>
                        </div>
                        <div className="text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            prescription.status === 'active' ? 'bg-green-100 text-green-800' :
                            prescription.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            prescription.status === 'expired' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {prescription.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900">Medications:</h4>
                        <div className="mt-2 space-y-2">
                          {prescription.medications.map((medication, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-md">
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{medication.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {medication.dosage} • {medication.frequency} • {medication.duration}
                                  </p>
                                  {medication.instructions && (
                                    <p className="text-sm text-gray-600 mt-1">{medication.instructions}</p>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Qty: {medication.quantity || 'N/A'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {prescription.doctor && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-500">
                            Prescribed by: {prescription.doctor.user.firstName} {prescription.doctor.user.lastName}
                            {prescription.doctor.specialization && ` • ${prescription.doctor.specialization}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            Date: {formatDate(prescription.createdAt)}
                            {prescription.validUntil && ` • Valid until: ${formatDate(prescription.validUntil)}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PatientDashboard;