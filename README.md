<a id="readme-top"></a>

[![Stars][stars-shield]][stars-url] [![Forks][forks-shield]][forks-url] [![Watchers][watchers-shield]][watchers-url]
[![Contributors][contributors-shield]][contributors-url] [![Commit Activity][commitactivity-shield]][commitactivity-url]
[![Last Commit][lastcommit-shield]][lastcommit-url] [![Issues][issues-shield]][issues-url] [![License][license-shield]][license-url]


<br />
<div align="center">
<h2 align="center">InstaScan</h3>
  <p align="center">
    <a href="https://github.com/fraunhofer-iml/InstaScan/issues/new?labels=bug&template=bug-report---.md">🐞 Report Bug</a> &middot;
    <a href="https://github.com/fraunhofer-iml/InstaScan/issues/new?labels=enhancement&template=feature-request---.md">💡 Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">📚 About The Project</a>
      <ul><li><a href="#description">📄 Description</a></li></ul>
      <ul><li><a href="#built-with">🛠️ Built With</a></li></ul>
      <ul><li><a href="#components-overview">🏗️ Components Overview</a></li></ul>
    </li>
    </li>
    <li><a href="#getting-started">🚀 Getting Started</a></li>
    <li>
      <a href="#contributing">🤝 Contributing</a>
      <ul><li><a href="#getting-involved">🌟 Getting Involved</a></li></ul>
    </li>
    <li><a href="#license">📜 License</a></li>
    <li><a href="#contact">📬 Contact</a></li>
    <li><a href="#acknowledgments">🙏 Acknowledgments</a></li>
  </ol>
</details>

## 📚 About The Project <a id="about-the-project"></a>

### 📄 Description <a id="description"></a>

Instascan provides a way to digitize and save documents that are available in paper form. The documents are scanned as images and stored on a data server. At the same time, an analysis of the documents is triggered, which extracts the values of the individual fields. To achieve this, AI systems are used that generate a complete data object by specifying the fields to be filled in. To ensure that the data objects created are correct, a way is also provided to view and subsequently edit the data via a front end.

### 🛠️ Built With <a id="built-with"></a>

- [![Angular][angular-shield]][angular-url] Framework for building dynamic web applications
- [![Docker][docker-shield]][docker-url] Platform for containerizing and deploying applications efficiently
- [![ESLint][eslint-shield]][eslint-url] Utility for linting and enforcing code quality in JavaScript and TypeScript
- [![Jest][jest-shield]][jest-url] JavaScript testing framework
- S3-compatible object storage
- [![NestJS][nestjs-shield]][nestjs-url] Node.js framework for building scalable server-side applications
- [![Nx][nx-shield]][nx-url] Build system for monorepos
- [![PostgreSQL][postgresql-shield]][postgresql-url] Relational database management system known for reliability and performance
- [![Prettier][prettier-shield]][prettier-url] Code formatter for consistent style
- [![TypeOrm][typeorm-shield]][typeorm-url] ORM for database management
- [![RabbitMQ][rabbitmq-shield]][rabbitmq-url] Message broker for distributed systems, supporting AMQP
- [![RxJS][rxjs-shield]][rxjs-url] Library for managing asynchronous events
- [![Swagger][swagger-shield]][swagger-url] Tools for designing and documenting APIs
- [![TypeScript][typescript-shield]][typescript-url] Strongly typed programming language that enhances JavaScript
- [![Python][python-shield]][python-url] Versatile, high-level programming language known for its readability and ease of use

### 🏗️ Components Overview <a id="components-overview"></a>

The project consists of the following components:

1. **Backend for frontend (`bff`)**

- Exposes endpoints for the frontend application.
- Handles all incoming HTTP requests and routes them to the appropriate services via AMQP.
- Takes care of the preparation of the data for the Angular frontend.

2. **Storage Service (`storage-service`)**

- Stores incoming documents on a S3 server.
- Saves information on the documents and the analysis result in a Postgres database.
- Can be addressed via AMQP by the bff and the dcoument-analysation-service.
- Allows you to edit data records to correct errors in the analysis.

3. **Document Analyzation Service (`document-analyzation-service`)**

- Accepts the images sent via the bff.
- Forwards the document including the appropriate data fields and the necessary prompts to an AI service.
- As soon as the response from the AI service (in the form of the filled data object) is available, it is forwarded via AMQP to the storage service to be saved.

4. **Frontend (`frontend`)**

- Allows users to scan or upload new documents.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🚀 Getting Started <a id="getting-started"></a>

To set up and run Instascan locally, please consult the chapter
[Installation and Tutorial](https://github.com/fraunhofer-iml/InstaScan/blob/main/documentation/05_installation_and_tutorial.adoc) in our documentation. This chapter
provides step-by-step instructions to guide you through the process of installing, configuring and running Instascan on your local machine.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🤝 Contributing <a id="contributing"></a>

### 🌟 Getting Involved <a id="getting-involved"></a>

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are
**greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with
the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'Add some amazing-feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📜 License <a id="license"></a>

Licensed under the Apache License 2.0. See `LICENSE` for details.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📬 Contact <a id="contact"></a>

Tim Chilla: tim.chilla@iml.fraunhofer.de

Lukas Grieger: lukas.grieger@iml.fraunhofer.de

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🙏 Acknowledgments <a id="acknowledgments"></a>

- [Best-README-Template](https://github.com/othneildrew/Best-README-Template) provided inspiration and structure for creating this README
  file
- [Img Shields](https://shields.io) enabled the creation of customizable and visually appealing badges for this project, which is included unmodified in this readme file under the terms of the [CC0 1.0 Universal](https://github.com/badges/shields/blob/master/LICENSE)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/fraunhofer-iml/forest-guard.svg?style=for-the-badge
[stars-url]: https://github.com/fraunhofer-iml/forest-guard/stargazers
[forks-shield]: https://img.shields.io/github/forks/fraunhofer-iml/forest-guard.svg?style=for-the-badge
[forks-url]: https://github.com/fraunhofer-iml/forest-guard/forks
[watchers-shield]: https://img.shields.io/github/watchers/fraunhofer-iml/forest-guard?style=for-the-badge
[watchers-url]: https://github.com/fraunhofer-iml/forest-guard/watchers
[contributors-shield]: https://img.shields.io/github/contributors/fraunhofer-iml/forest-guard.svg?style=for-the-badge
[contributors-url]: https://github.com/fraunhofer-iml/forest-guard/graphs/contributors
[commitactivity-shield]: https://img.shields.io/github/commit-activity/y/fraunhofer-iml/forest-guard?style=for-the-badge
[commitactivity-url]: https://github.com/fraunhofer-iml/forest-guard/graphs/commit-activity
[lastcommit-shield]: https://img.shields.io/github/last-commit/fraunhofer-iml/forest-guard?style=for-the-badge
[lastcommit-url]: https://github.com/fraunhofer-iml/forest-guard/commits/main
[issues-shield]: https://img.shields.io/github/issues/fraunhofer-iml/forest-guard.svg?style=for-the-badge
[issues-url]: https://github.com/fraunhofer-iml/forest-guard/issues
[license-shield]: https://img.shields.io/github/license/fraunhofer-iml/forest-guard.svg?style=for-the-badge
[license-url]: https://github.com/fraunhofer-iml/forest-guard/blob/main/LICENSE
[angular-shield]: https://img.shields.io/badge/Framework-Angular-DD0031?style=flat&logo=angular
[angular-url]: https://angular.io/
[docker-shield]: https://img.shields.io/badge/Platform-Docker-2496ED?style=flat&logo=docker
[docker-url]: https://www.docker.com/
[eslint-shield]: https://img.shields.io/badge/Linting-ESLint-4B32C3?style=flat&logo=eslint
[eslint-url]: https://eslint.org/
[hyperledgerbesu-shield]: https://img.shields.io/badge/Blockchain-Hyperledger%20Besu-F26822?style=flat&logo=ethereum
[hyperledgerbesu-url]: https://besu.hyperledger.org/
[jest-shield]: https://img.shields.io/badge/Testing-Jest-C21325?style=flat&logo=jest
[jest-url]: https://jestjs.io/
[keycloak-shield]: https://img.shields.io/badge/Library-Keycloak-DC382D?style=flat&logo=keycloak
[keycloak-url]: https://www.keycloak.org/
[nestjs-shield]: https://img.shields.io/badge/Framework-NestJS-E0234E?style=flat&logo=nestjs
[nestjs-url]: https://nestjs.com/
[nftfolderblockchainconnector-shield]: https://img.shields.io/badge/Library-Blockchain_Connector-F7931A?style=flat&logo=ethereum
[nftfolderblockchainconnector-url]: https://github.com/fraunhofer-iml/nft-folder-blockchain-connector
[nftfoldersmartcontracts-shield]: https://img.shields.io/badge/Smart_Contracts-Tokenization_Smart_Contracts-F7931A?style=flat&logo=ethereum
[nftfoldersmartcontracts-url]: https://github.com/fraunhofer-iml/nft-folder-smart-contracts
[nx-shield]: https://img.shields.io/badge/Tool-Nx-DD0031?style=flat&logo=nrwl
[nx-url]: https://nx.dev/
[postgresql-shield]: https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat&logo=postgresql
[postgresql-url]: https://www.postgresql.org/
[prettier-shield]: https://img.shields.io/badge/Formatting-Prettier-F7B93E?style=flat&logo=prettier
[prettier-url]: https://prettier.io/
[prisma-shield]: https://img.shields.io/badge/ORM-Prisma-2D3748?style=flat&logo=prisma
[prisma-url]: https://www.prisma.io/
[python-shield]: https://img.shields.io/badge/Language-python-3670A0?style=flat&logo=python
[python-url]: https://www.python.org/
[rabbitmq-shield]: https://img.shields.io/badge/Message_Broker-RabbitMQ-FF6600?style=flat&logo=rabbitmq
[rabbitmq-url]: https://www.rabbitmq.com/
[rxjs-shield]: https://img.shields.io/badge/Library-RxJS-B7178C?style=flat&logo=reactivex
[rxjs-url]: https://rxjs.dev/
[swagger-shield]: https://img.shields.io/badge/API-Swagger-85EA2D?style=flat&logo=swagger
[swagger-url]: https://swagger.io/
[tailwindcss-shield]: https://img.shields.io/badge/CSS_Framework-TailwindCSS-06B6D4?style=flat&logo=tailwindcss
[tailwindcss-url]: https://tailwindcss.com/
[typescript-shield]: https://img.shields.io/badge/Language-TypeScript-007ACC?style=flat&logo=typescript
[typescript-url]: https://www.typescriptlang.org/
[typeorm-shield]: https://img.shields.io/badge/ORM-TypeORM-FE0803?logo=typeorm&logoColor=fff
[typeorm-url]: https://typeorm.io/
