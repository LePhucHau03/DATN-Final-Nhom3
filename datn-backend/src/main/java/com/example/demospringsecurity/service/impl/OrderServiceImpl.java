package com.example.demospringsecurity.service.impl;

import com.example.demospringsecurity.dto.request.order.OrderCreateDTO;
import com.example.demospringsecurity.dto.response.ResultPaginationResponse;
import com.example.demospringsecurity.dto.response.order.OrderResponse;
import com.example.demospringsecurity.dto.response.order.OrderUpdate;
import com.example.demospringsecurity.exception.ResourceNotFoundException;
import com.example.demospringsecurity.model.Order;
import com.example.demospringsecurity.model.OrderDetail;
import com.example.demospringsecurity.repository.OrderDetailRepository;
import com.example.demospringsecurity.repository.OrderRepository;
import com.example.demospringsecurity.repository.ProductRepository;
import com.example.demospringsecurity.repository.UserRepository;
import com.example.demospringsecurity.service.EmailService;
import com.example.demospringsecurity.service.OrderService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository bookRepository;
    private final UserRepository userRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final EmailService emailService;

    @Override
    public Order createOrder(OrderCreateDTO orderCreateDTO) {
        // Check if user exists before proceeding
        var user = userRepository.findById(orderCreateDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Validate all books and stock levels first
        var bookMap = orderCreateDTO.getOrderDetails().stream().collect(
                java.util.stream.Collectors.toMap(
                        detail -> detail.getProductId(),
                        detail -> bookRepository.findById(detail.getProductId())
                                .orElseThrow(() -> new ResourceNotFoundException("Book with id " + detail.getProductId() + " does not exist"))
                )
        );

        // Create the order
        Order order = orderRepository.save(Order.builder()
                .receiverName(orderCreateDTO.getReceiverName())
                .receiverAddress(orderCreateDTO.getReceiverAddress())
                .receiverPhone(orderCreateDTO.getReceiverPhone())
                .totalPrice(orderCreateDTO.getTotalPrice())
                .user(user)
                .paymentMethod(orderCreateDTO.getPaymentMethod())
                .status("Đã xác nhận")
                .build());

        // Create the order details
        orderCreateDTO.getOrderDetails().forEach(detail -> {
            orderDetailRepository.save(
                    OrderDetail.builder()
                            .product(bookMap.get(detail.getProductId()))
                            .order(order)
                            .productName(detail.getProductName())
                            .price(detail.getPrice())
                            .quantity(detail.getQuantity())
                            .build()
            );
        });

        // Format price as currency (in VND or a suitable format)
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        String totalPriceFormatted = currencyFormat.format(orderCreateDTO.getTotalPrice());

        // Send email notification
        String subject = "Order Confirmation";
        StringBuilder htmlMessage = new StringBuilder("<html><body>");
        htmlMessage.append("<h2>Your Order Confirmation</h2>");
        htmlMessage.append("<p>Thank you for your purchase!</p>");
        htmlMessage.append("<p>Order ID: ").append(order.getId()).append("</p>");
        htmlMessage.append("<p>Total Price: ").append(totalPriceFormatted).append("</p>");
        htmlMessage.append("<p>Items:</p><ul>");

        // Add order items to email with formatted price
        orderCreateDTO.getOrderDetails().forEach(detail -> {
            String priceFormatted = currencyFormat.format(detail.getPrice());
            htmlMessage.append("<li>").append(detail.getProductName())
                    .append(" - Quantity: ").append(detail.getQuantity())
                    .append(" - Price: ").append(priceFormatted)
                    .append("</li>");
        });

        htmlMessage.append("</ul>");
        htmlMessage.append("</body></html>");

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage.toString());
        } catch (MessagingException e) {
            e.printStackTrace();
        }

        return order;
    }



    @Override
    public List<OrderResponse> getOrdersByUserId(Long id) {
        if(!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        List<Order> orders =  orderRepository.findAllByUserId(id);

        return orders.stream()
                .map(order -> {
                    List<OrderDetail> orderDetails = orderDetailRepository.findAllByOrderId(order.getId());

                    List<OrderResponse.OrderDetailResponse> orderDetailResponses = orderDetails.stream()
                            .map(OrderResponse.OrderDetailResponse::fromOrderDetail)
                            .toList();

                    return OrderResponse.fromOrder(order, orderDetailResponses);
                })
                .toList();

    }

    @Override
    public ResultPaginationResponse findAll(Specification<Order> spec, Pageable pageable) {
        // Tìm tất cả các đơn hàng dựa trên Specification và Pageable
        Page<Order> orders = orderRepository.findAll(spec, pageable);

        // Tạo metadata cho phân trang
        ResultPaginationResponse.Meta meta = ResultPaginationResponse.Meta.builder()
                .total(orders.getTotalElements())
                .pages(orders.getTotalPages())
                .page(pageable.getPageNumber() + 1)  // Trang hiện tại
                .pageSize(pageable.getPageSize())    // Số phần tử trên mỗi trang
                .build();

        // Chuyển đổi từng Order sang OrderResponse kèm theo OrderDetailResponse
        List<OrderResponse> orderResponses = orders.getContent().stream()
                .map(order -> {
                    // Lấy các OrderDetail của Order hiện tại
                    List<OrderDetail> orderDetails = orderDetailRepository.findAllByOrderId(order.getId());

                    // Chuyển đổi từng OrderDetail sang OrderDetailResponse
                    List<OrderResponse.OrderDetailResponse> orderDetailResponses = orderDetails.stream()
                            .map(OrderResponse.OrderDetailResponse::fromOrderDetail)
                            .toList();

                    // Tạo OrderResponse từ Order và danh sách OrderDetailResponse
                    return OrderResponse.fromOrder(order, orderDetailResponses);
                })
                .toList();

        // Trả về kết quả phân trang kèm theo danh sách các OrderResponse
        return ResultPaginationResponse.builder()
                .meta(meta)
                .result(orderResponses)  // Kết quả các đơn hàng
                .build();
    }

    @Override
    public List<OrderResponse> getAll() {
        List<Order> orders =  orderRepository.findAll();

        return orders.stream()
                .map(order -> {
                    List<OrderDetail> orderDetails = orderDetailRepository.findAllByOrderId(order.getId());

                    List<OrderResponse.OrderDetailResponse> orderDetailResponses = orderDetails.stream()
                            .map(OrderResponse.OrderDetailResponse::fromOrderDetail)
                            .toList();

                    return OrderResponse.fromOrder(order, orderDetailResponses);
                })
                .toList();
    }

    @Override
    public void update(OrderUpdate orderUpdate) {
        orderRepository.findById(orderUpdate.getId()).get();


        Order order = orderRepository.findById(orderUpdate.getId()).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(orderUpdate.getStatus());
        order.setReceiverAddress(orderUpdate.getReceiverAddress());
        orderRepository.save(order);
    }

    @Override
    public void delete(Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus("Đã hủy");
        orderRepository.save(order);
    }

}

