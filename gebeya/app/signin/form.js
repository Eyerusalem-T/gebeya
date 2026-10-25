'use client';
import { useActionState, useState } from 'react';
import { signIn, signUp } from '@/lib/actions';

function Fields({ mode, next, onToggle }) {
  const [state, action, pending] = useActionState(mode === 'in' ? signIn : signUp, null);
  return (
    <form action={action} className="card narrow">
      <h1>{mode === 'in' ? 'Welcome back' : 'Create your account'}</h1>
      <input type="hidden" name="next" value={next} />
      {mode === 'up' && <label>Name<input name="name" required minLength={2} autoComplete="name" /></label>}
      <label>Email<input name="email" type="email" required autoComplete="email" /></label>
      <label>Password
        <input name="password" type="password" required minLength={8}
          autoComplete={mode === 'in' ? 'current-password' : 'new-password'} />
      </label>
      {state?.error && <p role="alert" className="err">{state.error}</p>}
      <button className="btn" disabled={pending}>{pending ? 'One moment…' : mode === 'in' ? 'Sign in' : 'Create account'}</button>
      <button type="button" className="ghost" onClick={onToggle}>
        {mode === 'in' ? 'New here? Create an account' : 'Have an account? Sign in'}
      </button>
    </form>
  );
}

export default function AuthForm({ next }) {
  const [mode, setMode] = useState('in');
  return <Fields key={mode} mode={mode} next={next} onToggle={() => setMode(mode === 'in' ? 'up' : 'in')} />;
}
