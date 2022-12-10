import SpInAppUpdates, {IAUUpdateKind, StartUpdateOptions} from "sp-react-native-in-app-updates";
import {Platform} from "react-native";

const inAppUpdates = new SpInAppUpdates(
    false // isDebug
);

const checkVersionAndForceUpdateIfNeeded = async () => {
    const result = await inAppUpdates.checkNeedsUpdate({ curVersion: '0.0.8' })
    if (result.shouldUpdate) {
        let updateOptions: StartUpdateOptions = {};
        if (Platform.OS === 'android') {
            // android only, on iOS the user will be prompted to go to your app store page
            updateOptions = {
                updateType: IAUUpdateKind.IMMEDIATE,
            };
        }

        // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
        inAppUpdates.startUpdate(updateOptions);
    }
};

export default checkVersionAndForceUpdateIfNeeded;
