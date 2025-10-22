import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Archive,
  Trash2,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: Array<{ type: 'image' | 'file'; url: string; name: string }>;
}

interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
    batch?: string;
    isOnline: boolean;
  };
  lastMessage: {
    content: string;
    timestamp: Date;
    senderId: string;
  };
  unreadCount: number;
  messages: Message[];
}

const MessagesPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  // Mock conversations data
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv1',
      user: {
        id: 'user1',
        name: 'Rahul Sharma',
        avatar: undefined,
        role: 'Senior Engineer at L&T',
        batch: '2015',
        isOnline: true,
      },
      lastMessage: {
        content: 'Thanks for the advice! Really helpful.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        senderId: 'user1',
      },
      unreadCount: 2,
      messages: [
        {
          id: 'msg1',
          senderId: currentUser?.id || 'me',
          content: 'Hi Rahul! How can I help you?',
          timestamp: new Date(Date.now() - 1000 * 60 * 20),
          isRead: true,
        },
        {
          id: 'msg2',
          senderId: 'user1',
          content: "I'm looking for some guidance on structural design projects.",
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          isRead: true,
        },
        {
          id: 'msg3',
          senderId: currentUser?.id || 'me',
          content:
            "Sure! I'd be happy to help. What specific area are you working on?",
          timestamp: new Date(Date.now() - 1000 * 60 * 10),
          isRead: true,
        },
        {
          id: 'msg4',
          senderId: 'user1',
          content: 'Thanks for the advice! Really helpful.',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          isRead: false,
        },
      ],
    },
    {
      id: 'conv2',
      user: {
        id: 'user2',
        name: 'Priya Singh',
        avatar: undefined,
        role: 'Project Manager at Tata Projects',
        batch: '2016',
        isOnline: false,
      },
      lastMessage: {
        content: 'Looking forward to the workshop!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        senderId: 'user2',
      },
      unreadCount: 0,
      messages: [
        {
          id: 'msg5',
          senderId: 'user2',
          content: 'Hi! Are you attending the upcoming workshop?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
          isRead: true,
        },
        {
          id: 'msg6',
          senderId: currentUser?.id || 'me',
          content: 'Yes, I am! Are you?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
          isRead: true,
        },
        {
          id: 'msg7',
          senderId: 'user2',
          content: 'Looking forward to the workshop!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          isRead: true,
        },
      ],
    },
    {
      id: 'conv3',
      user: {
        id: 'user3',
        name: 'Amit Kumar',
        avatar: undefined,
        role: 'Final Year Student',
        batch: '2025',
        isOnline: true,
      },
      lastMessage: {
        content: 'Thank you so much for your guidance!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        senderId: 'user3',
      },
      unreadCount: 0,
      messages: [
        {
          id: 'msg8',
          senderId: 'user3',
          content: 'Hello! Can I ask for some career advice?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 30),
          isRead: true,
        },
        {
          id: 'msg9',
          senderId: currentUser?.id || 'me',
          content: 'Of course! What would you like to know?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 10),
          isRead: true,
        },
        {
          id: 'msg10',
          senderId: 'user3',
          content: 'Thank you so much for your guidance!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          isRead: true,
        },
      ],
    },
  ]);

  useEffect(() => {
    // Check if a specific user is requested via URL params
    const userId = searchParams.get('user');
    if (userId) {
      const conversation = conversations.find((c) => c.user.id === userId);
      if (conversation) {
        setSelectedConversation(conversation.id);
      }
    } else if (conversations.length > 0) {
      setSelectedConversation(conversations[0].id);
    }
  }, [searchParams]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation]);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return timestamp.toLocaleDateString();
  };

  const formatMessageTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `msg${Date.now()}`,
      senderId: currentUser?.id || 'me',
      content: messageInput,
      timestamp: new Date(),
      isRead: false,
    };

    setConversations(
      conversations.map((conv) =>
        conv.id === selectedConversation
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: {
                content: messageInput,
                timestamp: new Date(),
                senderId: currentUser?.id || 'me',
              },
            }
          : conv
      )
    );

    setMessageInput('');
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversation(conversationId);
    // Mark messages as read
    setConversations(
      conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const activeConversation = conversations.find(
    (conv) => conv.id === selectedConversation
  );

  const filteredConversations = conversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        isAuthenticated={true}
        userRole={currentUser?.role}
        userName={`${currentUser?.firstName} ${currentUser?.lastName}`}
        userAvatar={currentUser?.profilePicture}
        unreadNotifications={3}
        unreadMessages={totalUnread}
      />

      <div className="flex-1 container mx-auto px-4 py-6">
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
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationClick(conversation.id)}
                    className={`p-4 border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedConversation === conversation.id
                        ? 'bg-primary-50 border-l-4 border-primary-600'
                        : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative flex-shrink-0">
                        <Avatar
                          src={conversation.user.avatar}
                          alt={conversation.user.name}
                          size="md"
                          fallback={conversation.user.name[0]}
                        />
                        {conversation.user.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {conversation.user.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1 truncate">
                          {conversation.user.role}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate flex-1">
                            {conversation.lastMessage.senderId ===
                            (currentUser?.id || 'me')
                              ? 'You: '
                              : ''}
                            {conversation.lastMessage.content}
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
                ))
              )}
            </div>
          </Card>

          {/* Chat Window */}
          <Card variant="elevated" className="lg:col-span-2 flex flex-col overflow-hidden">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar
                          src={activeConversation.user.avatar}
                          alt={activeConversation.user.name}
                          size="md"
                          fallback={activeConversation.user.name[0]}
                        />
                        {activeConversation.user.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {activeConversation.user.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {activeConversation.user.isOnline ? 'Online' : 'Offline'}
                        </p>
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
                  {activeConversation.messages.map((message) => {
                    const isOwn = message.senderId === (currentUser?.id || 'me');
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md ${
                            isOwn ? 'order-2' : 'order-1'
                          }`}
                        >
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
                            {formatMessageTime(message.timestamp)}
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
                      disabled={!messageInput.trim()}
                      className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={20} />
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
