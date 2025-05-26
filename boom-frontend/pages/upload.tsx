import { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { useRouter } from "next/router";

export default function Upload() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
  });
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    "Gaming", "Music", "Tech", "Comedy", "Education", 
    "Sports", "Travel", "Food", "Lifestyle", "News"
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleThumbnailChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setThumbnail(selectedFile);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("video", file);
      uploadFormData.append("title", formData.title);
      uploadFormData.append("description", formData.description);
      uploadFormData.append("category", formData.category);
      uploadFormData.append("tags", formData.tags);
      if (thumbnail) {
        uploadFormData.append("thumbnail", thumbnail);
      }

      const response = await API.post("/videos/upload", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadProgress(100);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      clearInterval(progressInterval);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Please log in to upload videos</h1>
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Go to Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
              Upload Your Content
            </h1>
            <p className="text-xl text-gray-300">
              Share your creativity with the BOOM community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload Area */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  📹
                </span>
                Video File
              </h2>
              
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-pink-400 bg-pink-400/10"
                    : "border-gray-600 hover:border-pink-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                
                {file ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                      ✅
                    </div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                      📁
                    </div>
                    <p className="text-white text-lg font-medium">
                      Drag & drop your video here or click to browse
                    </p>
                    <p className="text-gray-400">
                      Supports MP4, MOV, AVI (Max 500MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Video Details */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-3">
                  📝
                </span>
                Video Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-white font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                    placeholder="Enter your video title"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300 resize-none"
                    placeholder="Describe your video content..."
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                    required
                  >
                    <option value="" className="bg-gray-800">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category} className="bg-gray-800">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                    placeholder="gaming, tutorial, fun (comma separated)"
                  />
                </div>
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-3">
                  🖼️
                </span>
                Thumbnail (Optional)
              </h2>
              
              <div className="border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center hover:border-yellow-400 transition-all duration-300">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {thumbnail ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                      ✅
                    </div>
                    <p className="text-white font-medium">{thumbnail.name}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                      🖼️
                    </div>
                    <p className="text-white text-lg font-medium">
                      Click to upload thumbnail
                    </p>
                    <p className="text-gray-400">
                      JPG, PNG (Recommended: 1280x720)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Uploading...</h3>
                  <span className="text-pink-400 font-bold">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-gray-300 mt-2">Please don't close this page...</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={uploading || !file}
                className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  uploading || !file
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:shadow-2xl hover:shadow-pink-500/25"
                }`}
              >
                {uploading ? (
                  <span className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    Uploading...
                  </span>
                ) : (
                  "🚀 Upload Video"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}