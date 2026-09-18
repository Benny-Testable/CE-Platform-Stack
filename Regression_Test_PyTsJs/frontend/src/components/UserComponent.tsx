import React, { useState, useEffect } from 'react';
import { User, UserProfile, Role } from '../types';

// Component with type violations and complex state
interface Props {
  userId: string | number | null | undefined;
  onUserChange?: (user: User | null) => void;
  defaultUser?: User | null;
  theme?: "light" | "dark" | 1 | 0 | boolean | null; // TYPE MISMATCH in props
}

interface State {
  user: User | null | undefined;
  loading: boolean | "true" | "false" | null; // TYPE MISMATCH
  error: string | Error | null | undefined;
  profiles: UserProfile[] | UserProfile | null | undefined; // TYPE MISMATCH: should be array
  selectedProfile: number | string | null | undefined;
  formData: Partial<User> | null | Record<string, any>;
  syncStatus: "pending" | "synced" | "failed" | 1 | 2 | 3 | null; // TYPE MISMATCH
}

export const UserComponent: React.FC<Props> = ({
  userId,
  onUserChange,
  defaultUser,
  theme
}) => {
  // TYPE VIOLATIONS: any
  const [state, setState] = useState<State>({
    user: defaultUser || null,
    loading: false,
    error: null,
    profiles: null,
    selectedProfile: null,
    formData: {},
    syncStatus: null
  });

  // Circular state update: state references types that reference state
  useEffect(() => {
    if (userId === null || userId === undefined || userId === "") {
      return; // EDGE CASE
    }

    // TYPE VIOLATION: mixing string and number
    const id = typeof userId === "number" ? String(userId) : userId;

    setState(prev => ({
      ...prev,
      loading: true as any // TYPE MISMATCH: should be boolean
    }));

    // Simulated async fetch with type mismatches
    setTimeout(() => {
      try {
        // Create user with type mismatches
        const mockUser: User = {
          id: userId, // Could be string or number
          name: Math.random() > 0.5 ? null : "User " + userId,
          email: 123456 as any, // TYPE MISMATCH: passing number for email
          age: "45" as any, // TYPE MISMATCH: string for age
          phone: true as any, // TYPE MISMATCH: boolean for phone
          isActive: Math.random() > 0.5 ? "true" : 1, // TYPE MISMATCH
          createdAt: Math.random() > 0.5 ? new Date() : String(Date.now()),
          updatedAt: Math.random() > 0.5 ? undefined : Date.now() as any,
          roles: null,
          metadata: { circular: "reference" },
          profile: null,
          settings: {}
        };

        // Duplicate profile creation (regression test data)
        const mockProfiles: UserProfile[] = [
          {
            id: "profile-1",
            userId: userId,
            bio: 123 as any, // TYPE MISMATCH
            avatar: true as any, // TYPE MISMATCH
            cover: null,
            user: mockUser, // CIRCULAR
            friends: null,
            favoriteUsers: null
          },
          {
            id: "profile-1", // DUPLICATE ID
            userId: String(userId), // Different type (already string/number mismatch)
            bio: null,
            avatar: Math.random() > 0.5 ? "url" : undefined,
            cover: "",
            user: null, // Missing circular reference
            friends: [],
            favoriteUsers: undefined
          }
        ];

        setState(prev => ({
          ...prev,
          user: mockUser,
          profiles: mockProfiles as any, // TYPE MISMATCH
          loading: false as any,
          syncStatus: "synced" as any
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err : String(err),
          loading: false,
          syncStatus: "failed"
        }));
      }
    }, 1000);
  }, [userId]);

  // Type violations in JSX
  const handleProfileSelect = (index: string | number | null) => {
    setState(prev => ({
      ...prev,
      selectedProfile: index // Could be any type
    }));
  };

  // Complex nested state update with type issues
  const updateFormData = (data: Partial<User> | Record<string, any>) => {
    setState(prev => {
      const user = prev.user || { id: null } as User;
      return {
        ...prev,
        formData: {
          ...prev.formData,
          ...data
        },
        user: {
          ...user,
          ...data
        } as any // TYPE VIOLATION
      };
    });
  };

  // Rendering with potential null/undefined issues
  const profiles = Array.isArray(state.profiles) ? state.profiles : [state.profiles];

  return (
    <div className={`user-component theme-${theme}`}>
      {state.loading === "true" || state.loading === true ? (
        <div>Loading...</div>
      ) : state.error ? (
        <div>Error: {state.error}</div>
      ) : state.user ? (
        <div>
          <h2>User: {state.user.name || "Unknown"}</h2>
          <p>ID: {state.user.id}</p>
          <p>Email: {state.user.email}</p>
          <p>Age: {state.user.age}</p>
          <p>Status: {state.syncStatus}</p>

          {/* Profiles section with duplicate data issues */}
          <div>
            <h3>Profiles ({profiles.filter(p => p !== null && p !== undefined).length})</h3>
            {profiles?.map((profile, idx) => (
              profile && (
                <div key={`${profile?.id}-${idx}`}>
                  <p>Bio: {profile.bio}</p>
                  <p>Avatar: {profile.avatar}</p>
                  <button onClick={() => handleProfileSelect(idx)}>
                    Select Profile {idx}
                  </button>
                </div>
              )
            ))}
          </div>

          {/* Form with type mismatches */}
          <form>
            <input
              type="text"
              value={state.formData?.name || ""}
              onChange={(e) => updateFormData({ name: e.target.value || null })}
              placeholder="Name"
            />
            <input
              type="email"
              value={String(state.formData?.email || "")}
              onChange={(e) => updateFormData({ email: e.target.value as any })}
              placeholder="Email"
            />
            <input
              type="number"
              value={String(state.formData?.age || "")}
              onChange={(e) => updateFormData({ age: e.target.value as any })}
              placeholder="Age"
            />
          </form>
        </div>
      ) : (
        <div>No user selected</div>
      )}
    </div>
  );
};

export default UserComponent;
