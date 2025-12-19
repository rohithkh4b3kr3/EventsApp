import { useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function PostCard({ post, onRefresh }) {
  const { user, refreshUser } = useContext(AuthContext);
  const [actionLoading, setActionLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
  if (!post || !post._id) {
    return null; // Don't render if post is invalid
  }
  
  const author = post.userId || {};
  
  // Get images array
  const images = (post.images && Array.isArray(post.images) && post.images.length > 0) 
    ? post.images.filter(img => img)
    : (post.image ? [post.image] : []);
  
  // Reset index when post changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [post._id]);

  useEffect(() => {
    if (user?.following && author?._id) {
      const following = user.following.some(
        (id) => id.toString() === author._id.toString()
      );
      setIsFollowing(following);
    }
  }, [user?.following, author?._id]);

  const handleFollow = async () => {
    if (!user || !author?._id || user._id === author._id) return;
    setFollowLoading(true);
    try {
      const response = await axios.post(`/user/togglefollow/${author._id}`);
      if (response.data.success) {
        await refreshUser();
        setIsFollowing(!isFollowing);
        onRefresh?.();
      }
    } catch (err) {
      console.error("Follow error:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleShare = async () => {
    const postLink = `${window.location.origin}/post/${post._id}`;
    try {
      await navigator.clipboard.writeText(postLink);
      showToast();
    } catch {}
  };

  const handleAction = async (type) => {
    if (!user) return;
    setActionLoading(true);
    try {
      await axios.put(type === "like"
        ? `/post/like/${post._id}`
        : `/post/bookmark/${post._id}`
      );
      onRefresh?.();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isLiked = user ? post.like?.some(id => id.toString() === user._id.toString()) : false;
  const isBookmarked = user ? post.bookmark?.some(id => id.toString() === user._id.toString()) : false;

  // Swipe handlers - optimized for mobile
  const minSwipeDistance = 30; // Lower threshold for easier swiping on mobile

  const onTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart(touch.clientX);
    setTouchEnd(null);
    setIsDragging(true);
    setDragOffset(0);
  };

  const onTouchMove = (e) => {
    if (!touchStart || !isDragging) return;
    
    const touch = e.touches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;
    const diffX = touchStart - currentX;
    const diffY = Math.abs((touchEnd || touchStart) - currentY);
    
    // Determine if horizontal or vertical swipe
    const isHorizontalSwipe = Math.abs(diffX) > diffY;
    
    // Only prevent scroll if swiping horizontally (more horizontal than vertical)
    if (isHorizontalSwipe && Math.abs(diffX) > 10) {
      e.preventDefault();
      e.stopPropagation();
      setDragOffset(-diffX);
      setTouchEnd(currentX);
    } else if (!isHorizontalSwipe) {
      // If vertical swipe, reset drag
      setIsDragging(false);
      setDragOffset(0);
      setTouchStart(null);
      setTouchEnd(null);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }
    
    if (touchEnd !== null) {
      const distance = touchStart - touchEnd;
      const absDistance = Math.abs(distance);
      
      // Swipe threshold
      if (absDistance > minSwipeDistance) {
        if (distance > 0 && currentImageIndex < images.length - 1) {
          // Swipe left - go to next
          setCurrentImageIndex(prev => prev + 1);
        } else if (distance < 0 && currentImageIndex > 0) {
          // Swipe right - go to previous
          setCurrentImageIndex(prev => prev - 1);
        }
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const goToNext = (e) => {
    e.stopPropagation();
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const getImageUrl = (img) => {
    if (img.startsWith("http")) return img;
    return `${import.meta.env.VITE_API_URL?.replace(/\/api$/, "")}${img}`;
  };

  return (
    <>
      <article 
        className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="px-3 md:px-4 py-3">
          <div className="flex gap-2 md:gap-3">
            <Link 
              to={`/profile/${author._id}`}
              className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center font-semibold uppercase text-white text-xs md:text-sm flex-shrink-0 hover:opacity-90 transition-opacity touch-manipulation"
              onClick={(e) => e.stopPropagation()}
            >
              {author.name?.[0] || author.username?.[0] || "U"}
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <Link 
                    to={`/profile/${author._id}`}
                    className="font-bold text-slate-900 dark:text-white text-sm md:text-[15px] hover:underline touch-manipulation"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {author.name}
                  </Link>
                  <span className="text-slate-500 dark:text-slate-400 text-sm md:text-[15px]">
                    @{author.username}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm md:text-[15px]">·</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm md:text-[15px]">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                {user && author?._id && user._id !== author._id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollow();
                    }}
                    disabled={followLoading}
                    className={`px-3 md:px-4 h-7 md:h-8 rounded-full text-xs md:text-sm font-bold transition-all flex-shrink-0 touch-manipulation active:scale-95 ${
                      isFollowing
                        ? "border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 active:border-red-500 active:text-red-500"
                        : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-200 active:bg-slate-800 dark:active:bg-slate-100"
                    } disabled:opacity-50`}
                  >
                    {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>

              <p className="text-[15px] md:text-[15px] text-slate-900 dark:text-white leading-5 md:leading-5 whitespace-pre-wrap mb-3 break-words">
                {post.description}
              </p>

              {images.length > 0 && (
                <div className="mb-3 rounded-2xl overflow-hidden relative">
                  {images.length === 1 ? (
                    // Single image - no carousel needed
                    <img
                      src={getImageUrl(images[0])}
                      alt="Post"
                      className="w-full max-h-[500px] md:max-h-[600px] object-contain"
                      loading="eager"
                      draggable="false"
                    />
                  ) : (
                    // Multiple images - carousel with swipe
                    <div 
                      className="relative"
                      onTouchStart={onTouchStart}
                      onTouchMove={onTouchMove}
                      onTouchEnd={onTouchEnd}
                      style={{ touchAction: 'pan-y' }}
                    >
                      {/* Image Container */}
                      <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-900 select-none">
                        <div 
                          className={`flex ${
                            isDragging ? '' : 'transition-transform duration-300 ease-out'
                          }`}
                          style={{ 
                            transform: `translateX(calc(-${currentImageIndex * 100}% + ${dragOffset}px))`,
                            willChange: isDragging ? 'transform' : 'auto',
                            cursor: isDragging ? 'grabbing' : 'grab'
                          }}
                        >
                          {images.map((img, index) => (
                            <div
                              key={index}
                              className="w-full flex-shrink-0"
                              style={{ minWidth: '100%' }}
                            >
                              <img
                                src={getImageUrl(img)}
                                alt={`Post image ${index + 1}`}
                                className="w-full max-h-[500px] md:max-h-[600px] object-contain pointer-events-none"
                                loading={index === 0 ? "eager" : "lazy"}
                                draggable="false"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Navigation Arrows - Larger on mobile */}
                        {currentImageIndex > 0 && (
                          <button
                            onClick={goToPrevious}
                            className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 h-10 w-10 md:h-8 md:w-8 rounded-full bg-black/60 hover:bg-black/80 active:bg-black/90 text-white flex items-center justify-center transition-all md:opacity-0 md:group-hover:opacity-100 z-10 touch-manipulation"
                            aria-label="Previous image"
                          >
                            <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                        )}
                        {currentImageIndex < images.length - 1 && (
                          <button
                            onClick={goToNext}
                            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 h-10 w-10 md:h-8 md:w-8 rounded-full bg-black/60 hover:bg-black/80 active:bg-black/90 text-white flex items-center justify-center transition-all md:opacity-0 md:group-hover:opacity-100 z-10 touch-manipulation"
                            aria-label="Next image"
                          >
                            <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}

                        {/* Image Counter - Larger on mobile */}
                        <div className="absolute bottom-4 md:bottom-3 right-3 md:right-3 bg-black/70 md:bg-black/60 text-white px-3 py-1.5 md:px-2.5 md:py-1 rounded-full text-sm md:text-xs font-medium backdrop-blur-sm">
                          {currentImageIndex + 1} of {images.length}
                        </div>

                        {/* Dots Indicator - Larger and more spaced on mobile */}
                        {images.length <= 10 && (
                          <div className="absolute bottom-4 md:bottom-3 left-1/2 -translate-x-1/2 flex gap-2 md:gap-1.5 px-2">
                            {images.map((_, index) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndex(index);
                                }}
                                className={`rounded-full transition-all touch-manipulation ${
                                  index === currentImageIndex
                                    ? 'bg-white h-2 w-7 md:h-1.5 md:w-6'
                                    : 'bg-white/60 h-2 w-2 md:h-1.5 md:w-1.5 active:bg-white/80'
                                }`}
                                aria-label={`Go to image ${index + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between max-w-[425px] mt-1 -ml-1 md:-ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction("like");
                  }}
                  disabled={!user || actionLoading}
                  className={`group flex items-center gap-1.5 md:gap-2 px-2 py-1.5 md:py-1.5 rounded-full transition-colors touch-manipulation ${
                    isLiked
                      ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 active:bg-red-50 dark:active:bg-red-950/20"
                      : "text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 active:bg-red-50 dark:active:bg-red-950/20"
                  } disabled:opacity-50`}
                >
                  <div className={`p-1.5 md:p-1.5 rounded-full group-hover:bg-red-100 dark:group-hover:bg-red-950/30 transition-colors ${
                    isLiked ? "bg-red-100 dark:bg-red-950/30" : ""
                  }`}>
                    <svg className="w-5 h-5 md:w-5 md:h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  {post.like?.length > 0 && (
                    <span className="text-sm md:text-[13px] font-medium">{post.like.length}</span>
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction("bookmark");
                  }}
                  disabled={!user || actionLoading}
                  className={`group flex items-center gap-1.5 md:gap-2 px-2 py-1.5 md:py-1.5 rounded-full transition-colors touch-manipulation ${
                    isBookmarked
                      ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 active:bg-emerald-50 dark:active:bg-emerald-950/20"
                      : "text-slate-500 dark:text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 active:bg-emerald-50 dark:active:bg-emerald-950/20"
                  } disabled:opacity-50`}
                >
                  <div className={`p-1.5 rounded-full group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/30 transition-colors ${
                    isBookmarked ? "bg-emerald-100 dark:bg-emerald-950/30" : ""
                  }`}>
                    <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  disabled={actionLoading}
                  className="group flex items-center gap-1.5 md:gap-2 px-2 py-1.5 md:py-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 active:bg-emerald-50 dark:active:bg-emerald-950/20 transition-colors touch-manipulation"
                >
                  <div className="p-1.5 rounded-full group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/30 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {toastVisible && (
        <div className="fixed bottom-4 right-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-full shadow-lg text-sm font-medium z-50 animate-fade-in">
          Link copied
        </div>
      )}
    </>
  );
}
