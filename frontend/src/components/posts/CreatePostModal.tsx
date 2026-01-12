import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Bold, Underline, Link as LinkIcon, Italic } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import { createPost } from '../../services/post.service';
import { FILE_LIMITS } from '../../utils/constants';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [postType, setPostType] = useState<string>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    images: [] as File[],
    // Job/Internship specific fields
    company: '',
    location: '',
    jobType: '',
    salary: '',
    applyLink: '',
    deadline: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const postTypes = [
    { label: 'General Post', value: 'general' },
    { label: 'Job Opportunity', value: 'job' },
    { label: 'Internship Opportunity', value: 'internship' },
    { label: 'Career Advice', value: 'advice' },
    { label: 'Event Announcement', value: 'event' },
    { label: 'Ask the Community', value: 'question' },
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

  const handleLink = () => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);

    const url = prompt('Enter URL:');
    if (!url) return;

    const beforeText = formData.content.substring(0, start);
    const afterText = formData.content.substring(end);
    const linkText = selectedText || 'link text';
    const newContent = beforeText + `[${linkText}](${url})` + afterText;

    setFormData(prev => ({ ...prev, content: newContent }));

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

    // Validate number of images
    if (files.length + formData.images.length > FILE_LIMITS.MAX_IMAGES_PER_POST) {
      setErrors(prev => ({ ...prev, images: `Maximum ${FILE_LIMITS.MAX_IMAGES_PER_POST} images allowed` }));
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of files) {
      // Check file type
      if (!FILE_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
        setErrors(prev => ({ ...prev, images: 'Only JPG, PNG, and WEBP images are allowed' }));
        continue;
      }

      // Check file size
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
      // Prepare job details if applicable
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

      // Create post
      const response = await createPost({
        type: postType,
        title: formData.title,
        content: formData.content,
        images: formData.images.length > 0 ? formData.images : undefined,
        jobDetails,
      });

      if (response.success) {
        setSuccessMessage('Post created successfully!');

        // Reset form
        setFormData({
          title: '',
          content: '',
          images: [],
          company: '',
          location: '',
          jobType: '',
          salary: '',
          applyLink: '',
          deadline: '',
        });
        setPostType('general');

        // Notify parent component to refresh feed
        if (onPostCreated) {
          onPostCreated();
        }

        // Close modal after a short delay
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 1500);
      } else {
        setErrors({ submit: response.message || 'Failed to create post. Please try again.' });
      }
    } catch (error: any) {
      console.error('Create post error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create post. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Post"
      size="lg"
      showCloseButton
    >
      <div className="space-y-4">
        {/* Post Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Post Type
          </label>
          <div className="flex flex-wrap gap-2">
            {postTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setPostType(type.value)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  postType === type.value
                    ? 'bg-primary-100 border-primary-600 text-primary-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Give your post a title..."
          error={errors.title}
          required
        />

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>

          {/* Formatting Toolbar */}
          <div className="flex items-center space-x-1 p-2 bg-gray-50 border border-gray-300 rounded-t-lg border-b-0">
            <button
              type="button"
              onClick={handleBold}
              className="p-2 hover:bg-gray-200 rounded transition-colors group"
              title="Bold (Ctrl+B)"
            >
              <Bold size={18} className="text-gray-600 group-hover:text-gray-900" />
            </button>
            <button
              type="button"
              onClick={handleItalic}
              className="p-2 hover:bg-gray-200 rounded transition-colors group"
              title="Italic (Ctrl+I)"
            >
              <Italic size={18} className="text-gray-600 group-hover:text-gray-900" />
            </button>
            <button
              type="button"
              onClick={handleUnderline}
              className="p-2 hover:bg-gray-200 rounded transition-colors group"
              title="Underline (Ctrl+U)"
            >
              <Underline size={18} className="text-gray-600 group-hover:text-gray-900" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <button
              type="button"
              onClick={handleLink}
              className="p-2 hover:bg-gray-200 rounded transition-colors group"
              title="Add Link"
            >
              <LinkIcon size={18} className="text-gray-600 group-hover:text-gray-900" />
            </button>
            <div className="flex-1"></div>
            <div className="text-xs text-gray-500 px-2">
              Select text to format
            </div>
          </div>

          <textarea
            ref={contentRef}
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={6}
            placeholder="Share your thoughts, experience, or information..."
            className="block w-full rounded-b-lg rounded-t-none border border-gray-300 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
          <p className="mt-1 text-xs text-gray-500">
            {formData.content.length} characters • Use **bold**, *italic*, __underline__, or [text](url) for links
          </p>
        </div>

        {/* Job/Internship Specific Fields */}
        {(postType === 'job' || postType === 'internship') && (
          <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-gray-900">Job Details</p>

            <Input
              label="Company Name"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g., Larsen & Toubro"
              error={errors.company}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Mumbai, Maharashtra"
              />

              <Dropdown
                label="Job Type"
                options={jobTypes}
                value={formData.jobType}
                onChange={(value) => setFormData(prev => ({ ...prev, jobType: value }))}
                placeholder="Select job type"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Salary/Stipend Range"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g., ₹6-10 LPA"
              />

              <Input
                label="Application Deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>

            <Input
              label="Apply Link/Email"
              name="applyLink"
              value={formData.applyLink}
              onChange={handleChange}
              placeholder="https://company.com/careers or email@company.com"
            />
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Images (Optional)
          </label>
          <div className="space-y-3">
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formData.images.length < 5 && (
              <label className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 cursor-pointer transition-colors">
                <ImageIcon size={20} className="text-gray-400" />
                <span className="text-sm text-gray-600">Add Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
          <p className="mt-1 text-xs text-gray-500">
            You can upload up to 5 images. JPG, PNG, GIF accepted.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
            {isLoading ? 'Publishing...' : 'Publish Post'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreatePostModal;
