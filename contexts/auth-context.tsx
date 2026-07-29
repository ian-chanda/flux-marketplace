import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session, User } from "@supabase/supabase-js";
import { router } from "expo-router";
import { createContext, PropsWithChildren, use, useContext, useEffect, useState } from "react";


const AuthContext = createContext<{
  user: User | null
  hasSeenOnboard: boolean;
  markHasSeenOnboard: ()=>void;
  signIn: ({ email, password }: { email: string, password: string }) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  session?: Session | null;
  isLoading: boolean;
}>({
  user: null,
  hasSeenOnboard: false,
  markHasSeenOnboard: ()=>{},
  signOut: () => Promise.resolve(),
  signIn: () => Promise.resolve(false),
  signUp: (email: string, password: string) => Promise.resolve(),
  session: null,
  isLoading: false,
});

// hook to access user info
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasSeenOnboard, setHasSeenOnboard] = useState(true)

  const markHasSeenOnboard = () => {
    setHasSeenOnboard(true);
  }

  useEffect(() => {
    // '!!' converts a value to a boolean apparently
    const getItem = async () => {
      await AsyncStorage.getItem("seen_onboard").then(val => { setHasSeenOnboard(!!val) });

    }
    getItem();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    });

    //listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut();
  }

  const signIn = async ({ email, password }: { email: string, password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    })

    if (error) throw error

    return data?.session.user.user_metadata.isOnboard
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          isOnboard: false,
          isManager: false
        }
      }
    })

    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, hasSeenOnboard, markHasSeenOnboard, signOut, signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
