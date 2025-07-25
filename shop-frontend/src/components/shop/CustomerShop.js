// FIXED CustomerShop.js - Sử dụng dữ liệu thực từ API, không dùng fallback data
import React, { useState, useEffect } from 'react';
import apiService from '../../services/api/apiService';
import authService from '../../services/api/authService';
import { notificationManager } from '../layout/Notification/Notification';
import EnhancedCheckout from '../order/EnhacedCheckout/EnhancedCheckout';
import './CustomerShop.css';

const CustomerShop = ({ onModeChange, onLoginSuccess, authState }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasApiError, setHasApiError] = useState(false);
  
  const isAuthenticated = authState?.isAuthenticated || false;
  const user = authState?.user || null;

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-low', label: 'Giá thấp' },
    { value: 'price-high', label: 'Giá cao' },
    { value: 'best-selling', label: 'Bán chạy' }
  ];

  // Load all data từ API
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setHasApiError(false);
      
      try {
        // Load products, categories và brands từ API
        const [productsRes, categoriesRes, brandsRes] = await Promise.allSettled([
          apiService.getProducts(),
          apiService.getCategories(),
          apiService.getBrands()
        ]);

        // Handle products
        if (productsRes.status === 'fulfilled' && Array.isArray(productsRes.value)) {
          const validProducts = productsRes.value.filter(p => {
            return p && 
                   p.maSP && 
                   p.tenSP && 
                   typeof p.giaTien === 'number' && 
                   typeof p.soLuongTrongKho === 'number' &&
                   p.giaTien > 0;
          });
          setProducts(validProducts);
          console.log(`✅ Loaded ${validProducts.length} products`);
        } else {
          console.error('Failed to load products:', productsRes.reason);
          setProducts([]);
          setHasApiError(true);
        }

        // Handle categories
        if (categoriesRes.status === 'fulfilled' && Array.isArray(categoriesRes.value)) {
          const validCategories = [
            { id: '', name: 'Tất cả' },
            ...categoriesRes.value.map(cat => ({
              id: cat.maDanhMuc,
              name: cat.tenDanhMuc
            }))
          ];
          setCategories(validCategories);
          console.log(`✅ Loaded ${categoriesRes.value.length} categories`);
        } else {
          console.error('Failed to load categories:', categoriesRes.reason);
          setCategories([{ id: '', name: 'Tất cả' }]);
        }

        // Handle brands
        if (brandsRes.status === 'fulfilled' && Array.isArray(brandsRes.value)) {
          const validBrands = [
            { id: '', name: 'Tất cả thương hiệu' },
            ...brandsRes.value.map(brand => ({
              id: brand.maHang,
              name: brand.tenHang
            }))
          ];
          setBrands(validBrands);
          console.log(`✅ Loaded ${brandsRes.value.length} brands`);
        } else {
          console.error('Failed to load brands:', brandsRes.reason);
          setBrands([{ id: '', name: 'Tất cả thương hiệu' }]);
        }

        // Check if we have any data
        const hasProducts = productsRes.status === 'fulfilled' && Array.isArray(productsRes.value) && productsRes.value.length > 0;
        
        if (!hasProducts) {
          setHasApiError(true);
          notificationManager.error('Không thể tải dữ liệu sản phẩm từ server');
        } else {
          const successCount = [
            productsRes.status === 'fulfilled' ? productsRes.value.length : 0,
            categoriesRes.status === 'fulfilled' ? categoriesRes.value.length : 0,
            brandsRes.status === 'fulfilled' ? brandsRes.value.length : 0
          ];
          notificationManager.success(`Đã tải ${successCount[0]} sản phẩm, ${successCount[1]} danh mục, ${successCount[2]} thương hiệu`);
        }

      } catch (err) {
        console.error('Error loading data:', err);
        setProducts([]);
        setCategories([{ id: '', name: 'Tất cả' }]);
        setBrands([{ id: '', name: 'Tất cả thương hiệu' }]);
        setHasApiError(true);
        notificationManager.error('Không thể kết nối tới server: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Load cart từ localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      const savedFavorites = localStorage.getItem('favorites');
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
      
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  // Utility functions
  const formatPrice = (price) => {
    try {
      const numPrice = Number(price) || 0;
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(numPrice);
    } catch (error) {
      return '0 ₫';
    }
  };

  const getImageUrl = (filename) => {
    if (!filename) return 'https://via.placeholder.com/300x200?text=No+Image';
    return `http://localhost:9010/api/files/${filename}`;
  };

  const getProductImages = (product) => {
    if (!product) return [];
    return [product.anh1, product.anh2, product.anh3, product.anh4, product.anh5, product.anh6]
      .filter(img => img && img.trim() !== '');
  };

  // Filter và sort products
  const filteredAndSortedProducts = products
    .filter(product => {
      if (!product || !product.tenSP) return false;
      
      const matchesSearch = 
        product.tenSP.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.moTa && product.moTa.toLowerCase().includes(searchTerm.toLowerCase()));    
      
      const matchesCategory = selectedCategory === '' || 
        product.maDanhMuc === parseInt(selectedCategory);
      
      const matchesBrand = selectedBrand === '' || 
        product.maHang === parseInt(selectedBrand);
      
      const inStock = (product.soLuongTrongKho || 0) > 0;
      
      return matchesSearch && matchesCategory && matchesBrand && inStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.giaTien || 0) - (b.giaTien || 0);
        case 'price-high':
          return (b.giaTien || 0) - (a.giaTien || 0);
        case 'best-selling':
          return (b.soLuongDaBan || 0) - (a.soLuongDaBan || 0);
        default:
          return (b.maSP || 0) - (a.maSP || 0);
      }
    });

  // Cart functions
  const addToCart = (product, quantity = 1) => {
    try {
      if (!product || !product.maSP) {
        notificationManager.error('Sản phẩm không hợp lệ');
        return;
      }

      const existingItem = cart.find(item => item.maSP === product.maSP);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity <= (product.soLuongTrongKho || 0)) {
          setCart(cart.map(item => 
            item.maSP === product.maSP 
              ? { ...item, quantity: newQuantity }
              : item
          ));
          notificationManager.success('Đã cập nhật số lượng trong giỏ hàng!');
        } else {
          notificationManager.warning('Số lượng vượt quá hàng có sẵn!');
        }
      } else {
        if (quantity <= (product.soLuongTrongKho || 0)) {
          setCart([...cart, { ...product, quantity }]);
          notificationManager.success('Đã thêm sản phẩm vào giỏ hàng!');
        } else {
          notificationManager.warning('Số lượng vượt quá hàng có sẵn!');
        }
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      notificationManager.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  const removeFromCart = (productId) => {
    try {
      setCart(cart.filter(item => item.maSP !== productId));
      notificationManager.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      console.error('Remove from cart error:', error);
      notificationManager.error('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  const updateCartQuantity = (productId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }
      
      const product = products.find(p => p.maSP === productId);
      if (product && newQuantity <= (product.soLuongTrongKho || 0)) {
        setCart(cart.map(item => 
          item.maSP === productId 
            ? { ...item, quantity: newQuantity }
            : item
        ));
      } else {
        notificationManager.warning('Số lượng vượt quá hàng có sẵn!');
      }
    } catch (error) {
      console.error('Update cart quantity error:', error);
      notificationManager.error('Có lỗi xảy ra khi cập nhật số lượng');
    }
  };

  const toggleFavorite = (productId) => {
    try {
      if (favorites.includes(productId)) {
        setFavorites(favorites.filter(id => id !== productId));
        notificationManager.info('Đã xóa khỏi danh sách yêu thích');
      } else {
        setFavorites([...favorites, productId]);
        notificationManager.success('Đã thêm vào danh sách yêu thích');
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      notificationManager.error('Có lỗi xảy ra với danh sách yêu thích');
    }
  };

  const getTotalCartPrice = () => {
    try {
      return cart.reduce((total, item) => {
        const price = Number(item.giaTien) || 0;
        const quantity = Number(item.quantity) || 0;
        return total + (price * quantity);
      }, 0);
    } catch (error) {
      console.error('Calculate total price error:', error);
      return 0;
    }
  };

  const getTotalCartItems = () => {
    try {
      return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
    } catch (error) {
      console.error('Calculate total items error:', error);
      return 0;
    }
  };

  const openProductDetail = (product) => {
    try {
      if (!product) return;
      setSelectedProduct(product);
      setCurrentImageIndex(0);
      setShowProductDetail(true);
    } catch (error) {
      console.error('Open product detail error:', error);
      notificationManager.error('Không thể mở chi tiết sản phẩm');
    }
  };

  const closeProductDetail = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
  };

  // Checkout functions
  const handleStartCheckout = () => {
    try {
      if (cart.length === 0) {
        notificationManager.warning('Giỏ hàng trống!');
        return;
      }

      if (!isAuthenticated) {
        notificationManager.info('Vui lòng đăng nhập để đặt hàng');
        return;
      }

      setShowCart(false);
      setShowCheckout(true);
    } catch (error) {
      console.error('Start checkout error:', error);
      notificationManager.error('Có lỗi xảy ra khi bắt đầu thanh toán');
    }
  };

  const handleOrderSuccess = (orderData) => {
    try {
      setCart([]);
      setShowCheckout(false);
      notificationManager.success(`Đặt hàng thành công! Mã đơn hàng: ${orderData.orderId}`);
    } catch (error) {
      console.error('Order success handler error:', error);
      setCart([]);
      setShowCheckout(false);
      notificationManager.success('Đặt hàng thành công!');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="customer-shop">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu từ server...</p>
        </div>
      </div>
    );
  }

  // Error state khi không có data
  if (hasApiError && products.length === 0) {
    return (
      <div className="customer-shop">
        <div className="shop-content">
          <div className="api-error-container">
            <div className="error-icon">⚠️</div>
            <h3>Không thể tải dữ liệu</h3>
            <p>Server không phản hồi hoặc có lỗi kết nối.</p>
            <p>Vui lòng kiểm tra:</p>
            <ul>
              <li>Server backend đang chạy tại http://localhost:8000</li>
              <li>Kết nối mạng ổn định</li>
              <li>API endpoints đã được triển khai</li>
            </ul>
            <button 
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              🔄 Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-shop">
      {/* Filters với dữ liệu thực từ API */}
      <div className="shop-filters compact">
        <div className="filters-content">
          <div className="header-search">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>🔍</button>
          </div>

          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select 
            value={selectedBrand} 
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <div className="cart-quick-actions">
            <button 
              className="favorites-btn"
              onClick={() => notificationManager.info(`Bạn có ${favorites.length} sản phẩm yêu thích`)}
            >
              ❤️ ({favorites.length})
            </button>

            <button 
              className="cart-btn"
              onClick={() => setShowCart(true)}
            >
              🛒 ({getTotalCartItems()})
            </button>
              
            <button 
              className="checkout-btn"
              onClick={handleStartCheckout}
              disabled={cart.length === 0}
            >
              💳 Đặt hàng
            </button>
          </div>

          <span className="results-count">
            {filteredAndSortedProducts.length} sản phẩm
          </span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="shop-content">
        {filteredAndSortedProducts.length > 0 ? (
          <div className="products-grid">
            {filteredAndSortedProducts.map((product) => (
              <div key={product.maSP} className="product-card">
                <div className="product-image">
                  <img
                    src={getImageUrl(product.anh1)}
                    alt={product.tenSP || 'Sản phẩm'}
                    onClick={() => openProductDetail(product)}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                  <button 
                    className={`favorite-btn ${favorites.includes(product.maSP) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(product.maSP)}
                  >
                    ❤️
                  </button>
                </div>

                <div className="product-info">
                  <h3 className="product-name" onClick={() => openProductDetail(product)}>
                    {product.tenSP || 'Sản phẩm không có tên'}
                  </h3>
                  
                  <div className="product-price">
                    {formatPrice(product.giaTien)}
                  </div>

                  <div className="product-stats">
                    <span>Đã bán: {product.soLuongDaBan || 0}</span>
                    <span className={`stock ${(product.soLuongTrongKho || 0) > 10 ? 'high' : 'low'}`}>
                      Còn: {product.soLuongTrongKho || 0}
                    </span>
                  </div>

                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                    disabled={(product.soLuongTrongKho || 0) === 0}
                  >
                    {(product.soLuongTrongKho || 0) === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>Không tìm thấy sản phẩm</h3>
            <p>Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {showProductDetail && selectedProduct && (
        <div className="modal-overlay" onClick={closeProductDetail}>
          <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeProductDetail}>✕</button>
            
            <div className="modal-grid">
              <div className="product-images">
                <div className="main-image">
                  <img
                    src={getImageUrl(getProductImages(selectedProduct)[currentImageIndex] || selectedProduct.anh1)}
                    alt={selectedProduct.tenSP}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/500x400?text=No+Image';
                    }}
                  />
                </div>
                
                {getProductImages(selectedProduct).length > 1 && (
                  <div className="image-thumbnails">
                    {getProductImages(selectedProduct).map((img, index) => (
                      <img
                        key={index}
                        src={getImageUrl(img)}
                        alt={`${selectedProduct.tenSP} ${index + 1}`}
                        className={currentImageIndex === index ? 'active' : ''}
                        onClick={() => setCurrentImageIndex(index)}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x60?text=No+Image';
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="product-details">
                <h2>{selectedProduct.tenSP}</h2>
                
                <div className="price-section">
                  <div className="current-price">{formatPrice(selectedProduct.giaTien)}</div>
                </div>

                <div className="product-description">
                  <h4>Mô tả sản phẩm:</h4>
                  <p>{selectedProduct.moTa || 'Chưa có mô tả'}</p>
                </div>

                <div className="product-meta">
                  <div className="meta-item">
                    <span>Đã bán:</span>
                    <strong>{selectedProduct.soLuongDaBan || 0}</strong>
                  </div>
                  <div className="meta-item">
                    <span>Còn lại:</span>
                    <strong className={selectedProduct.soLuongTrongKho > 0 ? 'in-stock' : 'out-stock'}>
                      {selectedProduct.soLuongTrongKho || 0}
                    </strong>
                  </div>
                </div>

                <div className="quantity-section">
                  <label>Số lượng:</label>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => {
                        const input = document.querySelector('.quantity-input');
                        const qty = Math.max(1, (parseInt(input.value) || 1) - 1);
                        input.value = qty;
                      }}
                    >-</button>
                    <input 
                      type="number" 
                      className="quantity-input"
                      min="1" 
                      max={selectedProduct.soLuongTrongKho || 1}
                      defaultValue="1"
                    />
                    <button 
                      onClick={() => {
                        const input = document.querySelector('.quantity-input');
                        const qty = Math.min((selectedProduct.soLuongTrongKho || 1), (parseInt(input.value) || 1) + 1);
                        input.value = qty;
                      }}
                    >+</button>
                  </div>
                </div>

                <div className="action-buttons">
                  <button 
                    className="add-to-cart-large"
                    onClick={() => {
                      const quantity = parseInt(document.querySelector('.quantity-input').value) || 1;
                      addToCart(selectedProduct, quantity);
                    }}
                    disabled={(selectedProduct.soLuongTrongKho || 0) === 0}
                  >
                    🛒 Thêm vào giỏ hàng
                  </button>
                  
                  <button 
                    className={`favorite-large ${favorites.includes(selectedProduct.maSP) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(selectedProduct.maSP)}
                  >
                    ❤️ {favorites.includes(selectedProduct.maSP) ? 'Đã yêu thích' : 'Yêu thích'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && !showCheckout && (
        <div className="modal-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Giỏ hàng ({getTotalCartItems()} sản phẩm)</h2>
              <button className="close-btn" onClick={() => setShowCart(false)}>✕</button>
            </div>

            <div className="cart-content">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>Giỏ hàng của bạn đang trống</p>
                  <button onClick={() => setShowCart(false)}>Tiếp tục mua sắm</button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={item.maSP} className="cart-item">
                        <img
                          src={getImageUrl(item.anh1)}
                          alt={item.tenSP}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x60?text=No+Image';
                          }}
                        />
                        
                        <div className="item-info">
                          <h4>{item.tenSP}</h4>
                          <div className="item-price">{formatPrice(item.giaTien)}</div>
                        </div>

                        <div className="quantity-controls">
                          <button onClick={() => updateCartQuantity(item.maSP, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.maSP, item.quantity + 1)}>+</button>
                        </div>

                        <div className="item-total">
                          {formatPrice(item.giaTien * item.quantity)}
                        </div>

                        <button 
                          className="remove-btn"
                          onClick={() => removeFromCart(item.maSP)}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="cart-footer">
                    <div className="cart-total">
                      <strong>Tổng cộng: {formatPrice(getTotalCartPrice())}</strong>
                    </div>
                    <button 
                      className="checkout-btn"
                      onClick={handleStartCheckout}
                    >
                      💳 Thanh toán
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Checkout Modal */}
      {showCheckout && (
        <EnhancedCheckout
          cart={cart}
          onOrderSuccess={handleOrderSuccess}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
};

export default CustomerShop;