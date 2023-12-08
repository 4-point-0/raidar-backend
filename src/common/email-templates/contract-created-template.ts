import { Role } from '../enums/enum';

export const contractCreatedTemplate = (
  role: Role.Artist | Role.User,
  songName: string,
  contractLink: string,
) => `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  <title>Contract Notification</title>
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

    #built-on-near {
      width: 250px;
    }
  </style>
</head>

<body>
  <div class="container">
    <img src="https://raidar-platform-images.s3.eu-central-1.amazonaws.com/berklee-logo.png" alt="Berklee Logo" />
    <h1>Contract ${
      role === 'artist' ? 'Created' : 'Available'
    } for Your Song!</h1>
    <p>
      ${
        role === 'artist'
          ? `A written agreement has been created for your song "${songName}".`
          : `A written agreement for the song "${songName}" is available for you.`
      }
    </p>
    <p>Contract Link: <a href="${contractLink}">${contractLink}</a></p>
    <p>Sincerely,</p>
    <p>The Raidar Team</p>
    <img id="built-on-near" src="https://raidar-platform-images.s3.eu-central-1.amazonaws.com/built-on-near-black.png" alt="Built on NEAR Logo" />
  </div>
</body>

</html>
`;
