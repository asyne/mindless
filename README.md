## Getting started with Headless Chrome

Chrome 59 gets cross-platform Headless mode support. Chrome Headless is already available on Linux so you could start hacking with it right now, even if you're not on Linux. The only thing you will need is [Docker](https://www.docker.com/).

For now, there is one example of use in this repository – capturing screenshots for different platforms (Desktop, Mobile & Tablet) using Headless Chrome. But more may appear later, contributions are always welcome.

### Running with Docker

```sh
# Clone Github repository
$ git clone git@github.com:asyne/mindless.git

# Build Docker image
$ cd mindless/
$ docker build -t mindless .

# Run Docker container and take screenshots of Github's main page
# «output» folder will be created in the current directory
$ docker run -it --cap-add=SYS_ADMIN -v $(pwd)/output:/output mindless --url https://github.com/
```

### Reference

- [Chrome Debugging Protocol](https://chromedevtools.github.io/devtools-protocol/)
- [Chrome Remote Interface (CDP client)](https://github.com/cyrus-and/chrome-remote-interface/)
