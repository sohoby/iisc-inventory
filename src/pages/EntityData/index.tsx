import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import FullPage from '../../components/layouts/full-page/FullPage';
import {Sizes} from '../../assets/Theme';
import {CommonStyles} from '../../assets/CommonStyle';
import {Button, Input} from '@rneui/themed';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import {API_URL} from '../../utils/constants';

const validation = Yup.object().shape({
  entityCode: Yup.string().required('Required'),
  entity: Yup.string().required('Required'),
});

type FormValues = {
  entityCode: string;
  entity: string;
};

type EntityType = {
  label: string;
  value: string;
};

export const EntityData = () => {
  const navigation = useNavigation<any>();
  const route: any = useRoute();
  const [code, setCode] = useState<string>('');
  const [prevData, setPrevData] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [entities, setEntities] = useState<EntityType[]>([]);

  useEffect(() => {
    if (route?.params?.code) {
      setCode(route.params.code);
      setPrevData(route.params.prevData);
    }
  }, [route.params]);

  useEffect(() => {
    if (code) {
      (async () => {
        const data = await getEntities();
        if (data.rows && data.total > 0) {
          const ent = data.rows.map((item: any) => ({
            value: item.id,
            label: item.name,
          }));
          setEntities(ent);
        }
      })();
    }
  }, [code]);

  const getEntities = async (): Promise<any> => {
    try {
      const res = await axios.get(`${API_URL}/companies`);
      return res.data;
    } catch (e: any) {
      console.log('==== ERROR IN GET ENTITIES ====');
      console.log(e.message);
      return false;
    }
  };

  const handleSubmitForm = async (values: FormValues) => {
    const data = {...prevData, ...values};

    navigation.push('assetData', {
      code: code,
      prevData: data,
    });
  };

  return (
    <FullPage title={'ENTITY DATA'} hasBackBtn={true} disableScroll={true}>
      <View style={styles.container}>
        <View style={styles.formArea}>
          <Formik
            initialValues={{
              entityCode: '',
              entity: '',
            }}
            validationSchema={validation}
            onSubmit={handleSubmitForm}>
            {({
              isSubmitting,
              handleSubmit,
              values,
              setFieldValue,
              setFieldTouched,
              errors,
              touched,
            }) => (
              <View>
                <View>
                  <Text style={CommonStyles.ddTitleText}>Entity Name</Text>
                  <DropDownPicker
                    loading={entities.length === 0}
                    //searchable={true}
                    key={'entity-name'}
                    placeholder="Select Entity"
                    placeholderStyle={CommonStyles.ddPlaceholderStyle}
                    containerStyle={CommonStyles.ddContainerStyle}
                    style={CommonStyles.ddStyle}
                    dropDownContainerStyle={CommonStyles.dropDownContainerStyle}
                    labelStyle={CommonStyles.ddLabelText}
                    disabled={false}
                    open={open}
                    value={values.entity}
                    items={entities}
                    setOpen={val => {
                      setOpen(val);
                      if (!val) {
                        setFieldTouched('entity');
                      }
                    }}
                    setValue={fn => {
                      const value = fn(values.entity);
                      setFieldValue('entity', value);
                      setFieldValue('entityCode', `${value}`);
                    }}
                    setItems={setEntities}
                  />
                  <Text style={CommonStyles.ddErrorText}>
                    {touched.entity && errors.entity
                      ? errors.entity
                      : undefined}
                  </Text>
                </View>

                <View style={styles.inputContainer}>
                  <Input
                    disabled={false}
                    disabledInputStyle={CommonStyles.disabledInputStyle}
                    inputContainerStyle={CommonStyles.inputContainerStyle}
                    errorMessage={
                      touched.entityCode && errors.entityCode
                        ? errors.entityCode
                        : undefined
                    }
                    label="Entity Code"
                    labelStyle={CommonStyles.labelStyle}
                    placeholder="Entity Code"
                    //onBlur={() => setFieldTouched('entityCode')}
                    //onChangeText={value => setFieldValue('entityCode', value)}
                    value={values.entityCode}
                    editable={false}
                    style={CommonStyles.inputStyle}
                  />
                </View>

                <View>
                  <Button
                    disabled={isSubmitting}
                    buttonStyle={[CommonStyles.buttonStyle, styles.button]}
                    disabledStyle={CommonStyles.buttonDisabledStyle}
                    containerStyle={CommonStyles.buttonContainerStyle}
                    onPress={handleSubmit}
                    title="NEXT"
                    titleStyle={CommonStyles.buttonTitleStyle}
                  />
                </View>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </FullPage>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  formArea: {
    paddingHorizontal: 20,
    // width: Sizes.windowWidth * 0.7,
  },
  button: {
    width: Sizes.windowWidth * 0.87,
    alignSelf: 'center',
    marginTop: 10,
  },
  inputContainer: {
    marginTop: 5,
  },
});
