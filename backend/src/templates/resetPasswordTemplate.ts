import { baseEmailTemplate } from './baseEmailTemplate.js';

export const resetPasswordTemplate = (resetURL: string): string => {
  const content = `
    <h2>Password reset</h2>
    <h3 class="title">Hello</h3>
    <p>You requested a password reset for your account.</p>
    <a href="${resetURL}" class="button">Reset password</a>
    <p>If you didn’t request this — please ignore this email.</p>
  `;

  return baseEmailTemplate(content);
};
