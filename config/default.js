module.exports = {
    port: 1337,
    origin: "http://localhost:3000",
    dbUri: "mongodb://localhost:27017/comego-app",
    socketHost: 'localhost',
    socketPort: 4000,
    saltWorkFactor: 10,
    accessTokenTtl:"15m",
    refreshTokenTtl: "1y",
    publicKey: `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCGWKK5fhRHxkPhSgcKDl3N9OdW
Zl/xdyWNadWZsI8b1Py4Ie8vN5s+SDXQkaiKAGOG3hSeHhN5Gs2dhpbDfBALxykk
+8+EO0zQTZBlilUIMXqW7FDEo1U0hkCxPXzgpRvcYdlUp84lTfEUs6bE6W+OjPak
33AuaLjEQJ2++X+AswIDAQAB
-----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQCGWKK5fhRHxkPhSgcKDl3N9OdWZl/xdyWNadWZsI8b1Py4Ie8v
N5s+SDXQkaiKAGOG3hSeHhN5Gs2dhpbDfBALxykk+8+EO0zQTZBlilUIMXqW7FDE
o1U0hkCxPXzgpRvcYdlUp84lTfEUs6bE6W+OjPak33AuaLjEQJ2++X+AswIDAQAB
AoGBAISi960I0/70uMmxK3f7LROMqeT8V9bume2ewprk3LVOt18XaayFSsjXxAGx
/OKadaiOk250JSeYlc3jNe+0CaYYcyDZUnGL7XfugN2eFFd2WaH4+fPNmxVauTfo
lDezuSCug7BUpmBHjoRaOWDG0HFSWZMwHkt+9GKLJP/guZ4ZAkEAw98RcaJ/y066
1YrPAQm6t6Ocwdia235LsdgotMzx3oG2hRRdZqYdRZ+C1NAAhqz1AK8bH8peiCTA
zw6BEP2RPwJBAK+WfucTAe965sELZlN6OqDRt7qufcebQ8qU/Ixj2vIi+a5dmhKc
4E4d48yv+SdEzRMmf7RFT0DMONfJVeroP40CQH1fok3HQt+CxGp9UCUM8jwreOJH
YFAQlij/AIdCC6tuAcNLFsHmoCP5hwfrH/sUaDqI2ubNZRbl15hxY0HZ3IcCQGdl
d9UanEkpVjjXPapqj5uj401K80ZXZ9QjZ5REOOndLqo+9DuBpZRahYpDFbTKDvj3
8rt1FPZTTCXFqZJqsQECQQCP7vNkrZBbEosfNhSbpM0CmfBhQo0W8NGJQftID6Y2
nAgBvOJqedbIVrRI9OFiPx/jdxn5F3tgZCK4uKQVaDPu
-----END RSA PRIVATE KEY-----`
}