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

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Registration & Email Verification OTP Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('displays error when passwords do not match', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Sisekelo Masombuka/i), { target: { value: 'Nomcebo Zungu' } });
    fireEvent.change(screen.getByPlaceholderText(/resident@example\.co\.za/i), { target: { value: 'nomcebo@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. 082 123 4567/i), { target: { value: '0821234567' } });
    fireEvent.change(screen.getByPlaceholderText(/At least 6 characters/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByPlaceholderText(/Re-type password/i), { target: { value: 'Mismatch999!' } });

    const submitBtn = screen.getByRole('button', { name: /sendVerificationCode/i });
    fireEvent.submit(submitBtn.closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match\. Please re-check\./i)).toBeDefined();
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

  it('displays error when invalid length OTP is submitted in Step 2', async () => {
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
      expect(screen.getByPlaceholderText(/482915/i)).toBeDefined();
    });

    // Enter short 3-digit code
    const otpInput = screen.getByPlaceholderText(/482915/i);
    fireEvent.change(otpInput, { target: { value: '123' } });

    const verifyBtn = screen.getByRole('button', { name: /verifyButton/i });
    fireEvent.submit(verifyBtn.closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/Please enter the 6-digit verification code/i)).toBeDefined();
    });
  });

  it('displays error when OTP verification API fails', async () => {
    api.post
      .mockResolvedValueOnce({ data: { success: true } }) // send-otp
      .mockRejectedValueOnce({ response: { data: { message: 'Invalid or expired verification code.' } } }); // verify-otp

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
      expect(screen.getByPlaceholderText(/482915/i)).toBeDefined();
    });

    const otpInput = screen.getByPlaceholderText(/482915/i);
    fireEvent.change(otpInput, { target: { value: '999999' } });

    const verifyBtn = screen.getByRole('button', { name: /verifyButton/i });
    fireEvent.submit(verifyBtn.closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/Invalid or expired verification code\./i)).toBeDefined();
    });
  });

  it('completes full OTP verification and calls register() with form state', async () => {
    api.post
      .mockResolvedValueOnce({ data: { success: true } }) // send-otp
      .mockResolvedValueOnce({ data: { success: true, verified: true } }); // verify-otp

    mockRegister.mockResolvedValueOnce({ success: true });

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
      expect(screen.getByPlaceholderText(/482915/i)).toBeDefined();
    });

    const otpInput = screen.getByPlaceholderText(/482915/i);
    fireEvent.change(otpInput, { target: { value: '482915' } });

    const verifyBtn = screen.getByRole('button', { name: /verifyButton/i });
    fireEvent.submit(verifyBtn.closest('form'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/v1/auth/verify-otp', {
        email: 'nomcebo@gmail.com',
        code: '482915',
        purpose: 'EmailVerification',
      });
      expect(mockRegister).toHaveBeenCalledWith({
        fullName: 'Nomcebo Zungu',
        email: 'nomcebo@gmail.com',
        phoneNumber: '0821234567',
        area: 'Galeshewe',
        password: 'Secret123!',
        turnstileToken: '',
        otpCode: '482915',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('navigates to /login with state message when registration requires verification', async () => {
    api.post
      .mockResolvedValueOnce({ data: { success: true } })
      .mockResolvedValueOnce({ data: { success: true, verified: true } });

    mockRegister.mockResolvedValueOnce({
      success: true,
      requiresVerification: true,
      message: 'Account created. Please check your email to activate.',
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
      expect(screen.getByPlaceholderText(/482915/i)).toBeDefined();
    });

    const otpInput = screen.getByPlaceholderText(/482915/i);
    fireEvent.change(otpInput, { target: { value: '482915' } });

    const verifyBtn = screen.getByRole('button', { name: /verifyButton/i });
    fireEvent.submit(verifyBtn.closest('form'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login', {
        replace: true,
        state: {
          email: 'nomcebo@gmail.com',
          message: 'Account created. Please check your email to activate.',
        },
      });
    });
  });
});
