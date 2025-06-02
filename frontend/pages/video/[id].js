import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/AuthContext';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function VideoDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(AuthContext);

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [giftAmount, setGiftAmount] = useState('');
  const [commentText, setCommentText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (id) fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/videos/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch video');
      setVideo(data.video);
      setComments(data.comments);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleGift = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!giftAmount || giftAmount <= 0) {
      setErrorMsg('Please enter a valid gift amount.');
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/gifts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ videoId: id, amount: giftAmount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Gift failed');
      setSuccessMsg('🎁 Gift sent successfully!');
      setGiftAmount('');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleComment = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!commentText.trim()) {
      setErrorMsg('Comment cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ videoId: id, text: commentText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Comment failed');
      setComments((prev) => [...prev, data.comment]);
      setSuccessMsg('💬 Comment posted!');
      setCommentText('');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="text-xl font-medium text-gray-700">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto pt-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Video Player */}
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl mb-5">
              <video 
                controls 
                className="w-full aspect-video bg-black"
                poster="/api/placeholder/1280/720"
              >
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-5">
              <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                {video.title}
              </h1>
              
              {/* Video Meta */}
              <div className="flex flex-wrap items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                    1.2K views
                  </span>
                  <span>•</span>
                  <span>2 days ago</span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                      isLiked 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                    <span className="font-medium">Like</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                    </svg>
                    <span className="font-medium">Share</span>
                  </button>
                </div>
              </div>

              {/* Channel Info */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {video.uploader?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {video.uploader?.username || 'Unknown Creator'}
                    </h3>
                    <p className="text-sm text-gray-600">1.2K subscribers</p>
                  </div>
                </div>
                
                {user && user._id !== video.uploader?._id && (
                  <button
                    onClick={toggleSubscribe}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                      isSubscribed
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </button>
                )}
              </div>

              {/* Description */}
              <div className="mt-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      {video.type === 'short' ? 'Short Video' : 'Long Form'}
                    </span>
                    {video.type === 'long' && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                        ${video.price}
                      </span>
                    )}
                  </div>
                  <p className={`text-gray-800 leading-relaxed ${showFullDescription ? '' : 'line-clamp-3'}`}>
                    {video.description}
                  </p>
                  {video.description && video.description.length > 150 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-blue-600 hover:text-blue-800 font-medium mt-2 text-sm"
                    >
                      {showFullDescription ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Comments ({comments.length})
              </h2>

              {/* Add Comment */}
              {user && (
                <div className="mb-8">
                  <div className="flex space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <textarea
                        rows={3}
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full border-0 border-b-2 border-gray-200 focus:border-blue-500 px-0 py-2 resize-none outline-none text-gray-900 placeholder-gray-500"
                      />
                      <div className="flex justify-end mt-3 space-x-2">
                        <button
                          onClick={() => setCommentText('')}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleComment}
                          disabled={!commentText.trim()}
                          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                  {successMsg}
                </div>
              )}

              {/* Comments List */}
              {comments.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  <p className="text-gray-500 text-lg">No comments yet</p>
                  <p className="text-gray-400 text-sm">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment._id} className="flex space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {comment.user?.username?.charAt(0).toUpperCase() || 'A'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {comment.user?.username || 'Anonymous'}
                          </h4>
                          <span className="text-sm text-gray-500">2 hours ago</span>
                        </div>
                        <p className="text-gray-800 leading-relaxed">{comment.text}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                            </svg>
                            <span className="text-sm">Like</span>
                          </button>
                          <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            {/* Support Creator */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Support Creator</h3>
              </div>

              {user && user._id !== video.uploader?._id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gift Amount (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0.00"
                        value={giftAmount}
                        onChange={(e) => setGiftAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 25].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setGiftAmount(amount.toString())}
                        className="py-2 px-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleGift}
                    disabled={!giftAmount || giftAmount <= 0}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>🎁</span>
                    <span>Send Gift</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">You cannot send gifts to your own videos</p>
                </div>
              )}
            </div>

            {/* Related Videos Placeholder */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Related Videos</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex space-x-3">
                    <div className="w-28 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                        Sample Related Video Title {i}
                      </h4>
                      <p className="text-xs text-gray-600">Creator Name</p>
                      <p className="text-xs text-gray-500">1.2K views • 3 days ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}