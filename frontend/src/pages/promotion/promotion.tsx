import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { getAllPromotionsFromRestaurant } from '../../api/promotion'
import { PromotionItem } from '../../components/promotion'
import { PromotionDrawer } from '../../components/promotionDrawer'

export const Promotion = () => {

  const  { id }  = useParams()
  const isAdmin = location.pathname.includes('admin')
  const [openPromotionDialog, setOpenPromotionDialog] = useState(false)
  //const [restaurant, setRestaurant] = useState({} as Restaurant)
  const {
    data: result,
      refetch,
      isFetching
    } = useQuery({
      queryKey: ['promotions', id],
      queryFn: () => getAllPromotionsFromRestaurant(id || ''),
    })


  return (
    <>
      {result && (
        <>
          <PromotionDrawer
            open={openPromotionDialog}
            handleClose={() => setOpenPromotionDialog(false)}
            refetch={refetch}
            isLoading={isFetching}
            restaurantId={id||''}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <Typography variant="h5" marginRight={1}>
              Promoções
            </Typography>
            {isAdmin && (
              <Button
                variant="contained"
                sx={{ width: '200px' }}
                onClick={() => setOpenPromotionDialog(true)}
              >
                Adicionar promoção
              </Button>
            )}
          </Box>
          <Divider />
          <Stack spacing={2} marginTop={1}>
            {result.map((promotion) => (
              <PromotionItem
                promotion={promotion}
                refetch={refetch}
                key={promotion.id}
                restaurantId={id||''}
              />
            ))}
          </Stack>
        </>
      )}
    </>
  )
}