import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import CommonForm from '../common/form'
import { useDispatch, useSelector } from 'react-redux'
import { TbCurrencyNaira } from 'react-icons/tb'
import { formatPriceDisplay } from '@/lib/utils'
import { deliverOrder, getAllOrders, updateOrderStatus } from '../../store/vendor/order-slice'
import { fetchProductById } from '../../store/vendor/product-slice'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Package, Loader2, ExternalLink } from 'lucide-react'


const initialFormData = {
    status: ''
}


function VendorOrderDetailsView({ selectedOrder, setOpenDetailsDialog }) {

    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const [formData, setFormData] = useState(initialFormData)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [productDetailsOpen, setProductDetailsOpen] = useState(false)
    const [productDetails, setProductDetails] = useState(null)
    const [isLoadingProduct, setIsLoadingProduct] = useState(false)

    function handleStatusChange(e) {
        e.preventDefault()

        const updatedStatus = formData.status

        dispatch(updateOrderStatus({ orderId: selectedOrder._id, updatedStatus })).then((data) =>{
            if(data.payload.success){
                setFormData(updatedStatus)
                setOpenDetailsDialog(false)
                dispatch(getAllOrders(user.id))
                toast.success('Order status updated successfully!')
            }
            
        })
    }

    const handleProductClick = async (product) => {
        const productId = product.productId || product._id
        setSelectedProduct({ ...product, _id: productId })
        setProductDetailsOpen(true)
        setIsLoadingProduct(true)
        setProductDetails(null)

        try {
            const result = await dispatch(fetchProductById(productId)).unwrap()
            if (result.success) {
                setProductDetails(result.data)
            }
        } catch {
            toast.error('Failed to load product details')
        } finally {
            setIsLoadingProduct(false)
        }
    }

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-slate-100 text-slate-700',
            accepted: 'bg-sky-50 text-sky-700',
            packaging: 'bg-violet-50 text-violet-700',
            ready: 'bg-emerald-50 text-emerald-700',
            cancelled: 'bg-red-50 text-red-700',
            processing: 'bg-sky-50 text-sky-700',
            shipped: 'bg-violet-50 text-violet-700',
            completed: 'bg-emerald-50 text-emerald-700',
            delivered: 'bg-emerald-50 text-emerald-700',
        }
        return colors[status] || 'bg-slate-100 text-slate-700'
    }

    return (
        selectedOrder ? (
            <DialogContent className='sm:max-w-[500px] bg-white border border-slate-200 rounded-2xl shadow-lg p-0 overflow-hidden'>
                <div className='p-6 border-b border-slate-100'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h3 className='text-base font-semibold text-slate-900'>Order Details</h3>
                            <p className='text-xs text-slate-500 mt-0.5'>Order #{selectedOrder._id?.slice(-8) || 'N/A'}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Badge className={`${getStatusColor(selectedOrder.deliveryStatus)} text-[10px] font-semibold px-2 py-0.5 rounded-md border-0`}>
                                {selectedOrder.deliveryStatus ? selectedOrder.deliveryStatus.charAt(0).toUpperCase() + selectedOrder.deliveryStatus.slice(1) : 'Unknown'}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className='p-6 space-y-5'>
                    {/* Order Info */}
                    <div className='grid gap-3'>
                        <div className='flex items-center justify-between py-2 border-b border-slate-50'>
                            <span className='text-xs font-medium text-slate-500'>Order Date</span>
                            <Label className='text-xs font-medium text-slate-900'>
                                {selectedOrder.payoutDate ? new Date(selectedOrder.payoutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                            </Label>
                        </div>
                        <div className='flex items-center justify-between py-2 border-b border-slate-50'>
                            <span className='text-xs font-medium text-slate-500'>Order Status</span>
                            <Label className='text-xs font-medium text-slate-900'>
                                {selectedOrder.payoutStatus ? selectedOrder.payoutStatus.charAt(0).toUpperCase() + selectedOrder.payoutStatus.slice(1) : 'N/A'}
                            </Label>
                        </div>
                        <div className='flex items-center justify-between py-2 border-b border-slate-50'>
                            <span className='text-xs font-medium text-slate-500'>Delivery Status</span>
                            <Label className='text-xs font-medium text-slate-900'>
                                {selectedOrder.deliveryStatus.charAt(0).toUpperCase() + selectedOrder.deliveryStatus.slice(1) || 'N/A'}
                            </Label>
                        </div>
                        <div className='flex items-center justify-between py-2'>
                            <span className='text-xs font-medium text-slate-500'>Total Amount</span>
                            <Label className='flex text-xs font-semibold items-center gap-1 text-slate-900'>
                                <TbCurrencyNaira className='h-3 w-3' />
                                {formatPriceDisplay(selectedOrder.subTotal)}
                            </Label>
                        </div>
                    </div>

                    {/* Products */}
                    <div className='space-y-3'>
                        <p className='text-xs font-semibold text-slate-900 uppercase tracking-wider'>Products</p>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                            {selectedOrder && selectedOrder.cartItems ? (
                                selectedOrder.cartItems.map((product) => {
                                    const productId = product.productId || product._id
                                    return (
                                    <Dialog key={productId} open={productDetailsOpen && selectedProduct?._id === productId} onOpenChange={setProductDetailsOpen}>
                                        <DialogTrigger asChild>
                                            <div 
                                                className='flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition-colors'
                                                onClick={() => handleProductClick(product)}
                                            >
                                                <div className='h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0'>
                                                    <Package className='h-4 w-4' />
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <p className='text-xs font-semibold text-slate-900 truncate'>{product.name}</p>
                                                    <p className='text-[10px] text-slate-500'>Qty: {product.quantity}</p>
                                                    <p className='text-[10px] font-medium text-slate-700 flex items-center gap-0.5'>
                                                        <TbCurrencyNaira className='h-3 w-3' />
                                                        {formatPriceDisplay(product.price * product.quantity)}
                                                    </p>
                                                </div>
                                                <ExternalLink className='h-3 w-3 text-slate-400' />
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className='sm:max-w-[400px] bg-white border border-slate-200 rounded-2xl shadow-lg p-0 overflow-hidden'>
                                            <div className='p-6'>
                                                {isLoadingProduct ? (
                                                    <div className='flex items-center justify-center py-10'>
                                                        <Loader2 className='h-6 w-6 text-slate-400 animate-spin' />
                                                    </div>
                                                ) : productDetails ? (
                                                    <div className='space-y-4'>
                                                        <div>
                                                            <h4 className='text-sm font-semibold text-slate-900'>{productDetails.name}</h4>
                                                            <p className='text-xs text-slate-500 mt-1 line-clamp-2'>{productDetails.description}</p>
                                                        </div>

                                                        <div className='grid grid-cols-2 gap-3'>
                                                            <div className='rounded-xl border border-slate-100 bg-slate-50/50 p-3'>
                                                                <p className='text-[10px] font-medium text-slate-500 uppercase tracking-wider'>Price</p>
                                                                <p className='text-sm font-semibold text-slate-900 mt-1'>₦{formatPriceDisplay(productDetails.salesPrice > 0 ? productDetails.salesPrice : productDetails.price)}</p>
                                                            </div>
                                                            <div className='rounded-xl border border-slate-100 bg-slate-50/50 p-3'>
                                                                <p className='text-[10px] font-medium text-slate-500 uppercase tracking-wider'>Stock</p>
                                                                <p className='text-sm font-semibold text-slate-900 mt-1'>{productDetails.totalStock}</p>
                                                            </div>
                                                        </div>

                                                        <div className='space-y-2'>
                                                            <p className='text-[10px] font-medium text-slate-500 uppercase tracking-wider'>Category</p>
                                                            <p className='text-xs text-slate-700 capitalize'>{productDetails.subcategory || productDetails.category}</p>
                                                        </div>

                                                        <div className='space-y-2'>
                                                            <p className='text-[10px] font-medium text-slate-500 uppercase tracking-wider'>Brand</p>
                                                            <p className='text-xs text-slate-700'>{productDetails.brand || 'N/A'}</p>
                                                        </div>

                                                        {productDetails.specifications && productDetails.specifications.length > 0 && (
                                                            <div className='space-y-2'>
                                                                <p className='text-[10px] font-medium text-slate-500 uppercase tracking-wider'>Specifications</p>
                                                                <div className='space-y-1'>
                                                                    {productDetails.specifications.map((spec, idx) => (
                                                                        <div key={idx} className='flex items-center justify-between text-xs'>
                                                                            <span className='text-slate-600'>{spec.name}</span>
                                                                            <span className='font-medium text-slate-900'>{spec.value}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className='flex items-center justify-center py-10'>
                                                        <p className='text-xs text-slate-500'>No product details available</p>
                                                    </div>
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )
                            })
                            ) : (
                                <p className='text-xs text-slate-500 col-span-2'>No products found for this order.</p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className='space-y-2 pt-2'>
                        <CommonForm 
                            formControls={[
                                {
                                    name: 'status',
                                    label: 'Update Status',
                                    placeholder: 'Select Status',
                                    componentType: 'select',
                                    options: [
                                        { name: 'pending', value: 'pending', label: 'Pending' },
                                        { name: 'accepted', value: 'accepted', label: 'Accepted' },
                                        { name: 'packaging', value: 'packaging', label: 'Packaging' },
                                        { name: 'ready', value: 'ready', label: 'Ready for Pickup' },
                                        { name: 'cancelled', value: 'cancelled', label: 'Cancelled' },
                                    ]
                                }
                            ]}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={'Update Status'}
                            onSubmit={handleStatusChange}
                            className='text-xs'
                        />

                        {
                            user.role === 'vendor' && selectedOrder.payoutStatus !== 'completed' && selectedOrder.deliveryStatus !== 'delivered' && (
                                <Button 
                                    onClick={() => dispatch(deliverOrder({ orderId: selectedOrder._id, userId: user.id })).then((data) => {
                                        if (data.payload?.success) {
                                            toast.success('Order marked as delivered!')
                                            dispatch(getAllOrders(user.id))
                                            setOpenDetailsDialog(false)
                                        }
                                    })} 
                                    size='sm' 
                                    className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs border-0"
                                >
                                    Set Delivered
                                </Button>
                            )
                        }
                    </div>
                </div>
            </DialogContent>
        ) : <></>)
}

export default VendorOrderDetailsView
