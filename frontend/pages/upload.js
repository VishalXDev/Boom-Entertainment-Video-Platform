import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function Upload() {
  const router = useRouter();
  const { user, loading } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('short');
  const [price, setPrice] = useState(0);
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file) => {
    if (file.type !== 'video/mp4') {
      setErrorMsg('Only .mp4 video files are allowed.');
      setVideoFile(null);
    } else if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setErrorMsg('File size must be less than 10MB.');
      setVideoFile(null);
    } else {
      setErrorMsg('');
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setErrorMsg('Title is required.');
    if (type === 'long' && price < 0) return setErrorMsg('Price must be non-negative.');
    if (!videoFile) return setErrorMsg('Select an .mp4 video file to upload.');

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('price', price);
    formData.append('videoFile', videoFile);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      const res = await api.post('/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const videoId = res.data.video?._id;
      if (!videoId) throw new Error('Invalid upload response');

      setSuccessMsg('Video uploaded successfully!');
      setTitle('');
      setDescription('');
      setType('short');
      setPrice(0);
      setVideoFile(null);

      setTimeout(() => router.push(`/videos/${videoId}`), 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || err.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Upload video</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={uploading || !videoFile || !title.trim()}
                className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {uploading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
                
                {/* File Upload */}
                {!videoFile ? (
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      dragActive 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDragIn}
                    onDragLeave={handleDragOut}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900 mb-1">
                          Drag and drop video files to upload
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Your videos will be private until you publish them.
                        </p>
                        <label className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer transition-colors font-medium">
                          SELECT FILES
                          <input
                            type="file"
                            accept="video/mp4"
                            onChange={handleFileChange}
                            disabled={uploading}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-400">
                        MP4 files only. Max file size: 10MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{videoFile.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(videoFile.size)}</p>
                        {uploading && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-red-600 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{Math.round(uploadProgress)}% uploaded</p>
                          </div>
                        )}
                      </div>
                      {!uploading && (
                        <button
                          onClick={() => setVideoFile(null)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                {videoFile && (
                  <div className="mt-6 space-y-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Title (required)
                      </label>
                      <input
                        id="title"
                        type="text"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                        placeholder="Add a title that describes your video"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={uploading}
                        maxLength={100}
                      />
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          Add a title that describes your video (don't include the words "video" or "episode")
                        </p>
                        <span className="text-xs text-gray-400">{title.length}/100</span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        id="description"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors resize-none"
                        rows={4}
                        placeholder="Tell viewers about your video"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={uploading}
                        maxLength={5000}
                      />
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          Tell viewers about your video (type @ to mention a channel)
                        </p>
                        <span className="text-xs text-gray-400">{description.length}/5000</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Error/Success Messages */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800">{errorMsg}</p>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-800">{successMsg}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Video Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Video Type
                  </label>
                  <select
                    id="type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    disabled={uploading}
                  >
                    <option value="short">Short Video (Free)</option>
                    <option value="long">Long Video (Premium)</option>
                  </select>
                </div>

                {type === 'long' && (
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Price (USD)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value) || 0)}
                        disabled={uploading}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Set to 0 for free content
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Guidelines */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">Upload Guidelines</h3>
              <ul className="text-xs text-blue-800 space-y-2">
                <li className="flex items-start">
                  <svg className="w-3 h-3 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Only MP4 video files are supported
                </li>
                <li className="flex items-start">
                  <svg className="w-3 h-3 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Maximum file size is 10MB
                </li>
                <li className="flex items-start">
                  <svg className="w-3 h-3 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Add engaging titles and descriptions
                </li>
                <li className="flex items-start">
                  <svg className="w-3 h-3 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Your video will be private until published
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}