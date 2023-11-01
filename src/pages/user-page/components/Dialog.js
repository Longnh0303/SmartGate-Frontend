import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import { updateUser } from 'src/api/user'
import LoadingButton from '@mui/lab/LoadingButton'
import Icon from "src/@core/components/icon"

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const UserDialog = props => {
  const {
    open = false,
    toggleDialog = () => {},
    row = [],
    refresh = () => {},
    openDeactive = false,
    toggleDeactive = () => {},
    openActive = false,
    toggleActive = () => {}
  } = props

  const schema = yup.object().shape({
    email: yup.string().email('Email must be valid email').required('Email is required'),
    name: yup
      .string()
      .required('Name is required')
      .min(3, 'Name must have at least 3 characters')
      .max(30, 'Name allows up to 30 characters'),
    department: yup
      .string()
      .required('Department is required')
      .min(3, 'Department must have at least 3 characters')
      .max(30, 'Department allows up to 30 characters'),
    phone: yup
      .string()
      .required('Phone number is required')
      .min(4, 'Phone number must have at least 4 characters')
      .max(15, 'Phone number allows up to 15 characters')
  })

  const defaultValues = {
    name: row.name || '',
    email: row.email || '',
    phone: row.phone || '',
    department: row.department || ''
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    reset({
      name: row.name || '',
      email: row.email || '',
      phone: row.phone || '',
      department: row.department || ''
    })
  }, [row, reset])

  const [loading, setLoading] = useState(false)

  const onSubmit = async data => {
    try {
      setLoading(true)
      await updateUser(id, data)
      refresh()
      toast.success(`Edit user ${row.name} information succesfully!`)
    } catch (error) {
    } finally {
      setTimeout(function () {
        setLoading(false)
      }, 500)
      toggleDialog(false)
    }
  }

  const id = row.id

  return (
    <>
      {/* Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => toggleDialog(false)}
        aria-labelledby='user-view-edit'
        aria-describedby='user-view-edit-description'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
      >
        <DialogTitle
          id='user-view-edit'
          sx={{
            textAlign: 'center',
            fontSize: '1.5rem !important',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          Edit User Information
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
            Updating user details will receive a privacy audit.
          </DialogContentText>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='User Name'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.name)}
                      {...(errors.name && { helperText: errors.name.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='User Email'
                      value={value}
                      disabled={row.isEmailVerified}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      {...(errors.email && { helperText: errors.email.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='phone'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Phone Number'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.phone)}
                      {...(errors.phone && { helperText: errors.phone.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='department'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Department'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.department)}
                      {...(errors.department && { helperText: errors.department.message })}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ pt: theme => `${theme.spacing(6.5)} !important`, display: 'flex', justifyContent: 'right' }}
            >
              <LoadingButton loading={loading} variant='contained' sx={{ mr: 3 }} type='submit'>
                Submit
              </LoadingButton>
              <Button
                variant='tonal'
                color='secondary'
                onClick={() => {
                  toggleDialog(false)
                  reset(defaultValues)
                  toast.success('Action has been cancelled!')
                }}
              >
                Cancel
              </Button>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      {/* Deactivate Confirmation Dialog */}
      <Dialog
        open={openDeactive}
        onClose={() => {
          toggleDeactive(false)
        }}
        aria-labelledby='dialog-title'
        aria-describedby='dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon icon={'tabler:alert-circle-filled'} fontSize={24} style={{ marginRight: 6 }} />
            Deactivate User Confirmation
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='dialog-description'>
            {`Are you sure you want to deactivate user ${row.name}, this action will change user's status to inactive?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            onClick={async () => {
              try {
                const data = { status: 'inactive' }
                await updateUser(id, data)
                refresh()
                toast.success(`deactivate user ${row.name} successfully!`)
              } catch (error) {
              } finally {
                toggleDeactive(false)
              }
            }}
          >
            Agree
          </Button>
          <Button
            variant='contained'
            color='secondary'
            onClick={() => {
              toggleDeactive(false)
              toast.success('Action has been cancelled!')
            }}
          >
            Disagree
          </Button>
        </DialogActions>
      </Dialog>
      {/* Activate Confirmation Dialog */}
      <Dialog
        open={openActive}
        onClose={() => {
          toggleActive(false)
        }}
        aria-labelledby='dialog-title'
        aria-describedby='dialog-description'
      >
        <DialogTitle id='dialog-title'>⚠️ Activate User Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id='dialog-description'>
            {`Are you sure you want to activate user ${row.name}, this action will change user's status to active?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            onClick={async () => {
              try {
                const data = { status: 'active' }
                await updateUser(id, data)
                refresh()
                toast.success(`Active user ${row.name} successfully!`)
              } catch (error) {
              } finally {
                toggleActive(false)
              }
            }}
          >
            Agree
          </Button>
          <Button
            variant='contained'
            color='secondary'
            onClick={() => {
              toggleActive(false)
              toast.success('Action has been cancelled!')
            }}
          >
            Disagree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default UserDialog
