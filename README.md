# Pockets

A React Native mobile application for financial tracking, built with Expo and fully coded by AI under human supervision and guidance.


![GpJYlHpa4AEtque](https://github.com/user-attachments/assets/06651eb5-3946-484b-adae-8d3ae7e012b5)



## Technology Stack

- **Framework:** React Native
- **Platform:** Expo (v52)
- **Language:** TypeScript
- **Navigation:** Expo Router (File-based routing)
- **State Management:** React Context (`AccountContext`), Zustand (dependency present but unused)
- **UI Components:** Expo components, `@expo/vector-icons`, `@gorhom/bottom-sheet`, custom components
- **Storage:** AsyncStorage
- **Testing:** Jest

## Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npx expo start
    ```
    Follow the instructions in the terminal to open the app in an emulator, simulator, or on a physical device using the Expo Go app.

## Project Structure

```
.
├── app/                   # Main application code (using Expo Router)
│   ├── (tabs)/            # Screens grouped under the main tab navigator
│   │   ├── _layout.tsx    # Defines the tab navigator (Home, Accounts, Credits)
│   │   ├── index.tsx      # Home/Dashboard tab screen
│   │   ├── accounts.tsx   # Accounts management tab screen
│   │   └── credits.tsx    # Credits related tab screen
│   ├── context/           # React Context providers (e.g., AccountProvider)
│   ├── styles/            # Shared styles
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── _layout.tsx        # Root layout component (Stack Navigator, ThemeProvider, AccountProvider)
│   └── +not-found.tsx     # Fallback screen for unknown routes
├── assets/                # Static assets (images, fonts)
│   └── fonts/
├── components/            # Global reusable UI components (e.g., HapticTab)
├── constants/             # Constant values (e.g., colors, configurations)
├── hooks/                 # Custom React Hooks (e.g., useColorScheme)
├── scripts/               # Utility scripts (e.g., reset-project.js)
├── .expo/                 # Expo generated files (cache, settings)
├── .git/                  # Git repository files
├── node_modules/          # Project dependencies
├── .gitignore             # Files ignored by Git
├── app.json               # Expo configuration file
├── babel.config.js        # Babel configuration
├── expo-env.d.ts          # Expo TypeScript environment types
├── package-lock.json      # Exact dependency versions
├── package.json           # Project metadata and dependencies
├── README.md              # This file
└── tsconfig.json          # TypeScript configuration
```

### Key Components & Concepts

- **Navigation:** Handled by `expo-router`. The main navigation is a bottom tab bar defined in `app/(tabs)/_layout.tsx`. The root layout in `app/_layout.tsx` uses a Stack navigator.
- **State Management:** Primarily uses React Context (`app/context/AccountContext.tsx`) accessed via the `useAccount` hook to manage account data (loading, selection, refresh). The `zustand` dependency is included in `package.json` but is not currently used.
- **Theming:** Supports light/dark mode using `@react-navigation/native`'s `ThemeProvider` and the `useColorScheme` hook.
- **Data Persistence:** Uses `@react-native-async-storage/async-storage` (likely via `app/utils/storage.ts`) for storing data locally.
- **Custom UI:** Includes global custom components like `HapticTab` in the root `components/` directory. Uses `@gorhom/bottom-sheet` for bottom sheet UIs.

## Available Scripts

- `npm start`: Starts the Expo development server.
- `npm run android`: Starts the app on an Android emulator/device.
- `npm run ios`: Starts the app on an iOS simulator/device.
- `npm run web`: Starts the app in a web browser.
- `npm run test`: Runs tests using Jest.
- `npm run lint`: Lints the code using Expo's lint configuration.
- `npm run reset-project`: (As described in the original README) Moves starter code to `app-example` and creates a blank `app` directory.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Architecture Approach

This project aims for a scalable and maintainable architecture, prepared for future data synchronization features.

- **State Management:** Uses **Zustand** for efficient, decoupled global state management. State logic is organized into stores (e.g., `src/stores/accountStore.ts`).
- **Local Data Persistence:** Employs **WatermelonDB** for robust local storage, managed via a dedicated data layer.
- **Data Layer:** A **Repository Pattern** (`src/data/repositories/`) abstracts data operations. Zustand stores interact with repositories, which in turn coordinate with local (and potentially remote, in the future) data sources (`src/data/sources/`). This isolates storage details and simplifies adding sync capabilities.
- **Structure:** Code is organized into feature modules (`src/features/`), a shared UI components directory (`src/components/`), and distinct layers for data (`src/data/`), state (`src/stores/`), navigation (`src/navigation/`), etc., to promote separation of concerns.

## Architecture Refactoring Plan & Progress

This section tracks the progress of refactoring the application to use WatermelonDB, Zustand, and the Repository pattern for improved scalability and future synchronization capabilities.

**Phase 1: Setup & Data Layer**

- [x] Install WatermelonDB dependencies (`@nozbe/watermelondb`, `@morrowdigital/watermelondb-expo-plugin`, `expo-build-properties`).
- [x] Install and configure Babel plugin (`@babel/plugin-proposal-decorators`).
- [x] Clear Metro cache (`npx expo start --clear`).
- [x] Define WatermelonDB schema (`app/data/models/schema.ts`).
- [x] Define WatermelonDB models (`app/data/models/Account.ts`, etc.).
- [x] Initialize WatermelonDB instance (`app/data/database.ts`).
- [x] Define Repository interfaces (`app/data/repositories/IAccountRepository.ts`, etc.).
- [ ] Implement WatermelonDB local data source (`app/data/sources/local/WatermelonAccountSource.ts`).
- [ ] Implement Repositories (`app/data/repositories/AccountRepository.ts`).

**Phase 2: State Management Migration**

- [ ] Create Zustand store(s) (`app/stores/accountStore.ts`).
- [ ] Implement store state and actions using Repositories.

**Phase 3: UI Refactoring & Cleanup**

- [ ] Refactor components using `AccountContext` to use the new Zustand store(s).
- [ ] Remove `AccountProvider` from `app/_layout.tsx`.
- [ ] Delete `app/context/AccountContext.tsx`.
- [ ] Delete `app/utils/storage.ts` (if fully replaced).

**Phase 4: (Optional) Structure Refinement**

- [ ] Create `src/` directory and move relevant code into it (components, hooks, constants, utils, types, stores, data, etc.).
- [ ] Keep `app/` minimal for Expo Router file-based routing, importing necessary components/layouts from `src/`.
- [ ] Update `tsconfig.json` paths if needed.

**Phase 5: Testing**

- [ ] Thoroughly test all refactored features and data persistence.
