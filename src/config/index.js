
export const registerFormControls = [
   { name : 'userName',
    label : 'User name',
    placeholder : 'Enter your User Name',
    componentType : 'input',
    type : 'text',
    options : [
        
    ]
},

    { name : 'email',
    label : 'E-mail',
    placeholder : 'Enter your E-mail',
    componentType : 'input',
    type : 'email'},

    { name : 'password',
    label : 'Password',
    placeholder : 'Enter your passsword',
    componentType : 'input',
    type : 'password'},
]

export const LoginFormControls = [
      { name : 'email',
    label : 'E-mail',
    placeholder : 'Enter your E-mail',
    componentType : 'input',
    type : 'email'},

    { name : 'password',
    label : 'Password',
    placeholder : 'Enter your password',
    componentType : 'input',
    type : 'password'},
]

export const addProductFormElements = [

    

    { name : 'name',
    label : 'Name',
    placeholder : 'Enter Product Name',
    componentType : 'input',
    type : 'text'},

    { name : 'description',
    label : 'Description',
    componentType : 'textarea',
    placeholder : 'Product Description'},

    {
    name : 'category',
    label : 'Category',
    placeholder : 'Category',
    componentType : 'select',
    options : [
        { name : 'electronics', value: 'electronics', label : 'Electronics'},
        { id : 'fashion', value : 'fashion', label : 'Fashion'},
        { id : 'home-appliances', value : 'home-appliances', label : 'Home Appliances'},
        { id : 'books', value : 'books', label : 'Books'},
        { id : 'toys', value : 'toys', label : 'Toys'},
            ]
    },


    {
        name : 'brand',
        label : 'Brand',
        placeholder : 'Product Brand',
        componentType : 'select',
        options : [
            { value : 'nike', id : 'nike', label : 'Nike'},
            { value : 'hp', id : 'hp', label : 'HP'},
            { value : 'adidas', id : 'adidas', label : 'Adidas'},
            { value : 'lenovo', id : 'lenovo', label : 'Lenovo'},
        ]
     },

      {
        name : 'totalStock',
        label : 'Stock Quantity',
        placeholder : 'Stock Quantity',
        componentType : 'input',
        type : 'number'
     },

      {
    name : 'salesPrice',
    label : 'Sales Price',
    placeholder : 'Sales Price',
    componentType : 'input',
    type : 'number'
     },

     {
    name : 'price',
    label : 'Price',
    placeholder : 'Enter Product Price',
    componentType : 'input',
    type : 'number'
    }    
]

export const shoppingViewCategories = [
    { id : 'home', value : 'home', label : 'Home', path : '/shop/home' },
    { id : 'electronics', value: 'electronics', label : 'Electronics', path : '/shop/listing'},
    { id : 'fashion', value : 'fashion', label : 'Fashion', path : '/shop/listing'},
    { id : 'home-appliances', value : 'home-appliances', label : 'Home Appliances', path : '/shop/listing'},
    { id : 'books', value : 'books', label : 'Books', path : '/shop/listing'},
    { id : 'toys', value : 'toys', label : 'Toys', path : '/shop/listing'},
]

export const filterOptions = {
    Category : [
        { id : 'electronics', value: 'electronics', label : 'Electronics'},
        { id : 'fashion', value : 'fashion', label : 'Fashion'},
        { id : 'home-appliances', value : 'home-appliances', label : 'Home Appliances'},
        { id : 'books', value : 'books', label : 'Books'},
        { id : 'toys', value : 'toys', label : 'Toys'},
    ],
    Brand : [
        { value : 'nike', id : 'nike', label : 'Nike'},
        { value : 'hp', id : 'hp', label : 'HP'},
        { value : 'adidas', id : 'adidas', label : 'Adidas'},
        { value : 'lenovo', id : 'lenovo', label : 'Lenovo'},
    ]
}

export const addressFormControls = [
    { name : 'address',
    label : 'Address',
    placeholder : 'Enter your address',
    componentType : 'input',
    type : 'text'},

    { name : 'city',
    label : 'City',
    placeholder : 'Enter your city',
    componentType : 'input',
    type : 'text'},

    { name : 'state',
    label : 'State',
    placeholder : 'Enter your state',
    componentType : 'input',
    type : 'text'},

    { name : 'postalCode',
    label : 'Postal Code',
    placeholder : 'Enter your postal code',
    componentType : 'input',
    type : 'text'},

    { name : 'country',
    label : 'Country',
    placeholder : 'Enter your country',
    componentType : 'input',
    type : 'text'},

    { name : 'phoneNumber',
    label : 'Phone Number',
    placeholder : 'Enter your phone number',
    componentType : 'input',
    type : 'tel'},

    { name : 'notes',
    label : 'Notes',
    placeholder : 'Enter any additional notes',
    componentType : 'textarea'}
]


export const sortOptions = [
    // { id : 'newest', value : 'newest', label : 'Newest'},
    // { id : 'oldest', value : 'oldest', label : 'Oldest'},
    { id : 'price:low-to-high', value : 'price:low-to-high', label : 'Price: Low to High'},
    { id : 'price:high-to-low', value : 'price:high-to-low', label : 'Price: High to Low'},
    {id : 'A-Z', value : 'A-Z', label : 'Alphabetical: A-Z'},
    {id : 'Z-A', value : 'Z-A', label : 'Alphabetical: Z-A'},
]