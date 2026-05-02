import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch } from '../../utils/auth';

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

const initialState = {
  items: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Fetch wishlist
export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, thunkAPI) => {
  try {
    const response = await authFetch(`${BASEURL}/api/wishlist/`);
    const data = await response.json();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Add to wishlist
export const addToWishlist = createAsyncThunk('wishlist/add', async (productId, thunkAPI) => {
  try {
    const response = await authFetch(`${BASEURL}/api/wishlist/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_id: productId }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (productId, thunkAPI) => {
  try {
    await authFetch(`${BASEURL}/api/wishlist/remove/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_id: productId }),
    });
    return productId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.product.id !== action.payload);
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
