// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const AnalyticsVisits = () => {
  return (
    <Card>
      <CardContent sx={{ p: theme => `${theme.spacing(5)} !important` }}>
        <Box sx={{ gap: 2, mb: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <Typography variant='body2' sx={{ color: 'text.disabled' }}>
              Tổng số lượt vào/ra
            </Typography>
            <Typography variant='h4'>165 lượt</Typography>
          </div>
        </Box>
        <Box sx={{ mb: 3.5, gap: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ py: 2.25, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' color='info' variant='rounded' sx={{ mr: 1.5, height: 24, width: 24 }}>
                <Icon icon='tabler:shopping-cart' fontSize='1.125rem' />
              </CustomAvatar>
              <Typography sx={{ color: 'text.secondary' }}>Lượt vào</Typography>
            </Box>
            <Typography variant='h5'>48.5%</Typography>
            <Typography variant='body2' sx={{ color: 'text.disabled' }}>
             80 lượt
            </Typography>
          </Box>
          <Divider flexItem sx={{ m: 0 }} orientation='vertical'>
            <CustomAvatar
              skin='light'
              color='secondary'
              sx={{ height: 24, width: 24, fontSize: '0.6875rem', color: 'text.secondary' }}
            >
              VS
            </CustomAvatar>
          </Divider>
          <Box sx={{ py: 2.25, display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
            <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 1.5, color: 'text.secondary' }}>Lượt ra</Typography>
              <CustomAvatar skin='light' variant='rounded' sx={{ height: 24, width: 24 }}>
                <Icon icon='tabler:link' fontSize='1.125rem' />
              </CustomAvatar>
            </Box>
            <Typography variant='h5'>51.5%</Typography>
            <Typography variant='body2' sx={{ color: 'text.disabled' }}>
              85 lượt
            </Typography>
          </Box>
        </Box>
        <LinearProgress
          value={48.5}
          color='info'
          variant='determinate'
          sx={{
            height: 10,
            '&.MuiLinearProgress-colorInfo': { backgroundColor: 'primary.main' },
            '& .MuiLinearProgress-bar': {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0
            }
          }}
        />
      </CardContent>
    </Card>
  )
}

export default AnalyticsVisits
