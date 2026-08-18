import React from 'react'
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, alpha } from '@mui/material'
import { IoCartOutline, IoClose } from 'react-icons/io5'
import { TbCurrencyNaira } from 'react-icons/tb'
import { formatPriceDisplay } from '@/lib/utils'
import CartItemsContent from './cart-items-content'

function UserCartWrapper({ cartItems, setOpenCartSheet, setOpenSheet }) {
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.shopCart)

    const totalPrice = cartItems && cartItems.items ? cartItems.items.reduce((total, item) => {
        const itemPrice = item.salesPrice > 0 ? item.salesPrice : item.price;
        return total + (itemPrice * item.quantity);
    }, 0) : 0;

    return (
        <SheetContent className='bg-white sm:max-w-md w-full max-w-xs p-0 gap-0 overflow-hidden flex flex-col'>
            <Box sx={{ 
                px: 3, 
                py: 2, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '12px',
                        bgcolor: alpha('#f97316', 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#f97316',
                    }}>
                        <IoCartOutline size={22} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2 }}>
                            Your Cart
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            {cartItems?.items?.length || 0} {cartItems?.items?.length === 1 ? 'item' : 'items'}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ 
                flex: 1, 
                overflowY: 'auto', 
                p: 2,
                bgcolor: '#fafafa',
            }}>
                {isLoading && !cartItems?.items?.length ? (
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        gap: 2,
                        py: 8,
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            Updating your cart...
                        </Typography>
                    </Box>
                ) : cartItems?.items?.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {cartItems.items.map((item) => (
                            <CartItemsContent key={item.productId} cartItem={item} />
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        gap: 2,
                        py: 8,
                        textAlign: 'center',
                    }}>
                        <Box sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            bgcolor: alpha('#000', 0.04),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                        }}>
                            <IoCartOutline size={32} color="#ccc" />
                        </Box>
                        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Your cart is empty
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ maxWidth: 240 }}>
                            Looks like you haven't added anything to your cart yet.
                        </Typography>
                    </Box>
                )}
            </Box>

            {cartItems?.items?.length > 0 && (
                <Box sx={{ 
                    p: 3, 
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.04)',
                }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {formatPriceDisplay(totalPrice)}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Shipping</Typography>
                            <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.75rem' }}>
                                Calculated at checkout
                            </Typography>
                        </Box>
                        <Box sx={{ height: '1px', bgcolor: 'divider', my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Total</Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                {formatPriceDisplay(totalPrice)}
                            </Typography>
                        </Box>
                        <Box
                            onClick={() => {
                                navigate('/shop/checkout')
                                setOpenCartSheet(false)
                                setOpenSheet(false)
                            }}
                            sx={{
                                mt: 1,
                                py: 1.5,
                                px: 2,
                                borderRadius: '12px',
                                bgcolor: 'black',
                                color: 'white',
                                textAlign: 'center',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: '#1a1a1a',
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                                },
                            }}
                        >
                            Confirm Order
                        </Box>
                    </Box>
                </Box>
            )}
        </SheetContent>
    )
}

export default UserCartWrapper
