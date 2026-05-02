import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch } from '../../utils/auth';

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

const initialState = {
  items: [],
  total: 0,
  isLoading: false,
  isError: false,
  message: '',
};

// Fetch cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const response = await authFetch(`${BASEURL}/api/cart/`);
    const data = await response.json();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Add to cart
export const addToCart = createAsyncThunk('cart/addToCart', async (productId, thunkAPI) => {
  try {
    const response = await authFetch(`${BASEURL}/api/cart/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_id: productId }),
    });
    const data = await response.json();
    return data.cart;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Remove from cart
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (itemId, thunkAPI) => {
  try {
    await authFetch(`${BASEURL}/api/cart/remove/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item_id: itemId }),
    });
    thunkAPI.dispatch(fetchCart());
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Update quantity
export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ itemId, quantity }, thunkAPI) => {
    try {
      const response = await authFetch(`${BASEURL}/api/cart/update/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_id: itemId, quantity }),
      });
      const data = await response.json();
      thunkAPI.dispatch(fetchCart());
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateQuantity.fulfilled, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
