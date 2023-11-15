**abstract**

# What is Janus

# Others topics
eg.
- Features
- Changelog

# Install
## Prerequisites

- git
- npm 8.6+
- node 18+
- typescript 5.0.2+
- react 18.2+
- vite 4.4.5+
- openssl 3.0+
- Algokit 4.1
    - Python 3.10+
    - pip 23+
    - pipx 1.2.1+
    - Docker 20+
    - Docker compose 2.5+
- Algosdk 2.7+
- other dependencies defined in package.json

## Setup and run

Before installing this project you might be sure respect the above requirements. For convenience we invite you to go [here](https://github.com/algorandfoundation/algokit-cli) for instructions on how to install algokit

Before cloning and running Janus you have an algokit localnet started:

```bash
algokit localnet start
```

You can try single wallet integration choicing separate wallet branch. 
E.g. Metamask integration:
```bash
git clone https://github.com/VKappaKV/Janus
git checkout Metamask
npm install
npm run dev
# open http://localhost:5173/ in your browser
```

