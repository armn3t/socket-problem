Create self signed certificate

```bash
openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365
```

Set the commonName to `localhost`
Add the certificate to chrome in the Certificate Authority Manager

ENV file example

```bash
PORT=4001
MONGODB_URI="mongodb://127.0.0.1:27017/db"
JWT_SECRET="supersecret"
SECURE='1'
NODE_TLS_REJECT_UNAUTHORIZED='0'
```

To change back to http protocol, just set the env SECURE variable to false, and also change the SERVER_URL for React to use http instead of https. Also change the socket creation to not use the secure option.
