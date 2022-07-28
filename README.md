# Trainify

Walk Throught the application

## 1) Install & run

Install the application on any iPhone and run it either from testflight or from AppStore.

- Step 1: Clone the App

```
git clone https://github.com/smiletechinc/trainify-react-app.git
```

- Step 2: Install the npm react packages

  ```
  npm install
  ```

- Step 3: Install pods
  ```
  pod install
  ```
- Step 4: Buil app on device
  ```
  react-native run-ios --device "iPhone"
  ```

## 2) Sign Up

Signup the application by providing the credentials.

## 3) Sign In

Sign in the application by using the same credentials that you provided in the signup method

## 4) Subscriptions

### i. Free Trial

You can enjoy the free trial of the application for a period of 30 days. Morever the free trial is only for Serve Practice only.

### ii. Premium Subscription

You can enjoy the premium feature by purchasing @ $9.99 per month. By purchasing this feature you will able to unlock the Server Practice and Practice with Ball Machine for a period of 60 days.

For testing you can use these credentials:

```
email: hfshan247@gmail.com
password: 123456
```

## 5) Recording Serve Practice

On our landing page after you page, you might be able to navigate to Serve Practice and can record videos by clicking on _Record Serve Practice_ button.

## 6) Analysis Report for Serve Practice

When on Serve Practice screen you can click on _Analysis Report_ button to navigate to the analysis screen where you can see all the recorded videos list and their graphs.

## 7) Recording Practice Vollay

You can enjoy the premium feature _Practice Rally_ by clicking on _Practice Rally_ button on home screen and might be able to record videos.

## 6) Analysis Report for Practice Rally

When on Practice Rally screen you can click on _Analysis Report_ button to navigate to the analysis screen where you can see all the recorded videos list and their graphs.

## 7) Example App Run

Here is an example of the App Run. To see how our application works you may click on the link to preview the video.
https://drive.google.com/drive/folders/11fflenPYnROyqhlw75-N4VK8JfYlMeGN?usp=sharing

# Getting Started with React Native

This will help you install and build your React Native app.

If you are new to mobile development, the easiest way to get started is with Expo CLI. Expo is a set of tools built around React Native and, while it has many features, the most relevant feature for us right now is that it can get you writing a React Native app within minutes. You will only need a recent version of Node.js and a phone or emulator. If you'd like to try out React Native directly in your web browser before installing any tools, you can try out Snack.

If you are already familiar with mobile development, you may want to use React Native CLI. It requires Xcode or Android Studio to get started. If you already have one of these tools installed, you should be able to get up and running within a few minutes. If they are not installed, you should expect to spend about an hour installing and configuring them.

Expo CLI Quickstart React Native CLI Quickstart
Follow these instructions if you need to build native code in your project. For example, if you are integrating React Native into an existing application, or if you "ejected" from Expo, you'll need this section.

The instructions are a bit different depending on your development operating system, and whether you want to start developing for iOS or Android. If you want to develop for both Android and iOS, that's fine - you can pick one to start with, since the setup is a bit different.

Development OS: macOS
Target OS: iOS
Installing dependencies
You will need Node, Watchman, the React Native command line interface, and Xcode.

While you can use any editor of your choice to develop your app, you will need to install Xcode in order to set up the necessary tooling to build your React Native app for iOS.

Node, Watchman, JDK
We recommend installing Node, Watchman, and JDK using Homebrew. Run the following commands in a Terminal after installing Homebrew:

```

$ brew install yarn
$ brew install node
$ brew install watchman
$ brew tap AdoptOpenJDK/openjdk
$ brew cask install adoptopenjdk8

```

If you have already installed Node on your system, make sure it is Node 8.3 or newer.

Watchman is a tool by Facebook for watching changes in the filesystem. It is highly recommended you install it for better performance.

If you have already installed JDK on your system, make sure it is JDK 8 or newer.

The React Native CLI
Node comes with npm, which lets you install the React Native command line interface.

Run the following command in a Terminal:

npm install -g react-native-cli
If you get an error like Cannot find module 'npmlog', try installing npm directly: curl -0 -L https://npmjs.org/install.sh | sudo sh.

Xcode
The easiest way to install Xcode is via the Mac App Store. Installing Xcode will also install the iOS Simulator and all the necessary tools to build your iOS app.

If you have already installed Xcode on your system, make sure it is version 9.4 or newer.

Command Line Tools
You will also need to install the Xcode Command Line Tools. Open Xcode, then choose "Preferences..." from the Xcode menu. Go to the Locations panel and install the tools by selecting the most recent version in the Command Line Tools dropdown.

Xcode Command Line Tools

Creating a new application
Use the React Native command line interface to generate a new React Native project called "AwesomeProject":

react-native init AwesomeProject
This is not necessary if you are integrating React Native into an existing application, if you "ejected" from Expo (or Create React Native App), or if you're adding iOS support to an existing React Native project (see Platform Specific Code). You can also use a third-party CLI to init your React Native app, such as Ignite CLI.

[Optional] Using a specific version
If you want to start a new project with a specific React Native version, you can use the --version argument:

react-native init AwesomeProject --version X.XX.X
react-native init AwesomeProject --version react-native@next
Running your React Native application
Run react-native run-ios inside your React Native project folder:

cd AwesomeProject
react-native run-ios
You should see your new app running in the iOS Simulator shortly.

AwesomeProject on iOS

react-native run-ios is one way to run your app. You can also run it directly from within Xcode.

If you can't get this to work, see the Troubleshooting page.

Running on a device
The above command will automatically run your app on the iOS Simulator by default. If you want to run the app on an actual physical iOS device, please follow the instructions here.

Modifying your app
Now that you have successfully run the app, let's modify it.

Open App.js in your text editor of choice and edit some lines.
Hit ⌘R in your iOS Simulator to reload the app and see your changes!
That's it!
Congratulations! You've successfully run and modified your first React Native app.

Now what?
Turn on Live Reload in the Developer Menu. Your app will now reload automatically whenever you save any changes!

If you want to add this new React Native code to an existing application, check out the Integration guide.

If you're curious to learn more about React Native, continue on to the Tutorial.

```

```
