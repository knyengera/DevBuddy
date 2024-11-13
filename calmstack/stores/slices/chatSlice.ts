import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [{
    id: '1',
    text: 'Hello! How can I assist you today?',
    sender: 'bot',
    timestamp: Date.now()
  }],
  loading: false,
  error: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    sendMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({
        id: Date.now().toString(),
        text: action.payload,
        sender: 'user',
        timestamp: Date.now()
      });
    },
    receiveBotMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({
        id: Date.now().toString(),
        text: action.payload,
        sender: 'bot',
        timestamp: Date.now()
      });
    },
    setBotTyping: (state) => {
      state.loading = true;
    },
    clearBotTyping: (state) => {
      state.loading = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearChat: (state) => {
      state.messages = [initialState.messages[0]];
      state.error = null;
      state.loading = false;
    }
  }
});

export const {
  sendMessage,
  receiveBotMessage,
  setBotTyping,
  clearBotTyping,
  setError,
  clearChat
} = chatSlice.actions;

export default chatSlice.reducer;
