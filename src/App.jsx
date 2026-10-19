import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar/Sidebar';
import ChatHeader from './components/ChatHeader/ChatHeader';
import MessageList from './components/MessageList/MessageList';
import ChatInput from './components/ChatInput/ChatInput';
import Auth from './components/Auth/Auth';
import './App.css';

const API_BASE_URL = 'http://localhost:3777/api';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('chatgpt_user');
    const savedToken = localStorage.getItem('chatgpt_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (token) {
      fetchConversations();
    }
  }, [token]);

  useEffect(() => {
    scrollToBottom();
  }, [conversations, isLoading]);

  const authHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  const handleAuthSuccess = ({ user: authUser, token: authToken }) => {
    setUser(authUser);
    setToken(authToken);
    localStorage.setItem('chatgpt_user', JSON.stringify(authUser));
    localStorage.setItem('chatgpt_token', authToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setConversations([]);
    localStorage.removeItem('chatgpt_user');
    localStorage.removeItem('chatgpt_token');
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/conversations`, {
        headers: authHeaders(),
      });
      if (response.data.success) {
        setConversations(response.data.data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleNewChat = () => {
    setConversations([]);
  };

  const handleMenuSelect = menu => {
    const notice = {
      id: Date.now() + 100,
      role: 'assistant',
      content: `"${menu}" isn't available in this demo version. Ask me about programming, software engineering, computer science, or IT instead.`,
    };
    setConversations(prev => [...prev, notice]);
  };

  const handleSendMessage = async question => {
    // Optimistically add user message
    const tempUserMessage = {
      id: Date.now(),
      role: 'user',
      content: question,
    };
    setConversations(prev => [...prev, tempUserMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/chat/conversations`,
        { question },
        { headers: authHeaders() }
      );
      if (response.data.success) {
        const { userConversation, assistantConversation } = response.data.data;
        // Replace temp message with real ones
        setConversations(prev => {
          const filtered = prev.filter(msg => msg.id !== tempUserMessage.id);
          return [...filtered, userConversation, assistantConversation];
        });
      }
    } catch (error) {
      console.error('Error posting conversation:', error);

      if (error.response?.status === 401) {
        handleLogout();
        return;
      }

      // Extract error message from backend response or use a realistic fallback
      const errorMessage =
        error.response?.data?.message ||
        'There was an error generating a response.';

      // Add error message to chat
      const errorConversation = {
        id: Date.now() + 1,
        role: 'assistant',
        content: errorMessage,
      };

      setConversations(prev => [...prev, errorConversation]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !token) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className='app'>
      <Sidebar onNewChat={handleNewChat} onMenuSelect={handleMenuSelect} />

      <main className='chat'>
        <ChatHeader user={user} onLogout={handleLogout} />

        <MessageList
          conversations={conversations}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />

        <ChatInput
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default App;