// ** MUI Imports
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Component Import
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

const CardStatsVertical = () => {

  return (
    <Card >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <CustomAvatar
          skin='light'
          variant='rounded'
          color='primary'
          sx={{ mb: 3.5, width: 44, height: 44 }}
        >
          <Icon icon='tabler:currency-dollar' fontSize='1.75rem' />
        </CustomAvatar>
        <Typography variant='h5' sx={{ mb: 1 }}>
        Total Profit
        </Typography>
        <Typography variant='body2' sx={{ mb: 1, color: 'text.disabled' }}>
        Last week
        </Typography>
        <Typography sx={{ mb: 3.5, color: 'text.secondary' }}>1.28k</Typography>
        <CustomChip
          size='small'
          label='-12.2%'
          color='primary'
         rounded
            skin= 'light' 
        />
      </CardContent>
    </Card>
  )
}

export default CardStatsVertical
