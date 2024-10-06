const createAccountEmail = (fullName, email, password) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Creation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333;
            }
            p {
                color: #555;
            }
            .credentials {
                background-color: #e9ecef;
                padding: 10px;
                border-radius: 4px;
                margin: 10px 0;
            }
            .footer {
                margin-top: 20px;
                font-size: 0.9em;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to Our Voting App Verdictium, ${fullName}!</h1>
            <p>Thank you for registering with us! Your login credentials are as follows:</p>
            <div class="credentials">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
            </div>
            <p>We're excited to have you on board. If you have any questions or need assistance, please don't hesitate to contact us.</p>
            <div class="footer">
                <p>Best regards,</p>
                <p>Verdictium Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
};


const createVoterCredentialsEmail = (electionTitle, startTime, endTime, electionId, email, password) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Election Invitation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: auto;
        }
        h1 {
            color: #333;
            text-align: center;
        }
        p {
            color: #555;
            line-height: 1.5;
        }
        .credentials {
            background-color: #e9ecef;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
            text-align: center;
        }
        a.button {
            display: inline-block;
            background-color: #007BFF;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <p>Dear Voter,</p>
        <p>We are excited to invite you to participate in the upcoming election for <strong>${electionTitle}</strong>. Your voice matters, and your vote is crucial for shaping the future!</p>

        <h2>Election Details:</h2>
        <p><strong>Start Date:</strong> ${startTime}</p>
        <p><strong>End Date:</strong> ${endTime}</p>

        <h2>Your Voting Credentials:</h2>
        <div class="credentials">
            <p><strong>Election ID:</strong> ${electionId}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
        </div>

        <p>To cast your vote, please log in to the voting platform using your credentials and follow the instructions provided.</p>

        <a href="https://verdictium.vercel.app/voter/login" class="button">Vote Now</a>

        <p>Important: Please keep your login credentials secure and do not share them with anyone.</p>

        <p>Thank you for taking the time to participate in this important democratic process. Your vote can make a difference!</p>

        <div class="footer">
            <p>Best Regards, Verdictium</p>
        </div>
    </div>
</body>
</html>
`;
};

const createElectionResultsEmail = (electionTitle, results, electionId) => {
    const resultList = results.map(res => `
        <li><strong>${res.candidate}</strong>: ${res.votes} votes</li>
    `).join('');

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Election Results</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f0f4f8;
                margin: 0;
                padding: 20px;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: auto;
                border-top: 5px solid #3f51b5; /* Deep Blue color */
            }
            h1 {
                color: #3f51b5; /* Deep Blue color */
                text-align: center;
                margin-bottom: 20px;
            }
            p {
                color: #555;
                line-height: 1.6;
            }
            .results {
                margin: 20px 0;
                padding: 0;
                list-style-type: none;
            }
            .results li {
                margin: 10px 0;
                padding: 12px;
                background-color: #e3f2fd; /* Light Blue */
                border-radius: 5px;
                border-left: 5px solid #3f51b5; /* Deep Blue */
            }
            .footer {
                margin-top: 20px;
                font-size: 0.9em;
                color: #777;
                text-align: center;
            }
            .thank-you {
                font-weight: bold;
                color: #3f51b5; /* Deep Blue */
                margin: 15px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Election Results for "${electionTitle}"</h1>
            <p class="thank-you">Thank you for participating in the election!</p>
            <p>Here are the final results:</p>
            <ul class="results">
                ${resultList}
            </ul>
            <p>Election ID: <strong>${electionId}</strong></p>
            <p>Your participation is important, and we appreciate your involvement in the democratic process.</p>
            <div class="footer">
                <p>Best Regards,</p>
                <p>Verdictium Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
};


export { createAccountEmail, createVoterCredentialsEmail, createElectionResultsEmail };
