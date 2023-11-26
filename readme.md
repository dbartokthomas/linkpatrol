# Link Patrol

Linkpatrol will take a bunch of different app providers and then check your credentials against them to see if your URL has changed

## Environment Variables

The following table lists the environment variables used in this project:

| Variable Name           | Description                                              | Example          |
| ----------------------- | -------------------------------------------------------- | ---------------- |
| `TELEGRAM_BOT_TOKEN`    | The token for the Telegram bot.                          |                  |
| `TELEGRAM_CHAT_ID`      | The ID of the Telegram chat.                             |                  |
| `PUSHOVER_APP_TOKEN`    | The token for the Pushover application.                  |                  |
| `PUSHOVER_USER_KEY`     | The user key for Pushover.                               |                  |
| `SEND_ALERT_ON_STARTUP` | Whether to send an alert on startup (`true` or `false`). | `true`           |
| `CRON_SCHEDULE`         | The schedule for the cron job (in cron format).          | `*/30 * * * * *` |
| `LOG_LEVEL`             | The level of logging (`debug`, `info`, `warn`, `error`). | `debug`          |

Please replace the values with your actual data.

## Installation

Follow these steps to install the project:

1. Clone the repository:

```bash
git clone https://github.com/username/repository.git
```

2. Navigate into the project directory:

```bash
cd repository
```

3. Install the dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory of the project, and fill it with your environment variables. Refer to the Environment Variables section for more details.

5. Create a `config/config.json` file based on the `config/config.json.example` file. Refer to the Configuration section for more details.

6. Run the project:

## Configuration

This project uses a `config/config.json` file for additional configuration. Here's how you can create your own:

1. Locate the `config/config.json.example` file in the project directory. This file contains example settings for the project.
2. Copy the `config/config.json.example` file and rename the copy to `config/config.json`.
3. Open the `config/config.json` file in a text editor.
4. Replace the example values with your actual data. Save and close the file when you're done.

Here's an example of what the `config/config.json` file might look like:

```json
{
  "settings": [
    {
      "source": "Endpoint for provider app",
      "credentials": [
        {
          "name": "Memorable Name",
          "username": "username1",
          "password": "password1",
          "endpoint": "https://example.com",
          "endpointHistory": []
        }
      ]
    }
  ]
}
```

## Usage

```bash
npm run start | pico-pretty
```

## Contributing

Provide contributing guidelines here.

## License

Provide license information here.
