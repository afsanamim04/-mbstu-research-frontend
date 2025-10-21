import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Backend URL constant
const API_URL = "https://mbstu-research-backend.onrender.com";

function HomePage({ user }) {  // ✅ user prop receive korchi
  const [showPostModal, setShowPostModal] = useState(false);
  const [modalType, setModalType] = useState("text");
  const [tempText, setTempText] = useState("");
  const [tempImage, setTempImage] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const [tempImagePreview, setTempImagePreview] = useState(null);
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ NEW: Notification count state
  const [notificationCount, setNotificationCount] = useState(0);

  // ✅ NEW: Comment states
  const [commentTexts, setCommentTexts] = useState({});
  const [showCommentSections, setShowCommentSections] = useState({});

  // ✅ NEW: Load notification count
  const loadNotificationCount = () => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const notifications = JSON.parse(savedNotifications);
      const unreadCount = notifications.filter(n => !n.read).length;
      setNotificationCount(unreadCount);
    }
  };

  // ✅ NEW: Add notification function
  const addNotification = (message, type = 'info') => {
    const savedNotifications = localStorage.getItem('notifications');
    let notifications = [];
    
    if (savedNotifications) {
      notifications = JSON.parse(savedNotifications);
    }
    
    const newNotification = {
      id: Date.now(),
      message: message,
      type: type,
      time: new Date().toLocaleString(),
      read: false
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    // Update count
    loadNotificationCount();
    
    // Trigger update for other pages
    window.dispatchEvent(new Event('notificationsUpdated'));
  };

  // ✅ UPDATED: Load posts and notification count only
  useEffect(() => {
    loadPostsFromBackend();
    loadNotificationCount();

    // ✅ NEW: Listen for notification updates
    window.addEventListener('notificationsUpdated', loadNotificationCount);
    
    return () => {
      window.removeEventListener('notificationsUpdated', loadNotificationCount);
    };
  }, []);

  // ✅ Function to load posts from backend
  const loadPostsFromBackend = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([
        {
          _id: 1,
          user: { name: "Afsana Mim" },
          createdAt: new Date().toISOString(),
          postType: "text",
          text: "MBSTU conference registration open now!",
          file: null,
          image: null,
          likes: [],
          comments: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Like function - CORRECT URL FORMAT
const handleLike = async (postId) => {
  console.log('🟢 DEBUG: Like button clicked!');
  console.log('🟢 DEBUG: Post ID:', postId);
  
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('দয়া করে প্রথমে লগইন করুন!');
      return;
    }

    // ✅ CORRECT: Use URL parameter instead of body
    const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
      // ✅ NO body needed - postId is in URL
    });

    const data = await response.json();
    console.log('🟢 DEBUG: API Response:', data);

    if (data.success) {
      // ✅ Update the specific post in state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { ...post, likes: data.likes } 
            : post
        )
      );
      console.log('🟢 DEBUG: Like successful!');
    } else {
      alert(data.message || 'Like failed!');
    }
  } catch (error) {
    console.error('🔴 DEBUG: Like error:', error);
    alert('Network error! Please check if backend is running.');
  }
};

  
// ✅ FIXED: Comment function
const handleComment = async (postId) => {
  const commentText = commentTexts[postId] || '';
  if (!commentText.trim()) {
    alert('Please write a comment!');
    return;
  }

  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please login to comment!');
      return;
    }

    console.log('🟢 DEBUG: Comment for post:', postId);

    const response = await axios.post(
      `${API_URL}/api/posts/${postId}/comment`,
      { text: commentText },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000
      }
    );

    if (response.data.success) {
      // Reload all posts
      await loadPostsFromBackend();
      // Clear comment text
      setCommentTexts(prev => ({ ...prev, [postId]: '' }));
      console.log('🟢 DEBUG: Comment added successfully!');
    }
  } catch (error) {
    console.error('🔴 Comment error:', error);
    console.log('🔴 Error response:', error.response?.data);
    alert('Error: ' + (error.response?.data?.message || 'Check console'));
  }
};

  // ✅ NEW: Share function
  const handleShare = async (postId) => {
    try {
      const post = posts.find(p => p._id === postId);
      if (!post) return;

      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.user?.name}`,
          text: post.text || 'Check out this post!',
          url: window.location.href,
        });
        
        // Add notification
        addNotification(`🔗 You shared a post by ${post.user?.name}`, 'share');
      } else {
        // Fallback: copy to clipboard
        const postUrl = `${window.location.href}#post-${postId}`;
        await navigator.clipboard.writeText(postUrl);
        alert('Post link copied to clipboard!');
        
        // Add notification
        addNotification(`🔗 You shared a post by ${post.user?.name}`, 'share');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  // ✅ NEW: Toggle comment section
  const toggleCommentSection = (postId) => {
    setShowCommentSections(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // ✅ NEW: Update comment text
  const updateCommentText = (postId, text) => {
    setCommentTexts(prev => ({
      ...prev,
      [postId]: text
    }));
  };

  // ✅ FIXED: Check if user liked the post
const isPostLikedByUser = (post) => {
  if (!user) return false;
  
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  // Get user ID from token or localStorage
  const userId = localStorage.getItem('userId');
  
  // Check if this user has liked the post
  const userLiked = post.likes?.some(like => {
    // Check both possible formats
    return like.user?._id === userId || 
           like.user?._id === user._id ||
           like.user?.toString() === userId;
  });
  
  return
