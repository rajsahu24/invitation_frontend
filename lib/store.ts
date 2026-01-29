import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RSVPStatus = "going" | "maybe" | "no" | null;

export interface SubEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity?: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  reactions: Record<string, number>;
}

export interface Guest {
  id: string;
  name: string;
  avatar?: string;
  status: RSVPStatus;
  isMutual?: boolean;
}

interface EventStore {
  // Sub-event RSVPs
  subEvents: SubEvent[];
  rsvpStatus: Record<string, RSVPStatus>;
  setRSVP: (eventId: string, status: RSVPStatus) => void;

  // Comments
  comments: Comment[];
  addComment: (comment: Omit<Comment, "id" | "timestamp" | "reactions">) => void;
  addReaction: (commentId: string, emoji: string) => void;

  // Photo lightbox
  selectedPhoto: string | null;
  setSelectedPhoto: (photo: string | null) => void;

  // UI state
  activeTab: "itinerary" | "feed" | "photos";
  setActiveTab: (tab: "itinerary" | "feed" | "photos") => void;
}



export interface HostUser {
  id: string;
  name: string;
  email: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
}

export interface HostInvitation {
  id: string;
  title: string;
  slug: string;
  hostName: string;
  createdAt: string;
  events: HostEvent[];
}

export interface HostEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  capacity: string;
  guestsCount: number;
}

interface HostState {
  user: HostUser | null;
  invitations: HostInvitation[];
  currentInvitationId: string | null;
  selectedTemplate: Template | null;

  // Actions
  login: (userData: { id: string; name: string; email: string }) => void;
  signup: (userData: { id: string; name: string; email: string; phone: string }) => void;
  logout: () => Promise<void>;
  createInvitation: (invitation: Omit<HostInvitation, 'events'>) => void;
  setCurrentInvitation: (id: string | null) => void;
  addEventToInvitation: (invitationId: string, event: HostEvent) => void;
  updateInvitation: (invitation: HostInvitation) => void;
  setSelectedTemplate: (template: Template | null) => void;
}

export const useHostStore = create<HostState>()(
  persist(
    (set) => ({
      user: null,
      invitations: [],
      currentInvitationId: null,
      selectedTemplate: null,

      login: (userData) => set({
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email
        }
      }),

      signup: (userData) => set({
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email
        }
      }),

      logout: async () => {
        try {
          await fetch(`/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
          });
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ user: null, currentInvitationId: null });
        }
      },

      createInvitation: (invitation) => set((state) => ({
        invitations: [...state.invitations, { ...invitation, events: [] }],
        currentInvitationId: invitation.id
      })),

      setCurrentInvitation: (id) => set({ currentInvitationId: id }),

      addEventToInvitation: (invitationId, event) => set((state) => ({
        invitations: state.invitations.map((inv) =>
          inv.id === invitationId
            ? { ...inv, events: [...inv.events, event] }
            : inv
        )
      })),

      updateInvitation: (invitation) => set((state) => {
        console.log(invitation)
        const existingIndex = state.invitations.findIndex(inv => inv.id === invitation.id);
        if (existingIndex >= 0) {
          const updatedInvitations = [...state.invitations];
          updatedInvitations[existingIndex] = invitation;
          return { invitations: updatedInvitations };
        } else {
          return { invitations: [...state.invitations, invitation] };
        }
      }),

      setSelectedTemplate: (template) => set({ selectedTemplate: template }),
    }),
    {
      name: 'host-storage-v3',
    }
  )
);
