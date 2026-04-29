import React from 'react'
import { SheetContent, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet'
import { ArrowRight, ChevronRight, ChevronRightIcon, CircleArrowOutUpRight, DiscIcon, Facebook, GpuIcon, Home, House, Instagram, LayoutDashboardIcon, LogOut, LogOutIcon, LucideShoppingBasket, PowerCircle, PowerIcon, ShirtIcon, Twitter, UmbrellaIcon, UserCircle } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'

import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { BiMenu } from 'react-icons/bi'
import { FaFacebook } from 'react-icons/fa'
import { BsInstagram, BsWhatsapp } from 'react-icons/bs'







function ShopSidebar() {
    
    return (
        <SheetContent side="right" className='bg-white flex rounded-lg overflow-y-scroll'>
            <div className='flex flex-col h-fit mt-8 p-0'>
                <SheetHeader className='rounded-2xl flex flex-row font-semibold p-4 gap-2 text-2xl items-center'>
                    <BiMenu />
                    <span>Menu</span>
                </SheetHeader>

            </div>

            <div className='h-full w-full text-gray-500 p-2 flex flex-col justify-start gap-4 '>
                {/* <Collapsible className='w-full flex flex-col gap-2 rounded-lg py-3 px-2'>
                    <CollapsibleTrigger className='w-full rounded-lg flex flex-row gap-4 justify-between items-center'>
                        <div className='flex items-center gap-3 text-gray-800'>
                            <LayoutDashboardIcon />
                            Products
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className='flex text-gray-600 flex-col gap-1 ml-10'>

                            {
                                filterOptions && filterOptions.Category.map(link => (


                                    <Label className='font-light text-2xl hover:bg-gray-100 p-2'>{link.label}</Label>

                                ))
                            }
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible className='w-full flex flex-col gap-2 shadow-neutral-200 rounded-lg py-3 px-2'>
                    <CollapsibleTrigger className='w-full text-gray-800 rounded-lg flex flex-row gap-4 justify-between items-center'>
                        <div className='flex gap-3'>
                            <UmbrellaIcon />
                            Brand
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className='flex text-gray-600 flex-col gap-1 ml-10'>

                            {
                                filterOptions && filterOptions.Brand.map(link => (
                                    <Label className='font-light text-2xl p-2'>{link.label}</Label>
                                ))
                            }
                        </div>
                    </CollapsibleContent>
                </Collapsible> */}

              
            </div>


            <SheetFooter className='flex flex-col gap-4 rounded-t-2xl bg-neutral-400 pt-6 justify-between items-center'>
                <div className='flex  flex-row items-center justify-center gap-4 mb-4'>
                    <FaFacebook />
                    <BsInstagram />
                    <BsWhatsapp />
                </div>
                <div className='flex p-2 justify-center rounded-lg bg-black text-white items-center w-full gap-2'>
                    <LogOut />
                    <span className=''>Logout</span>
                </div>
            </SheetFooter>

        </SheetContent>
    )
}

export default ShopSidebar