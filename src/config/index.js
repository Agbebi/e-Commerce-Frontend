
export const registerFormControls = [
    {
        name: 'userName',
        label: 'Username *',
        componentType: 'input',
        placeholder: 'Enter your User Name',
        type: 'text',
        options: [

        ]
    },
    {
        name: 'name',
        label: 'Full Name *',
        componentType: 'input',
        placeholder: 'Enter your name',
        type: 'text',
        options: [

        ]
    },

    {
        name: 'email',
        label: 'E-mail *',
        placeholder: 'Enter your E-mail',
        componentType: 'input',
        type: 'email'
    },

    {
        name: 'password',
        label: 'Password *',
        placeholder: 'Enter your passsword',
        componentType: 'input',
        type: 'password'
    },

    {
        name: 'phoneNumber',
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        componentType: 'input',
        type: 'tel'
    }
]

export const registerVendorFormControls = [
    {
        name: 'shopName',
        label: 'Shop Name',
        placeholder: 'Enter your Shop Name',
        componentType: 'input',
        type: 'text',
        options: [

        ]
    },

    {
        name: 'email',
        label: 'E-mail *',
        placeholder: 'Enter your E-mail',
        componentType: 'input',
        type: 'email'
    },

    {
        name: 'password',
        label: 'Password *',
        placeholder: 'Enter your passsword',
        componentType: 'input',
        type: 'password'
    },

    {
        name: 'phoneNumber',
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        componentType: 'input',
        type: 'tel'
    },
    {
        name: 'shopDescription',
        label: 'Shop Description',
        placeholder: 'Describe your shop...',
        componentType: 'input',
        type: 'text'
    },
    {
        name: 'shopAddress',
        label: 'Shop Address',
        placeholder: 'Where is your shop...',
        componentType: 'input',
        type: 'text'
    },
]

export const vendorBankDetails = [
    {
        name: 'accountNumber',
        label: 'Account Number',
        placeholder: 'Bank Account Number',
        componentType: 'input',
        type: 'number'
    },
    {
        name: 'accountHolderName',
        Label: 'Account Name',
        placeholder: 'Name on the Bank Account',
        componentType: 'input',
        type: 'text'
    },
    {
        name: 'bankName',
        Label: 'Bank Name',
        placeholder: 'Name of the Bank',
        componentType: 'input',
        type: 'text'
    }
]

export const registerDispatchFormControls = [
    {
        name: 'userName',
        label: 'Username',
        placeholder: 'Enter your Username',
        componentType: 'input',
        type: 'text',
        options: [

        ]
    },

    {
        name: 'name',
        label: 'Full Name *',
        componentType: 'input',
        placeholder: 'Enter your name',
        type: 'text',
        options: [

        ]
    },

    {
        name: 'email',
        label: 'E-mail *',
        placeholder: 'Enter your E-mail',
        componentType: 'input',
        type: 'email'
    },

    {
        name: 'password',
        label: 'Password *',
        placeholder: 'Enter your passsword',
        componentType: 'input',
        type: 'password'
    },

    {
        name: 'phoneNumber',
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        componentType: 'input',
        type: 'tel'
    },
]

export const dispatchVehicleDetails = [
    {
        name: 'vehicleType',
        label: 'Vehicle Type',
        placeholder: 'What is the type of vehicle',
        componentType: 'input',
        type: 'text'
    },

    {
        name: 'vehicleNumber',
        label: 'Vehicle Number',
        placeholder: 'Enter your vehicle number',
        componentType: 'input',
        type: 'number'
    },
]

export const LoginFormControls = [
    {
        name: 'email',
        label: 'E-mail *',
        placeholder: 'Enter your E-mail',
        componentType: 'input',
        type: 'email'
    },

    {
        name: 'password',
        label: 'Password *',
        placeholder: 'Enter your password',
        componentType: 'input',
        type: 'password'
    },
]

export const addProductFormElements = [



    {
        name: 'name',
        label: 'Name',
        placeholder: 'Enter Product Name',
        componentType: 'input',
        type: 'text'
    },

    {
        name: 'description',
        label: 'Description',
        componentType: 'textarea',
        placeholder: 'Product Description'
    },

    {
        name: 'category',
        label: 'Category',
        placeholder: 'Category',
        componentType: 'select',
        options: [
            { value: 'electronics', id: 'electronics', label: 'Electronics' },
            { value: 'fashion', id: 'fashion', label: 'Fashion' },
            { value: 'home-appliances', id: 'home-appliances', label: 'Home Appliances' },
            { value: 'beauty', id: 'beauty', label: 'Beauty & Personal Care' },
            { value: 'baby', id: 'baby', label: 'Baby & Toys' },
            { value: 'computers', id: 'computers', label: 'Computers' },
            { value: 'phones-tablets', id: 'phones-tablets', label: 'Phones & Tablets' },
            { value: 'sports', id: 'sports', label: 'Sports & Outdoors' },
            { value: 'groceries', id: 'groceries', label: 'Groceries' },
            { value: 'accessories', id: 'accessories', label: 'Accessories' },
        ]
    },

    {
        name: 'subcategory',
        label: 'Subcategory',
        placeholder: 'Select a category first',
        componentType: 'select',
        options: [],
        disabled: true
    },

    {
        name: 'brand',
        label: 'Brand',
        placeholder: 'Type or select a brand',
        componentType: 'input',
        type: 'text',
        list: 'product-brands'
    },

    {
        name: 'totalStock',
        label: 'Stock Quantity',
        placeholder: 'Stock Quantity',
        componentType: 'input',
        type: 'number'
    },

    {
        name: 'salesPrice',
        label: 'Sales Price',
        placeholder: 'Sales Price',
        componentType: 'input',
        type: 'number'
    },

    {
        name: 'price',
        label: 'Price',
        placeholder: 'Enter Product Price',
        componentType: 'input',
        type: 'number'
    }
]

export const categorySubcategoryMap = {
    electronics: [
        { value: 'smartphones', id: 'smartphones', label: 'Smartphones' },
        { value: 'televisions', id: 'televisions', label: 'Televisions' }
    ],
    computers: [
        { value: 'laptops', id: 'laptops', label: 'Laptops' }
    ],
    'phones-tablets': [
        { value: 'smartphones', id: 'smartphones', label: 'Smartphones' }
    ],
    'home-appliances': [
        { value: 'kitchen-appliances', id: 'kitchen-appliances', label: 'Kitchen Appliances' }
    ],
    fashion: [
        { value: 'men-clothing', id: 'men-clothing', label: 'Men Clothing' },
        { value: 'women-clothing', id: 'women-clothing', label: 'Women Clothing' },
        { value: 'accessories', id: 'accessories', label: 'Accessories' }
    ],
    beauty: [
        { value: 'skincare', id: 'skincare', label: 'Skin Care' }
    ],
    baby: [
        { value: 'baby-care', id: 'baby-care', label: 'Baby Care' }
    ],
    sports: [
        { value: 'sports-equipment', id: 'sports-equipment', label: 'Sports Equipment' }
    ],
    groceries: [],
    accessories: []
}

export const specificationTemplatesByCategory = {
    electronics: [
        { name: 'RAM', value: '' },
        { name: 'Processor', value: '' },
        { name: 'Storage', value: '' },
        { name: 'Battery', value: '' }
    ],
    computers: [
        { name: 'Processor', value: '' },
        { name: 'RAM', value: '' },
        { name: 'Storage', value: '' },
        { name: 'Screen Size', value: '' }
    ],
    'phones-tablets': [
        { name: 'Storage', value: '' },
        { name: 'RAM', value: '' },
        { name: 'Battery', value: '' },
        { name: 'Camera', value: '' }
    ],
    'home-appliances': [
        { name: 'Capacity', value: '' },
        { name: 'Power', value: '' },
        { name: 'Material', value: '' }
    ],
    fashion: [
        { name: 'Size', value: '' },
        { name: 'Color', value: '' },
        { name: 'Material', value: '' },
        { name: 'Fit', value: '' }
    ],
    beauty: [
        { name: 'Size', value: '' },
        { name: 'Skin Type', value: '' },
        { name: 'Scent', value: '' }
    ],
    sports: [
        { name: 'Size', value: '' },
        { name: 'Color', value: '' },
        { name: 'Material', value: '' }
    ],
    groceries: [
        { name: 'Weight', value: '' },
        { name: 'Ingredients', value: '' },
        { name: 'Flavor', value: '' }
    ],
    accessories: [
        { name: 'Material', value: '' },
        { name: 'Color', value: '' },
        { name: 'Size', value: '' }
    ],
    default: [
        { name: 'Color', value: '' },
        { name: 'Material', value: '' }
    ]
}

export const specificationTemplatesBySubcategory = {
    televisions: [
        { name: 'Screen Size', value: '' },
        { name: 'Resolution', value: '' },
        { name: 'Refresh Rate', value: '' },
        { name: 'Smart TV', value: '' }
    ],
    'men-clothing': [
        { name: 'Size', value: '' },
        { name: 'Color', value: '' },
        { name: 'Fabric', value: '' }
    ],
    'women-clothing': [
        { name: 'Size', value: '' },
        { name: 'Color', value: '' },
        { name: 'Fabric', value: '' }
    ],
    shoes: [
        { name: 'Size', value: '' },
        { name: 'Color', value: '' },
        { name: 'Material', value: '' }
    ]
}

export const shoppingViewCategories = [
    { id: 'home', value: 'home', label: 'Home', path: '/shop/home' },
    { id: 'electronics', value: 'electronics', label: 'Electronics', path: '/shop/listing' },
    { id: 'fashion', value: 'fashion', label: 'Fashion', path: '/shop/listing' },
    { id: 'computers', value: 'computers', label: 'Computers', path: '/shop/listing' },
    { id: 'toys', value: 'toys', label: 'Toys', path: '/shop/listing' },
]


export const menuLinks = [
    { id: 'home', value: 'home', label: 'Home', path: '/shop/home', active: 'border-b border' },
    { id: 'shop', value: 'shop', label: 'Shop', path: '/shop/listing', active: 'border-b border' },
    { id: 'orders', value: 'orders', label: 'View Orders', path: '/shop/orders', active: 'border-b border' },
    { id: 'address', value: 'address', label: 'Manage Addresses', path: '/shop/address', active: 'border-b border' },
    { id: 'contact', value: 'contact', label: 'Contact Us', path: '/shop/contact', active: 'border-b border' },
]


export const filterOptions = {
    Brand: [
        { value: 'nike', id: 'nike', label: 'Nike' },
        { value: 'hp', id: 'hp', label: 'HP' },
        { value: 'adidas', id: 'adidas', label: 'Adidas' },
        { value: 'lenovo', id: 'lenovo', label: 'Lenovo' },
    ],
    Category: [
        { value: 'electronics', id: 'electronics', label: 'Electronics' },
        { value: 'fashion', id: 'fashion', label: 'Fashion' },
        { value: 'home-appliances', id: 'home-appliances', label: 'Home Appliances' },
        { value: 'beauty', id: 'beauty', label: 'Beauty & Personal Care' },
        { value: 'baby', id: 'baby', label: 'Baby & Toys' },
        { value: 'computers', id: 'computers', label: 'Computers' },
        { value: 'phones-tablets', id: 'phones-tablets', label: 'Phones & Tablets' },
        { value: 'sports', id: 'sports', label: 'Sports & Outdoors' },
        { value: 'groceries', id: 'groceries', label: 'Groceries' },
        { value: 'accessories', id: 'accessories', label: 'Accessories' },
    ],
}

export const addressFormControls = [
    {
        name: 'address',
        label: 'Address',
        placeholder: 'Enter your address',
        componentType: 'input',
        type: 'text'
    },

    {
        name: 'city',
        label: 'City',
        placeholder: 'Enter your city',
        componentType: 'input',
        type: 'text'
    },

    {
        name: 'state',
        label: 'State',
        placeholder: 'Enter your state',
        componentType: 'input',
        type: 'text'
    },

    {
        name: 'postalCode',
        label: 'Postal Code',
        placeholder: 'Enter your postal code',
        componentType: 'input',
        type: 'text'
    },

    {
        name: 'country',
        label: 'Country',
        placeholder: 'Enter your country',
        componentType: 'input',
        type: 'text'
    },

    {
        name: 'phoneNumber',
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        componentType: 'input',
        type: 'tel'
    },

    {
        name: 'notes',
        label: 'Notes',
        placeholder: 'Enter any additional notes',
        componentType: 'textarea'
    }
]


export const sortOptions = [
    // { id : 'newest', value : 'newest', label : 'Newest'},
    // { id : 'oldest', value : 'oldest', label : 'Oldest'},
    { id: 'price:low-to-high', value: 'price:low-to-high', label: 'Price: Low to High' },
    { id: 'price:high-to-low', value: 'price:high-to-low', label: 'Price: High to Low' },
    { id: 'A-Z', value: 'A-Z', label: 'Alphabetical: A-Z' },
    { id: 'Z-A', value: 'Z-A', label: 'Alphabetical: Z-A' },
]