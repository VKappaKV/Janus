**abstract**

# What is Janus

# Others topics
eg.
- Features
- Changelog

# Install
## Prerequisites

- Metamask browser extension properly configurated
- Phantom browser extension properly configurated
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

1. Clone Janus project:
```bash
git clone https://github.com/VKappaKV/Janus
```

2. Start algokit localnet:
```bash
algokit localnet start
```

3. Try single wallet integrations
```bash
git checkout Metamask   #To try the Metamask demo
git checkout Phantom    #To try the Phantom demo
```

4. Install dependencies
```bash
npm install
```

5. Run Janus
```bash
npm run dev
# open http://localhost:5173/ in your browser
```

