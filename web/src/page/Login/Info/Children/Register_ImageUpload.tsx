import React, { useEffect } from 'react'
import LoginButton from '../../../../component/FormElement/Login/LoginButton'
import { observer } from 'mobx-react-lite'
import { ProfileModel } from '../../../../Model/User'
import { useStore } from '../../../../store/Store'
import { useNavigate } from 'react-router-dom'
import ImageUploadElement from '../../../../component/FormElement/Image/ImageUploadElement'
import ImageUploadContainer from './ImageUpload/ImageUploadContainer'
import RegisterHeading from '../../../../component/FormElement/Login/Register/RegisterHeading'
import ProfileCrop from '../../../../component/crop/ProfileCrop'

interface prop {
  setPage: (n: Number) => void
  record: ProfileModel
  setRecord: (model: ProfileModel) => void
}

export default observer(function Register_ImageUpload({ record, setRecord, setPage }: prop) {


  useEffect(() => {
    console.log(record.profileFiles)
  }, [record.profileFiles])

  const setFiles = (newFiles:  (File|undefined)[]) => {
    setRecord({ ...record, profileFiles: newFiles })
  }
  const store = useStore();
  const { accountStore } = store;

  const navigate = useNavigate();

  // const onSubmit = () => {
  //   if (accountStore.User == null) {
  //     navigate('/')
  //     return;
  //   }
  //   accountStore.Submit_Profile({ ...record, id: accountStore.User?.id }).then((i) => {
  //     navigate("/home")
  //   })
  // }
  const firstRow = [0, 1, 2].map((item, idx) => (
    <ImageUploadElement idx={item} setFiles={setFiles} files={record.profileFiles} />
  ))
  const secondRow = [3, 4, 5].map((item, idx) => (
    <ImageUploadElement idx={item} setFiles={setFiles} files={record.profileFiles} />
  ))

  return (
    <div className="regInfo-children">
      <RegisterHeading title={"Add Photos"} content={"Add at least 2 photos to continue."} />
      <ImageUploadContainer reg={true} files={record.profileFiles} setFiles={setFiles} />

      <div className="flex flex-nowrap gap-2 justify-center mt-4">
                <LoginButton title={'Next'} handleClick={() =>  setPage(2) } width='200' />
                <LoginButton color="#b2b8b4" title={'Back'} handleClick={() => setPage(0)} width='200' />
            </div>
    </div>
  )
})
