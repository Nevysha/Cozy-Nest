# Cozy Nest Client

**![#f03c15](https://placehold.co/15x15/f03c15/f03c15.png) f you are looking for the Automatic1111's webui extension, please look [HERE](https://github.com/Nevysha/Cozy-Nest). This folder is for non-built source code of Cozy Nest client.**

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/G2G2L55CD)

![](https://nevysha.art/wp-content/uploads/2023/01/nevy-icon-1-256-round.png)

## Installation

```bash
git clone https://github.com/Nevysha/Cozy-Nest.git
cd Cozy-Nest/cozy-nest-client
npm install
```

## Usage

You need to have Cozy-Nest extension installed on a1111, and a1111 running.

```bash
# start a1111 webui server
cd Cozy-Nest/cozy-nest-client
npm run dev
# access client at http://localhost:<vite_port>
```

## Build

```bash
cd Cozy-Nest/cozy-nest-client
# check output folder in vite.config.ts. It is hard coded atm.
npm run build
```