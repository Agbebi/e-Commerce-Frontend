import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../../api/axios';

const initialState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    isConnected: false
};

export const getNotifications = createAsyncThunk('notification/getNotifications', async (_, { rejectWithValue }) => {
    try {
        const response = await API.get('/api/shop/notifications', { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const markNotificationAsRead = createAsyncThunk('notification/markAsRead', async (id, { rejectWithValue }) => {
    try {
        const response = await API.patch(`/api/shop/notifications/${id}/read`, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const markAllNotificationsAsRead = createAsyncThunk('notification/markAllAsRead', async (_, { rejectWithValue }) => {
    try {
        const response = await API.patch('/api/shop/notifications/read-all', {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            const notification = action.payload;
            const exists = state.notifications.some(n => n._id === notification._id);
            if (!exists) {
                state.notifications.unshift(notification);
                if (!notification.isRead) {
                    state.unreadCount += 1;
                }
            }
        },
        setConnectionStatus: (state, action) => {
            state.isConnected = action.payload;
        },
        resetNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
            state.isLoading = false;
            state.isConnected = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getNotifications.pending, (state) => {
            state.isLoading = true;
        }).addCase(getNotifications.fulfilled, (state, action) => {
            state.isLoading = false;
            state.notifications = action.payload?.data || [];
            state.unreadCount = action.payload?.unreadCount || 0;
        }).addCase(getNotifications.rejected, (state) => {
            state.isLoading = false;
            state.notifications = [];
            state.unreadCount = 0;
        }).addCase(markNotificationAsRead.fulfilled, (state, action) => {
            const notification = state.notifications.find(n => n._id === action.payload?.data?._id);
            if (notification && !notification.isRead) {
                notification.isRead = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        }).addCase(markAllNotificationsAsRead.fulfilled, (state) => {
            state.notifications.forEach(n => n.isRead = true);
            state.unreadCount = 0;
        });
    }
});

export const { addNotification, setConnectionStatus, resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
