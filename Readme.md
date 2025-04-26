# Hippo framework

A reactive frontend framework with no magic tricks.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Getting Started

### 1. Clone the Repository and checkout to the right branch

```bash
git clone <repository_url>
cd hippo-vite
git checkout without_h-if
```

### 2. Install Dependencies

```bash
npm ci
```

### 3. Running the Development Server

```bash
npm run dev
```

### 4. Building for Production

```bash
npm run build
```

## Usage

- The `/hippo` folder contains all the core code for the hippo framework.
- The `/user` folder includes components that demonstrate how to use the framework. You can explore these examples to understand the workflow and structure.
- Before building your own components, we recommend reviewing the framework code in the `/hippo` folder to understand its concepts and usage patterns.
- **Important:** To develop your own features, write your code inside the `/user` folder. Use the `main.ts` file to initialize your app by calling the `createApp` function.
- In the future, additional documentation or a dedicated description page about the framework will be provided for further guidance.