import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://vidhisahayak2004.pythonanywhere.com/api/v1';

const Dashboard = () => {
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [scraping, setScraping] = useState(false);
    const [activeTab, setActiveTab] = useState('hiring');
    const navigate = useNavigate();

    const apiKey = localStorage.getItem('apiKey');

    useEffect(() => {
        if (!apiKey) {
            navigate('/');
        } else {
            fetchUpdates();
        }
    }, [apiKey, activeTab]);

    const fetchUpdates = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/updates/`, {
                params: { type: activeTab, limit: 50 },
                headers: { 'X-API-KEY': apiKey }
            });
            setUpdates(response.data);
        } catch (error) {
            console.error("Failed to fetch updates", error);
            if (error.response?.status === 401) navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleScrape = async () => {
        setScraping(true);
        try {
            await axios.post(`${API_BASE}/updates/fetch-live`, {}, {
                headers: { 'X-API-KEY': apiKey }
            });
            alert('Scraping completed successfully!');
            fetchUpdates();
        } catch (error) {
            alert(`Scraping failed: ${error.response?.data?.detail || error.message}`);
        } finally {
            setScraping(false);
        }
    };

    const handleClearData = async () => {
        if (!window.confirm('Are you sure you want to delete ALL data? This cannot be undone.')) return;

        setLoading(true);
        try {
            await axios.delete(`${API_BASE}/updates/all`, {
                headers: { 'X-API-KEY': apiKey }
            });
            alert('All data cleared successfully.');
            fetchUpdates();
        } catch (error) {
            alert(`Failed to clear data: ${error.response?.data?.detail || error.message}`);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this update?')) return;

        try {
            await axios.delete(`${API_BASE}/updates/${id}`, {
                headers: { 'X-API-KEY': apiKey }
            });
            // Optimistic update
            setUpdates(updates.filter(u => u.id !== id));
        } catch (error) {
            alert(`Failed to delete: ${error.response?.data?.detail || error.message}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('apiKey');
        navigate('/');
    };

    return (
        <div className="min-h-full bg-slate-900 text-slate-100 font-sans">
            {/* Header */}
            <nav className="bg-slate-800 border-b border-slate-700 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                Vidhi Sahayak
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleScrape}
                                disabled={scraping}
                                className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${scraping
                                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                                    }`}
                            >
                                {scraping ? (
                                    <span className="flex items-center"><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Scraping...</span>
                                ) : 'Start Scraper'}
                            </button>

                            <button
                                onClick={handleClearData}
                                className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors border border-transparent hover:border-red-900/50"
                            >
                                Clear Data
                            </button>

                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg w-fit mb-8 shadow-inner">
                    {['hiring', 'notice', 'blog'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-md text-sm font-medium capitalize transition-all focus:outline-none ${activeTab === tab
                                ? 'bg-slate-700 text-cyan-400 shadow-sm'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* content */}
                <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-12 text-slate-400 space-y-4">
                            <svg className="animate-spin h-8 w-8 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span>Loading updates...</span>
                        </div>
                    ) : updates.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">No updates found for this category.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-left">Title</th>
                                        <th className="px-6 py-4 font-semibold text-left">Court</th>
                                        <th className="px-6 py-4 font-semibold text-left">Date</th>
                                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {updates.map((update) => (
                                        <tr key={update.id} className="hover:bg-slate-700/30 transition-colors group">
                                            <td className="px-6 py-4 align-top">
                                                <div className="font-medium text-slate-200 text-sm leading-snug">{update.title}</div>
                                                <div className="text-xs text-slate-500 mt-1 line-clamp-2">{update.content_summary}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 text-sm whitespace-nowrap align-top">
                                                {update.court_name}
                                                <span className="block text-xs text-slate-600 mt-0.5">{update.category}</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 text-sm whitespace-nowrap align-top">
                                                {new Date(update.published_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right align-top whitespace-nowrap space-x-2">
                                                <button
                                                    onClick={() => handleDelete(update.id)}
                                                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-400 bg-transparent border border-transparent rounded-full hover:bg-red-900/20 hover:text-red-300 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                                <a
                                                    href={update.source_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-cyan-400 bg-cyan-900/30 border border-cyan-800 rounded-full hover:bg-cyan-900/50 hover:border-cyan-700 transition-colors"
                                                >
                                                    View Source
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
