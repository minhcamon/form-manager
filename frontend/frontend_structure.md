# Frontend Architecture & AI Agent Guidelines

This document details the frontend architecture, design system, and data processing rules. **All AI coding agents MUST read and adhere strictly to these rules to avoid data parsing issues or design inconsistency.**

---

## 1. Project Directory Structure

The project follows a modular, presentation-logic separation pattern:

- **`src/views/`**: Dumb container views. They only connect layouts and modules; they must **never** contain business logic or API state.
- **`src/modules/`**: Feature-based modules containing logic:
  - `modules/<feature>/pages/`: Pages containing page layout, rendering sub-components, consuming custom hooks.
  - `modules/<feature>/hooks/`: Custom React hooks managing local states, inputs, event handlers, and calling API services.
  - `modules/<feature>/components/`: Feature-specific UI components.
- **`src/services/`**: API interaction services.
- **`src/components/ui/`**: Shared core UI elements (Shadcn components).
- **`src/lib/`**: Network client initialization (`axios.js`) and shared utilities.

---

## 2. Crucial Rules for AI Agents (Avoid Data & Styling Errors)

### ⚠️ Rule 2.1: API Response Processing (Axios Interceptor Layer)
- **Context**: The `axiosClient` has an interceptor that unwraps `response.data`. The resolved value returned by `axiosClient` calls is the backend's JSON body (`APIResponse` structure containing `code`, `isSuccess`, `message`, `data`).
- **Data Layers**:
  - `response.data` is the inner payload (e.g., list of forms, or user authorization payload).
  - `response.code` is the HTTP status code mapped inside the envelope.
- **The Bug to Avoid**: Do **NOT** write `response.data.data` in the service methods unless `response.data` itself is an object that contains another nested `data` field.
  - **Auth Service**: `authService.login` must return `response` (the full body) so that `AuthContext` can read `response.code`, `response.isSuccess`, and `response.data`.
  - **Forms Service**: `formService.getForms` must return `response.data` (which is the array of forms) so that the hook receives the array directly.
- **Service Errors**: Always use a try-catch block in service methods. Log the error with `console.error` and throw a clean Javascript Error object containing only the error message string:
  ```javascript
  const errorMsg = error.response?.data?.message || "Error message";
  throw new Error(errorMsg);
  ```

### 🎨 Rule 2.2: Theme Colors & Variables
- **Constraint**: **Do NOT use custom/self-created colors** (e.g., `#4f46e5`, `rgb(79, 70, 229)`, or `bg-indigo-600` for custom theme-specific parts).
- **Practice**: All colors must be mapped to system variables in Tailwind CSS v4. Use semantic classes:
  - `bg-primary` & `text-primary-foreground`
  - `bg-background` & `text-foreground`
  - `border-border` & `bg-card` & `text-card-foreground`
  - `bg-muted` & `text-muted-foreground`
- **Variable Customization**: To tweak colors, modify the `:root` definitions in [index.css](file:///d:/Data/Personal/JOBS/TOPCV/form-manager/frontend/src/index.css).

### 🔔 Rule 2.3: Toast Notifications (No Inline Alerts)
- **Constraint**: Do not render custom inline red alert boxes for errors.
- **Practice**: Use the globally registered toast engine `window.toast` (from `sonner`). 
- **Zero-Imports**: `window.toast` is declared in [App.jsx](file:///d:/Data/Personal/JOBS/TOPCV/form-manager/frontend/src/App.jsx) and is accessible everywhere without imports:
  ```javascript
  window.toast.success("Thành công!");
  window.toast.error("Lỗi xảy ra!");
  ```

### 📁 Rule 2.4: Component File Casing
- **Context**: On Windows systems, file names are case-insensitive, but they are case-sensitive on Linux/production builds.
- **Casing Rule**:
  - Legacy UI files in `src/components/ui/` (`Button.jsx`, `Input.jsx`, `Badge.jsx`) are **UpperCamelCase**.
  - Newly added Shadcn files (`card.jsx`, `dialog.jsx`, `table.jsx`, `sonner.jsx`) are **lowercase**.
  - **Never rename or import them with the wrong casing** to avoid breaking production builds.
