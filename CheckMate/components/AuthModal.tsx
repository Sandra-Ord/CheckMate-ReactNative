import {BottomSheetView} from "@gorhom/bottom-sheet";
import {Image, Text, TouchableOpacity} from "react-native";
import React from "react";
import {useOAuth, useSignIn, useSignUp} from "@clerk/clerk-expo";
import {AuthStrategy, ModalType} from "@/types/enums";

const LOGIN_OPTIONS = [
    {
        text: "with Google",
        icon: require("@/assets/images/login/google.png"),
        strategy: AuthStrategy.Google
    },
    {
        text: "with Microsoft",
        icon: require("@/assets/images/login/microsoft.png"),
        strategy: AuthStrategy.Microsoft
    },
    {
        text: "with Apple",
        icon: require("@/assets/images/login/apple.png"),
        strategy: AuthStrategy.Apple
    }
]

interface AuthModalProps {
    authType: ModalType | null
}

const AuthModal = ({authType}: AuthModalProps) => {

    const {startOAuthFlow: googleAuth} = useOAuth({strategy: AuthStrategy.Google});
    const {startOAuthFlow: microsoftAuth} = useOAuth({strategy: AuthStrategy.Microsoft});
    const {startOAuthFlow: appleAuth} = useOAuth({strategy: AuthStrategy.Apple});

    const {signUp, setActive} = useSignUp();
    const {signIn} = useSignIn();

    const onSelectAuth = async (strategy: AuthStrategy) => {
        console.log("Selected auth " + strategy);

        // Code source: https://clerk.com/docs/custom-flows/oauth-connections#o-auth-account-transfer-flows

        if (!signIn || !signUp) return null;

        const selectedAuth = {
            [AuthStrategy.Google]: googleAuth,
            [AuthStrategy.Microsoft]: microsoftAuth,
            [AuthStrategy.Apple]: appleAuth
        }[strategy];

        // If the user has an account in your application, but does not yet
        // have an OAuth account connected to it, you can transfer the OAuth
        // account to the existing user account.
        const userExistsButNeedsToSignIn =
            signUp.verifications.externalAccount.status === 'transferable' &&
            signUp.verifications.externalAccount.error?.code === 'external_account_exists';

        if (userExistsButNeedsToSignIn) {
            const res = await signIn.create({transfer: true});

            if (res.status === 'complete') {
                setActive({
                    session: res.createdSessionId,
                });
            }
        }

        // If the user has an OAuth account but does not yet
        // have an account in your app, you can create an account
        // for them using the OAuth information.
        const userNeedsToBeCreated = signIn.firstFactorVerification.status === 'transferable';

        if (userNeedsToBeCreated) {
            const res = await signUp.create({
                transfer: true,
            });

            if (res.status === 'complete') {
                setActive({
                    session: res.createdSessionId,
                });
            }
        } else {
            // If the user has an account in your application
            // and has an OAuth account connected to it, you can sign them in.
            try {
                const {createdSessionId, setActive} = await selectedAuth();

                if (createdSessionId) {
                    setActive!({
                        session: createdSessionId,
                    });
                }
            } catch (err) {
                console.log("OAuth error", err);
            }

        }
    };

    return (
        <BottomSheetView className="p-5 gap-10">
            {LOGIN_OPTIONS.map((option, index) => (
                <TouchableOpacity key={index}
                                  className="flex-row gap-5"
                                  onPress={() => onSelectAuth(option.strategy!)}
                >
                    <Image source={option.icon} style={{width: 24, height: 24}}/>
                    <Text>{authType === ModalType.Login ? "Log in" : "Sign up"} {option.text}</Text>
                </TouchableOpacity>
            ))}
        </BottomSheetView>
    );
};

export default AuthModal;