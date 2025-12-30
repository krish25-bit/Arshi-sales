import { useEffect } from 'react';

export default function Popup({ message, type = 'error', onClose }) {
    useEffect(() => {
        // Auto-close after 3 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    const isError = type === 'error';

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 max-w-sm w-full mx-4 transform transition-all animate-bounce-in pointer-events-auto flex flex-col items-center text-center">
                <div className={`text-5xl mb-4 ${isError ? 'text-red-500' : 'text-green-500'}`}>
                    {isError ? '⚠️' : '✅'}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isError ? 'text-red-600' : 'text-green-600'}`}>
                    {isError ? 'Error' : 'Success'}
                </h3>
                <p className="text-gray-600 mb-6 font-medium">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className={`px-6 py-2 rounded-full text-white font-bold transition-transform transform hover:scale-105 ${isError ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                    Close
                </button>
            </div>
        </div >
    );
}
