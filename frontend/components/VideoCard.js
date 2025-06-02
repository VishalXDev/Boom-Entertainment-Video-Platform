import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

export default function VideoCard({ video }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const videoRef = useRef(null)
  const timeoutRef = useRef(null)

  // Auto-play on hover for short videos
  useEffect(() => {
    if (video.type === 'short' && videoRef.current) {
      if (isHovered) {
        timeoutRef.current = setTimeout(() => {
          videoRef.current.play()
          setIsPlaying(true)
        }, 500) // Delay before auto-play
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        videoRef.current.pause()
        videoRef.current.currentTime = 0
        setIsPlaying(false)
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isHovered, video.type])

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViewCount = (count) => {
    if (!count) return '0 views'
    if (count < 1000) return `${count} views`
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K views`
    return `${(count / 1000000).toFixed(1)}M views`
  }

  const getTimeAgo = (date) => {
    if (!date) return 'Just now'
    const now = new Date()
    const uploadDate = new Date(date)
    const diffTime = Math.abs(now - uploadDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  return (
    <div 
      className="flex flex-col bg-white hover:bg-gray-50 transition-colors duration-200 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Container */}
      <div className="relative mb-3">
        <Link href={`/video/${video._id}`}>
          <a className="block relative overflow-hidden rounded-xl bg-gray-100">
            {video.type === 'short' ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                  src={`http://localhost:5000${video.filePath}`}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                {/* Short Video Indicator */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                  </svg>
                  <span>Short</span>
                </div>
              </>
            ) : (
              <>
                <img
                  className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                  src={`https://img.youtube.com/vi/${extractYouTubeId(video.url)}/hqdefault.jpg`}
                  alt={video.title}
                  loading="lazy"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black bg-opacity-70 rounded-full p-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </>
            )}

            {/* Duration Badge */}
            {video.duration && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                {formatDuration(video.duration)}
              </div>
            )}

            {/* Price Badge for Paid Content */}
            {video.type === 'long' && video.price > 0 && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded-md">
                ₹{video.price}
              </div>
            )}

            {/* Watch Later Button */}
            <button 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // Add to watch later functionality
              }}
              title="Watch later"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </a>
        </Link>
      </div>

      {/* Video Info */}
      <div className="flex space-x-3">
        {/* Creator Avatar */}
        <Link href={`/creator/${video.creator._id || video.creator.username}`}>
          <a className="flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm hover:scale-105 transition-transform duration-200">
              {video.creator.avatar ? (
                <img 
                  src={video.creator.avatar} 
                  alt={video.creator.username}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                video.creator.username?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
          </a>
        </Link>

        {/* Video Details */}
        <div className="flex-1 min-w-0">
          <Link href={`/video/${video._id}`}>
            <a>
              <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm mb-1 hover:text-red-600 transition-colors duration-200">
                {video.title}
              </h3>
            </a>
          </Link>
          
          <Link href={`/creator/${video.creator._id || video.creator.username}`}>
            <a className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <p className="text-sm mb-1">{video.creator.username}</p>
            </a>
          </Link>
          
          <div className="flex items-center text-xs text-gray-500 space-x-1">
            <span>{formatViewCount(video.views || Math.floor(Math.random() * 100000))}</span>
            <span>•</span>
            <span>{getTimeAgo(video.createdAt)}</span>
            {video.type === 'long' && video.price === 0 && (
              <>
                <span>•</span>
                <span className="text-green-600 font-medium">Free</span>
              </>
            )}
          </div>

          {/* Description Preview */}
          {video.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          )}
        </div>

        {/* More Options Menu */}
        <div className="relative flex-shrink-0">
          <button
            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
          >
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="py-2">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                  Add to Watch Later
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                  Add to Playlist
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                  Share
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                  Not Interested
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  )
}

function extractYouTubeId(url) {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

// Add these CSS classes to your global CSS file for line-clamp support
const styles = `
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
`