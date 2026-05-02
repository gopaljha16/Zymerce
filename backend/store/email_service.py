import os
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

class EmailService:
    """Email service for sending notifications"""
    
    @staticmethod
    def send_order_confirmation(order, user_email):
        """Send order confirmation email"""
        try:
            subject = f'Order Confirmation - #{order.id}'
            
            # HTML content
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #0f5132;">Order Confirmation</h2>
                        <p>Thank you for your order!</p>
                        
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3>Order Details</h3>
                            <p><strong>Order ID:</strong> #{order.id}</p>
                            <p><strong>Order Date:</strong> {order.created_at.strftime('%B %d, %Y')}</p>
                            <p><strong>Total Amount:</strong> ₹{order.total_amount}</p>
                            <p><strong>Status:</strong> {order.status.upper()}</p>
                        </div>
                        
                        <h3>Order Items</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background-color: #0f5132; color: white;">
                                    <th style="padding: 10px; text-align: left;">Product</th>
                                    <th style="padding: 10px; text-align: center;">Qty</th>
                                    <th style="padding: 10px; text-align: right;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
            """
            
            for item in order.items.all():
                html_content += f"""
                                <tr style="border-bottom: 1px solid #ddd;">
                                    <td style="padding: 10px;">{item.product.name}</td>
                                    <td style="padding: 10px; text-align: center;">{item.quantity}</td>
                                    <td style="padding: 10px; text-align: right;">₹{item.price}</td>
                                </tr>
                """
            
            html_content += f"""
                            </tbody>
                        </table>
                        
                        <div style="margin-top: 30px; padding: 15px; background-color: #e8f5e9; border-radius: 5px;">
                            <p style="margin: 0;"><strong>What's Next?</strong></p>
                            <p style="margin: 5px 0;">We'll send you another email when your order ships.</p>
                            <p style="margin: 5px 0;">Track your order anytime from your dashboard.</p>
                        </div>
                        
                        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
                            <p>Thank you for shopping with Zymerce!</p>
                            <p>If you have any questions, please contact our support team.</p>
                        </div>
                    </div>
                </body>
            </html>
            """
            
            # Plain text version
            text_content = strip_tags(html_content)
            
            # Send email
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user_email]
            )
            email.attach_alternative(html_content, "text/html")
            email.send()
            
            return True
        except Exception as e:
            print(f"Error sending order confirmation email: {e}")
            return False
    
    @staticmethod
    def send_order_status_update(order, user_email):
        """Send order status update email"""
        try:
            status_messages = {
                'pending': 'Your order has been received and is being processed.',
                'processing': 'Your order is being prepared for shipment.',
                'shipped': 'Your order has been shipped and is on its way!',
                'delivered': 'Your order has been delivered. Enjoy your purchase!',
                'cancelled': 'Your order has been cancelled.',
            }
            
            subject = f'Order Status Update - #{order.id}'
            message = f"""
            Order #{order.id} Status Update
            
            Status: {order.status.upper()}
            {status_messages.get(order.status, '')}
            
            Order Total: ₹{order.total_amount}
            
            Track your order: [Your Dashboard Link]
            
            Thank you for shopping with Zymerce!
            """
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user_email],
                fail_silently=False,
            )
            
            return True
        except Exception as e:
            print(f"Error sending status update email: {e}")
            return False
    
    @staticmethod
    def send_welcome_email(user_email, username):
        """Send welcome email to new users"""
        try:
            subject = 'Welcome to Zymerce!'
            message = f"""
            Hi {username},
            
            Welcome to Zymerce! 🎉
            
            Thank you for joining our community. We're excited to have you here!
            
            Start exploring our wide range of products:
            - Electronics
            - Headphones
            - Furniture
            - Beauty Products
            
            Enjoy free shipping on all orders and our 30-day return policy.
            
            Happy Shopping!
            The Zymerce Team
            """
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user_email],
                fail_silently=False,
            )
            
            return True
        except Exception as e:
            print(f"Error sending welcome email: {e}")
            return False

email_service = EmailService()
