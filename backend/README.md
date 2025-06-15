# ... existing code ...

## Payment Mode Toggle

Set the payment mode for the backend:

```
PAYMENT_MODE=mock      # Use mock payment logic (default, for testing/demo)
PAYMENT_MODE=razorpay  # Use real Razorpay integration (requires Razorpay keys and implementation)
```

- The backend will switch payment logic based on this variable.
- For MVP/testing, keep it as 'mock'. 