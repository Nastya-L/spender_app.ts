import * as dotenv from 'dotenv';

dotenv.config();

export const shareJarTemplate = (jarName: string, userName: string): string => {
  const frontendUrl = String(process.env.FRONTEND_URL);

  const emailLogo = `${frontendUrl}/static/media/email-logo.png`;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: "Noto Sans", sans-serif;
        line-height: 1.5;
        color: #000;
        margin: 0;
        padding: 0;
        background-color: #F4F4F4;
      }
      center {
        background-color: #F4F4F4;
        padding: 10px;
      }
      .wrapper {
        max-width: 600px;
        width: 500px;
        margin: 20px auto;
        background-color: #FFFEFE;
        border-radius: 20px;
        padding: 20px;
        text-align: center;
      }
      h2 {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 10px;
        color: #000000B3;
      }
      .title {
        font-size: 18px;
        font-weight: 700;
        margin: 10px 0;
        color: #000000B3
      }
      a {
        color: #000000B3 !important;
        text-decoration: none;
      }
      p {
        color: #000000B3;
        font-size: 16px;
        line-height: 22px;
        margin: 10px 0;
      }
      .link {
        font-size: 18px;
        font-weight: 700;
      }
      .button {
        display: inline-block;
        margin: 20px 0;
        padding: 10px 20px;
        background-color: #76DE37;
        color: #000000B3;
        text-decoration: none;
        font-size: 16px;
        border-radius: 10px;
      }
      .footer {
        margin-top: 20px;
      }
      .desc {
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <center>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table class="wrapper" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="vertical-align: middle; padding-right: 10px;">
                  <a href="${frontendUrl}">
                    <img src=${emailLogo} alt="Logo" width="100"/>
                  </a>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <h2>Jar Invitation</h2>
                  <h3 class="title">Hello</h3>
                  <p>User ${userName} has added you to the Jar "${jarName}".</p>

                  <p>Follow the link to add your expenses
                    <a class="link" href="${frontendUrl}">
                      Spender
                    </a>
                  </p>
                  <div class="footer">
                    <p class="desc">This is an automated message, please do not reply to it.</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
  </html>
  `;
};
