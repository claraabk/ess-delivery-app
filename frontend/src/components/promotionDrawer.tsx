import { Box, Button, Drawer, FormControl, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { TimePicker } from '@mui/x-date-pickers'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { Promotion, createPromotion, updatePromotion } from '../api/promotion'
import { MenuItem } from '../api/menu'
import { useParams } from 'react-router-dom'

interface PromotionDrawerProps {
  open: boolean
  handleClose: () => void
  refetch: () => void
  isLoading?: boolean
  initialValues?: Promotion
  editMode?: boolean
}

const promotionSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    discount: z.number().min(0),
    startDate: z.date(),
    endDate: z.date(),
    menuItems: z.array(z.string()).min(1),
    restaurantId: z.string(),
  });
  
  type PromotionSchema = z.infer<typeof promotionSchema>;
  
  export function PromotionsDrawer({
    open,
    handleClose,
    refetch,
    isLoading,
    editMode,
    initialValues,
    editMode,
  }: PromotionDrawerProps) {

    const  { id }  = useParams()

    const startDate = editMode
    ? new Date(initialValues?.startDate || new Date())
    : null
    const [StartDate, setStartDate] = useState<Date | null>(startDate)

    const endDate = editMode
    ? new Date(initialValues?.startDate || new Date())
    : null
    const [EndDate, setEndDate] = useState<Date | null>(endDate)

  
    const { mutateAsync: createPromotionFn } = useMutation({
      mutationKey: ['promotions'],
      mutationFn: createPromotion,
    });
  
    const { mutateAsync: updatePromotionFn } = useMutation({
      mutationKey: ['promotions'],
      mutationFn: updatePromotion,
    });
  
    const {
      register,
      handleSubmit,
      setValue,
      reset,
      formState: { errors },
    } = useForm<PromotionSchema>({
      resolver: zodResolver(promotionSchema),
      defaultValues: {
        ...initialValues,
      },
    });
  
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  
    useEffect(() => {
      async function fetchMenuItems() {
        const menuItemsData = await getAllMenuItemsFromRestaurant(id);
        setMenuItems(menuItemsData);
      }
  
      fetchMenuItems();
    }, []);
  
    async function handleSubmitPromotion(data: PromotionSchema) {
      const response = await createPromotionFn(data);
      if (response.code === 'ERR_BAD_REQUEST') {
        alert('Erro ao criar a promoção');
      } else {
        handleClose();
        reset();
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        refetch();
      }
    }
  
    async function handleEditPromotion(data: PromotionSchema) {
      const payload = { ...data, id: initialValues?.id };
      const response = await updatePromotionFn(payload);
      if (response.code === 'ERR_BAD_REQUEST') {
        alert('Erro ao atualizar a promoção');
      } else {
        handleClose();
        reset(data);
        refetch();
      }
    }

  return (
    <Drawer anchor="bottom" open={open} onClose={handleClose}>
      <Box sx={{ px: 1, mb: 2 }}>
        <form
          onSubmit={handleSubmit(
            editMode ? handleEditRestaurant : handleSubmitRestaurant,
          )}
        >
          <h3>{editMode ? 'Atualizar Restaurante' : 'Criar Restaurante'}</h3>
          <TextField
            variant="outlined"
            label="Nome"
            sx={{ width: '100%', mt: 1, mb: 1 }}
            error={!!errors.name}
            helperText={
              errors.name?.message
                ? 'Esse campo não pode estar vazio'
                : undefined
            }
            {...register('name')}
          />
          <TextField
            variant="outlined"
            label="Endereço"
            sx={{ width: '100%', mt: 1, mb: 1 }}
            error={!!errors.address}
            helperText={
              errors.address?.message
                ? 'Esse campo não pode estar vazio'
                : undefined
            }
            {...register('address')}
          />
          <FormControl sx={{ width: '100%', mt: 1, mb: 1 }}>
            <TimePicker
              ampm={false}
              sx={{ width: '100%', mt: 1, mb: 1 }}
              label="Horário de fechamento"
              value={selectedTime}
              timezone="UTC"
              slotProps={{
                textField: {
                  error: !!errors.closingTime,
                  helperText: errors.closingTime?.message
                    ? 'Esse campo não pode estar vazio'
                    : undefined,
                },
              }}
              onChange={(value) => {
                setSelectedTime(value)
                if (value) {
                  setValue('closingTime', value)
                }
              }}
            />
          </FormControl>
          <FormControl sx={{ width: '100%', mt: 1, mb: 1 }}>
            <TextField
              variant="outlined"
              label="Tipo"
              sx={{ width: '100%', mt: 1, mb: 1 }}
              error={!!errors.type}
              helperText={
                errors.type?.message
                  ? 'Esse campo não pode estar vazio'
                  : undefined
              }
              {...register('type')}
            />
          </FormControl>
          
          <Button
            variant="contained"
            sx={{ width: '100%', mt: 5 }}
            type="submit"
          >
            Salvar
          </Button>
        </form>
      </Box>
    </Drawer>
  )
}
