import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export type ShareModalRef = {
    open: () => void;
    close: () => void;
};

const ShareModal = forwardRef(({ subscription }: { subscription: Subscription | null }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const snapPoints = useMemo(() => ['40%'], []);

    useImperativeHandle(ref, () => ({
        open: () => bottomSheetRef.current?.expand(),
        close: () => bottomSheetRef.current?.close(),
    }));


    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1} // hidden initially
            snapPoints={snapPoints}
            enablePanDownToClose
        >
            <BottomSheetView>
                <SafeAreaView className="flex-1 items-center justify-center bg-background">
                    {subscription ? (
                        <Text>Sharing {subscription.name}</Text>
                    ) : (
                        <Text>Nothing to share</Text>
                    )}
                </SafeAreaView>
            </BottomSheetView>
        </BottomSheet>
    );
});

export default ShareModal;