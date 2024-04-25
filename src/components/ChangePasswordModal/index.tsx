import { FormComponents } from 'isp-ui-kit'
import { FC } from 'react'
import { useForm } from 'react-hook-form'

import Modal from '@widgets/Modal'

import {
  ChangePasswordModalProps,
  ChangePasswordModalType
} from '@components/ChangePasswordModal/change-password-modal.type.ts'


const { FormInputPassword } = FormComponents
const ChangePasswordModal: FC<ChangePasswordModalProps> = ({
  open,
  onClose
}) => {
  const { control, handleSubmit } = useForm<ChangePasswordModalType>({
    mode: 'onChange'
  })

  const onSubmit = (formValue: ChangePasswordModalType) => {
    //TODO добавить бэк, как появится
    console.log(formValue)
  }

  return (
    <Modal
      title="Сменить пароль"
      open={open}
      onClose={onClose}
      onOk={handleSubmit(onSubmit)}
      footer={{ onOkText: 'Изменить пароль', onCanselText: 'Отмена' }}
    >
      <form key="change-pass-modal">
        <FormInputPassword
          rules={{
            required: { value: true, message: 'Поле не может быть пустым' }
          }}
          label="Старый пароль"
          control={control}
          name="oldPassword"
        />
        <FormInputPassword
          rules={{
            required: { value: true, message: 'Поле не может быть пустым' }
          }}
          label="Новый пароль"
          control={control}
          name="newPassword"
        />
        <FormInputPassword
          rules={{
            required: { value: true, message: 'Поле не может быть пустым' },
            validate: (value, formValues) => {
              const { newPassword } = formValues
              return value !== newPassword ? 'Пароли не совпадают' : true
            }
          }}
          label="Подтвердите пароль"
          control={control}
          name="confirmPassword"
        />
      </form>
    </Modal>
  )
}
export default ChangePasswordModal
