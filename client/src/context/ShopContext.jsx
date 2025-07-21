import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { data, useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] =useState([])
  const [cartItems, setCartItems] = useState({});
  const [token,setToken]=useState('');
  const navigate =useNavigate()

  // Add to cart
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
    if(token){
        try {
           const response = await axios.post(backendUrl +'/api/cart/add',{itemId,size}, {headers:{token}})
           toast.success(response.data.message)

        } catch (error) {
          console.log(error);
          toast.error(error.message)
        }
    }
    
  };

  // Get total cart item count
  const getCartCount = () => {
    let totalCount = 0;
    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        const quantity = cartItems[productId][size];
        if (quantity > 0) {
          totalCount += quantity;
        }
      }
    }
    return totalCount;
  };

  // Update quantity or remove
  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);

    if (quantity <= 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);
    if(token){
      try {
         await axios.post(backendUrl +'/api/cart/update',{itemId, size, quantity},{headers:{token}})
        
      } catch (error) {
         console.log(error);
          toast.error(error.message)
      }
    }
  };

  // Get total cart amount
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const productId in cartItems) {
      const product = products.find((p) => p._id === productId);
      if (!product) continue;

      for (const size in cartItems[productId]) {
        const quantity = cartItems[productId][size];
        if (quantity > 0) {
          totalAmount += product.price * quantity;
        }
      }
    }

    return totalAmount;
  };


  const getProductsData =async()=>{
    try {
      
      const response =await axios.get(backendUrl +'/api/product/list')
      if(response.data.success){
        setProducts(response.data.products)
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
       console.log(error);
       toast.error(error.messsage)
    }
  }

  const getUserCart =async(token)=>{
    try {
       const response =await axios.post(backendUrl+'/api/cart/get',{}, {headers:{token}})
       if(response.data.success){
        setCartItems(response.data.cartData)
       }
    } catch (error) {
       console.log(error);
       toast.error(error.messsage)
    }
  }

  useEffect(()=>{
    getProductsData()
  },[])

  useEffect(()=>{
   if(!token && localStorage.getItem('token')){
    setToken(localStorage.getItem('token'))
    getUserCart(localStorage.getItem('token'))
   }
  },[])


  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken, 
    token,
    setCartItems
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
