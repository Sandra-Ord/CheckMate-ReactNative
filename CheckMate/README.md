# Welcome to your Expo app 👋

## Table of Contents

---

- [Welcome to your Expo app 👋](#welcome-to-your-expo-app-)
- [Create the App](#create-the-app)
    - [Get a Fresh Project](#get-a-fresh-project)
- [Add NativeWind to Your Project](#add-nativewind-to-your-project)
- [Running the Project](#running-the-project)
    - [Start the Development Server](#start-the-development-server)
    - [Generating Native Project Files](#generating-native-project-files)
    - [Building and Running the App Directly on Devices or Emulators](#building-and-running-the-app-directly-on-devices-or-emulators)
- [Get Started](#get-started)
- [Setting Up Supabase and Clerk](#setting-up-supabase-and-clerk)
    - [What is Supabase and Clerk?](#what-is-supabase-and-clerk)
    - [Step 1: Create a Supabase Project](#step-1-create-a-supabase-project)
    - [Step 2: Create a Clerk Application](#step-2-create-a-clerk-application)
    - [Step 3: Setting Up Environment Variables](#step-3-setting-up-environment-variables)
    - [Step 4: Setup Clerk with Supabase](#step-4-setup-clerk-with-supabase)
    - [Step 5: Supabase Edge Function and Clerk Webhook](#step-5-supabase-edge-function-and-clerk-webhook)
- [Learn More](#learn-more)

---


## Create the App

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app):
```bash
npx create-expo-app@latest projectName -t default
```

### Get a fresh project

When you're ready, run:
```bash
npm run reset-project
```
Alternatively:
```bash
node scripts/reset-project.js
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

Alternatively, you can also delete the contents on the **app**, **components** and **hooks** folders.

---

## Add NativeWind To Your Project

NativeWind allows you to use Tailwind CSS to style your components in React Native.  
Source for adding [NativeWind](https://www.nativewind.dev/getting-started/react-native).

1. **Install NativeWind and Required Dependencies**  
    ```bash
    npx expo install nativewind tailwindcss react-native-reanimated react-native-safe-area-context
    ```
   
2. **Tailwind CSS Configuration**  
   * Initialize `tailwind.config.js` file by running:
     ```bash
     npx tailwindcss init
     ```
   * Update the configuration by replacing the contents of `tailwind.config.js` file with the following code:
     ```js
     /** @type {import('tailwindcss').Config} */
     module.exports = {
       // NOTE: Update this to include the paths to all of your component files (that will use TailWind CSS).
       content: ["./app/**/*.{js,jsx,ts,tsx}"],
       presets: [require("nativewind/preset")],
       theme: {
         extend: {},
       },
       plugins: [],
     }
     ```
     
3. **Create a `global.css` file**  
    In the root of your project, create a `global.css` file with the following content to include TailWind's base, components and utilities styles: 
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```
   
4. **Update the Babel Configuration**  
   Replace the content of `babel.config.js` with this configuration to enable NativeWind with Babel:
    ```js
    module.exports = function (api) {
      api.cache(true);
      return {
        presets: [
          ["babel-preset-expo", { jsxImportSource: "nativewind" }],
          "nativewind/babel",
        ],
      };
    };
    ```
   
5. **Configure Metro with NativeWind**  
   In the project root, create or update `metro.config.js` file with the following setup:
    ```js
    const { getDefaultConfig } = require("expo/metro-config");
    const { withNativeWind } = require('nativewind/metro');
    
    const config = getDefaultConfig(__dirname)
    
    module.exports = withNativeWind(config, { input: './global.css' })
    ```

6. **Import the `global.css` File in the App's Entry Point**  
   In your app's entry file (such as `App.js or `index.js), add the following import:
    ```ts
    import "./global.css"
    ```
   
7. **Update `app.json` for Metro Bundler on Web**  
   To use Metro as the bundler for web, update your `app.json` with the following configuration:
    ```json
    {
      "expo": {
        "web": {
          "bundler": "metro"
        }
      }
    }
    ```

8. **Add Type Declarations for NativeWind**  
   In the root of your project, create an `app.d.ts` file with this content to include type declarations for NativeWind:
    ```ts
    /// <reference types="nativewind/types" />
    ```

---

## Running the project

### Start the Development Server

```bash
npx expo start
```

Starts the Expo development server and opens the Expo Developer Tools interface in your default web browser. 
You can scan the QR code with the Expo Go app to preview the app on a physical device without 
building a standalone app.

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

Alternatively:
```bash
npm start
```

Runs the default start script defined in the package.json file, which will internally run npx expo start in Expo projects.
For projects created with Expo, will internally run `npx expo start`.


### Generating Native Project Files

```bash
npx expo prebuild
```

Generates native Android and iOS project files, creating android and ios directories in your Expo project. 
This is required if you need to add custom native code or libraries, as it converts the project from a 
managed workflow to a bare workflow.


### Building and Running the App Directly on Devices or Emulators

> **Note**:   
> 
> Before running the following commands, 
> ensure you’ve run `npx expo prebuild` to generate native files. 
> 
> The `npx expo run:ios` command requires macOS with Xcode installed for iOS builds.


### Android 

```bash
npx expo run:android
```

Builds and runs the app on an Android device or emulator. 
This compiles your app into a native Android package (APK or AAB), 
which can run directly on an Android device or emulator without needing the Expo Go app. 
Ideal for testing Android-specific features and native modules.


### iOS

```bash
npx expo run:ios
```

Builds and runs the app on an iOS device or simulator. 
This compiles your app into a native iOS package, 
allowing you to run it directly on an iOS device or simulator. 
Useful for testing iOS-specific features or integrations that are not supported by the Expo Go app.


---


## Get started

1. Install dependencies

   ```bash
   npm install
   ```

    ```bash
    npm install base64-arraybuffer
    npm add zeego react-native-ios-context-menu react-native-ios-utilities @react-native-menu/menu
    ```
2. Start the app

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

---

## Setting Up Supabase and Clerk

### What is Supabase and Clerk?

- **Supabase**: An open-source backend-as-a-service platform providing a PostgreSQL database, authentication, and 
  real-time data synchronization.  
  It offers a simple and scalable way to build full-stack applications by providing APIs and tools to manage databases,
  storage, and authentication out of the box.  
  It's an alternative to Firebase, with a focus on open-source technology and SQL databases.
  

- **Clerk**: A developer tool for user authentication and management, 
  offering pre-built components for sign-up, login, and profile management. 
  Clerk simplifies integrating secure, customizable authentication with APIs and SDKs for various frameworks.

---

### Step 0: Install Dependencies

```bash
npm install @clerk/clerk-expo
npx expo install expo-secure-store
npx expo install @supabase/supabase-js
Npx expo install @expo/react-native-action-sheet
Npx expo install expo-web-browser
npm i @gorhom/bottom-sheet
```

### Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and log in or create an account.
2. (Optional) Create an organization to place the project in.
3. Click **New Project** and fill in required details:
   - **Project Name**
   - **Database Password**
   - **Region**

---

### Step 2: Create a Clerk Application

1. Go to [Clerk](https://clerk.com/) and log in or create an account.
2. Click **New Application** and name your app.
3. In the **Configure** tab, go to **Email, Phone, Username** settings.
   - Toggle the following options:
     - **Email Address** 
     - **Name**
     - **Allow Users to Delete Accounts**.

---

### Step 3: Setting Up Environment Variables

1. Create a `.env` file in your project root.
2. Open the `.env` file and add the contents:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=
   EXPO_PUBLIC_SUPABASE_ANON_KEY=
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
   ```
3. Retrieve variable values:
   - **EXPO_PUBLIC_SUPABASE_URL**:
      - Go to **Supabase Project Settings** > **API**.
      - Copy the **Project URL** and paste it into `.env`.
   - **EXPO_PUBLIC_SUPABASE_ANON_KEY**:
      - From the same API section, find **Project API Keys**.
      - Copy the **anon public** key and paste it into `.env`.
   - **EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY**:
      - Go to **Clerk Application** > **Configure** > **API Keys**.
      - Copy the **Publishable key** and paste it into `.env`.
4. Save `.env`.
5. Ensure `.env` is ignored by Git by added it to .gitignore.
   ```bash
   # Add in the .gitignore
   .env
   ```

---

### Step 4: Setup Clerk with Supabase

1. Get the **JWT Secret** from Supabase.
   - Open Supabase.
   - Go to **Project Settings** > **API**. 
   - In **JWT Settings**, copy the **JWT Secret**.


2. Create a **JWT Template** in Clerk.
   - Open Clerk
   - Go to **Configure** > **JWT Templates**
   - Add a new template, select **Supabase**, and enable **Custom Signing Key**.
   - Paste the **JWT Secret** from Supabase into **Signing key** field and save changes.

---

### Step 5: Supabase Edge Function and Clerk Webhook

Create a webhook to have a user entity in Supabase updated when a user is created in Clerk.

#### A. Initialize Supabase Project Locally

1. Open Command Prompt and navigate to your project root.
2. Initialize a new local Supabase project.
   - Run the command.
     ```bash
     npx supabase init
      ```
   - Choose to generate settings for your IDE (VS Code or IntelliJ).
   - Install **Deno Plugin**.
3. Login to Supabase:
   ```bash
   npx supabase login
   ```

#### B. Link Local Supabase Project to Online Project

1. In Supabase, go to **Project Settings** > **General**.
2. Copy the **Project ID**.
3. Prepare the following command, replacing `<project-ref>` with your Project ID:
   ```bash
   npx supabase link --project-ref <project-ref>
   ```
4. Navigate to **Database**, reset your **Database Password**:
   - Copy and save the new password.
5. Run the command and enter the password when prompted.

#### C. Create and Deploy a Supabase Function

1. Create a new function:
   ```bash
   npx supabase functions new create-user
   ```
2. Take the code from the file `supabase/functions/create-user/index.ts`, copy the contents and paste to your project.
3. Ensure Docker is installed and running.
4. Deploy the function:
   ```bash
   npx supabase functions deploy --no-verify-jwt
   ```
5. Verify function deployment in Supabase under **Edge Functions**.
6. Copy the **Endpoint URL** from the deployed function.

#### D. Set Up Clerk Webhook

1. In **Clerk** > **Configure** > **Webhooks**:
   - Add an **Endpoint** with the copied URL from the edge function.
   - Subscribe to the **user.created** event and save.
2. Test webhook:
   - In Clerk, under the Testing tab send a **user.created** example event.
   - Verify user creation in Supabase’s **Table Editor** under **Users**.

--- 

---

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.



---