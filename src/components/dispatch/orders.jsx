import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle } from '../ui/card'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import CardContent from '@mui/material/CardContent'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders } from '@/store/dispatch/order-slice'
import DispatchOrderDetailsView from './order-details'
import { Dialog } from '../ui/dialog'
import { BsInfo } from 'react-icons/bs'
import { CiReceipt } from 'react-icons/ci'
import { useSearchParams } from 'react-router-dom'

function DispatchOrders() {

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [filters, setFilters] = useState({ status: ['all'] })
    const [sort, setSort] = useState('newest');
    const [searchParams, setSearchParams] = useSearchParams()

    const { orderList } = useSelector((state) => state.dispatchOrders)
    const { user } = useSelector((state) => state.auth)

    const dispatch = useDispatch()

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
    }

    // const filterSearchParams = searchParams.get('option')


    const filterOptions = ['all', 'pending', 'shipped', 'processing', 'cancelled', 'delivered']


    // function handleSort(value) {
    //     setSort(value);
    // }

    function handleFilters(Option) {
        const current = filters && Array.isArray(filters.status) ? filters.status[0] : 'all';
        if (current === Option) {
            const resetFilters = { status: ['all'] };
            setFilters(resetFilters);
            sessionStorage.removeItem("filters");
        } else {
            const cpyFilters = { status: [Option] };
            setFilters(cpyFilters);
            sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
        }
    }

    function createSearchParamsHelper(filterParams) {
        const queryParams = [];

        for (const [keys, values] of Object.entries(filterParams)) {
            if (Array.isArray(values) && values.length > 0) {
                const paramValue = values.join(",");

                queryParams.push(`${keys}=${encodeURIComponent(paramValue)}`);
            }
        }

        return queryParams.join("&");
    }

    useEffect(() => {
        if (filters) {
            const queryString = createSearchParamsHelper(filters);
            setSearchParams(new URLSearchParams(queryString).toString());
        }
    }, [filters, setSearchParams]);


    useEffect(() => {
        dispatch(getAllOrders({ userId: user._id, filterParams: filters, sortParams: sort }))
    }, [dispatch, user._id, filters, sort])

    return (
        <Card className='border-gray-200 border gap-1 w-full'>

            <CardHeader>
                <CardTitle>Your Orders</CardTitle>
            </CardHeader>

            <Separator className='border border-b border-gray-100 my-2' />

            <CardContent className='px-2 sm:px-4 flex flex-col gap-4'>
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <Stack direction='row' spacing={2} className='overflow-x-auto px-1'>
                        {
                            filterOptions && filterOptions.length > 0 ?
                                filterOptions.map(option => {
                                    const active = filters && Array.isArray(filters.status) && filters.status[0] === option;
                                    return (
                                        <Chip
                                            key={option}
                                            label={option.charAt(0).toUpperCase() + option.slice(1)}
                                            onClick={() => handleFilters(option)}
                                            component='a'
                                            clickable
                                            variant={active ? 'filled' : 'outlined'}
                                            size='small'
                                            sx={{
                                                fontSize: '0.75rem',
                                                backgroundColor: active ? 'rgba(55,65,81,1)' : undefined,
                                                color: active ? '#fff' : undefined,
                                                '&:hover': {
                                                    backgroundColor: active ? 'rgba(55,65,81,0.9)' : undefined
                                                }
                                            }}
                                        />
                                    )
                                })
                                : null
                        }
                    </Stack>

                    <div className='flex items-center gap-2 text-sm text-slate-600'>
                        <label htmlFor='dispatch-order-sort' className='font-medium'>Sort:</label>
                        <select
                            id='dispatch-order-sort'
                            className='rounded border border-slate-300 bg-white px-3 py-1 text-sm'
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value='newest'>Newest first</option>
                            <option value='oldest'>Oldest first</option>
                        </select>
                    </div>
                </div>

                <div className='w-full max-h-[60vh] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto p-2'>

                    {
                        orderList && orderList.length > 0 ? (
                            orderList.map((order) => (
                                <div className='w-full border border-gray-200 shadow-sm flex flex-col items-center text-center gap-2 p-4 rounded-md md:rounded-lg'>
                                    <div className='w-full flex items-center justify-center mb-2 px-2'>
                                        <span className='font-bold text-sm w-full'>{formatDate(order.orderDate)}</span>
                                    </div>
                                    <p className='text-xs text-gray-600'>{order.userInfo.name}</p>
                                    <p className={`text-sm font-medium ${{
                                        pending: 'text-orange-500',
                                        processing: 'text-blue-500',
                                        shipped: 'text-purple-500',
                                        delivered: 'text-green-500',
                                        cancelled: 'text-red-500',
                                    }[order.deliveryStatus] || 'text-gray-400'}`}
                                    >
                                        {order.deliveryStatus.charAt(0).toUpperCase() + order.deliveryStatus.slice(1)}
                                    </p>
                                    <span className='text-xs w-full'>{order._id.slice(0, 10) + '...'}</span>
                                    <Button onClick={() => {
                                        setSelectedOrder(order)
                                        setOpenDetailsDialog(true)
                                    }} variant='outline' size='sm' className='mt-2 shadow-xs border-gray-300 text-gray-700 hover:bg-gray-100 text-xs md:text-sm'>
                                        <CiReceipt className='' /> View Details
                                    </Button>
                                </div>

                            ))
                        ) : <div className='text-gray-600 py-4 text-sm'>No order was found!</div>
                    }


                </div>


                {openDetailsDialog && (
                    <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog} className='bg-white rounded-lg shadow-lg p-4'>
                        <DispatchOrderDetailsView selectedOrder={selectedOrder} setOpenDetailsDialog={setOpenDetailsDialog} />
                    </Dialog>
                )}
            </CardContent>



        </Card>
    )
}

export default DispatchOrders