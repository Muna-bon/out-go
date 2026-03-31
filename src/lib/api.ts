import { supabase } from "./supabase";

/**
 * Events API
 */

export const getEvents = async () => {
    const { data, error } = await supabase
        .from("events")
        .select("*, created_by(*)")
        .order("date", { ascending: true });

    if (error) throw error;
    return data;
};

export const getEventById = async (id: string) => {
    const { data, error } = await supabase
        .from("events")
        .select("*, created_by(*)")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data;
};

export const createEvent = async (eventData: any) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Must be logged in to create an event");

    const { data, error } = await supabase
        .from("events")
        .insert([
            {
                ...eventData,
                created_by: userData.user.id,
            }
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateEvent = async (id: string, eventData: any) => {
    const { data, error } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw error;
};

/**
 * User Activities / Joined Events
 */

export const joinEvent = async (eventId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Must be logged in to join");

    const { data, error } = await supabase
        .from("user_events")
        .insert([
            {
                user_id: userData.user.id,
                event_id: eventId,
            }
        ]);

    if (error) throw error;

    // Increment registered counter
    await supabase.rpc('increment_event_registered', { row_id: eventId });

    return data;
};

export const leaveEvent = async (eventId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Must be logged in to leave");

    const { data, error } = await supabase
        .from("user_events")
        .delete()
        .match({ user_id: userData.user.id, event_id: eventId });

    if (error) throw error;

    // Decrement registered counter
    await supabase.rpc('decrement_event_registered', { row_id: eventId });

    return data;
};

export const getMyJoinedEvents = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];

    const { data, error } = await supabase
        .from("user_events")
        .select("*, events(*, created_by(*))")
        .eq("user_id", userData.user.id);

    if (error) throw error;
    // filter out null events due to RLS or missing
    return data.map((ue: any) => ue.events).filter(Boolean);
};

export const getMyCreatedEvents = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];

    const { data, error } = await supabase
        .from("events")
        .select("*, created_by(*)")
        .eq("created_by", userData.user.id);

    if (error) throw error;
    return data;
};

export const getPartners = async () => {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("updated_at", { ascending: false });

    if (error) throw error;
    return data;
};

export const updateProfile = async (profileData: any) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Must be logged in to update profile");

    const { data, error } = await supabase
        .from("profiles")
        .update({
            ...profileData,
            updated_at: new Date().toISOString(),
        })
        .eq("id", userData.user.id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteAccount = async () => {
    const { error } = await supabase.rpc('delete_user');
    if (error) throw error;
    await supabase.auth.signOut();
};

export const getMyNotifications = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];

    const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
};

export const markNotificationsAsRead = async (ids?: string[]) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    let query = supabase.from("notifications").update({ read: true }).eq("user_id", userData.user.id);

    if (ids && ids.length > 0) {
        query = query.in("id", ids);
    }

    const { error } = await query;
    if (error) throw error;
};

export const sendPairingRequest = async (receiverId: string, message: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Must be logged in to send a request.");

    const { data, error } = await supabase
        .from("pairing_requests")
        .insert([{ sender_id: userData.user.id, receiver_id: receiverId, message }]);

    if (error) throw error;
    return data;
};

export const getIncomingPairingRequests = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];

    const { data, error } = await supabase
        .from("pairing_requests")
        .select(`
            *,
            sender:sender_id (id, name, age, location, activity_type, pace, preferred_time, avatar_url, bio, interests, rating, completed_pairings)
        `)
        .eq("receiver_id", userData.user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
};

export const processPairingRequest = async (requestId: string, status: "accepted" | "rejected") => {
    const { data, error } = await supabase
        .from("pairing_requests")
        .update({ status })
        .eq("id", requestId);

    if (error) throw error;
    return data;
};

export const uploadAvatar = async (file: File) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Must be logged in to upload avatar");

    const fileExt = file.name.split(".").pop();
    const filePath = `${userData.user.id}/avatar.${fileExt}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

    // Save URL to profile
    const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: urlData.publicUrl })
        .eq("id", userData.user.id);

    if (updateError) throw updateError;

    return urlData.publicUrl;
};

/**
 * Vendors API
 */

export const getVendors = async () => {
    const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
};

export const getVendorById = async (id: string) => {
    const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data;
};

export const getMyVendor = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Must be logged in");

    const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("owner_id", userData.user.id)
        .maybeSingle();

    if (error) throw error;
    return data;
};

export const createVendor = async (vendorData: any) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Must be logged in to register a business");

    const { data, error } = await supabase
        .from("vendors")
        .insert({
            ...vendorData,
            owner_id: userData.user.id,
            status: "pending",
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateVendor = async (id: string, vendorData: any) => {
    const { data, error } = await supabase
        .from("vendors")
        .update(vendorData)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteVendor = async (id: string) => {
    const { error } = await supabase
        .from("vendors")
        .delete()
        .eq("id", id);

    if (error) throw error;
};

