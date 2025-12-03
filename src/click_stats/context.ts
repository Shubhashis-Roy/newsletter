// import { Injectable, Request } from '@nestjs/common';

// // Define the structure of your user object and context
// interface User {
//   admin: boolean;
//   id: number;
//   username: string;
//   name: string;
//   email: string;
// }

// interface Context {
//   user: User;
// }

// @Injectable()
// export class ContextService {
//   private readonly adminContext: Context = {
//     user: {
//       admin: true,
//       id: 0,
//       username: '',
//       name: '',
//       email: '',
//     },
//   };

//   // Method to get the admin context
//   getAdminContext(): Context {
//     return this.adminContext;
//   }

//   // Method to extract context from a request
//   getRequestContext(req: Request): Context {
//     // Assuming req.user is populated by an authentication middleware (e.g., Passport.js)
//     const user = req['user'] as User;
//     return {
//       user,
//     };
//   }
// }
