import { authFetch } from './auth';
import toast from 'react-hot-toast';

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

export const initiateRazorpayPayment = async (amount, onSuccess, onFailure) => {
    try {
        // Create Razorpay order
        const response = await authFetch(`${BASEURL}/api/payment/create-order/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount,
                currency: 'INR',
            }),
        });

        const data = await response.json();

        if (data.error) {
            toast.error(data.error);
            if (onFailure) onFailure(data.error);
            return;
        }

        // Razorpay options
        const options = {
            key: data.key,
            amount: data.amount,
            currency: data.currency,
            name: 'Zymerce',
            description: 'Order Payment',
            order_id: data.order_id,
            handler: async function (response) {
                // Verify payment
                try {
                    const verifyResponse = await authFetch(`${BASEURL}/api/payment/verify/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });

                    const verifyData = await verifyResponse.json();

                    if (verifyData.status === 'success') {
                        toast.success('Payment successful!');
                        if (onSuccess) onSuccess(response);
                    } else {
                        toast.error('Payment verification failed');
                        if (onFailure) onFailure('Verification failed');
                    }
                } catch (error) {
                    toast.error('Payment verification error');
                    if (onFailure) onFailure(error);
                }
            },
            prefill: {
                name: '',
                email: '',
                contact: '',
            },
            theme: {
                color: '#0f5132',
            },
            modal: {
                ondismiss: function () {
                    toast.error('Payment cancelled');
                    if (onFailure) onFailure('Payment cancelled');
                },
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    } catch (error) {
        console.error('Payment error:', error);
        toast.error('Failed to initiate payment');
        if (onFailure) onFailure(error);
    }
};
