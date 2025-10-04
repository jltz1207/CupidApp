import React, { useEffect, useState } from 'react'
import AccountNavBar from './Elements/AccountNavBar'
import Account_Profile from './Elements/Account_Profile'
import Account_Tag from './Elements/Account_Tag'
import { AccountForm, AccountFormValue, IAccountFormError } from '../../Model/Account'
import { useStore } from '../../store/Store'
import Account_Login from './Elements/Account_Login'
import LoginButton from '../../component/FormElement/Login/LoginButton'
import { useNavigate, useNavigation } from 'react-router-dom'
import * as yup from 'yup';
import Account_Weight from './Elements/Account_Weight'

export default function AccountPage() {
  const [enterLog, setEnterLog] = useState<boolean>(false)

  const [page, setPage] = useState<number>(0)
  const [record, setRecord] = useState<AccountForm>(new AccountFormValue())
  const { accountStore, summaryStore } = useStore()
  const navigate = useNavigate()
  const handleSubmit = () => {
    if (record.keywordWeight == undefined || record.keywordWeight < 0 ||
      record.interestWeight == undefined || record.interestWeight < 0 ||
      record.aboutMeWeight == undefined || record.aboutMeWeight < 0 ||
      record.valueWeight == undefined || record.valueWeight < 0 ||
      record.ageWeight == undefined || record.keywordWeight < 0 ){
        setPage(2)
        return;
      }


 

      accountStore.editAccountForm(record).then(() => navigate('/home'))//temp
  }
  useEffect(() => {
    accountStore.getAccountForm().then((res) => {
      console.log(res)
      accountStore.getAccountFormProfile().then(profiles => {
        if (profiles) {
          setRecord({ ...res, newProfileFiles: profiles })
          console.log({ ...res, newProfileFiles: profiles })
        }

      })

    })
  }, [])

  useEffect(() => {
    console.log(record)
  }, [record])

  const loginSection = () => (
    <div className="flex flex gap-2 justify-center mt-auto">
      <LoginButton title={'Next'} handleClick={handleSubmit} width='200' />
      <LoginButton color="#b2b8b4" title={'Back'} handleClick={() => { }} width='200' />
    </div>
  )

  const [errors, setErrors] = useState<Partial<IAccountFormError>>({});

  const atLeastTwoFiles = yup.array().of(
    yup.mixed().nullable()  // Allows File or undefined
  ).test(
    'at-least-one-file',
    'At least one file is required',
    array => array!.filter(item => item instanceof File).length >= 1
  );
  const baseValidationSchema = yup.object({

    keywordWeight: yup.number().required('keywordWeight is required').min(0, 'keywordWeight isrequired'),
    interestWeight: yup.number().required('interestWeight is required').min(0, 'interestWeight isrequired'),
    aboutMeWeight: yup.number().required('aboutMeWeight is required').min(0, 'aboutMeWeight isrequired'),
    valueWeight: yup.number().required('valueWeight is required').min(0, 'valueWeight isrequired'),
    ageWeight: yup.number().required('ageWeight is required').min(0, 'ageWeight isrequired'),


    name: yup.string().required('Name is required').trim().min(1, "Name can't be empty"),
    dateOfBirth: yup.string().required('Date Of Birth is required').trim().min(1, "Date Of Birth is required can't be empty"),
    bio: yup.string().required('Bio is required').trim().min(1, "Bio is required can't be empty"),
    newProfileFiles: atLeastTwoFiles,
    interestIds: yup.array().of(yup.number()).min(2, 'At least two tags are required'),
    aboutMeIds: yup.array().of(yup.number()).min(2, 'At least two tags are required'),
    valueIds: yup.array().of(yup.number()).min(2, 'At least two tags are required'),
    email: yup.string(),
    oldPassword: yup.string(),
    newPassword: yup.string(),
    confirmPassword: yup.string(),
  });
  let validationSchema = baseValidationSchema;
  if (enterLog) {
    validationSchema = baseValidationSchema.shape({
      email: yup.string().required("Email can't be empty").matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Fill in a correct email"),
      oldPassword: yup.string().required("Old Password can't be empty"),
      newPassword: yup.string().required("Password can't be empty").min(6, "Password must be at least 6 characters.").matches(/\d/, "Password must be at least 1 digit").matches(/[A-Z]/, "Password must be at least 1 Capital english letter"),
      confirmPassword: yup.string().required("Confirm Password can't be empty")  //not checking here

    });
  }
  const handleValidationChange = (field: string, value: any) => {
    validationSchema.validateAt(field, {
      [field]: value
    })
      .then(() => {
        setErrors(prev => ({ ...prev, [field]: '' }));
      })
      .catch(err => {
        console.log(err)
        setErrors(prev => ({ ...prev, [field]: err.message }));
      });
  }
  return (
    <div className="page-parent flex p-4 ">
      <AccountNavBar page={page} setPage={setPage} />
      <div className="flex flex-col flex-grow">
        {
          page === 0 ?
            <Account_Profile handleValidation={handleValidationChange} errors={errors} loginSection={loginSection} record={record} setRecord={setRecord} />
            : page === 1 ?
              <Account_Tag errors={errors} handleValidation={handleValidationChange} loginSection={loginSection} setRecord={setRecord} record={record} />
              : page === 2 ?
                <Account_Weight handleValidation={handleValidationChange} errors={errors} loginSection={loginSection} record={record} setRecord={setRecord} />
                : page === 3 ?
                  <Account_Login handleValidation={handleValidationChange} errors={errors} enterLog={enterLog} setEnterLog={setEnterLog} loginSection={loginSection} record={record} setRecord={setRecord} />
                  : ''

        }


      </div>

    </div>
  )
}
