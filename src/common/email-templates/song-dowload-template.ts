export const songDownloadTemplate = (downloadUrl: string) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Your Song Download Link</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        background-color: #fff;
        border-radius: 8px;
        margin: 20px auto;
        max-width: 600px;
        padding: 20px;
        text-align: center;
      }
      .button {
        background-color: #007bff;
        border: none;
        border-radius: 4px;
        color: white;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Your Song Purchase is Complete!</h1>
      <p>Thank you for purchasing the song.</p>
      <p>Click the link below to download:</p>
      <a href="${downloadUrl}" class="button">Download Song</a>
      <p>Sincerely,</p>
      <p>The Raidar Team</p>
    </div>
  </body>
</html>`;
