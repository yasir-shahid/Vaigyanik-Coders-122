import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatBotContextType {
  isOpen: boolean;
  toggleChat: () => void;
  messages: Message[];
  sendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  speakMessage: (text: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
}

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

export const useChatBot = () => {
  const context = useContext(ChatBotContext);
  if (!context) {
    throw new Error('useChatBot must be used within a ChatBotProvider');
  }
  return context;
};

interface ChatBotProviderProps {
  children: ReactNode;
}

export const ChatBotProvider: React.FC<ChatBotProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const languageMap = {
        en: 'en-US',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        mr: 'mr-IN',
      };

      const currentLanguage = localStorage.getItem('dvote-language') || 'en';
      utterance.lang = languageMap[currentLanguage as keyof typeof languageMap] || 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const sendMessage = async (message: string) => {
    const userMessage: Message = {
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const currentLanguage = localStorage.getItem('dvote-language') || 'en';
      const systemPrompt = getSystemPrompt(currentLanguage);
      const contextualMessage = `${systemPrompt}\n\nUser question: ${message}`;

      const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama3',
        prompt: contextualMessage,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 500,
        },
      });

      let botResponse = response.data.response;

      // Add language note if response not in desired script
      if (currentLanguage !== 'en' && !containsNonLatinScript(botResponse)) {
        const languageNotes = {
          hi: '\n\n(नोट: यदि आप हिंदी में उत्तर चाहते हैं, तो कृपया हिंदी में प्रश्न पूछें)',
          ta: '\n\n(குறிப்பு: தமிழில் பதில் வேண்டுமானால், தயவுசெய்து தமிழில் கேள்வி கேளுங்கள்)',
          te: '\n\n(గమనిక: తెలుగులో సమాధానం కావాలంటే, దయచేసి తెలుగులో ప్రశ్న అడగండి)',
          mr: '\n\n(टीप: मराठीत उत्तर हवे असल्यास, कृपया मराठीत प्रश्न विचारा)',
        };
        botResponse += languageNotes[currentLanguage as keyof typeof languageNotes] || '';
      }

      const botMessage: Message = {
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

      speakMessage(botResponse);
    } catch (error) {
      console.error('Error calling Ollama:', error);

      const currentLanguage = localStorage.getItem('dvote-language') || 'en';

      const errorMessages = {
        en: "I'm sorry, I'm having trouble connecting to the AI service. Please make sure Ollama is running with the llama3 model. You can start it with: 'ollama run llama3'",
        hi: "क्षमा करें, मुझे AI सेवा से जुड़ने में समस्या हो रही है। कृपया सुनिश्चित करें कि Ollama llama3 मॉडल के साथ चल रहा है।",
        ta: "மன்னிக்கவும், AI சேவையுடன் இணைப்பதில் சிக்கல் உள்ளது. Ollama llama3 மாதிரியுடன் இயங்குகிறது என்பதை உறுதிப்படுத்தவும்.",
        te: "క్షమించండి, AI సేవతో కనెక్ట్ చేయడంలో సమస్య ఉంది. Ollama llama3 మోడల్‌తో రన్ అవుతుందని నిర్ధారించుకోండి.",
        mr: "माफ करा, AI सेवेशी जोडण्यात अडचण येत आहे. Ollama llama3 मॉडेलसह चालत आहे याची खात्री करा.",
      };

      const errorMessage: Message = {
        type: 'bot',
        content: errorMessages[currentLanguage as keyof typeof errorMessages] || errorMessages.en,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSystemPrompt = (language: string) => {
    const prompts = {
      en: `You are a helpful assistant for DVote, a decentralized blockchain-based voting system for India. Assist users in understanding how to register, verify their identity, vote, and retrieve results. Keep responses brief and accurate.`,
      hi: `आप DVote के लिए एक सहायक हैं, जो भारत की विकेन्द्रीकृत ब्लॉकचेन आधारित मतदान प्रणाली है। उपयोगकर्ताओं को पंजीकरण, पहचान सत्यापन, मतदान और परिणाम प्राप्त करने में मदद करें। उत्तर संक्षिप्त और सटीक रखें।`,
      ta: `நீங்கள் DVote என்ற இந்தியாவின் தன்னாட்சி கொண்ட வாக்குச்சாவடி அமைப்புக்கான உதவியாளர். பயனாளர்களை பதிவு செய்வது, அடையாளம் உறுதிப்படுத்துவது, வாக்களிப்பது மற்றும் முடிவுகளை பெறுவது போன்றவற்றில் உதவுங்கள். பதில்கள் தெளிவாகவும் சுருக்கமாகவும் இருக்கட்டும்.`,
      te: `మీరు DVote అనే భారతదేశానికి చెందిన వికేంద్రీకృతమైన బ్లాక్‌చైన్ ఓటింగ్ వ్యవస్థ కోసం సహాయకుడిగా పనిచేస్తున్నారు. వినియోగదారులు నమోదు, గుర్తింపు ధృవీకరణ, ఓటింగ్ మరియు ఫలితాలు పొందడంలో సహాయం చేయండి.`,
      mr: `तुम्ही DVote साठी सहाय्यक आहात, जे भारतासाठीचे एक विकेंद्रित ब्लॉकचेन आधारित मतदान प्रणाली आहे. वापरकर्त्यांना नोंदणी, ओळख पडताळणी, मतदान आणि निकाल प्राप्त करण्यात मदत करा.`,
    };
    return prompts[language as keyof typeof prompts] || prompts.en;
  };

  const containsNonLatinScript = (text: string) => {
    const devanagari = /[\u0900-\u097F]/;
    const tamil = /[\u0B80-\u0BFF]/;
    const telugu = /[\u0C00-\u0C7F]/;
    return devanagari.test(text) || tamil.test(text) || telugu.test(text);
  };

  return (
    <ChatBotContext.Provider
      value={{
        isOpen,
        toggleChat,
        messages,
        sendMessage,
        isLoading,
        speakMessage,
        isSpeaking,
        stopSpeaking,
      }}
    >
      {children}
    </ChatBotContext.Provider>
  );
};
