import React from 'react';
import Auth from '../components/Auth';

const AuthPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 w-full">
            <Auth />
        </div>
    );
};

export default AuthPage;
