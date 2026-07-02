import React, { useRef } from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { QRCodeSVG } from 'qrcode.react'
import { TbCurrencyNaira } from 'react-icons/tb'
import { getAllOrders, queryPaymentStatus } from '@/store/shop/order-slice'
import { toast } from 'sonner'
import { formatPriceDisplay } from '@/lib/utils'

function ShoppingOrderDetails({ setOpenDetailsDialog }) {
  const { orderDetails } = useSelector(state => state.shopOrder)
  const { cartItems } = useSelector(state => state.shopCart)
  const printRef = useRef(null)

  const dispatch = useDispatch()

  const handlePrint = () => {
    if (!printRef.current) {
      console.error('Print ref not found');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      console.error('Failed to open print window');
      return;
    }

    // Get the content to print
    const contentToPrint = printRef.current.innerHTML;
    console.log('Content to print:', contentToPrint);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Order Details</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: '#2d2d2d',
                    secondary: '#10b981',
                    foreground: '#111827',
                    background: '#ffffff',
                    border: '#e6edf3',
                    muted: '#6b7280',
                    gray: {
                      600: '#4b5563',
                      800: '#1f2937',
                      100: '#f3f4f6'
                    }
                  }
                }
              }
            }
          </script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

            body {
              font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
              color: #111827;
              line-height: 1.5;
              padding: 24px;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .print-container {
              width: 100%;
              max-width: 100%;
              min-height: 100vh;
              margin: 0 auto;
              background: white;
              padding: 24px;
              border-radius: 8px;
            }

            @media print {
              body { margin: 0; padding: 0; }
              .print-container {
                width: 100% !important;
                max-width: 100% !important;
                box-shadow: none !important;
                margin: 0 auto !important;
                padding: 20px !important;
                border-radius: 0 !important;
                min-height: 100vh !important;
              }
            }

            /* Ensure all Tailwind classes work */
            .grid { display: grid; }
            .gap-6 > * + * { margin-top: 1.5rem; }
            .gap-4 > * + * { margin-top: 1rem; }
            .gap-3 > * + * { margin-top: 0.75rem; }
            .gap-2 > * + * { margin-top: 0.5rem; }
            .gap-0\\.5 > * + * { margin-top: 0.125rem; }

            .flex { display: flex; }
            .items-center { align-items: center; }
            .justify-between { justify-content: space-between; }

            .text-sm { font-size: 1.875rem; line-height: 1.25rem; }
            .text-lg { font-size: 3.125rem; line-height: 1.75rem; }
            . { font-weight: 300; }
            .font-medium { font-weight: 500; }
            .font-semibold { font-weight: 600; }

            .text-gray-600 { color: #4b5563; }
            .text-gray-800 { color: #1f2937; }
            .border-gray-100 { border-color: #f3f4f6; }

            ul { list-style: none; padding: 0; margin: 0; }
            li { display: flex; justify-content: space-between; align-items: center; }

            .separator {
              border-top: 1px solid #f3f4f6;
              margin: 1.5rem 0;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${contentToPrint}
          </div>
          <script>
            // Wait for Tailwind to load, then print
            setTimeout(() => {
              window.print();
              window.close();
            }, 1000);
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }

  const QRCodeGenerator = ({ url }) => {
    return (
      <div className='flex items-center justify-center p-2 border border-gray-200 rounded-md '>
        {/* <h3>Scan this code to visit page</h3> */}
        <QRCodeSVG value={url} size={128} className='' />

      </div>
    )
  }

  const handleCompletePayment = () => {

    // Implement your payment completion logic here
    const productList = cartItems.items.map(item => (
      {
        productId: item.productId,
        name: item.name,
        description: item.description,
        imageUrl: item.images?.[0] || item.image,
        price: item.salesPrice > 0 ? item.salesPrice : item.price,
        quantity: item.quantity,
        vendorId: item.vendorId
      }
    ))

    dispatch(queryPaymentStatus({ opayReference: orderDetails._id, cartId: cartItems._id, productList })).then((response) => {

      console.log(response.payload.order.data, 'Payment Status Response');

      if (response.payload.order.data.cashierUrl) {
        sessionStorage.setItem('orderID', response.payload.order.data.reference)
        window.location.href = response.payload.order.data.cashierUrl
      } else {
        toast.error('Payment failed or already completed. Please check your orders for details.')

        dispatch(getAllOrders(orderDetails.userInfo.userId)) // Refresh orders to get updated status
        setOpenDetailsDialog(false)
      }
    })
  }




  return (
    <DialogContent className='w-full max-w-[90vw] max-h-[80vh] overflow-y-auto bg-white border-none rounded-lg shadow-lg p-6 pt-10'>
      <div className='flex items-center justify-between'>
        <p className='text-lg font-semibold'>Order details</p>
        <div className='flex items-center gap-2'>
          <Button variant='secondary' className='border border-gray-400' size='sm' onClick={handlePrint}>Print your Invoice</Button>
          {/* <Button variant='secondary' className='border border-gray-200' size='sm' >Check Delivery Status</Button> */}
        </div>
      </div>


      <div ref={printRef} className='grid gap-6'>
        <div className='grid gap-2'>
          <div className='flex items-center justify-between'>
            <p className='text-xs text-gray-600'>Order ID</p>
            <Label className='text-xs'>{orderDetails?._id}</Label>
          </div>
          <div className='flex items-center justify-between'>
            <p className='text-xs text-gray-600'>Order Date</p>
            <Label className='text-xs'>{orderDetails?.orderDate.slice(0, 10) + ' ' + orderDetails?.orderDate.slice(11, 19)}</Label>
          </div>
          <div className='flex items-center justify-between'>
            <p className='text-xs text-gray-600'>Delivery Status</p>
            <Label className='text-xs'>{orderDetails?.deliveryStatus.charAt(0).toUpperCase() + orderDetails?.deliveryStatus.slice(1)}</Label>
          </div>
          <div className='flex items-center justify-between'>
            <p className='text-xs text-gray-600'>Total Amount</p>
            <Label className='flex items-center text-xs gap-1'><TbCurrencyNaira />{formatPriceDisplay(orderDetails?.totalAmount ?? 0)}</Label>
          </div>
        </div>

        <Separator className='border-gray-100 border' />

        <div className='grid gap-4'>
          <div className='grid gap-2'>
            <p className='text-xs  text-gray-800'>Order Details</p>
            <ul className='grid gap-3'>
              {
                orderDetails?.childOrders?.length ? (
                  orderDetails.childOrders.map((childOrder) => (<>
                    <p className='text-xs text-gray-600 text-center'>Status: <span className={`font-md ${{
                      pending: 'text-orange-500',
                      accepted: 'text-blue-500',
                      packaging: 'text-purple-500',
                      ready: 'text-green-500',
                      cancelled: 'text-red-500',
                    }[childOrder.deliveryStatus] || 'text-gray-400'}`}>{childOrder.deliveryStatus.charAt(0).toUpperCase() + childOrder.deliveryStatus.slice(1)}</span></p>
                    <div key={childOrder._id} className='w-full flex flex-col justify-center items-center sm:flex-row sm:justify-around overflow-auto mb-2'>
                      {childOrder.cartItems.map((item) => (
                        <div key={item._id} className='flex flex-row'>
                          <div className='flex w-full flex-row border border-gray-200 max-w-50 min-w-50 shadow-sm rounded-lg'>
                            <img src={item.imageUrl} alt={item.name} className='w-full h-14 object-cover ' />
                            <div className='flex flex-col justify-between items-start gap-2 py-2 px-2'>
                              <p className='text-xs font-semibold'>{item.name}</p>
                              <div className='flex items-center justify-between w-full gap-2'>
                                <p className='text-xs text-gray-600'>Qty:{item.quantity}</p>
                                <p className='text-xs text-gray-600 flex items-center gap-0'><TbCurrencyNaira />{formatPriceDisplay(item.price)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                  ))
                ) : null}
            </ul>
          </div>
        </div>

        <Separator className='border-gray-100 border' />

        <div className='grid gap-4 grid-cols-2'>
          <div className='grid gap-2'>
            <p className='text-xs  text-gray-600 underline'>Address</p>
            <div className='grid gap-0.5 overflow-auto'>
              <span className='text-xs'>{orderDetails?.addressInfo?.address}</span>
              <span className='text-xs'>{orderDetails?.addressInfo?.city}</span>
              <span className='text-xs'>
                {orderDetails?.addressInfo?.state}, {orderDetails?.addressInfo?.country}
              </span>
              <span className='text-xs'>{orderDetails?.addressInfo?.phoneNumber}</span>
            </div>
          </div>

          <div className='grid gap-2 text-right'>
            <p className='text-xs  text-gray-600 underline'>User Information</p>
            <div className='grid gap-0.5 overflow-auto'>
              <span className='text-xs'>{orderDetails?.userInfo?.userName}</span>
              <span className='text-xs'>{orderDetails?.userInfo?.userEmail}</span>
              <span className='text-xs'>
                {orderDetails?.userInfo?.userMobile}
              </span>
            </div>
          </div>
        </div>
      </div>

      {orderDetails?.paymentStatus === 'pending' && (
        <Button variant='outline' size='sm' className='w-full border-none bg-black text-white cursor-pointer mt-6' onClick={() => handleCompletePayment()}>Complete Payment</Button>
      )}
    </DialogContent>
  )
}

export default ShoppingOrderDetails