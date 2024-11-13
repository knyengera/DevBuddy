import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly';
  xp: number;
  status: 'new' | 'in_progress' | 'completed';
  progress: number;
  objectives: string[];
  timeRemaining?: number;
  tips?: string;
}

interface QuestState {
  quests: Quest[];
  loading: boolean;
  error: string | null;
  activeQuestId: string | null;
}

const initialState: QuestState = {
  quests: [],
  loading: false,
  error: null,
  activeQuestId: null,
};

const questSlice = createSlice({
  name: 'quests',
  initialState,
  reducers: {
    fetchQuestsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchQuestsSuccess: (state, action: PayloadAction<Quest[]>) => {
      state.loading = false;
      state.quests = action.payload;
    },
    fetchQuestsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    startQuest: (state, action: PayloadAction<string>) => {
      const quest = state.quests.find(q => q.id === action.payload);
      if (quest) {
        quest.status = 'in_progress';
        state.activeQuestId = action.payload;
      }
    },
    completeQuest: (state, action: PayloadAction<string>) => {
      const quest = state.quests.find(q => q.id === action.payload);
      if (quest) {
        quest.status = 'completed';
        quest.progress = 1;
        if (state.activeQuestId === action.payload) {
          state.activeQuestId = null;
        }
      }
    },
    updateQuestProgress: (state, action: PayloadAction<{ questId: string; progress: number }>) => {
      const quest = state.quests.find(q => q.id === action.payload.questId);
      if (quest) {
        quest.progress = action.payload.progress;
      }
    },
  },
});

export const {
  fetchQuestsStart,
  fetchQuestsSuccess,
  fetchQuestsFailure,
  startQuest,
  completeQuest,
  updateQuestProgress,
} = questSlice.actions;

export default questSlice.reducer;
