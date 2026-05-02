import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

const initialState = {
  products: [],
  product: null,
  categories: [],
  recentlyViewed: JSON.parse(localStorage.getItem('recentlyViewed')) || [],
  filters: {
    category: '',
    priceRange: [0, 10000],
    rating: 0,
    search: '',
    sortBy: 'newest',
  },
  isLoading: false,
  isError: false,
  message: '',
};

// Fetch all products
export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await fetch(`${BASEURL}/api/products/`);
    const data = await response.json();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Fetch single product
export const fetchProduct = createAsyncThunk('products/fetchOne', async (id, thunkAPI) => {
  try {
    const response = await fetch(`${BASEURL}/api/products/${id}/`);
    const data = await response.json();
    
    // Add to recently viewed
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    const filtered = recentlyViewed.filter(item => item.id !== data.id);
    const updated = [data, ...filtered].slice(0, 8);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
    
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Fetch categories
export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, thunkAPI) => {
  try {
    const response = await fetch(`${BASEURL}/api/categories/`);
    const data = await response.json();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        priceRange: [0, 10000],
        rating: 0,
        search: '',
        sortBy: 'newest',
      };
    },
    updateRecentlyViewed: (state) => {
      state.recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle paginated response - extract results array
        state.products = action.payload.results || action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
        state.recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setFilters, clearFilters, updateRecentlyViewed } = productSlice.actions;
export default productSlice.reducer;
