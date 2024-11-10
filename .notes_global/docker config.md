
## Setting up Docker for Loki React App Screenshot Testing

To configure Docker for your Loki-based React app screenshot testing, follow these steps:

1. **Install Docker**: First, make sure you have Docker installed on your development machine. You can download the appropriate Docker version for your operating system from the official Docker website: [https://www.docker.com/get-started](https://www.docker.com/get-started)

2. **Create a Dockerfile**: In the root of your React project, create a new file named `Dockerfile` with the following contents:

```Dockerfile
FROM node:14-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "start"]
```

This Dockerfile sets up a Node.js 14 Alpine-based Docker image, installs your project dependencies, copies your app's source code, and starts the development server.

3. **Build the Docker image**: Open a terminal, navigate to your React project's root directory, and run the following command to build the Docker image:

```bash
docker build -t my-react-app .
```

This will create a Docker image named `my-react-app` based on the `Dockerfile` in the current directory.

4. **Run the Docker container**: To start the React app in a Docker container, run the following command:

```bash
docker run -it --rm -p 3000:3000 my-react-app
```

This will start the container, mapping port 3000 of the container to port 3000 of your local machine. The `--rm` flag will automatically remove the container when it's stopped.

5. **Configure Loki**: In your Loki configuration, update the `target` option to use the Docker-based setup:

```javascript
{
  "target": "chrome.docker",
  "docker": {
    "image": "my-react-app",
    "port": 3000
  }
}
```

This tells Loki to use the `my-react-app` Docker image and to connect to the React app running on port 3000 inside the container.

With these steps, you should now be able to use Loki for screenshot testing your React application running in a Docker container.