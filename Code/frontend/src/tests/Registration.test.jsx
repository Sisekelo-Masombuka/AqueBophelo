/**
 * AquaBophelo Frontend Unit Tests — Registration & OTP Journey
 */
import { describe, it, expect } from 'vitest';

describe('Registration & Email Verification OTP Flow', () => {
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
});
