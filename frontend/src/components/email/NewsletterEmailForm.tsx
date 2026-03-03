import { useState } from 'react';
import { Send, Loader2, Newspaper, Paperclip, X } from 'lucide-react';
import {
    sendNewsletterEmail,
    type EmailStats,
    type EmailFilters,
    type NewsletterEmailData,
} from '../../services/emailCampaign.service';
import toast from 'react-hot-toast';
import RecipientSelector from './RecipientSelector';
// Tiptap imports for Rich Text Editing
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

interface Props {
    stats: EmailStats | null;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('URL of the image:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-t-lg bg-gray-50">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`px-2 py-1 rounded text-sm font-bold ${editor.isActive('bold') ? 'bg-indigo-200 text-indigo-800' : 'hover:bg-gray-200 text-gray-700'
                    }`}
            >
                B
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`px-2 py-1 rounded text-sm italic ${editor.isActive('italic') ? 'bg-indigo-200 text-indigo-800' : 'hover:bg-gray-200 text-gray-700'
                    }`}
            >
                I
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-2 py-1 rounded text-sm font-semibold ${editor.isActive('heading', { level: 2 }) ? 'bg-indigo-200 text-indigo-800' : 'hover:bg-gray-200 text-gray-700'
                    }`}
            >
                H2
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`px-2 py-1 rounded text-sm font-semibold ${editor.isActive('heading', { level: 3 }) ? 'bg-indigo-200 text-indigo-800' : 'hover:bg-gray-200 text-gray-700'
                    }`}
            >
                H3
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`px-2 py-1 rounded text-sm ${editor.isActive('bulletList') ? 'bg-indigo-200 text-indigo-800' : 'hover:bg-gray-200 text-gray-700'
                    }`}
            >
                • List
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`px-2 py-1 rounded text-sm ${editor.isActive('orderedList') ? 'bg-indigo-200 text-indigo-800' : 'hover:bg-gray-200 text-gray-700'
                    }`}
            >
                1. List
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
            <button
                onClick={setLink}
                className={`px-2 py-1 rounded text-sm ${editor.isActive('link') ? 'bg-indigo-200 text-indigo-800' : 'hover:bg-gray-200 text-gray-700'
                    }`}
            >
                Link
            </button>
            <button
                onClick={addImage}
                className="px-2 py-1 rounded text-sm hover:bg-gray-200 text-gray-700"
            >
                Image
            </button>
        </div>
    );
};

const NewsletterEmailForm = ({ stats }: Props) => {
    const [filters, setFilters] = useState<EmailFilters>({});
    const [sending, setSending] = useState(false);
    const [subject, setSubject] = useState('');
    const [title, setTitle] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
            Image,
            Placeholder.configure({
                placeholder: 'Write your newsletter content here... (Select text to format)',
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base focus:outline-none min-h-[300px] max-h-[600px] overflow-y-auto px-4 py-3 border border-t-0 border-gray-300 rounded-b-lg',
            },
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const allowedTypes = [
                'application/pdf',
                'image/jpeg',
                'image/png',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/csv',
                'video/mp4'
            ];

            const validFiles = newFiles.filter(file => {
                if (!allowedTypes.includes(file.type)) {
                    toast.error(`${file.name} is not a supported file type`);
                    return false;
                }
                if (file.size > 10 * 1024 * 1024) { // 10MB limit per file
                    toast.error(`${file.name} exceeds the 10MB limit`);
                    return false;
                }
                return true;
            });

            setAttachments(prev => [...prev, ...validFiles]);
        }
    };

    const removeAttachment = (indexToRemove: number) => {
        setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSend = async () => {
        const htmlContent = editor?.getHTML();

        // Validation
        if (!title) {
            toast.error('Newsletter Title is required');
            return;
        }
        if (!htmlContent || htmlContent === '<p></p>') {
            toast.error('Newsletter content is required');
            return;
        }

        if (
            !window.confirm(
                'Are you sure you want to send this newsletter to the selected recipients?'
            )
        ) {
            return;
        }

        try {
            setSending(true);
            const newsletterData: NewsletterEmailData = {
                subject: subject || title, // fallback subject to title
                title,
                content: htmlContent,
                attachments: attachments,
            };

            const result = await sendNewsletterEmail(newsletterData, filters);

            if (result.success) {
                toast.success(result.message);
                if (result.data) {
                    toast.success(`Sent: ${result.data.sent}, Failed: ${result.data.failed}`);
                }
                // Reset form
                setSubject('');
                setTitle('');
                editor?.commands.setContent('');
                setAttachments([]);
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            console.error('Failed to send newsletter:', error);
            toast.error(error.response?.data?.message || 'Failed to send newsletter');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Newspaper className="text-indigo-600" size={24} />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Rich Newsletter</h3>
                        <p className="text-sm text-gray-500">Draft a long and detailed professional newsletter to engage alumni and students.</p>
                    </div>
                </div>

                <div className="space-y-5">
                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Subject
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g., Monthly Alumni Update - March 2026"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Newsletter Header Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., BIT Sindri Placements & Alumni News"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Newsletter Content <span className="text-red-500">*</span>
                        </label>
                        <MenuBar editor={editor} />
                        <EditorContent editor={editor} />
                    </div>

                    {/* Add Attachments */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Attachments (Optional)
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer border border-gray-300 transition-colors">
                                <Paperclip size={18} />
                                <span>Attach Files</span>
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept=".pdf,image/*,.doc,.docx,.csv,video/mp4"
                                />
                            </label>
                            <span className="text-xs text-gray-500">Max 10MB per file (PDF, Images, DOC, CSV, MP4)</span>
                        </div>

                        {attachments.length > 0 && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {attachments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded">
                                                <Paperclip size={16} />
                                            </div>
                                            <div className="truncate">
                                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeAttachment(index)}
                                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <RecipientSelector stats={stats} filters={filters} onFiltersChange={setFilters} />

            {/* Send Button */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                    Ensure your newsletter is well-formatted before sending
                </p>
                <button
                    onClick={handleSend}
                    disabled={sending || !title || editor?.isEmpty}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {sending ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Publish Newsletter
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default NewsletterEmailForm;
