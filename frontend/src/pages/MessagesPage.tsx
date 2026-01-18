import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Loader,
  AlertCircle,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import * as messageService from '../services/message.service';

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email?: string;
    profilePicture?: string;
  };
  receiver: {
    _id: string;
    name: string;
    email?: string;
    profilePicture?: string;
  };
  content: string;
  timestamp: Date;
  isRead: boolean;
  createdAt: string;
  attachments?: Array<{ type: 'image' | 'file'; url: string; name: string }>;
}

interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    name: string;
    profilePicture?: string;
  }>;
  lastMessage?: {
    content: string;
    createdAt: string;
    sender: string;
  };
  unreadCount: number;
  messages?: Message[];
}

const MessagesPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Fetch conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await messageService.getConversations();
        setConversations(data as any);
        
        // Check if a specific user is requested via URL params
        const userId = searchParams.get('user');
        if (userId) {
          const conversation = data.find((c: any) => 
            c.participants.some((p: any) => p._id === userId)
          );
          if (conversation) {
            setSelectedConversation(conversation._id);
          }
        } else if (data.length > 0) {
          setSelectedConversation(data[0]._id);
        }
      } catch (err) {
        setError('Failed to load conversations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [searchParams]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const loadMessages = async () => {
        try {
          const data = await messageService.getMessages(selectedConversation);
          setMessages(data as any);
          
          // Mark messages as read
          for (const msg of data) {
            if (!msg.isRead && msg.receiver?._id === currentUser?._id) {
              await messageService.markMessageAsRead(msg._id);
            }
          }
        } catch (err) {
          console.error('Failed to load messages:', err);
        }
      };

      loadMessages();
    }
  }, [selectedConversation, currentUser?._id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTimestamp = (timestamp: string | Date) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (timestamp: string | Date) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    const activeConversation = conversations.find(c => c._id === selectedConversation);
    if (!activeConversation) return;

    const otherParticipant = activeConversation.participants.find(p => p._id !== currentUser?._id);
    if (!otherParticipant) return;

    try {
      setSending(true);
      await messageService.sendMessage({
        receiverId: otherParticipant._id,
        content: messageInput,
      });

      // Reload messages
      const data = await messageService.getMessages(selectedConversation);
      setMessages(data as any);
      setMessageInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  const activeConversation = conversations.find(
    (conv) => conv._id === selectedConversation
  );

  const otherParticipant = activeConversation?.participants.find(
    (p) => p._id !== currentUser?._id
  );

  const filteredConversations = conversations.filter((conv) => {
    const other = conv.participants.find(p => p._id !== currentUser?._id);
    return other?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        isAuthenticated={true}
        userRole={currentUser?.role}
        userName={`${currentUser?.firstName} ${currentUser?.lastName}`}
        userAvatar={currentUser?.profilePicture}
        unreadNotifications={0}
        unreadMessages={totalUnread}
      />

      <div className="flex-1 container mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card variant="elevated" className="lg:col-span-1 flex flex-col overflow-hidden">
            {/* Search Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                leftIcon={<Search size={18} />}
              />
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <Loader size={32} className="animate-spin text-primary-600 mx-auto" />
                  <p className="text-gray-500 mt-4">Loading conversations...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const other = conversation.participants.find(p => p._id !== currentUser?._id);
                  if (!other) return null;

                  return (
                    <div
                      key={conversation._id}
                      onClick={() => handleConversationClick(conversation._id)}
                      className={`p-4 border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedConversation === conversation._id
                          ? 'bg-primary-50 border-l-4 border-primary-600'
                          : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar
                          src={other.profilePicture}
                          alt={other.name}
                          size="md"
                          fallback={other.name[0]}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {other.name}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {conversation.lastMessage?.createdAt 
                                ? formatTimestamp(conversation.lastMessage.createdAt)
                                : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate flex-1">
                              {conversation.lastMessage?.content || 'No messages yet'}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="primary" size="sm" className="ml-2">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Chat Window */}
          <Card variant="elevated" className="lg:col-span-2 flex flex-col overflow-hidden">
            {activeConversation && otherParticipant ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <Avatar
                        src={otherParticipant.profilePicture}
                        alt={otherParticipant.name}
                        size="md"
                        fallback={otherParticipant.name[0]}
                      />
                      <div className="min-w-0">
                        <button
                          onClick={() => navigate(`/profile/${otherParticipant._id}`)}
                          className="font-semibold text-gray-900 hover:text-primary-600 transition-colors text-left"
                        >
                          {otherParticipant.name}
                        </button>
                        <p className="text-sm text-gray-600">Online</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Phone size={20} />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Video size={20} />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Info size={20} />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.sender._id === currentUser?._id;
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md`}>
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              isOwn
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p
                            className={`text-xs text-gray-500 mt-1 ${
                              isOwn ? 'text-right' : 'text-left'
                            }`}
                          >
                            {formatMessageTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messageEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Paperclip size={20} />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ImageIcon size={20} />
                      </button>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      />
                    </div>
                    <button
                      type="button"
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Smile size={20} />
                    </button>
                    <button
                      type="submit"
                      disabled={!messageInput.trim() || sending}
                      className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MessagesPage;
