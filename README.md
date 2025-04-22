# ElaraLedger

A React Native mobile application built with Expo, likely designed for ledger management or financial tracking.

## Technology Stack

*   **Framework:** React Native
*   **Platform:** Expo (v52)
*   **Language:** TypeScript
*   **Navigation:** Expo Router (File-based routing)
*   **State Management:** Zustand
*   **UI Components:** Expo components, `@expo/vector-icons`, `@gorhom/bottom-sheet`, custom components
*   **Storage:** AsyncStorage
*   **Testing:** Jest

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
│   ├── components/        # UI components specific to the app directory
│   ├── context/           # React Context providers (e.g., AccountProvider)
│   ├── screens/           # Likely contains non-tab screens (if any)
│   ├── store/ | stores/   # Zustand state management stores
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

*   **Navigation:** Handled by `expo-router`. The main navigation is a bottom tab bar defined in `app/(tabs)/_layout.tsx`. The root layout in `app/_layout.tsx` uses a Stack navigator.
*   **State Management:** Uses `zustand` (likely configured in `app/store/` or `app/stores/`). Global account state seems to be managed via `app/context/AccountContext.tsx`.
*   **Theming:** Supports light/dark mode using `@react-navigation/native`'s `ThemeProvider` and the `useColorScheme` hook.
*   **Data Persistence:** Uses `@react-native-async-storage/async-storage` for storing data locally.
*   **Custom UI:** Includes custom components like `HapticTab` in `components/` and potentially others in `app/components/`. Uses `@gorhom/bottom-sheet` for bottom sheet UIs.

## Available Scripts

*   `npm start`: Starts the Expo development server.
*   `npm run android`: Starts the app on an Android emulator/device.
*   `npm run ios`: Starts the app on an iOS simulator/device.
*   `npm run web`: Starts the app in a web browser.
*   `npm run test`: Runs tests using Jest.
*   `npm run lint`: Lints the code using Expo's lint configuration.
*   `npm run reset-project`: (As described in the original README) Moves starter code to `app-example` and creates a blank `app` directory.

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
