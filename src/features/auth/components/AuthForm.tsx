import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../../../contexts/ToastContext';

export const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendMagicLink } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      showToast('Please add your email first.', 'error');
      return;
    }

    setLoading(true);

    try {
      await sendMagicLink(email);
      showToast('Magic link sent! Check your inbox.', 'success');
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong. Please try again.';

      console.error('Auth error:', error);

      if (error && typeof error === 'object') {
        const errorObj = error as { status?: number; message?: string };
        const status = errorObj.status ? Number(errorObj.status) : null;
        const message = errorObj.message ? String(errorObj.message) : '';

        if (
          status === 429 ||
          message.includes('429') ||
          message.includes('Too Many Requests')
        ) {
          errorMessage =
            'Too many requests. Please wait a few minutes before trying again.';
        } else if (
          message.includes('Email rate limit exceeded') ||
          message.includes('rate limit')
        ) {
          errorMessage =
            'Too many emails sent. Please wait a few minutes before requesting another magic link.';
        } else if (
          message.includes('Invalid email') ||
          (message.includes('email') && message.includes('invalid'))
        ) {
          errorMessage = 'Please enter a valid email address.';
        } else if (message && message.trim()) {
          errorMessage = message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }

      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="email">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="mt-2"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending magic link…
          </span>
        ) : (
          'Email me a magic link'
        )}
      </Button>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-center text-sm text-slate-600">
          <span className="font-medium">No password needed.</span> We'll email you a
          secure link to sign in instantly.
        </p>
      </div>
    </form>
  );
};
