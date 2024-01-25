# Overview

Implement a basic Node.js backend system for an NFT airdrop application using Express.js in TypeScript. This system allows users to generate and redeem codes for NFT airdrops, with a focus on modularizing your code for various routes.

## Objectives

1. **Implement Minimal In-Memory Store(s)**

   - Develop a simple class to manage airdrop job details (unique redeem code, NFT contract address).
   - Functions:
     - Generate/store airdrop job details.
     - Retrieve airdrop job details by redeem code.
     - Mark an airdrop job as redeemed.

2. **Develop Basic API Endpoints**

   - Endpoint to generate a redeem code for an NFT contract with a specified quantity.
   - Endpoint to redeem the NFT using the redeem code and a wallet address.
   - [Admin Only] Endpoints to list, retrieve, update, and delete airdrop jobs.

3. **Implement Basic Validation and Error Handling**

   - Validate inputs for API endpoints.
   - Handle errors, such as invalid or already redeemed codes.

4. **Simple API Security**

   - Implement a basic API Key authentication.
   - Role-based access control with two roles: `admin` and `public`. Admins have full access, while public users have limited access.

5. **Bonus**: Unit Testing with Jest

   - Write unit tests focusing on critical business logic.

6. **Bonus**: Replace In-Memory Store(s) with MongoDB.
7. **Bonus**: Integrate a queue system for asynchronous airdrop processing and batch airdrop processing.
8. **Bonus**: Implement airdrop function with smart contract interaction using Ethers.js / Web3.js.

## Requirements

- TypeScript and ES6+ code.
- Emphasis on maintainability and understandable code structure.
- Flexibility to modify the provided starter code.
- For bonus objectives, a brief explanation of your solution and design choices is sufficient. Implementation is a plus.

## Evaluation Criteria

- **Functionality**: The application should meet the outlined objectives.
- **System Design**: Look for practicality and simplicity in the overall system architecture, with particular attention to how the code is modularized for different routes.
- **Code Quality**: Cleanliness, readability, and documentation.
- **Modularity and Scalability**: Assess how well the solution uses modular design patterns to enhance code scalability and maintenance.
- **Testing**: Coverage and quality of unit tests.
