import React from 'react';

const Footer = () => {
    return (
        <footer className="py-6 text-center text-xs text-slate-500 bg-slate-900 border-t border-slate-800">
            <p className="mb-1">Copyright &copy; {new Date().getFullYear()} Vidhi Sahayak. All rights reserved.</p>
            <p className="text-slate-600">Developed by Shivam</p>
        </footer>
    );
};

export default Footer;
