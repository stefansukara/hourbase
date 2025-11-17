import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          throw error;
        }
        setMessage('Check your dashboard tab.');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) {
          throw error;
        }
        setMessage('Check your inbox to confirm your email.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setMessage('Please add your email first.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) {
        throw error;
      }
      setMessage('Magic link sent! Check your inbox.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <Input
          id="password"
          type="password"
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="mt-1"
        />
      </div>

      <div className="space-y-2">
        <Button type="submit" disabled={loading} className="w-full">
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={handleMagicLink}
          disabled={loading}
        >
          Send magic link
        </Button>
      </div>

      <p className="text-center text-sm text-slate-500">
        {mode === 'signin' ? 'Need an account?' : 'Already registered?'}{' '}
        <button
          type="button"
          className="font-semibold text-slate-900 underline"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
        >
          {mode === 'signin' ? 'Sign up' : 'Sign in'}
        </button>
      </p>

      {message ? <p className="text-center text-sm text-rose-600">{message}</p> : null}
    </form>
  );
};
