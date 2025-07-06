
const emailTemplateHtml=(code:number)=>{
    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Verification Code - Grow With AI</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          background-color: #f5f7fa;
          margin: 0;
          padding: 0;
        }
        .email-wrapper {
          width: 100%;
          padding: 40px 0;
          display: flex;
          justify-content: center;
        }
        .email-content {
          max-width: 600px;
          background-color: #ffffff;
          border-radius: 10px;
          padding: 40px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          text-align: center;
        }
        h1 {
          font-size: 26px;
          color: #333333;
          margin-bottom: 20px;
        }
        .code {
          font-size: 36px;
          font-weight: bold;
          color: #2d88ff;
          background-color: #f0f4ff;
          padding: 20px 30px;
          display: inline-block;
          border-radius: 8px;
          letter-spacing: 4px;
          margin-bottom: 30px;
        }
        p {
          font-size: 16px;
          color: #555555;
        }
        .footer {
          margin-top: 40px;
          font-size: 12px;
          color: #aaaaaa;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-content">
          <h1>Your Verification Code</h1>
          <div class="code">${code}</div>
          <p>This code will expire in 10 minutes. Please don’t share it with anyone.</p>
          <div class="footer">
            &copy; 2025 YourApp. All rights reserved.
          </div>
        </div>
      </div>
    </body>
    </html>`;
}

export {emailTemplateHtml};