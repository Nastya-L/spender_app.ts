import * as dotenv from 'dotenv';
import { baseEmailTemplate } from './baseEmailTemplate.js';

dotenv.config();

export const shareJarTemplate = (jarName: string, userName: string): string => {
  const frontendUrl = String(process.env.FRONTEND_URL);

  const content = `
    <h2>Jar Invitation</h2>
    <h3 class="title">Hello</h3>
    <p>User ${userName} has added you to the Jar "${jarName}".</p>
    <p>Follow the link to add your expenses
      <a class="link" href="${frontendUrl}">
        Spender
      </a>
    </p>
  `;

  return baseEmailTemplate(content);
};
