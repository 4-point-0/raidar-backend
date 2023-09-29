export const songBoughtTemplate = (songName: string) => `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  <title>Song Sold Notification</title>
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
    <img src="https://app.raidar.us/images/berklee-logo.svg" alt="Berklee Logo" />
    <h1>Congratulations, Your Song Was Bought!</h1>
    <p>Your song "${songName}" has been purchased!</p>
    <p>Sincerely,</p>
    <p>The Raidar Team</p>
    <img id="built-on-near" src="https://app.raidar.us/images/built-on-near-black.svg" alt="Built on NEAR Logo" />
  </div>
</body>

</html>
`;
