import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Bold, Underline, Link as LinkIcon, Italic, Briefcase, MapPin, IndianRupee, Calendar } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Avatar from '../common/Avatar';
import { updatePost } from '../../services/post.service';
import type { Post } from '../../services/post.service';
import { FILE_LIMITS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostUpdated?: (updatedPost: Post) => void;
  post: Partial<Post> | any;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ isOpen, onClose, onPostUpdated, post }) => {
  const { user } = useAuth();
  const [postType, setPostType] = useState<string>(post?.type || 'general');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    images: [] as File[], // Keep empty for new uploads
    company: post?.jobDetails?.company || '',
    location: post?.jobDetails?.location || '',
    jobType: post?.jobDetails?.type || (post?.jobDetails as any)?.jobType || '',
    salary: post?.jobDetails?.salary || '',
    applyLink: post?.jobDetails?.applyLink || '',
    deadline: post?.jobDetails?.deadline || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const postTypes = [
    { label: 'General', value: 'general' },
    { label: 'Job', value: 'job' },
    { label: 'Internship', value: 'internship' },
    { label: 'Advice', value: 'advice' },
    { label: 'Event', value: 'event' },
    { label: 'Question', value: 'question' },
  ];

  const jobTypes = [
    { label: 'Full-time', value: 'full-time' },
    { label: 'Part-time', value: 'part-time' },
    { label: 'Contract', value: 'contract' },
    { label: 'Internship', value: 'internship' },
  ];

  // Rich text formatting functions
  const applyFormat = (prefix: string, suffix: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);

    if (selectedText) {
      const beforeText = formData.content.substring(0, start);
      const afterText = formData.content.substring(end);
      const newContent = beforeText + prefix + selectedText + suffix + afterText;

      setFormData(prev => ({ ...prev, content: newContent }));

      // Set cursor position after formatting
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
      }, 0);
    }
  };

  const handleBold = () => applyFormat('**', '**');
  const handleUnderline = () => applyFormat('__', '__');
  const handleItalic = () => applyFormat('*', '*');

  const insertLink = () => {
    if (!linkUrl.trim()) {
      setShowLinkInput(false);
      return;
    }
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const beforeText = formData.content.substring(0, start);
    const afterText = formData.content.substring(end);
    const linkText = selectedText || 'link';

    // Ensure URL has http/https
    const formattedUrl = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
    const newContent = beforeText + `[${linkText}](${formattedUrl})` + afterText;

    setFormData(prev => ({ ...prev, content: newContent }));
    setShowLinkInput(false);
    setLinkUrl('');

    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + formData.images.length > FILE_LIMITS.MAX_IMAGES_PER_POST) {
      setErrors(prev => ({ ...prev, images: `Maximum ${FILE_LIMITS.MAX_IMAGES_PER_POST} images allowed` }));
      return;
    }

    const validFiles: File[] = [];
    for (const file of files) {
      if (!FILE_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
        setErrors(prev => ({ ...prev, images: 'Only JPG, PNG, and WEBP images are allowed' }));
        continue;
      }
      if (file.size > FILE_LIMITS.IMAGE_MAX_SIZE) {
        setErrors(prev => ({ ...prev, images: `Image size must be less than ${FILE_LIMITS.IMAGE_MAX_SIZE / (1024 * 1024)}MB` }));
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...validFiles] }));
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if ((postType === 'job' || postType === 'internship') && !formData.company) {
      newErrors.company = 'Company name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      let jobDetails;
      if (postType === 'job' || postType === 'internship') {
        jobDetails = {
          company: formData.company,
          location: formData.location,
          jobType: formData.jobType,
          salary: formData.salary,
          applyLink: formData.applyLink,
          deadline: formData.deadline,
        };
      }

      // FIX: PostCard uses 'id' instead of '_id' internally, backend needs '_id'.
      const postId = post?._id || post?.id;

      if (!postId) {
        throw new Error('Post ID is missing');
      }

      const response = await updatePost(postId, {
        type: postType,
        title: formData.title,
        content: formData.content,
        images: formData.images.length > 0 ? formData.images : undefined,
        jobDetails,
      });

      if (response.success) {
        setSuccessMessage('Post updated successfully!');

        if (onPostUpdated && response.data) {
          onPostUpdated(response.data);
        }

        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 1500);
      } else {
        setErrors({ submit: response.message || 'Failed to update post.' });
      }
    } catch (error: any) {
      console.error('Update post error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update post.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Post"
      size="lg"
      showCloseButton
    >
      <div className="space-y-5">

        {/* Author Header */}
        <div className="flex items-center space-x-3 mb-2">
          <Avatar
            src={user?.profilePicture}
            alt={user?.firstName || 'User'}
            size="md"
            className="ring-2 ring-primary-100 dark:ring-primary-900/50"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Editing as Alumni • Public
            </p>
          </div>
        </div>

        {/* Post Type Badges */}
        <div>
          <div className="flex flex-wrap gap-2">
            {postTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setPostType(type.value)}
                className={`px - 4 py - 1.5 text - sm font - medium rounded - full transition - all duration - 200 ${postType === type.value
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20 transform scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  } `}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title Input */}
        <div className="relative">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What do you want to talk about?"
            className="w-full text-lg font-semibold bg-transparent border-0 border-b-2 border-transparent hover:border-gray-200 focus:border-primary-500 focus:ring-0 p-0 transition-colors dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
        </div>

        {/* Expanding Content Area with Toolbar */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
          <textarea
            ref={contentRef}
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Share your thoughts, advice, or professional updates..."
            rows={6}
            className="w-full border-0 focus:ring-0 p-4 bg-transparent text-gray-900 dark:text-white resize-none"
          />

          {/* Formatting Toolbar */}
          <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={handleBold} className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" title="Bold">
              <Bold size={18} />
            </button>
            <button type="button" onClick={handleItalic} className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" title="Italic">
              <Italic size={18} />
            </button>
            <button type="button" onClick={handleUnderline} className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" title="Underline">
              <Underline size={18} />
            </button>
            <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>

            <div className="relative">
              <button type="button" onClick={() => setShowLinkInput(!showLinkInput)} className={`p - 1.5 rounded transition - colors ${showLinkInput ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:hover:text-white dark:hover:bg-gray-700'} `} title="Insert Link">
                <LinkIcon size={18} />
              </button>

              {showLinkInput && (
                <div className="absolute top-10 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg p-3 z-10 w-64 flex space-x-2">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    autoFocus
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-transparent dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                    onKeyDown={(e) => e.key === 'Enter' && insertLink()}
                  />
                  <button onClick={insertLink} className="text-white bg-primary-600 hover:bg-primary-700 px-3 py-1 rounded text-sm font-medium">
                    Add
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1"></div>

            <label className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors text-sm font-medium">
              <ImageIcon size={16} />
              <span>Media</span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>
        {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}

        {/* Existing Images preview */}
        {post?.images && post.images.length > 0 && formData.images.length === 0 && (
          <div className="text-xs text-gray-500">
            <span className="font-medium text-amber-600">Note:</span> Uploading new images will replace existing ones.
          </div>
        )}

        {/* Local Image Previews */}
        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Upload ${index + 1} `}
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => removeImage(index)} className="p-1.5 bg-white/20 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}

        {/* Job/Internship Fields */}
        {(postType === 'job' || postType === 'internship') && (
          <div className="space-y-4 p-5 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-xl">
            <h4 className="flex items-center text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-2">
              <Briefcase size={16} className="mr-2" />
              Role Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name *"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Google, Microsoft, etc."
                error={errors.company}
              />
              <Dropdown
                label="Job Type"
                options={jobTypes}
                value={formData.jobType}
                onChange={(value) => setFormData(prev => ({ ...prev, jobType: value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <MapPin size={16} className="absolute top-9 left-3 text-gray-400" />
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State, Remote"
                  className="pl-9"
                />
              </div>
              <div className="relative">
                <IndianRupee size={16} className="absolute top-9 left-3 text-gray-400" />
                <Input
                  label="Compensation"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. 10 LPA"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Apply Link or Email"
                name="applyLink"
                value={formData.applyLink}
                onChange={handleChange}
                placeholder="https://careers..."
              />
              <div className="relative">
                <Calendar size={16} className="absolute top-9 left-3 text-gray-400" />
                <Input
                  label="Application Deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {successMessage && (
          <div className="px-4 py-3 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-lg text-sm font-medium flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="px-4 py-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-lg text-sm font-medium flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            {errors.submit}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="border-gray-300 text-gray-700 hover:bg-gray-50">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading} className="bg-[#0B1A30] hover:bg-[#14294a] text-white">
            {isLoading ? 'Saving...' : 'Save Post'}
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default EditPostModal;
