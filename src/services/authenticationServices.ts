import { db, app } from './../config/db';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

export const signInService = (authObject:AuthObject, onSuccess?:any,onFailure?:any) => {
    const {email, password} = authObject;
    if (app) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log('User: ', JSON.stringify(userCredential));
    onSuccess(user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    onFailure(error);
  });
    } else {
        const error:ErrorObject = {
            message: 'Something went wrong while executing your request'
        }
        onFailure(error);
    }
}

export const signUpService = (authObject:AuthObject, onSuccess?:any,onFailure?:any) => {
    const {email, password} = authObject;
    if (app) {
    const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
     console.log('User: ', JSON.stringify(userCredential));
    onSuccess(user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    onFailure(error);
  });
    } else {
        const error:ErrorObject = {
            message: 'Something went wrong while executing your request'
        }
        onFailure(error);
    }
}

export const resetPasswordService = (email:string, onSuccess?:any, onFailure?:any) => {
    console.log('Sending...')
    if (app) {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
    .then((user) => {
    // Signed in
    onSuccess(user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    onFailure(error);
  });
    } else {
        const error:ErrorObject = {
            message: 'Something went wrong while executing your request'
        }
        onFailure(error);
    }
}

export const registerUserService = (userObject:UserObject, onSuccess?:any, onFailure?:any) => {
    const branch = `/users/${userObject.id}`
    console.log('Branch: ', branch)
    if (db) {
        set(ref(db, branch), userObject)
        .then((user) => {
        // Signed in
        onSuccess(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        onFailure(error);
      });
        } else {
            const error:ErrorObject = {
                message: 'Something went wrong while executing your request'
            }
            onFailure(error);
        }
}

export const addBalance = (accountNumber, amount, currency) => {
    db.ref('/balance').push({
        account: accountNumber,
        balance: amount,
        currency: currency
    });
}