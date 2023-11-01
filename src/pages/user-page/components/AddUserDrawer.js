// ** React Imports
import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LoadingButton from '@mui/lab/LoadingButton'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Actions Imports
import { createUser } from 'src/api/user'
import { VALID_PASSWORD_REGEX } from 'src/constants/regex'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Email là trường bắt buộc'),
  password: yup
    .string()
    .required('Mật khẩu là trường bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 kí tự')
    .required()
    .matches(VALID_PASSWORD_REGEX, 'Mật khẩu phải có ít nhất 6 kí tự, 1 kí tự thường và 1 chữ số'),
    username: yup
    .string()
    .required('Tên là trường bắt buộc')
    .min(3, 'Tên phải có ít nhất 3 kí tự')
    .max(30, 'Tên tối đa chỉ chứa 30 kí tự'),
})

const defaultValues = {
  email: '',
  username: '',
  password: '',
}

const SidebarAddUser = props => {
  // ** Props
  const { open, toggle, fetchData } = props

  // ** State
  const [role, setRole] = useState('operator')
  const [loading, setLoading] = useState(false)

  // ** Hooks

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = useCallback(
    async data => {
      try {
        setLoading(true)

        const combinedData = {
          ...data,
          role: role
        }
        await createUser(combinedData).then(() => {
          toggle()
          reset()
          setTimeout(function () {
            setLoading(false)
          }, 500)
          if (fetchData) {
            fetchData()
            toast.success('Add user successfully!')
          }
        })
      } catch (error) {
        setLoading(false)
      }
    },
    [role, toggle, reset, fetchData]
  )

  const handleClose = () => {
    setRole('operator')
    toggle()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100vw', sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>Thêm người dùng</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='username'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Tên người dùng'
                onChange={onChange}
                error={Boolean(errors.username)}
                {...(errors.username && { helperText: errors.username.message })}
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type='email'
                label='Email'
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.email)}
                {...(errors.email && { helperText: errors.email.message })}
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label='Mật khẩu'
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.password)}
                {...(errors.password && { helperText: errors.password.message })}
              />
            )}
          />

          <CustomTextField
            select
            fullWidth
            value={role}
            sx={{ mb: 4 }}
            label='Vai trò'
            onChange={e => setRole(e.target.value)}
            SelectProps={{ value: role, onChange: e => setRole(e.target.value) }}
          >
            <MenuItem value='manager'>Quản lý</MenuItem>
            <MenuItem value='operator'>Vận hành</MenuItem>
          </CustomTextField>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LoadingButton loading={loading} variant='contained' sx={{ mr: 3 }} type='submit'>
              Xác nhận
            </LoadingButton>
            <Button
              variant='tonal'
              color='secondary'
              onClick={() => {
                handleClose()
                toast.success('Đã huỷ thao tác!')
              }}
            >
              Thoát
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddUser
