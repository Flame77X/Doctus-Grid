import { useState, useEffect, useCallback } from 'react';
import { databases, DATABASE_ID, COLLECTION_ID_CHATS } from '../lib/appwrite';
import { ID, Query } from 'appwrite';

export function useChatPersistence(user) {
    const [messages, setMessages] = useState([]);
    const [loadingChats, setLoadingChats] = useState(false);

    // Load Chats
    const loadChats = useCallback(async (botId) => {
        if (!user || !botId) return;
        setLoadingChats(true);
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID_CHATS,
                [
                    Query.equal('userId', user.$id),
                    Query.equal('botId', botId), // Filter by specific bot/subject
                    Query.orderAsc('timestamp'),
                    Query.limit(100)
                ]
            );
            const loadedMessages = response.documents.map(doc => ({
                id: doc.$id,
                role: doc.role,
                content: doc.message,
                timestamp: new Date(doc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            return loadedMessages; // Return these so caller can set state if needed contextually
        } catch (error) {
            console.error("Failed to load chats:", error);
            // If collection doesn't exist yet, just return empty
            return [];
        } finally {
            setLoadingChats(false);
        }
    }, [user]);

    // Save Chat
    const saveChat = async (message, role, botId) => {
        if (!user || !botId) return;
        try {
            const doc = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID_CHATS,
                ID.unique(),
                {
                    userId: user.$id,
                    botId: botId, // Save the specific bot ID
                    message: message,
                    role: role,
                    timestamp: new Date().toISOString()
                }
            );
            return doc;
        } catch (error) {
            console.error("Failed to save chat:", error);
        }
    };

    return { messages, setMessages, loadChats, saveChat, loadingChats };
}
