import React, {FC, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useCameraDevices} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {
  useScanBarcodes,
  BarcodeFormat,
  Barcode,
} from 'vision-camera-code-scanner';

type Props = {
  onCapture: (code: Barcode[]) => void;
};

export const BarcodeScanner: FC<Props> = ({onCapture}): JSX.Element => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanned, setIsScanned] = React.useState(false);

  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([
    BarcodeFormat.ALL_FORMATS,
  ]);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  React.useEffect(() => {
    toggleActiveState();
    return () => {
      barcodes;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcodes]);

  const toggleActiveState = async () => {
    if (barcodes && barcodes.length > 0 && isScanned === false) {
      setIsScanned(true);
      onCapture(barcodes);
    }
  };

  return device != null && hasPermission ? (
    <>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!isScanned}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
        audio={false}
      />
    </>
  ) : (
    <></>
  );
};
