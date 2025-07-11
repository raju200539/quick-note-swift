
import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, content: string, notificationTime?: Date) => void;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [enableNotification, setEnableNotification] = useState(false);
  const [notificationMinutes, setNotificationMinutes] = useState(5);
  const [notificationDateTime, setNotificationDateTime] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setContent('');
      setEnableNotification(false);
      setNotificationMinutes(5);
      setNotificationDateTime('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() || content.trim()) {
      let notificationTime: Date | undefined;
      
      if (enableNotification) {
        if (notificationDateTime) {
          notificationTime = new Date(notificationDateTime);
        } else {
          notificationTime = new Date(Date.now() + notificationMinutes * 60 * 1000);
        }
      }
      
      onAdd(title, content.trim(), notificationTime);
      setTitle('');
      setContent('');
      setEnableNotification(false);
      setNotificationMinutes(5);
      setNotificationDateTime('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-150 scale-100 animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-lg">
              <Plus size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Add New Note</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150 active:scale-90"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Title Field */}
          <div className="mb-4">
            <label htmlFor="note-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 transition-all duration-150"
              autoFocus
            />
          </div>

          {/* Content Field */}
          <div className="mb-6">
            <label htmlFor="note-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="What's on your mind?"
              className="w-full h-32 p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 transition-all duration-150"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Press Cmd/Ctrl + Enter to save quickly
              </p>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {content.length} characters
              </span>
            </div>
          </div>

          {/* Notification Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Get Notified
              </label>
              <button
                type="button"
                onClick={() => setEnableNotification(!enableNotification)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  enableNotification ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enableNotification ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {enableNotification && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="quick-reminder"
                    name="notification-type"
                    checked={!notificationDateTime}
                    onChange={() => setNotificationDateTime('')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="quick-reminder" className="text-sm text-gray-600 dark:text-gray-400">
                    Quick reminder
                  </label>
                </div>
                
                {!notificationDateTime && (
                  <div className="flex items-center space-x-2 ml-6">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Remind me in</span>
                    <input
                      type="number"
                      min="1"
                      max="1440"
                      value={notificationMinutes}
                      onChange={(e) => setNotificationMinutes(parseInt(e.target.value) || 5)}
                      className="w-20 p-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 text-center"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">minutes</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="scheduled-reminder"
                    name="notification-type"
                    checked={!!notificationDateTime}
                    onChange={() => setNotificationDateTime(new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="scheduled-reminder" className="text-sm text-gray-600 dark:text-gray-400">
                    Schedule for specific time
                  </label>
                </div>
                
                {notificationDateTime && (
                  <div className="ml-6">
                    <input
                      type="datetime-local"
                      value={notificationDateTime}
                      onChange={(e) => setNotificationDateTime(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() && !content.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 transform hover:scale-105 active:scale-95"
            >
              Add Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;
