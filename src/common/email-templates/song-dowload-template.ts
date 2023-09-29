export const songDownloadTemplate = (songName: string, downloadUrl: string) => `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
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
      background-color: #ff6b6b;
      border: none;
      border-radius: 4px;
      color: #ffffff;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 2px;
    }

    .button:hover {
      filter: brightness(110%);
    }

    #built-on-near {
      width: 250px;
    }
  </style>
</head>

<body>
  <div class="container">
    <img src="https://app.raidar.us/images/berklee-logo.svg" alt="Berklee Logo"/>
    <h1>Your Song Purchase is Complete!</h1>
    <p>Thank you for purchasing the song ${songName}.</p>
    <p>Click the link below to download:</p>
    <a href="${downloadUrl}" class="button">Download Song</a>
    <p>Sincerely,</p>
    <p>The Raidar Team</p>
    <img id="built-on-near" src="https://app.raidar.us/images/built-on-near-black.svg" alt="Built on NEAR Logo" />
  </div>
</body>

</html>
`;
