import React from 'react';

interface Props {
    username: string;
    content: React.ReactNode;
    date: string;
    onReply?: () => void;
    children?: React.ReactNode;
}

const CommentNode: React.FC<Props> = ({ username, content, date, onReply, children }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex border border-gray-300 bg-white">
                {/* Left: Avatar & Name */}
                <div className="w-24 flex-shrink-0 flex flex-col items-center p-4 border-r border-gray-300">
                    <div className="w-16 h-16 bg-gray-200 mb-2 overflow-hidden">
                        <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900 break-all text-center">{username}</span>
                </div>

                {/* Right: Content */}
                <div className="flex-grow p-4 flex flex-col">
                    <div className="text-xs text-orange-400 mb-4">
                        {new Date(date).toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }).replace(',', ' в')}
                    </div>
                    
                    <div className="text-gray-800 text-sm mb-4 flex-grow">
                        {content}
                    </div>

                    {onReply && (
                        <button 
                            onClick={onReply}
                            className="text-purple-700 hover:underline text-sm self-start font-medium"
                        >
                            Reply
                        </button>
                    )}
                </div>
            </div>
            
            {/* Nested Children */}
            {children && (
                <div className="pl-8 md:pl-12">
                    {children}
                </div>
            )}
        </div>
    );
};

export default CommentNode;
