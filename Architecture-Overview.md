# Architecture Overview — GrocerEase

## Summary

The project follows a clean, scalable architecture based on feature boundaries and clear separation of concerns:

## Layers

### 1. HTTPService

A central Axios instance used for all network requests.
Handles:

- base URL
- headers
- tokens
- interceptors
- shared error handling

This layer **does not** contain business logic.

---

### 2. Feature Service

A high-level domain layer for each feature (e.g., `userService`).
Responsibilities:

- business logic
- **data validation** (Zod/Yup schemas)
- DTO mapping
- calling the HTTPService

This guarantees consistent behavior for all consumers (hooks, components, tests).

---

### 3. Data Layer (React Query)

React Query handles:

- caching
- background refetching
- retry logic
- invalidation
- loading/error states

Hooks wrap these operations and expose easy-to-use data APIs to the UI.

---

### 4. View Components

React components responsible only for:

- rendering UI
- interacting with hooks
- basic form-level validation
- showing loading/error states

Components contain **no business logic**.

---

## Validation Strategy

- **Form-level validation (UI)** → inside components/hooks for instant user feedback
- **Business-level validation** → inside Feature Services using Zod schemas before sending POST/PUT requests

---

## Folder Structure (High-Level)

```
src/
├─ features/
│ ├─ users/
│ │ ├─ api/userService.ts
│ │ ├─ hooks/useUsers.ts
│ │ |─ components/UsersList.tsx
| | └─ userMapper.ts
├─ shared/
│ ├─ http/httpService.ts
│ └─ types/
├─ App.tsx
└─ index.tsx
```

## Architectural Decisions

- **React Query** chosen to eliminate duplicate fetching logic and provide caching/sync.
- **Feature-based folder structure** to improve scalability and maintainability.
- **Validation inside Feature Services** to centralize domain rules.

## Short Code Samples

### 1. HTTP Service (Axios)

```javascript
import axios from 'axios';

const http = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token automatically
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
```

### 2. DTO Mapper

```javascript
export function mapUserDtoToUser(dto: any) {
  return {
    id: dto._id,
    name: dto.full_name,
    email: dto.contact?.email,
    createdAt: new Date(dto.created_at),
  };
}
```

### 3. Feature Service (Validation + Mapping)

```javascript
import http from '@/shared/http/httpService';
import { z } from 'zod';
import { mapUserDtoToUser } from '../mappers/userMapper';

// Validation schema for creating users
const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const userService = {
  async getAll() {
    const res = await http.get('/users');
    return res.data.map(mapUserDtoToUser);
  },

  async create(payload: unknown) {
    // Validate input
    const parsed = CreateUserSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error('Validation failed: ' + parsed.error.errors[0].message);
    }

    // Send to API
    const res = await http.post('/users', parsed.data);

    // Map response
    return mapUserDtoToUser(res.data);
  },
};
```

### 4. React Query Hooks

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../api/userService';
import type { CreateUserDto } from '../api/userService';

export function useUsers() {
  return useQuery(['users'], () => userService.getAll());
}

export function useCreateUser() {
  const qc = useQueryClient();

  return useMutation((data: CreateUserDto) => userService.create(data), {
    onSuccess: () => {
      // Refresh list
      qc.invalidateQueries(['users']);
    },
  });
}
```

### 5. View Component

```javascript
import React, { useState } from "react";
import { useUsers, useCreateUser } from "../hooks/useUsers";

export default function UsersList() {
  const { data, isLoading, error } = useUsers();
  const createUser = useCreateUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div>
      <h3>User List</h3>
      <ul>
        {data?.map((u: any) => (
          <li key={u.id}>{u.name} — {u.email}</li>
        ))}
      </ul>

      <h4>Create User</h4>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={() => createUser.mutate({ name, email })}
        disabled={createUser.isLoading}
      >
        Create User
      </button>

      {createUser.error && (
        <div style={{ color: "red" }}>
          {(createUser.error as any).message}
        </div>
      )}
    </div>
  );
}
```
