// Local Storage utilities for coupon management

export const storageUtils = {
  // Get all coupons from localStorage
  getCoupons: () => {
    try {
      const coupons = localStorage.getItem("coupons");
      return coupons ? JSON.parse(coupons) : [];
    } catch (error) {
      console.error("Error reading coupons from localStorage:", error);
      return [];
    }
  },

  // Save coupons to localStorage
  saveCoupons: (coupons) => {
    try {
      localStorage.setItem("coupons", JSON.stringify(coupons));
      return true;
    } catch (error) {
      console.error("Error saving coupons to localStorage:", error);
      return false;
    }
  },

  // Clear all coupons
  clearCoupons: () => {
    try {
      localStorage.removeItem("coupons");
      return true;
    } catch (error) {
      console.error("Error clearing coupons from localStorage:", error);
      return false;
    }
  },

  // Find a coupon by code
  findCoupon: (couponCode) => {
    const coupons = storageUtils.getCoupons();
    return coupons.find((coupon) => coupon.code === couponCode);
  },

  // Redeem a coupon
  redeemCoupon: (couponCode, userDetails) => {
    const coupons = storageUtils.getCoupons();
    const couponIndex = coupons.findIndex(
      (coupon) => coupon.code === couponCode,
    );

    if (couponIndex === -1) {
      return {
        success: false,
        message: "Invalid coupon code. Please check and try again.",
      };
    }

    const coupon = coupons[couponIndex];

    if (coupon.status === "used") {
      return {
        success: false,
        message:
          "This coupon has already been used and cannot be redeemed again.",
      };
    }

    // Mark coupon as used
    coupons[couponIndex] = {
      ...coupon,
      status: "used",
      claimedBy: userDetails.name,
      claimedAt: new Date().toISOString(),
      userDetails: userDetails,
    };

    storageUtils.saveCoupons(coupons);

    return {
      success: true,
      message: "Coupon redeemed successfully!",
      rewardAmount: coupon.reward, // Use 'reward' which is the actual field name
      coupon: coupons[couponIndex],
    };
  },

  // Get statistics
  getStatistics: () => {
    const coupons = storageUtils.getCoupons();
    const totalCoupons = coupons.length;
    const usedCoupons = coupons.filter((c) => c.status === "used").length;
    const unusedCoupons = coupons.filter((c) => c.status === "unused").length;
    const totalRewards = coupons
      .filter((c) => c.status === "used")
      .reduce((sum, c) => sum + c.rewardAmount, 0);

    return {
      totalCoupons,
      usedCoupons,
      unusedCoupons,
      totalRewards,
    };
  },

  // Get recent redemptions
  getRecentRedemptions: (limit = 10) => {
    const coupons = storageUtils.getCoupons();
    return coupons
      .filter((c) => c.status === "used")
      .sort((a, b) => new Date(b.claimedAt) - new Date(a.claimedAt))
      .slice(0, limit);
  },

  // Add new coupons (batch)
  addCoupons: (newCoupons) => {
    try {
      const currentCoupons = storageUtils.getCoupons();
      const updatedCoupons = [...currentCoupons, ...newCoupons];
      storageUtils.saveCoupons(updatedCoupons);
      return true;
    } catch (error) {
      console.error("Error adding coupons:", error);
      return false;
    }
  },

  // Delete a coupon
  deleteCoupon: (couponCode) => {
    try {
      const coupons = storageUtils.getCoupons();
      const updatedCoupons = coupons.filter((c) => c.code !== couponCode);
      storageUtils.saveCoupons(updatedCoupons);
      return true;
    } catch (error) {
      console.error("Error deleting coupon:", error);
      return false;
    }
  },

  // Get all users
  getUsers: () => {
    try {
      const users = localStorage.getItem("users");
      // If no users, return default admin
      if (!users) {
        const defaultAdmin = [
          {
            serialNo: "SN-001",
            userName: "Admin",
            id: "admin",
            pass: "admin123",
            role: "Admin",
          },
        ];
        localStorage.setItem("users", JSON.stringify(defaultAdmin));
        return defaultAdmin;
      }
      return JSON.parse(users);
    } catch (error) {
      console.error("Error reading users:", error);
      return [];
    }
  },

  // Save users
  saveUsers: (users) => {
    try {
      localStorage.setItem("users", JSON.stringify(users));
      return true;
    } catch (error) {
      console.error("error saving users", error);
      return false;
    }
  },

  // Add user
  addUser: (user) => {
    try {
      const users = storageUtils.getUsers();
      users.push(user);
      storageUtils.saveUsers(users);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Update payment status
  updatePaymentStatus: (code, status) => {
    const coupons = storageUtils.getCoupons();
    const index = coupons.findIndex((c) => c.code === code);
    if (index !== -1) {
      coupons[index].paymentStatus = status;
      storageUtils.saveCoupons(coupons);
      return true;
    }
    return false;
  },

  // Initialize dummy data for testing (20 rows)
  initializeDummyData: () => {
    // Check if dummy data already exists
    const existingCoupons = storageUtils.getCoupons();
    if (existingCoupons.length > 0) {
      console.log("Coupons already exist, skipping dummy data initialization");
      return false;
    }

    const items = [
      { name: "Divine Gold Ring", code: "DGR-001" },
      { name: "Silver Pendant", code: "SP-002" },
      { name: "Diamond Earrings", code: "DE-003" },
      { name: "Pearl Necklace", code: "PN-004" },
      { name: "Ruby Bracelet", code: "RB-005" },
      { name: "Emerald Ring", code: "ER-006" },
      { name: "Sapphire Brooch", code: "SB-007" },
      { name: "Platinum Chain", code: "PC-008" },
      { name: "Gold Bangle", code: "GB-009" },
      { name: "Crystal Watch", code: "CW-010" },
    ];

    const names = [
      "Rahul Sharma",
      "Priya Patel",
      "Amit Kumar",
      "Sneha Gupta",
      "Vikram Singh",
      "Anjali Reddy",
      "Ravi Verma",
      "Pooja Mehta",
      "Suresh Nair",
      "Kavita Joshi",
    ];

    const phones = [
      "9876543210",
      "9988776655",
      "9123456789",
      "9234567890",
      "9345678901",
      "9456789012",
      "9567890123",
      "9678901234",
      "9789012345",
      "9890123456",
    ];

    const upiIds = [
      "rahul@paytm",
      "priya@gpay",
      "amit@phonepe",
      "sneha@upi",
      "vikram@paytm",
      "anjali@gpay",
      "ravi@phonepe",
      "pooja@upi",
      "suresh@paytm",
      "kavita@gpay",
    ];

    const generateCode = () => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let code = "";
      for (let i = 0; i < 10; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    const dummyCoupons = [];
    const now = new Date();

    for (let i = 0; i < 20; i++) {
      const item = items[i % items.length];
      const isUsed = i < 8; // First 8 are used
      const isPaid = i < 4; // First 4 are paid

      const createdDate = new Date(now);
      createdDate.setDate(createdDate.getDate() - (20 - i));

      const coupon = {
        created: createdDate.toISOString(),
        code: generateCode(),
        status: isUsed ? "used" : "unused",
        reward: [50, 100, 150, 200, 250][i % 5],
        itemName: item.name,
        itemCode: item.code,
        claimedBy: isUsed ? names[i % names.length] : null,
        claimedAt: isUsed
          ? new Date(createdDate.getTime() + 86400000).toISOString()
          : null,
        userDetails: isUsed
          ? {
              name: names[i % names.length],
              phone: phones[i % phones.length],
              upiId: upiIds[i % upiIds.length],
            }
          : null,
        paymentStatus: isPaid ? "Done" : "",
      };

      dummyCoupons.push(coupon);
    }

    storageUtils.saveCoupons(dummyCoupons);
    console.log("Dummy data initialized with 20 coupons");
    return true;
  },

  // Clear dummy data (for production deployment)
  clearDummyData: () => {
    storageUtils.clearCoupons();
    console.log("All coupon data cleared");
    return true;
  },
};
