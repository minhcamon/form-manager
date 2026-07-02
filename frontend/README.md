# FormManager Frontend

A clean, minimalist light-theme frontend built with **React 19**, **Vite**, and **Tailwind CSS v4** mapping semantic theme variables.

---

## 🤖 IMPORTANT: Guidelines for AI Agents (Cursor, Claude, etc.)

> [!WARNING]
> To prevent data parsing issues, design discrepancies, or component casing mismatches, **you must read and follow the instructions in the architecture guide before writing code**:
> 
> 👉 **[Architecture Guide & AI Agent Guidelines](file:///d:/Data/Personal/JOBS/TOPCV/form-manager/frontend/frontend_structure.md)**

### Quick Rules Summary:
1. **API Handling**: `axiosClient` responses are already unwrapped by the interceptor. Do not use `.data.data` on service results unless nested.
2. **Colors**: Never use custom color hexes. Use semantic Tailwind variables like `bg-primary`, `border-border`, etc.
3. **Toasts**: Use `window.toast` (from `sonner`) globally without importing.
4. **File Casing**: Respect file casings (`Button.jsx` vs `card.jsx`) to prevent Windows case-insensitive filesystem conflicts.

---

## Getting Started

### Development Server
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```
