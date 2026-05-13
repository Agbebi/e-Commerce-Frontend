import React, { useRef } from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { QRCodeSVG } from 'qrcode.react'

function ShoppingOrderDetails() {
  const { orderDetails } = useSelector(state => state.shopOrder)
  const printRef = useRef(null)

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
            }

            .print-container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              padding: 24px;
              border-radius: 8px;
            }

            @media print {
              body { margin: 0; padding: 0; }
              .print-container {
                box-shadow: none !important;
                margin: 0 !important;
                max-width: none !important;
                padding: 0 !important;
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

            .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
            .font-light { font-weight: 300; }
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

  const QRCodeGenerator = ({url}) => {
    return (
      <div className='flex items-center justify-center p-2 border border-gray-200 rounded-md '>
        {/* <h3>Scan this code to visit page</h3> */}
        <QRCodeSVG value={url} size={128} className='' />
      </div>
    )
  }



  return (
    <DialogContent className='sm:max-w-[600px] bg-white border-none rounded-lg shadow-lg p-6 pt-10'>
      <div className='flex items-center justify-between'>
        <p className='text-lg font-semibold'>Order details</p>
        <div className='flex items-center gap-2'>
        <Button variant='secondary' className='border border-gray-400' size='sm' onClick={handlePrint}>Print your Invoice</Button>
         {/* <Button variant='secondary' className='border border-gray-200' size='sm' >Check Delivery Status</Button> */}
        </div>
      </div>


      <div ref={printRef} className='grid gap-6'>
      <QRCodeGenerator url={`https://timscommerce.netlify.app/admin/orders/deliver/${orderDetails?._id}`} />
        <div className='grid gap-2'>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-600 font-light'>Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-600 font-light'>Order Date</p>
            <Label>{orderDetails?.orderDate}</Label>
          </div>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-600 font-light'>Delivery Status</p>
            <Label>{orderDetails?.deliveryStatus}</Label>
          </div>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-600 font-light'>Price</p>
            <Label>${orderDetails?.totalAmount?.toFixed(2) ?? '0.00'}</Label>
          </div>
        </div>

        <Separator className='border-gray-100 border' />

        <div className='grid gap-4'>
          <div className='grid gap-2'>
            <p className='text-sm font-light text-gray-800'>Order Details</p>
            <ul className='grid gap-3'>
              {orderDetails?.cartItems?.length ? (
                orderDetails.cartItems.map((item, index) => (
                  <li key={item._id || index} className='flex items-center justify-between'>
                    <p className='text-sm'>{item.name}</p>
                    <p className='text-sm font-medium'>${item.price}</p>
                  </li>
                ))
              ) : null}
            </ul>
          </div>
        </div>

        <Separator className='border-gray-100 border' />

        <div className='grid gap-4 grid-cols-2'>
          <div className='grid gap-2'>
            <p className='text-sm font-light text-gray-800'>Address Informations</p>
            <div className='grid gap-0.5'>
              <span className='text-sm'>{orderDetails?.addressInfo?.address}</span>
              <span className='text-sm'>{orderDetails?.addressInfo?.city}</span>
              <span className='text-sm'>
                {orderDetails?.addressInfo?.state}, {orderDetails?.addressInfo?.country}
              </span>
              <span className='text-sm'>{orderDetails?.addressInfo?.phoneNumber}</span>
            </div>
          </div>

          <div className='grid gap-2 text-right'>
            <p className='text-sm font-light text-gray-800'>User Information</p>
            <div className='grid gap-0.5'>
              <span className='text-sm'>{orderDetails?.userInfo?.userName}</span>
              <span className='text-sm'>{orderDetails?.userInfo?.userEmail}</span>
              <span className='text-sm'>
                {orderDetails?.userInfo?.userMobile}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export default ShoppingOrderDetails