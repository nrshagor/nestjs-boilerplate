## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

npm install copyfiles --save-dev

npm install nodemailer hbs
```

## Test

```bash
"scripts": {
  "build": "tsc",
  "postbuild": "copyfiles -u 1 src/mailer/templates/* dist/mailer/templates",
  "start": "nest start",
  "start:dev": "nest start --watch",
  "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\""
}
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
