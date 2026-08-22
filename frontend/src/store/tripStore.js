import { create } from "zustand";
import api from "../lib/api";

const useTripStore = create((set, get) => ({
  trips: [],
  currentTrip: null,
  loading: false,
  error: null,

  // ── Trip CRUD ────────────────────────────────────────────
  fetchTrips: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.get("/trips");
      set({ trips: Array.isArray(data) ? data : [], loading: false });
    } catch (err) {
      console.error("fetchTrips failed:", err);
      set({ error: err.message || "Failed to load trips", loading: false });
    }
  },

  fetchTrip: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await api.get(`/trips/${id}`);
      set({ currentTrip: data, loading: false });
      return data;
    } catch (err) {
      console.error(`fetchTrip ${id} failed:`, err);
      set({ error: err.message || "Failed to load trip details", loading: false });
      throw err;
    }
  },

  createTrip: async (tripData) => {
    set({ loading: true, error: null });
    try {
      const newTrip = await api.post("/trips", tripData);
      set((state) => ({
        trips: [newTrip, ...state.trips],
        currentTrip: newTrip,
        loading: false,
      }));
      return newTrip;
    } catch (err) {
      console.error("createTrip failed:", err);
      set({ error: err.message || "Failed to create trip", loading: false });
      throw err;
    }
  },

  updateTrip: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await api.put(`/trips/${id}`, data);
      set((state) => ({
        trips: state.trips.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        currentTrip: state.currentTrip?.id === id ? { ...state.currentTrip, ...updated } : state.currentTrip,
        loading: false,
      }));
      return updated;
    } catch (err) {
      console.error(`updateTrip ${id} failed:`, err);
      set({ error: err.message || "Failed to update trip", loading: false });
      throw err;
    }
  },

  deleteTrip: async (id) => {
    try {
      await api.delete(`/trips/${id}`);
      set((state) => ({
        trips: state.trips.filter((t) => t.id !== id),
        currentTrip: state.currentTrip?.id === id ? null : state.currentTrip,
      }));
    } catch (err) {
      console.error(`deleteTrip ${id} failed:`, err);
      set({ error: err.message || "Failed to delete trip" });
      throw err;
    }
  },

  // ── Stop CRUD ────────────────────────────────────────────
  addStop: async (tripId, data) => {
    try {
      const stop = await api.post(`/trips/${tripId}/stops`, data);
      await get().fetchTrip(tripId);
      return stop;
    } catch (err) {
      console.error(`addStop for trip ${tripId} failed:`, err);
      throw err;
    }
  },

  updateStop: async (stopId, data) => {
    try {
      const updated = await api.put(`/stops/${stopId}`, data);
      const currentTripId = get().currentTrip?.id;
      if (currentTripId) await get().fetchTrip(currentTripId);
      return updated;
    } catch (err) {
      console.error(`updateStop ${stopId} failed:`, err);
      throw err;
    }
  },

  deleteStop: async (stopId) => {
    try {
      await api.delete(`/stops/${stopId}`);
      const currentTripId = get().currentTrip?.id;
      if (currentTripId) await get().fetchTrip(currentTripId);
    } catch (err) {
      console.error(`deleteStop ${stopId} failed:`, err);
      throw err;
    }
  },

  reorderStops: async (tripId, stopIds) => {
    try {
      await api.put(`/trips/${tripId}/stops/reorder`, { stopIds });
      await get().fetchTrip(tripId);
    } catch (err) {
      console.error(`reorderStops for trip ${tripId} failed:`, err);
      throw err;
    }
  },

  // ── Activity CRUD ────────────────────────────────────────
  addActivity: async (stopId, data) => {
    try {
      const activity = await api.post(`/stops/${stopId}/activities`, data);
      const currentTripId = get().currentTrip?.id;
      if (currentTripId) await get().fetchTrip(currentTripId);
      return activity;
    } catch (err) {
      console.error(`addActivity for stop ${stopId} failed:`, err);
      throw err;
    }
  },

  updateActivity: async (activityId, data) => {
    try {
      const updated = await api.put(`/activities/${activityId}`, data);
      const currentTripId = get().currentTrip?.id;
      if (currentTripId) await get().fetchTrip(currentTripId);
      return updated;
    } catch (err) {
      console.error(`updateActivity ${activityId} failed:`, err);
      throw err;
    }
  },

  deleteActivity: async (activityId) => {
    try {
      await api.delete(`/activities/${activityId}`);
      const currentTripId = get().currentTrip?.id;
      if (currentTripId) await get().fetchTrip(currentTripId);
    } catch (err) {
      console.error(`deleteActivity ${activityId} failed:`, err);
      throw err;
    }
  },

  reorderActivities: async (stopId, activityIds) => {
    try {
      await api.put(`/stops/${stopId}/activities/reorder`, { activityIds });
      const currentTripId = get().currentTrip?.id;
      if (currentTripId) await get().fetchTrip(currentTripId);
    } catch (err) {
      console.error(`reorderActivities for stop ${stopId} failed:`, err);
      throw err;
    }
  },

  clearCurrentTrip: () => set({ currentTrip: null }),
}));

export default useTripStore;
