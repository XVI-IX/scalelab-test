# Food Ordering Service Documentation

## Author 🖊️

> David-Daniel Ojebiyi

## Overview

This submission is a technical test for the role of an entry-level software engineer.
The [postman](https://documenter.getpostman.com/view/33161533/2sA2rCT1qs) documentation provides a comprehensive view into the endpoints. If in anycas the documentation is not accessible, please find the exported collection with the name `Food Ordering Service.postman_collection.json`

The system flow documents can also be accessed [here](https://drive.google.com/file/d/16au3sx6BHTw3u07JQrBSRjmADeVENjmq/view?usp=sharing)

## Introduction

This document serves as a comprehensive guide to the food ordering service, outlining its functionalities, user roles, and technical considerations. The service aims to provide a seamless and efficient experience for both customers and vendors, facilitating online food ordering with dynamic delivery time slots and mock payment processing.

### **Target Users:**

- **Customers:** Individuals seeking to conveniently order food from various vendors through the platform.
- **Vendors:** Restaurants or businesses offering food items for online purchase and delivery.
- **Super Admin:** The platform administrator responsible for managing vendors, orders, and overall system operations.

### **Key Features:**

- **Public Access:** Customers can browse menus and place orders without requiring authentication.
- **Dynamic Time Slots:** Orders are processed and delivered in clusters based on a dynamic time slot algorithm, ensuring efficient delivery management.
- **Mock Payment Processing:** A simulated card payment system facilitates order confirmation while providing retry mechanisms for failed transactions.
- **Real-Time Updates:** Customers and vendors receive timely notifications regarding order status, deliveries, and other relevant information.
- **Vendor Management:** Vendors can register, create stores, manage menus, and analyze order data.
- **Super Admin Control:** The super admin oversees vendor approvals, store visibility, order monitoring, and customer communication.

**This documentation provides:**

- Detailed explanations of functionalities for each user role.
- API reference guides for developers integrating with the service.
- System architecture and design overviews.
- Deployment and configuration instructions.
- Troubleshooting tips and best practices.

By utilizing this documentation, users and developers can gain a thorough understanding of the food ordering service, enabling them to effectively interact with the platform and contribute to its success.

## Technologies Used

- Node.js
- Nest.js
- Redis
- PayStack API

### Database Used

- PostgreSQL

## Setting up Locally

### Install NodeJS

To install NodeJs, visit [here](https://nodejs.org/en/download/current) to find instructions fitting your operating system.

### Clone this repository

```bash
gh repo clone

```

### Database

To set up postgres locally, visit [here](https://www.postgresql.org/download/) to know the instructions for your operating system.

#### Create a Database

To create a database, visit [here](https://www.postgresql.org/docs/current/sql-createdatabase.html)

### Folder Structure

- `src`: Contains the layer of the appliction responsibel for the business logic.
  - `/admin`: Contains the service and controllers responsible for facilitating admin functions
  - `/auth`: Contains the service and controllers responsible for authentication in this service
  - `/common`: Contains shared code and utilites like constants, decorators, entities, enum, and guards
  - `config`: contains the configuration files
  - `customers`: Contains the service and controller code for facilitating customer operations on the service.
  - `email`: Contains the service and controller code for facilitating the sending of emails.
  - `items`: Contains the service and controller code for facilitating the operations of a vendor in relation to items to be added to a store.
  - `orders`: Contains the service and controller code for facilitating orders.
  - `payments`: Contains the service and controller code for facilitating payments using the paystack api.
  - `prisma`: Contains the service for using prisma as an ORM in this service.
  - `stores`: Contains the service and controller code for facilitating operations of the vendors on their stores.
  - `timeslots`: Contains the service and controller code for faciliting the dynamic creation and allocation of timeslots (not implemented)
  - `vendors`: Contains the service and controller code for facilitating operation of vendors on personal data.

### Environment variable example

```txt
DATABASE_URL="postgresql://[DATABASE USER]:[PASSWORD]@localhost:[PORT]/[DATABASE NAME]?schema=public"
JWT_SECRET=secret
RESET_SECRET=secret
ADMIN_MAIL="admin@adminmail.com admin2@adminmail.com"
URL="http://localhost:3000"
EMAIL_PASS=emailPassword
EMAIL_HOST=mailhost
EMAIL_PORT=port
EMAIL_USER='emailuser'
PAYSTACK_KEY=secret
TRANSACTION_FEE=fee
URL="https://api.paystack.co"

```

### Install the Dependencies

`npm run install`

#### Prisma

`npx prisma db push`

### Run Service

`npm run start:dev`
