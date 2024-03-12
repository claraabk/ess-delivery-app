import { Box, Button, Drawer, FormControl, Select, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { TimePicker } from '@mui/x-date-pickers'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { Promotion, PromotionBody, createPromotion, updatePromotion } from '../api/promotion'
import { MenuItem, getAllMenuItemsFromRestaurant } from '../api/menu'
import { useParams } from 'react-router-dom'

interface PromotionDrawerProps {
  open: boolean
  handleClose: () => void
  refetch: () => void
  isLoading?: boolean
  initialValues?: Promotion
  editMode?: boolean
  restaurantId: string
}


  
  
  export function PromotionDrawer({
    open,
    handleClose,
    refetch,
    isLoading,
    initialValues,
    editMode,
    restaurantId,
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
    } = useForm<PromotionBody>({
      defaultValues: {
        ...initialValues,
      },
    });
  
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>(
      initialValues?.menuItens || []
    );
  
    useEffect(() => {
      async function fetchMenuItems() {
        const menuItemsData = await getAllMenuItemsFromRestaurant(id || '');
        setMenuItems(menuItemsData);
      }
  
      fetchMenuItems();
    }, []);
  
    async function handleSubmitPromotion(data: PromotionBody)
     {
     
      const response = await createPromotionFn({...data, restaurantId});
      if (response.code === 'ERR_BAD_REQUEST') {
        alert('Erro ao criar a promoção');
      } else {
        handleClose();
        reset();
        setStartDate(null);
        setEndDate(null);
        refetch();
      }
    }
  
    async function handleEditPromotion(data: PromotionBody) {
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

    const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      const selectedIds = event.target.value as string[];
      setSelectedMenuItems(selectedIds);
      setValue('menuItens', selectedIds);
    };

    return (
      <Drawer anchor="bottom" open={open} onClose={handleClose}>
        <Box sx={{ px: 1, mb: 2 }}>
          <form
            onSubmit={handleSubmit(editMode ? handleEditPromotion : handleSubmitPromotion)}
          >
            <h3>{editMode ? 'Atualizar Promoção' : 'Criar Promoção'}</h3>
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
              label="Descrição"
              sx={{ width: '100%', mt: 1, mb: 1 }}
              error={!!errors.description}
              helperText={
                errors.description?.message
                  ? 'Esse campo não pode estar vazio'
                  : undefined
              }
              {...register('description')}
            />
            <TextField
              variant="outlined"
              label="Desconto"
              type="number"
              sx={{ width: '100%', mt: 1, mb: 1 }}
              error={!!errors.discount}
              helperText={
                errors.discount?.message
                  ? 'Esse campo não pode estar vazio'
                  : undefined
              }
              {...register('discount',{ valueAsNumber: true })}
            />
            
            <FormControl sx={{ width: '100%', mt: 1, mb: 1 }}>
              <Select
              
                variant="outlined"
                label="Itens do Menu"
                multiple
                {...register('menuItens')}
                value={selectedMenuItems}
                onChange={handleSelectChange as any}
              >
                {menuItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </Select>
            </FormControl>
  
            <FormControl sx={{ width: '100%', mt: 1, mb: 1 }}>
              <TimePicker
                ampm={false}
                sx={{ width: '100%', mt: 1, mb: 1 }}
                label="Data de Início"
                value={startDate}
                timezone="UTC"
                slotProps={{
                  textField: {
                    error: !!errors.startDate,
                    helperText: errors.startDate?.message
                      ? 'Esse campo não pode estar vazio'
                      : undefined,
                  },
                }}
                onChange={(value) => {
                  setStartDate(value);
                  if (value) {
                    setValue('startDate', value);
                  }
                }}
              />
            </FormControl>
  
            <FormControl sx={{ width: '100%', mt: 1, mb: 1 }}>
              <TimePicker
                ampm={false}
                sx={{ width: '100%', mt: 1, mb: 1 }}
                label="Data de Término"
                value={endDate}
                timezone="UTC"
                slotProps={{
                  textField: {
                    error: !!errors.endDate,
                    helperText: errors.endDate?.message
                      ? 'Esse campo não pode estar vazio'
                      : undefined,
                  },
                }}
                onChange={(value) => {
                  setEndDate(value);
                  if (value) {
                    setValue('endDate', value);
                  }
                }}
              />
            </FormControl>
  
            <Button
              variant="contained"
              sx={{ width: '100%', mt: 5 }}
              type="submit"
              disabled={isLoading}
            >
              Salvar
            </Button>
          </form>
        </Box>
      </Drawer>
    );
}
