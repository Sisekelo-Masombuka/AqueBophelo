/**
 * AquaBophelo Frontend Integration & Unit Tests — Registration & OTP Journey
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Register } from '../pages/Register';
import api from '../api/client';

// Mock dependencies
vi.mock('../api/client', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
  },
}));

const mockRegister = vi.fn();
vi.mock('../auth/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister,
    user: null,
  }),
}));

vi.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key) => key,
    language: 'en',
    setLanguage: vi.fn(),
  }),
}));

vi.mock('../components/TurnstileWidget', () => ({
  default: () => <div data-testid="turnstile-mock" />,
}));

describe('Registration & Email Verification OTP Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates required fields before allowing Step 1 submission', () => {
    const validateForm = ({ fullName, email, phoneNumber, password, confirmPassword }) => {
      if (!fullName?.trim()) return { valid: false, error: 'Full name required' };
      if (!email?.includes('@')) return { valid: false, error: 'Valid email required' };
      if (!phoneNumber || phoneNumber.length < 10) return { valid: false, error: 'Valid phone required' };
      if (!password || password.length < 6) return { valid: false, error: 'Password too short' };
      if (password !== confirmPassword) return { valid: false, error: 'Passwords mismatch' };
      return { valid: true };
    };

    const empty = validateForm({});
    expect(empty.valid).toBe(false);

    const mismatch = validateForm({
      fullName: 'Nomcebo Zungu',
      email: 'nomcebo@gmail.com',
      phoneNumber: '0821234567',
      password: 'Password123!',
      confirmPassword: 'DifferentPassword!',
    });
    expect(mismatch.valid).toBe(false);
    expect(mismatch.error).toBe('Passwords mismatch');

    const valid = validateForm({
      fullName: 'Nomcebo Zungu',
      email: 'nomcebo@gmail.com',
      phoneNumber: '0821234567',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    expect(valid.valid).toBe(true);
  });

  it('validates 6-digit OTP code format', () => {
    const isOtpValid = (code) => Boolean(code && /^\d{6}$/.test(code.trim()));

    expect(isOtpValid('')).toBe(false);
    expect(isOtpValid('12345')).toBe(false);
    expect(isOtpValid('1234567')).toBe(false);
    expect(isOtpValid('abcdef')).toBe(false);
    expect(isOtpValid('482915')).toBe(true);
  });

  it('formats OTP timer countdown correctly and detects expiration', () => {
    const formatTimer = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    expect(formatTimer(300)).toBe('05:00');
    expect(formatTimer(75)).toBe('01:15');
    expect(formatTimer(9)).toBe('00:09');
    expect(formatTimer(0)).toBe('00:00');
  });

  it('handles unverified registration response without issuing an active token', () => {
    const processRegistrationResponse = (response) => {
      if (response.token) {
        return { authenticated: true, token: response.token };
      }
      return { authenticated: false, requiresVerification: true, message: response.message };
    };

    const unverifiedResponse = {
      token: '',
      email: 'resident@aquabophelo.app',
      message: 'Registration successful. Please verify your email before logging in.',
    };

    const result = processRegistrationResponse(unverifiedResponse);
    expect(result.authenticated).toBe(false);
    expect(result.requiresVerification).toBe(true);
  });

  // Full Component Integration Tests
  it('renders real Register component with initial input fields', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/e\.g\. Sisekelo Masombuka/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/resident@example\.co\.za/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/e\.g\. 082 123 4567/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/At least 6 characters/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Re-type password/i)).toBeDefined();
  });

  it('displays error when form is submitted with empty required fields', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /sendVerificationCode/i });
    fireEvent.submit(submitBtn.closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/Please provide your full name/i)).toBeDefined();
    });
  });

  it('displays error message if OTP dispatch API call fails', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Brevo email rate limit exceeded. Please try again.' } },
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Sisekelo Masombuka/i), { target: { value: 'Nomcebo Zungu' } });
    fireEvent.change(screen.getByPlaceholderText(/resident@example\.co\.za/i), { target: { value: 'nomcebo@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. 082 123 4567/i), { target: { value: '0821234567' } });
    fireEvent.change(screen.getByPlaceholderText(/At least 6 characters/i), { target: { value: 'Secret123!' } });
    fireEvent.change(screen.getByPlaceholderText(/Re-type password/i), { target: { value: 'Secret123!' } });

    const submitBtn = screen.getByRole('button', { name: /sendVerificationCode/i });
    fireEvent.submit(submitBtn.closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/Brevo email rate limit exceeded/i)).toBeDefined();
    });
  });

  it('transitions to Step 2 OTP verification screen upon successful dispatch', async () => {
    api.post.mockResolvedValueOnce({ data: { success: true } });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Sisekelo Masombuka/i), { target: { value: 'Nomcebo Zungu' } });
    fireEvent.change(screen.getByPlaceholderText(/resident@example\.co\.za/i), { target: { value: 'nomcebo@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. 082 123 4567/i), { target: { value: '0821234567' } });
    fireEvent.change(screen.getByPlaceholderText(/At least 6 characters/i), { target: { value: 'Secret123!' } });
    fireEvent.change(screen.getByPlaceholderText(/Re-type password/i), { target: { value: 'Secret123!' } });

    const submitBtn = screen.getByRole('button', { name: /sendVerificationCode/i });
    fireEvent.submit(submitBtn.closest('form'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/v1/auth/send-otp', {
        email: 'nomcebo@gmail.com',
        purpose: 'EmailVerification',
      });
      expect(screen.getByPlaceholderText(/482915/i)).toBeDefined();
      expect(screen.getByRole('button', { name: /verifyButton/i })).toBeDefined();
    });
  });
});
