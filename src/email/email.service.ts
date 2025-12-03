import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, text: string) {
    const emailTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .container {
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #f9f9f9;
                }
                .header {
                    font-size: 24px;
                    margin-bottom: 20px;
                }
                .content {
                    font-size: 18px;
                    margin-bottom: 20px;
                }
                .footer {
                    font-size: 16px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="http://localhost:8000/api/campaigns" width="1" height="1" style="display:none;" />
                <a href="http://localhost:8000/api/click-stats/track/{{campaignId}}?link=https%3A%2F%2Fyoutube.com" target="_blank">
                    Watch Video
                </a>

                <div class="header">
                    <h2>${subject}</h2><br>
                    New Info From NewsLetter !!!
                </div>
                <div class="content">
                    <strong>${text}</strong>
                </div>
                <div class="footer">
                    Thank you,<br>
                    Team NewsLetter
                </div>
            </div>
        </body>
        </html>
        `;
    await this.mailerService.sendMail({
      to,
      subject,
      html: emailTemplate,
    });
  }
}
